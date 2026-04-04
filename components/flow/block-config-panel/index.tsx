'use client';

import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useFlowStore } from '@/store/flow.store';
import { BLOCK_CONFIG_SCHEMAS_MAP } from '@/lib/flow/block-config-schemas';
import { NodeManager } from '@/lib/flow/node-manager';
import type { BlockContent, GroupFlowNode } from '@/types/flow';
import { BlockConfigField } from './block-config-field';

function DynamicIcon({ name, color }: { name: string; color: string }) {
  const Icon = (
    LucideIcons as Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>>
  )[name];
  if (!Icon) return <span style={{ width: 14, height: 14, borderRadius: '50%', background: color, display: 'inline-block' }} />;
  return <Icon size={14} color={color} strokeWidth={2} />;
}

export function BlockConfigPanel() {
  const { nodes, selectedBlockId, selectedBlockNodeId, clearSelectedBlock, updateBlockContent } =
    useFlowStore();

  const isOpen = !!selectedBlockId && !!selectedBlockNodeId;

  const { block, schema, def } = useMemo(() => {
    if (!selectedBlockId || !selectedBlockNodeId) return { block: null, schema: null, def: null };

    const node = nodes.find((n) => n.id === selectedBlockNodeId) as GroupFlowNode | undefined;
    if (!node || node.type !== 'group') return { block: null, schema: null, def: null };

    const blk = node.data.blocks.find((b) => b.id === selectedBlockId);
    if (!blk) return { block: null, schema: null, def: null };

    return {
      block: blk,
      schema: BLOCK_CONFIG_SCHEMAS_MAP.get(blk.type) ?? null,
      def: NodeManager.getBlockDefinition(blk.type) ?? null,
    };
  }, [nodes, selectedBlockId, selectedBlockNodeId]);

  const handleChange = (patch: Partial<BlockContent>) => {
    if (!selectedBlockNodeId || !selectedBlockId) return;
    updateBlockContent(selectedBlockNodeId, selectedBlockId, patch);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: 280,
        background: '#16171a',
        borderRight: '1px solid #2a2b2d',
        display: 'flex',
        flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
        zIndex: 10,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 shrink-0"
        style={{
          padding: '12px 14px',
          borderBottom: '1px solid #2a2b2d',
        }}
      >
        {def && (
          <span className="shrink-0">
            <DynamicIcon name={def.iconName} color={def.color} />
          </span>
        )}
        <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e4e8', flex: 1, minWidth: 0 }}>
          {schema?.title ?? block?.type ?? ''}
        </span>
        <button
          onClick={clearSelectedBlock}
          className="flex items-center justify-center rounded-lg p-1 hover:bg-white/[0.06] transition-colors"
          title="Close"
          style={{ color: '#6b7280', flexShrink: 0 }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {block && schema && schema.fields.map((field) => (
          <BlockConfigField
            key={field.key}
            field={field}
            value={block.content[field.key] as string | boolean | undefined}
            onChange={handleChange}
          />
        ))}

        {schema && schema.fields.length === 0 && (
          <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 24 }}>
            No configuration options
          </p>
        )}
      </div>
    </div>
  );
}
