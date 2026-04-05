'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import * as LucideIcons from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { BlockItem } from './block-item';
import { useFlowStore } from '@/store/flow.store';
import type { ActiveDragBlock } from '@/store/flow.store';
import type { GroupFlowNode, BlockType } from '@/types/flow';

const HANDLE: React.CSSProperties = {
  width: 13,
  height: 13,
  background: '#f36b25',
  border: '2.5px solid #111213',
  borderRadius: '50%',
  cursor: 'crosshair',
  zIndex: 10,
};

// ─── Drop placeholder shown during drag-over ────────────────────────────────

function IconPreview({ name, color }: { name: string; color: string }) {
  const Icon = (
    LucideIcons as Record<
      string,
      React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
    >
  )[name];
  if (!Icon) return null;
  return <Icon size={13} color={color} strokeWidth={2} />;
}

function DropPlaceholder({ active }: { active: ActiveDragBlock | null }) {
  return (
    <div className="drop-placeholder flex items-center gap-2.5" style={{ borderRadius: 8 }}>
      {active ? (
        <>
          <span className="shrink-0">
            <IconPreview name={active.iconName} color={active.color} />
          </span>
          <span
            className="flex-1 truncate"
            style={{ fontSize: 12, color: 'rgba(243,107,37,0.85)', fontWeight: 500 }}
          >
            {active.label}
          </span>
        </>
      ) : (
        <span style={{ fontSize: 12, color: 'rgba(243,107,37,0.7)', fontWeight: 500 }}>
          Drop here
        </span>
      )}
    </div>
  );
}

// ─── Main node ──────────────────────────────────────────────────────────────

