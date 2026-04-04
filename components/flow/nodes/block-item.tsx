'use client';

import React, { useCallback } from 'react';
import * as LucideIcons from 'lucide-react';
import { X } from 'lucide-react';
import type { Block } from '@/types/flow';
import { NodeManager } from '@/lib/flow/node-manager';
import { useFlowStore } from '@/store/flow.store';

interface BlockItemProps {
  block: Block;
  nodeId: string;
  onRemove: (blockId: string) => void;
}

function DynamicIcon({ name, color }: { name: string; color: string }) {
  const Icon = (
    LucideIcons as Record<
      string,
      React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
    >
  )[name];
  if (!Icon)
    return (
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
    );
  return <Icon size={14} color={color} strokeWidth={2} />;
}

export function BlockItem({ block, nodeId, onRemove }: BlockItemProps) {
  const def = NodeManager.getBlockDefinition(block.type);
  const label = block.content.text ?? def?.label ?? block.type;
  const { setActiveDragBlock, setSelectedBlock, selectedBlockId } = useFlowStore();
  const isSelected = selectedBlockId === block.id;

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.stopPropagation();
      e.dataTransfer.setData(
        'application/flow-block-move',
        JSON.stringify({ blockId: block.id, sourceNodeId: nodeId })
      );
      e.dataTransfer.effectAllowed = 'move';

      if (def) {
        setActiveDragBlock({
          type: block.type,
          iconName: def.iconName,
          color: def.color,
          label: def.label,
        });
      }
    },
    [block.id, block.type, nodeId, def, setActiveDragBlock]
  );

  const handleDragEnd = useCallback(() => {
    setActiveDragBlock(null);
  }, [setActiveDragBlock]);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBlock(block.id, nodeId);
      }}
      className="group relative flex items-center gap-2.5 nodrag cursor-pointer select-none"
      style={{
        background: isSelected ? '#1e2535' : '#1c1d20',
        border: isSelected ? '1px solid #3b82f6' : '1px solid #2e2f33',
        borderRadius: 8,
        padding: '9px 10px 9px 12px',
        boxShadow: isSelected ? '0 0 0 2px rgba(59,130,246,0.25)' : undefined,
      }}
    >
      {def && (
        <span className="shrink-0">
          <DynamicIcon name={def.iconName} color={def.color} />
        </span>
      )}

      <span
        className="flex-1 truncate"
        style={{ fontSize: 13, color: '#e2e4e8', fontWeight: 500 }}
      >
        {label}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(block.id);
        }}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity rounded p-0.5 hover:bg-red-500/20"
        title="Remove"
      >
        <X size={10} style={{ color: '#6b7280' }} />
      </button>
    </div>
  );
}
