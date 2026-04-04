'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Flag } from 'lucide-react';
import type { StartFlowNode } from '@/types/flow';

const HANDLE: React.CSSProperties = {
  width: 13,
  height: 13,
  background: '#f36b25',
  border: '2.5px solid #111213',
  borderRadius: '50%',
  cursor: 'crosshair',
  zIndex: 10,
};

export function StartNode({ data }: NodeProps<StartFlowNode>) {
  return (
    // Outer wrapper without overflow:hidden so handle isn't clipped
    <div className="relative inline-flex">
      <div
        className="flex items-center gap-2"
        style={{
          background: '#252628',
          border: '1.5px solid #3a3b3e',
          borderRadius: 999,
          padding: '8px 16px 8px 12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap',
          fontSize: 14,
          fontWeight: 600,
          color: '#e8e9ea',
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
}