export const GroupNode = React.memo(
  function GroupNode({ id, data, selected }: NodeProps<GroupFlowNode>) {
  const {
    updateNodeTitle,
    addBlockToNode,
    moveBlockBetweenNodes,
    reorderBlockInNode,
    deleteNode,
    activeDragBlock,
  } = useFlowStore(
    useShallow((s) => ({
      updateNodeTitle: s.updateNodeTitle,
      addBlockToNode: s.addBlockToNode,
      moveBlockBetweenNodes: s.moveBlockBetweenNodes,
      reorderBlockInNode: s.reorderBlockInNode,
      deleteNode: s.deleteNode,
      activeDragBlock: s.activeDragBlock,
    }))
  );

  const [isDragOver, setIsDragOver] = useState(false);
  // null = no indicator; number = show line before blocks[number] (length = after last)
  const [dropBeforeIndex, setDropBeforeIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    const has =
      e.dataTransfer.types.includes('application/flow-block') ||
      e.dataTransfer.types.includes('application/flow-block-move');
    if (!has) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const moveData = e.dataTransfer.getData('application/flow-block-move');
      if (moveData) {
        const { blockId, sourceNodeId } = JSON.parse(moveData) as {
          blockId: string;
          sourceNodeId: string;
        };
        if (sourceNodeId !== id) moveBlockBetweenNodes(sourceNodeId, id, blockId);
        return;
      }

      const blockData = e.dataTransfer.getData('application/flow-block');
      if (blockData) {
        const { type } = JSON.parse(blockData) as { type: BlockType };
        addBlockToNode(id, type);
      }
    },
    [id, addBlockToNode, moveBlockBetweenNodes]
  );

  // ── Per-item reorder drag handlers ────────────────────────────────────────
  const getDropIndex = (e: React.DragEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return e.clientY < rect.top + rect.height / 2 ? index : index + 1;
  };

  const handleItemDragOver = useCallback((e: React.DragEvent, index: number) => {
    if (!e.dataTransfer.types.includes('application/flow-block-move')) return;
    e.preventDefault();
    e.stopPropagation();
    const newIndex = getDropIndex(e, index);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setDropBeforeIndex(newIndex);
      rafRef.current = null;
    });
  }, []);

  const handleItemDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropBeforeIndex(null);
  }, []);

  const handleItemDrop = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setIsDragOver(false);
      setDropBeforeIndex(null);

      const moveData = e.dataTransfer.getData('application/flow-block-move');
      if (!moveData) return;
      const { blockId, sourceNodeId } = JSON.parse(moveData) as {
        blockId: string;
        sourceNodeId: string;
      };
      const targetIndex = getDropIndex(e, index);
      if (sourceNodeId === id) {
        reorderBlockInNode(id, blockId, targetIndex);
      } else {
        moveBlockBetweenNodes(sourceNodeId, id, blockId);
      }
    },
    [id, reorderBlockInNode, moveBlockBetweenNodes]
  );

  const cardStyle = useMemo<React.CSSProperties>(
    () => ({
      background: '#252628',
      border: `1.5px solid ${selected || isDragOver ? '#f36b25' : '#3a3b3e'}`,
      boxShadow: selected
        ? '0 0 0 3px rgba(243,107,37,0.18), 0 8px 32px rgba(0,0,0,0.55)'
        : '0 4px 20px rgba(0,0,0,0.45)',
      transition: 'border-color 0.12s, box-shadow 0.12s',
      overflow: 'hidden',
    }),
    [selected, isDragOver]
  );

  return (
    <div className="relative" style={{ width: 230 }}>

      {/* Target handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          ...HANDLE,
          position: 'absolute',
          left: -7,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Visual card */}
      <div
        className="rounded-xl"
        style={cardStyle}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2 px-3 py-2.5"
          style={{ borderBottom: '1px solid #363839' }}
        >
          <input
            ref={inputRef}
            value={data.title}
            onChange={(e) => updateNodeTitle(id, e.target.value)}
            className="flex-1 bg-transparent outline-none min-w-0 nodrag"
            style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}
            placeholder="Group name"
            onMouseDown={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => deleteNode(id)}
            className="node-delete-btn shrink-0 rounded-md p-1 nodrag"
            title="Delete node"
          >
            <Trash2 size={12} style={{ color: '#9ca3af' }} />
          </button>
        </div>

        {/* Blocks */}
        <div className="flex flex-col p-2">
          {/* Existing blocks */}
          {data.blocks.map((block, index) => (
            <div
              key={block.id}
              onDragOver={(e) => handleItemDragOver(e, index)}
              onDragLeave={handleItemDragLeave}
              onDrop={(e) => handleItemDrop(e, index)}
              style={{ marginBottom: index < data.blocks.length - 1 ? 6 : 0 }}
            >
              {/* Drop indicator line – before this block */}
              <div style={{
                height: 2,
                borderRadius: 1,
                marginBottom: 3,
                background: dropBeforeIndex === index ? '#f36b25' : 'transparent',
                transition: 'background 0.1s',
              }} />
              <BlockItem
                block={block}
                nodeId={id}
              />
              {/* Drop indicator line – after last block */}
              {index === data.blocks.length - 1 && (
                <div style={{
                  height: 2,
                  borderRadius: 1,
                  marginTop: 3,
                  background: dropBeforeIndex === data.blocks.length ? '#f36b25' : 'transparent',
                  transition: 'background 0.1s',
                }} />
              )}
            </div>
          ))}

          {/* Empty state OR drop placeholder */}
          {isDragOver ? (
            <DropPlaceholder active={activeDragBlock} />
          ) : (
            data.blocks.length === 0 && (
              <div
                className="flex items-center justify-center rounded-lg border border-dashed"
                style={{
                  padding: '14px 8px',
                  borderColor: '#3a3b3e',
                  color: '#4b5563',
                  fontSize: 11,
                }}
              >
                Drop blocks here
              </div>
            )
          )}
        </div>
      </div>

      {/* Source handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          ...HANDLE,
          position: 'absolute',
          right: -7,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  );
},
  (prev, next) =>
    prev.id === next.id && prev.data === next.data && prev.selected === next.selected
);