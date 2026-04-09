'use client';

import React, { useCallback } from 'react';
import * as LucideIcons from 'lucide-react';
import { Lock } from 'lucide-react';
import type { BlockDefinition } from '@/types/flow';
import { useFlowStore } from '@/store/flow.store';
import { cn } from '@/lib/utils';

interface NodeItemProps {
  definition: BlockDefinition;
}

function DynamicIcon({ name, color, isDisabled }: { name: string; color: string, isDisabled: boolean }) {
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
  return <Icon size={12} color={isDisabled ? "#2d2e2d" : color} strokeWidth={2} />;
}

export function NodeItem({ definition }: NodeItemProps) {
  const setActiveDragBlock = useFlowStore((s) => s.setActiveDragBlock);

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
      draggable={!definition.isDisabled}
      onDragStart={definition.isDisabled ? () => {} : handleDragStart}
      onDragEnd={definition.isDisabled ? () => {} : handleDragEnd}
      className={cn("flex items-center gap-1.5 rounded-lg select-none cursor-grab active:cursor-grabbing transition-colors bg-[#1e1f22] border border-[#2e3033] px-2 py-2.5", {
        "hover:bg-white/6": !definition.isDisabled
      })}
      title={definition.label}
      aria-disabled={definition.isDisabled}
    >
      <DynamicIcon isDisabled={definition.isDisabled!} name={definition.iconName} color={definition.color} />
      <span className={cn("flex-1 truncate text-sm text-[#c8cace]", {
        "text-[#2d2e2d]": definition.isDisabled
      })}>
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
