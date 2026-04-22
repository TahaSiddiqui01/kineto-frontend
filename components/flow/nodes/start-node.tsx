'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Flag } from 'lucide-react';
import type { StartFlowNode } from '@/types/flow';

const HANDLE: React.CSSProperties = {
  width: 13,
  height: 13,
  background: '#f36b25',
  border: '2.5px solid var(--node-handle-border)',
  borderRadius: '50%',
  cursor: 'crosshair',
  zIndex: 10,
};

export const StartNode = React.memo(
  function StartNode({ data }: NodeProps<StartFlowNode>) {
    return (
      // Outer wrapper without overflow:hidden so handle isn't clipped
      <div className="relative inline-flex">
        <div
          className="flex items-center gap-2"
          style={{
            background: 'var(--node-card-bg)',
            border: '1.5px solid var(--node-card-border)',
            borderRadius: 999,
            padding: '8px 16px 8px 12px',
            boxShadow: 'var(--node-card-shadow)',
            whiteSpace: 'nowrap',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--node-title-color)',
          }}
        >
          <Flag size={13} style={{ color: '#f36b25', flexShrink: 0 }} />
          {data.label}
        </div>

        <Handle
          type="source"
          position={Position.Right}
          style={{ ...HANDLE, position: 'absolute', right: -7, top: '50%', transform: 'translateY(-50%)' }}
        />
      </div>
    );
  },
  (prev, next) => prev.data === next.data
);
