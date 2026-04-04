import type { Node } from '@xyflow/react';
import type { Block } from './block.types';

export type FlowNodeType = 'group' | 'start';

export interface GroupNodeData extends Record<string, unknown> {
  title: string;
  blocks: Block[];
}

export interface StartNodeData extends Record<string, unknown> {
  label: string;
}

export type GroupFlowNode = Node<GroupNodeData, 'group'>;
export type StartFlowNode = Node<StartNodeData, 'start'>;
export type FlowNode = GroupFlowNode | StartFlowNode;
