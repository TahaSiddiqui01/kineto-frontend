'use client';

import React, { useCallback } from 'react';
import { Lock } from 'lucide-react';
import type { BlockDefinition } from '@/types/flow';
import { useFlowStore } from '@/store/flow.store';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/components/ui/icons/dynamic-icon';

interface NodeItemProps {
  definition: BlockDefinition;
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
      className={cn("flex items-center gap-1.5 rounded-lg select-none cursor-grab active:cursor-grabbing transition-colors border px-2 py-2.5", {
        "hover:brightness-95 dark:hover:brightness-125": !definition.isDisabled
      })}
      style={{
        background: 'var(--canvas-surface-raised)',
        borderColor: 'var(--canvas-border-subtle)',
      }}
      title={definition.label}
      aria-disabled={definition.isDisabled}
    >
      <DynamicIcon isDisabled={definition.isDisabled!} name={definition.iconName} color={definition.color} />
      <span
        className="flex-1 truncate text-sm"
        style={{ color: definition.isDisabled ? 'var(--canvas-border-subtle)' : 'var(--foreground)' }}
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
