'use client';

import React, { useCallback } from 'react';
import { X } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import type { Block } from '@/types/flow';
import { NodeManager } from '@/lib/flow/node-manager';
import { useFlowStore } from '@/store/flow.store';
import { DynamicIcon } from '@/components/ui/icons/dynamic-icon';
import { BLOCK_ITEM_PREVIEW_REGISTRY } from './block-item-previews/registry';

interface BlockItemProps {
  block: Block;
  nodeId: string;
}

export const BlockItem = React.memo(function BlockItem({ block, nodeId }: BlockItemProps) {
  const def = NodeManager.getBlockDefinition(block.type);
  const { setActiveDragBlock, setSelectedBlock, selectedBlockId, removeBlockFromNode } = useFlowStore(
    useShallow((s) => ({
      setActiveDragBlock: s.setActiveDragBlock,
      setSelectedBlock: s.setSelectedBlock,
      selectedBlockId: s.selectedBlockId,
      removeBlockFromNode: s.removeBlockFromNode,
    }))
  );

  const isSelected = selectedBlockId === block.id;
  const entry = BLOCK_ITEM_PREVIEW_REGISTRY[block.type];
  const hasContent = entry?.hasContent(block) ?? false;
  const PreviewComponent = entry?.component;

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.stopPropagation();
      e.dataTransfer.setData(
        'application/flow-block-move',
        JSON.stringify({ blockId: block.id, sourceNodeId: nodeId })
      );
      e.dataTransfer.effectAllowed = 'move';
      if (def) {
        setActiveDragBlock({ type: block.type, iconName: def.iconName, color: def.color, label: def.label });
      }
    },
    [block.id, block.type, nodeId, def, setActiveDragBlock]
  );

  const handleDragEnd = useCallback(() => setActiveDragBlock(null), [setActiveDragBlock]);
  const hideDynamicIcon = block.type === 'image-bubble' && hasContent; // Hide icon if it's an image bubble with content and the image or icon will be shown in the preview

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={(e) => { e.stopPropagation(); setSelectedBlock(block.id, nodeId); }}
      className={`group relative flex items-center gap-2.5 nodrag cursor-pointer select-none rounded-lg px-3 py-2.25 border transition-all ${isSelected
          ? 'bg-[#1e2535] border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.25)]'
          : 'bg-[#1c1d20] border-[#2e2f33] hover:border-[#3e3f43]'
        }`}
    >
      {def && !hideDynamicIcon && (
        <span className="shrink-0">
          <DynamicIcon name={def.iconName} color={def.color} />
        </span>
      )}

      {/* Content area */}
      {PreviewComponent && hasContent ? (
        <PreviewComponent block={block} />
      ) : (
        <span className="flex-1 truncate text-sm text-gray-600 italic text-left">
          {entry ? 'Click to configure' : (def?.label ?? block.type)}
        </span>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); removeBlockFromNode(nodeId, block.id); }}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity rounded p-0.5 hover:bg-red-500/20 text-gray-500"
        title="Remove"
      >
        <X size={10} />
      </button>
    </div>
  );
});
