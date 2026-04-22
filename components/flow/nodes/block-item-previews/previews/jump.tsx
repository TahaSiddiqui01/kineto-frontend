'use client';

import { useShallow } from 'zustand/react/shallow';
import { useFlowStore } from '@/store/flow.store';
import type { GroupFlowNode } from '@/types/flow';
import type { BlockItemPreviewProps } from '../types';

export function JumpItemPreview({ block }: BlockItemPreviewProps) {
  const targetGroupId = block.content.targetGroupId as string | undefined;

  const nodes = useFlowStore(useShallow((s) => s.nodes));
  const targetNode = targetGroupId
    ? (nodes.find((n) => n.id === targetGroupId && n.type === 'group') as GroupFlowNode | undefined)
    : undefined;

  const label = targetNode ? (targetNode.data.title || 'Untitled group') : targetGroupId ? '—' : undefined;

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="truncate text-sm font-medium text-[#e2e4e8]">Jump</span>
      {label && <span className="text-[10px] text-gray-600 truncate">→ {label}</span>}
    </div>
  );
}
