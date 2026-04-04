'use client';

import React from 'react';
import {
  BaseEdge,
  EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
} from '@xyflow/react';
import type { FlowEdge } from '@/types/flow';

export function FlowEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}: EdgeProps<FlowEdge>) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 12,
  });

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
    pointerEvents: 'all',
    background: '#242628',
    color: '#e8e9ea',
    border: '1px solid #363839',
    borderRadius: 6,
    padding: '2px 8px',
    fontSize: 11,
    fontWeight: 500,
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? '#f36b25' : '#555860',
          strokeWidth: selected ? 2 : 1.5,
          transition: 'stroke 0.15s',
        }}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div style={labelStyle}>{data.label}</div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
