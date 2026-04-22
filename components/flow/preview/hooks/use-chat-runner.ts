'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useFlowStore } from '@/store/flow.store';
import type { GroupFlowNode, Block } from '@/types/flow';
import type { Platform } from '../registry/types';
import { CHAT_BLOCK_REGISTRY } from '../registry';
import { interpolate } from '../registry/utils';

export interface ChatMessage {
  id: string;
  source: 'bot' | 'user';
  blockType: string;
  content: Record<string, unknown>;
  isTyping: boolean;
}

interface ConditionItem {
  id: string;
  variableName?: string;
  operator: string;
  value: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function evaluateConditions(
  conditions: ConditionItem[],
  logicalOperator: string,
  variables: Record<string, string>
): boolean {
  const results = conditions.map((c) => {
    const v = variables[c.variableName ?? ''] ?? '';
    const cmp = c.value;
    switch (c.operator) {
      case 'equal':             return v === cmp;
      case 'not-equal':         return v !== cmp;
      case 'contains':          return v.includes(cmp);
      case 'not-contains':      return !v.includes(cmp);
      case 'greater-than':      return parseFloat(v) >= parseFloat(cmp);
      case 'less-than':         return parseFloat(v) <= parseFloat(cmp);
      case 'is-set':            return v !== '';
      case 'is-empty':          return v === '';
      case 'starts-with':       return v.startsWith(cmp);
      case 'ends-with':         return v.endsWith(cmp);
      case 'matches-regex':     try { return new RegExp(cmp).test(v); } catch { return false; }
      case 'not-matches-regex': try { return !new RegExp(cmp).test(v); } catch { return true; }
      default:                  return false;
    }
  });
  return logicalOperator === 'OR' ? results.some(Boolean) : results.every(Boolean);
}

function resolveSetVariable(
  valueType: string,
  value: string | undefined,
  variables: Record<string, string>
): string {
  const now = new Date();
  switch (valueType) {
    case 'custom':           return interpolate(value ?? '', variables);
    case 'empty':            return '';
    case 'append':           return interpolate(value ?? '', variables);
    case 'environment-name': return 'web';
    case 'device-type':      return 'desktop';
    case 'now':              return now.toISOString();
    case 'yesterday': {
      const d = new Date(now); d.setDate(d.getDate() - 1); return d.toISOString();
    }
    case 'tomorrow': {
      const d = new Date(now); d.setDate(d.getDate() + 1); return d.toISOString();
    }
    case 'random-id':     return crypto.randomUUID();
    case 'moment-of-day': {
      const h = now.getHours();
      if (h < 12) return 'morning';
      if (h < 17) return 'afternoon';
      if (h < 21) return 'evening';
      return 'night';
    }
    default: return value ?? '';
  }
}

export function useChatRunner(platform: Platform) {
  const { nodes, edges } = useFlowStore(
    useShallow((s) => ({ nodes: s.nodes, edges: s.edges }))
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'waiting' | 'done'>('idle');
  const [pendingMsgId, setPendingMsgId] = useState<string | null>(null);
  const [pendingBlock, setPendingBlock] = useState<Block | null>(null);
  // Reactive variables state so interpolation re-renders with up-to-date values
  const [variables, setVariables] = useState<Record<string, string>>({});

  // runCtxRef holds the current execution context so cancellation works correctly
  // even under React Strict Mode's double-invocation of effects.
  const runCtxRef = useRef<{ cancel: boolean }>({ cancel: true });
  const inputResolverRef = useRef<((value: string) => void) | null>(null);
  const varsRef = useRef<Record<string, string>>({});

  const adjacency = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const edge of edges) {
      if (!map.has(edge.source)) map.set(edge.source, []);
      map.get(edge.source)!.push(edge.target);
    }
    return map;
  }, [edges]);

  function syncVars(vars: Record<string, string>) {
    varsRef.current = vars;
    setVariables({ ...vars });
  }

  function addTypingMessage(id: string, blockType: string, content: Record<string, unknown>) {
    setMessages((prev) => [...prev, { id, source: 'bot', blockType, content, isTyping: true }]);
  }

  function revealMessage(id: string) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isTyping: false } : m)));
  }

  function addUserMessage(value: string) {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), source: 'user', blockType: 'text', content: { text: value }, isTyping: false },
    ]);
  }

  function waitForUserInput(): Promise<string> {
    return new Promise<string>((resolve) => {
      inputResolverRef.current = resolve;
    });
  }

  async function executeBlock(
    block: Block,
    vars: Record<string, string>,
    ctx: { cancel: boolean }
  ): Promise<{ vars: Record<string, string>; jumpTo?: string; end?: boolean }> {
    if (ctx.cancel) return { vars };

    const entry = CHAT_BLOCK_REGISTRY[block.type];
    const category = entry?.category ?? 'logic';

    if (category === 'bubble') {
      const msgId = crypto.randomUUID();
      addTypingMessage(msgId, block.type, block.content as Record<string, unknown>);
      const textLen = (block.content.text as string ?? '').length;
      await sleep(700 + Math.min(textLen * 18, 1100));
      if (ctx.cancel) return { vars };
      revealMessage(msgId);
      await sleep(100);
      return { vars };
    }

    if (category === 'input') {
      const msgId = crypto.randomUUID();
      addTypingMessage(msgId, block.type, block.content as Record<string, unknown>);
      await sleep(500);
      if (ctx.cancel) return { vars };
      revealMessage(msgId);
      // Mark this message as the active input — the bubble will render the form inline
      setPendingMsgId(msgId);
      setPendingBlock(block);
      setStatus('waiting');
      const userAnswer = await waitForUserInput();
      if (ctx.cancel) return { vars };
      setPendingMsgId(null);
      setPendingBlock(null);
      setStatus('running');
      addUserMessage(userAnswer);
      const saveKey = block.content.saveAnswerTo as string | undefined;
      if (saveKey) {
        vars = { ...vars, [saveKey]: userAnswer };
        syncVars(vars);
      }
      return { vars };
    }

    // Logic blocks
    switch (block.type) {
      case 'set-variable': {
        const varName = block.content.variable as string | undefined;
        const valueType = (block.content.valueType as string | undefined) ?? 'custom';
        const value = block.content.value as string | undefined;
        if (varName) {
          const resolved = resolveSetVariable(valueType, value, vars);
          vars = { ...vars, [varName]: resolved };
          syncVars(vars);
        }
        return { vars };
      }

      case 'wait': {
        const secs = parseFloat(block.content.seconds as string ?? '1') || 1;
        await sleep(Math.min(secs * 1000, 10000));
        return { vars };
      }

      case 'condition': {
        const conditions = (block.content.conditions as ConditionItem[] | undefined) ?? [];
        const op = (block.content.logicalOperator as string | undefined) ?? 'AND';
        const matched = evaluateConditions(conditions, op, vars);
        return { vars, jumpTo: matched ? '__condition_match__' : '__condition_default__' };
      }

      case 'ab-test': {
        const aPercent = (block.content.aPercent as number | undefined) ?? 50;
        return { vars, jumpTo: Math.random() * 100 < aPercent ? '__ab_a__' : '__ab_b__' };
      }

      case 'jump': {
        const targetId = block.content.targetGroupId as string | undefined;
        if (targetId) return { vars, jumpTo: targetId };
        return { vars };
      }

      case 'return':
        return { vars, end: true };

      case 'redirect': {
        const url = block.content.url as string | undefined;
        if (url && platform === 'website') {
          const msgId = crypto.randomUUID();
          addTypingMessage(msgId, 'text-bubble', { text: `Redirecting to: ${url}` });
          await sleep(400);
          if (!ctx.cancel) revealMessage(msgId);
        }
        return { vars };
      }

      default:
        return { vars };
    }
  }

  async function executeNode(
    nodeId: string,
    vars: Record<string, string>,
    ctx: { cancel: boolean },
    visited: Set<string> = new Set()
  ): Promise<void> {
    if (ctx.cancel || visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = nodes.find((n) => n.id === nodeId);
    if (!node || node.type !== 'group') return;

    const groupNode = node as GroupFlowNode;
    let jumpTarget: string | undefined;
    let shouldEnd = false;

    for (const block of groupNode.data.blocks) {
      if (ctx.cancel) return;
      const result = await executeBlock(block, vars, ctx);
      vars = result.vars;
      if (result.end) { shouldEnd = true; break; }
      if (result.jumpTo) { jumpTarget = result.jumpTo; break; }
    }

    if (ctx.cancel || shouldEnd) {
      if (!ctx.cancel) setStatus('done');
      return;
    }

    const nextIds = adjacency.get(nodeId) ?? [];

    if (jumpTarget && !jumpTarget.startsWith('__')) {
      await executeNode(jumpTarget, vars, ctx, visited);
    } else if (nextIds.length === 0) {
      setStatus('done');
    } else if (nextIds.length === 1) {
      await executeNode(nextIds[0], vars, ctx, visited);
    } else {
      // condition / ab-test: first edge = match/A, second = default/B
      const goFirst = jumpTarget === '__condition_match__' || jumpTarget === '__ab_a__';
      await executeNode(goFirst ? nextIds[0] : (nextIds[1] ?? nextIds[0]), vars, ctx, visited);
    }
  }

  const start = useCallback(() => {
    // Cancel any previously running execution (handles React Strict Mode double-invoke)
    runCtxRef.current.cancel = true;
    inputResolverRef.current?.('' /* unblock any hanging wait */);
    inputResolverRef.current = null;

    const ctx = { cancel: false };
    runCtxRef.current = ctx;

    setMessages([]);
    setVariables({});
    setStatus('running');
    setPendingMsgId(null);
    setPendingBlock(null);
    varsRef.current = {};

    const startNode = nodes.find((n) => n.type === 'start');
    if (!startNode) { setStatus('done'); return; }

    const firstGroupId = adjacency.get(startNode.id)?.[0];
    if (!firstGroupId) { setStatus('done'); return; }

    executeNode(firstGroupId, {}, ctx).then(() => {
      if (!ctx.cancel) setStatus('done');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, adjacency, platform]);

  const answer = useCallback((value: string) => {
    inputResolverRef.current?.(value);
    inputResolverRef.current = null;
  }, []);

  const restart = useCallback(() => {
    setTimeout(() => start(), 16);
  }, [start]);

  return { messages, status, pendingBlock, pendingMsgId, start, answer, restart, variables };
}
