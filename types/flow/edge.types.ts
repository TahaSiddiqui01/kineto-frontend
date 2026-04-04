import type { Edge } from '@xyflow/react';

export interface FlowEdgeData extends Record<string, unknown> {
  label?: string;
}

export type FlowEdge = Edge<FlowEdgeData, 'flow-edge'>;
