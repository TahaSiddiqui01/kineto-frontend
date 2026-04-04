'use client';

import React, { useCallback } from 'react';
import * as LucideIcons from 'lucide-react';
import { Lock } from 'lucide-react';
import type { BlockDefinition } from '@/types/flow';
import { useFlowStore } from '@/store/flow.store';

interface NodeItemProps {
  definition: BlockDefinition;
}

function DynamicIcon({ name, color }: { name: string; color: string }) {
  const Icon = (
    LucideIcons as Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>>
  )[name];
  if (!Icon)
    return (
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
        }}
      />
    );
  return <Icon size={12} color={color} strokeWidth={2} />;
}

export function NodeItem({ definition }: NodeItemProps) {
  const { setActiveDragBlock } = useFlowStore();

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData(
        'application/flow-block',
        JSON.stringify({ type: definition.type, category: definition.category })
      );
      e.dataTransfer.effectAllowed = 'copy';

      setActiveDragBlock({
        type: definition.type,
        iconName: definition.iconName,
        color: definition.color,
        label: definition.label,
      });
    },
    [definition, setActiveDragBlock]
  );

  const handleDragEnd = useCallback(() => {
    setActiveDragBlock(null);
  }, [setActiveDragBlock]);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="flex items-center gap-1.5 rounded-lg select-none cursor-grab active:cursor-grabbing transition-colors hover:bg-white/[0.06]"
      style={{
        background: '#1e1f22',
        border: '1px solid #2e3033',
        padding: '7px 10px',
      }}
      title={definition.label}
    >
      <DynamicIcon name={definition.iconName} color={definition.color} />
      <span
        className="flex-1 truncate"
        style={{ fontSize: 11.5, color: '#c8cace', lineHeight: '1' }}
      >
        {definition.label}
      </span>
      {definition.isPro && (
        <Lock size={9} style={{ color: '#4b5563', flexShrink: 0 }} />
      )}
      {definition.isBeta && (
        <span
          style={{
            fontSize: 8,
            fontWeight: 700,
            color: '#f97316',
            background: 'rgba(249,115,22,0.15)',
            borderRadius: 3,
            padding: '1px 3px',
            flexShrink: 0,
          }}
        >
          Beta
        </span>
      )}
    </div>
  );
}
