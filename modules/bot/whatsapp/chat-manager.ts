import type { BotFlowData } from "@/types/bot"
import type { Block, FlowEdge, GroupFlowNode } from "@/types/flow"
import type { IncomingMessage } from "@/types/whatsapp/whatsapp"
import type { WaChatResolveParams } from "@/types/whatsapp/wa-chat-manager"
import type { ConversationState } from "@/lib/conversation-state.server"
import type { ConditionItem } from "@/components/flow/block-config-panel/blocks/condition/condition-row"
import { wa_client } from "./wa-client"

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const INPUT_BLOCK_TYPES = new Set([
    "text-input", "number-input", "email-input", "phone-input",
    "website-input", "date-input", "time-input", "buttons-input",
    "pic-choice-input", "rating-input", "file-input", "audio-input",
    "payment-input", "cards-input",
])

const BUBBLE_BLOCK_TYPES = new Set([
    "text-bubble", "image-bubble", "video-bubble", "document-bubble", "audio-bubble",
])

class WaChatManager {

    extractMessage(body: unknown): IncomingMessage | null {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const entry = (body as any)?.entry?.[0]
            const change = entry?.changes?.[0]?.value
            const msg = change?.messages?.[0]
            if (!msg) return null
            return {
                from: msg.from,
                id: msg.id,
                type: msg.type,
                text: msg.text?.body
                    ?? msg.interactive?.button_reply?.title
                    ?? msg.interactive?.list_reply?.title
                    ?? "",
                messages: change.messages,
            }
        } catch {
            return null
        }
    }

    /** Main entry point called from the webhook. Returns the new conversation state. */
    async resolveMessage({ state, flow, incomingMessage }: WaChatResolveParams): Promise<ConversationState> {
        let { currentNodeId, currentBlockId, variables } = state

        // Mark as read + show typing indicator before the first reply
        await wa_client.showTyping(incomingMessage.id)

        // ── 1. Capture response for the block we were waiting on ──────────────
        if (currentNodeId && currentBlockId) {
            const captured = this.captureInput(flow, currentNodeId, currentBlockId, incomingMessage.text, variables)
            variables = captured.variables
            currentBlockId = captured.nextBlockId

            // If next block is null the node is exhausted — follow the edge
            if (currentBlockId === null) {
                currentNodeId = this.followEdge(flow.edges, currentNodeId, null)
            }
        }

        // ── 2. If no node yet, jump to the first node after the start node ────
        if (!currentNodeId) {
            const startNode = flow.nodes.find((n) => n.type === "start")
            if (!startNode) return { currentNodeId: null, currentBlockId: null, variables }
            currentNodeId = this.followEdge(flow.edges, startNode.id, null)
            currentBlockId = null
        }

        // ── 3. Execute blocks in a loop until we hit an input or run out ──────
        while (currentNodeId) {
            const node = flow.nodes.find((n) => n.id === currentNodeId)
            if (!node) break

            // Start node: just follow the outgoing edge
            if (node.type === "start") {
                currentNodeId = this.followEdge(flow.edges, node.id, null)
                currentBlockId = null
                continue
            }

            const groupNode = node as GroupFlowNode
            const blocks = groupNode.data.blocks ?? []
            const foundIdx = currentBlockId ? blocks.findIndex((b) => b.id === currentBlockId) : 0
            const startIdx = foundIdx === -1 ? blocks.length : foundIdx

            let jumped = false

            for (let i = startIdx; i < blocks.length; i++) {
                const block = blocks[i]

                if (BUBBLE_BLOCK_TYPES.has(block.type)) {
                    await wa_client.showTyping(incomingMessage.id)
                    await sleep(1200)
                    const ok = await wa_client.sendBlock(incomingMessage.from, block, variables)
                    if (!ok) return { currentNodeId: null, currentBlockId: null, variables }
                    continue
                }

                if (INPUT_BLOCK_TYPES.has(block.type)) {
                    await wa_client.showTyping(incomingMessage.id)
                    await sleep(1200)
                    const ok = await wa_client.sendBlock(incomingMessage.from, block, variables)
                    if (!ok) return { currentNodeId: null, currentBlockId: null, variables }
                    // Pause here — next message from user will be the answer
                    return { currentNodeId: currentNodeId!, currentBlockId: block.id, variables }
                }

                if (block.type === "condition") {
                    const matched = this.evaluateConditionBlock(block, variables)
                    const handle = matched ? "true" : "false"
                    currentNodeId = this.followEdge(flow.edges, currentNodeId!, handle)
                    currentBlockId = null
                    jumped = true
                    break
                }

                if (block.type === "set-variable") {
                    variables = this.executeSetVariable(block, variables, incomingMessage.from)
                    continue
                }

                // Unhandled block type — skip silently
            }

            if (!jumped) {
                // All blocks in node executed — follow the unconditional edge
                currentNodeId = this.followEdge(flow.edges, currentNodeId!, null)
                currentBlockId = null
            }
        }

        // Flow ended
        return { currentNodeId: null, currentBlockId: null, variables }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private captureInput(
        flow: BotFlowData,
        nodeId: string,
        blockId: string,
        userText: string,
        variables: Record<string, string | boolean | number>
    ): { variables: Record<string, string | boolean | number>; nextBlockId: string | null } {
        const node = flow.nodes.find((n) => n.id === nodeId) as GroupFlowNode | undefined
        if (!node) return { variables, nextBlockId: null }

        const blocks = node.data.blocks
        const idx = blocks.findIndex((b) => b.id === blockId)
        if (idx === -1) return { variables, nextBlockId: null }

        const block = blocks[idx]
        const updated = { ...variables }

        // Save the user's answer into the configured variable
        const saveKey = (block.content.saveAnswerTo ?? block.content.saveLabelTo) as string | undefined
        if (saveKey) updated[saveKey] = userText

        const nextBlock = blocks[idx + 1] ?? null
        return { variables: updated, nextBlockId: nextBlock?.id ?? null }
    }

    private followEdge(
        edges: FlowEdge[],
        sourceNodeId: string,
        sourceHandle: string | null
    ): string | null {
        // Prefer edge matching the requested handle; fall back to any edge from this node
        const match = sourceHandle
            ? edges.find((e) => e.source === sourceNodeId && e.sourceHandle === sourceHandle)
              ?? edges.find((e) => e.source === sourceNodeId)
            : edges.find((e) => e.source === sourceNodeId)

        return match?.target ?? null
    }

    private evaluateConditionBlock(block: Block, variables: Record<string, string | boolean | number>): boolean {
        const conditions = (block.content.conditions as ConditionItem[] | undefined) ?? []
        const logical = (block.content.logicalOperator as string | undefined) ?? "AND"

        if (conditions.length === 0) return true

        const results = conditions.map((c) => {
            const actual = c.variableName ? String(variables[c.variableName] ?? "") : ""
            return this.testCondition(actual, c.operator, c.value)
        })

        return logical === "OR" ? results.some(Boolean) : results.every(Boolean)
    }

    private executeSetVariable(
        block: Block,
        variables: Record<string, string | boolean | number>,
        phoneNumber: string
    ): Record<string, string | boolean | number> {
        const varName = block.content.variable as string | undefined
        if (!varName) return variables

        const valueType = (block.content.valueType as string | undefined) ?? "custom"
        const updated = { ...variables }

        switch (valueType) {
            case "custom": {
                const raw = block.content.value as string | undefined
                updated[varName] = raw
                    ? raw.replace(/\{\{([^}]+)\}\}/g, (_, n) => String(variables[n.trim()] ?? `{{${n}}}`))
                    : ""
                break
            }
            case "empty":
                updated[varName] = ""
                break
            case "phone-number":
                updated[varName] = phoneNumber
                break
            case "random-id":
                updated[varName] = Math.random().toString(36).slice(2, 10)
                break
            default:
                break
        }

        return updated
    }

    private testCondition(actual: string, operator: string, expected: string): boolean {
        const a = actual.toLowerCase().trim()
        const e = expected.toLowerCase().trim()
        const aNum = parseFloat(actual)
        const eNum = parseFloat(expected)

        switch (operator) {
            case "equal":              return a === e
            case "not-equal":          return a !== e
            case "contains":           return a.includes(e)
            case "not-contains":       return !a.includes(e)
            case "starts-with":        return a.startsWith(e)
            case "ends-with":          return a.endsWith(e)
            case "greater-than":       return !isNaN(aNum) && !isNaN(eNum) && aNum > eNum
            case "less-than":          return !isNaN(aNum) && !isNaN(eNum) && aNum < eNum
            case "is-set":             return actual.trim().length > 0
            case "is-empty":           return actual.trim().length === 0
            case "matches-regex":      try { return new RegExp(expected).test(actual) } catch { return false }
            case "not-matches-regex":  try { return !new RegExp(expected).test(actual) } catch { return true }
            default:                   return false
        }
    }
}

export const wa_chat_manager = new WaChatManager()
