'use client';

import { useCallback, useMemo } from 'react';
import { X } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useFlowStore } from '@/store/flow.store';
import { NodeManager } from '@/lib/flow/node-manager';
import type { BlockContent, GroupFlowNode } from '@/types/flow';
import { DynamicIcon } from '@/components/ui/icons/dynamic-icon';
import { BLOCK_CONFIG_REGISTRY, DEFAULT_BLOCK_CONFIG } from './registry';

export function BlockConfigPanel() {
  const { selectedBlockId, selectedBlockNodeId, clearSelectedBlock, updateBlockContent } =
    useFlowStore(
      useShallow((s) => ({
        selectedBlockId: s.selectedBlockId,
        selectedBlockNodeId: s.selectedBlockNodeId,
        clearSelectedBlock: s.clearSelectedBlock,
        updateBlockContent: s.updateBlockContent,
      }))
    );

  const block = useFlowStore(
    useCallback(
      (s) => {
        if (!selectedBlockId || !selectedBlockNodeId) return null;
        const node = s.nodes.find((n) => n.id === selectedBlockNodeId) as GroupFlowNode | undefined;
        if (!node || node.type !== 'group') return null;
        return node.data.blocks.find((b) => b.id === selectedBlockId) ?? null;
      },
      [selectedBlockId, selectedBlockNodeId]
    )
  );

  const isOpen = !!selectedBlockId && !!selectedBlockNodeId;

  const def = useMemo(
    () => (block ? NodeManager.getBlockDefinition(block.type) ?? null : null),
    [block]
  );

  const ConfigComponent = useMemo(
    () => (block ? (BLOCK_CONFIG_REGISTRY[block.type] ?? DEFAULT_BLOCK_CONFIG) : null),
    [block]
  );

  const handleChange = useCallback(
    (patch: Partial<BlockContent>) => {
      if (!selectedBlockNodeId || !selectedBlockId) return;
      updateBlockContent(selectedBlockNodeId, selectedBlockId, patch);
    },
    [selectedBlockNodeId, selectedBlockId, updateBlockContent]
  );

  return (
    <div
      className={`absolute top-0 left-0 h-full w-[280px] bg-[#16171a] border-r border-[#2a2b2d] flex flex-col z-10 transition-transform duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 shrink-0 px-[14px] py-3 border-b border-[#2a2b2d]">
        {def && (
          <span className="shrink-0">
            <DynamicIcon name={def.iconName} color={def.color} />
          </span>
        )}
        <span className="text-[13px] font-semibold text-[#e2e4e8] flex-1 min-w-0 truncate">
          {def?.label ?? block?.type ?? ''}
        </span>
        <button
          onClick={clearSelectedBlock}
          className="flex items-center justify-center rounded-lg p-1 hover:bg-white/[0.06] transition-colors text-gray-500 shrink-0"
          title="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Config body */}
      <div className="flex-1 overflow-y-auto p-[14px]">
        {block && ConfigComponent && (
          <ConfigComponent block={block} onChange={handleChange} />
        )}
      </div>
    </div>
  );
}
