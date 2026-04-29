import type { BotFlowData } from "@/types/bot"
import type { Block, FlowEdge, GroupFlowNode } from "@/types/flow"
import type { IncomingMessage } from "@/types/whatsapp/whatsapp"
import type { WaChatResolveParams } from "@/types/whatsapp/wa-chat-manager"
import type { ConversationState } from "@/lib/conversation-state.server"
import type { ConditionItem } from "@/components/flow/block-config-panel/blocks/condition/condition-row"
import { wa_client } from "./wa-client"
import { interpolate } from "@/components/flow/preview/registry/utils"
import { BLOCK_RETRY_MESSAGES } from "@/constants/block-retry-messages"

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
                mediaId: msg.audio?.id ?? msg.voice?.id ?? undefined,
                messages: change.messages,
            }
        } catch {
            return null
        }
    }

    /** Main entry point called from the webhook. Returns the new conversation state. */
    async resolveMessage({ state, flow, incomingMessage }: WaChatResolveParams): Promise<ConversationState> {
        let { currentNodeId, currentBlockId, variables } = state

        // Conversation previously ended — restart with a clean slate
        if (state.ended) {
            currentNodeId = null
            currentBlockId = null
            variables = {}
        }

        // ── 1. Capture response for the block we were waiting on ──────────────
        let hadPendingInput = false

        if (currentNodeId && currentBlockId) {
            hadPendingInput = true
            const currentNode = flow.nodes.find((n) => n.id === currentNodeId) as GroupFlowNode | undefined
            const currentBlock = currentNode?.data.blocks.find((b) => b.id === currentBlockId)

            if (currentBlock) {
                const validation = this.validateInput(currentBlock, incomingMessage, variables)
                if (!validation.valid) {
                    await wa_client.sendText({ to: incomingMessage.from, text: validation.error })
                    await wa_client.showTyping(incomingMessage.id)
                    await sleep(800)
                    await wa_client.sendBlock(incomingMessage.from, currentBlock, variables)
                    return { currentNodeId, currentBlockId, variables }
                }
                const captured = this.captureInput(flow, currentNodeId, currentBlockId, validation.value, variables)
                variables = captured.variables
                currentBlockId = captured.nextBlockId
            } else {
                const captured = this.captureInput(flow, currentNodeId, currentBlockId, incomingMessage.text, variables)
                variables = captured.variables
                currentBlockId = captured.nextBlockId
            }

            // If next block is null the node is exhausted — follow the edge
            if (currentBlockId === null) {
                currentNodeId = this.followEdge(flow.edges, currentNodeId, null)
            }
        }

        // ── 2. If no node yet, start from the beginning — but only for fresh conversations.
        //       If we just handled an input and reached the end, the flow is done.
        if (!currentNodeId) {
            if (hadPendingInput) {
                return { currentNodeId: null, currentBlockId: null, variables, ended: true }
            }
            const startNode = flow.nodes.find((n) => n.type === "start")
            if (!startNode) return { currentNodeId: null, currentBlockId: null, variables, ended: true }
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

        // Flow ended — mark so further messages are ignored
        return { currentNodeId: null, currentBlockId: null, variables, ended: true }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private validateInput(
        block: Block,
        incomingMessage: IncomingMessage,
        variables: Record<string, string | boolean | number>
    ): { valid: boolean; error: string; value: string } {
        const text = incomingMessage.text.trim()
        const msgType = incomingMessage.type

        const retryMsg = (raw: string | undefined) =>
            interpolate(raw || BLOCK_RETRY_MESSAGES[block.type] || 'Invalid input, please try again.', variables)

        switch (block.type) {
            case 'text-input': {
                if (!text) return { valid: false, error: retryMsg(block.content.retryMessage as string | undefined), value: '' }
                return { valid: true, error: '', value: text }
            }

            case 'number-input': {
                if (msgType !== 'text' || !text) return { valid: false, error: retryMsg(block.content.retryMessage as string | undefined), value: '' }
                const num = Number(text)
                if (isNaN(num)) return { valid: false, error: retryMsg(block.content.retryMessage as string | undefined), value: '' }
                const min = block.content.min !== undefined && block.content.min !== '' ? Number(block.content.min) : undefined
                const max = block.content.max !== undefined && block.content.max !== '' ? Number(block.content.max) : undefined
                if (min !== undefined && !isNaN(min) && num < min) return { valid: false, error: retryMsg(block.content.retryMessage as string | undefined), value: '' }
                if (max !== undefined && !isNaN(max) && num > max) return { valid: false, error: retryMsg(block.content.retryMessage as string | undefined), value: '' }
                return { valid: true, error: '', value: text }
            }

            case 'email-input': {
                if (msgType !== 'text' || !text || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))
                    return { valid: false, error: retryMsg(block.content.retryMessage as string | undefined), value: '' }
                return { valid: true, error: '', value: text }
            }

            case 'website-input': {
                if (msgType !== 'text' || !text) return { valid: false, error: retryMsg(block.content.retryMessage as string | undefined), value: '' }
                try {
                    new URL(text.startsWith('http') ? text : `https://${text}`)
                    return { valid: true, error: '', value: text }
                } catch {
                    return { valid: false, error: retryMsg(block.content.retryMessage as string | undefined), value: '' }
                }
            }

            case 'audio-input': {
                if (msgType !== 'audio') return { valid: false, error: retryMsg(block.content.retryMessage as string | undefined), value: '' }
                return { valid: true, error: '', value: incomingMessage.mediaId ?? '' }
            }

            default:
                return { valid: true, error: '', value: text }
        }
    }

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
