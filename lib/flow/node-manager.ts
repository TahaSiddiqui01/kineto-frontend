import { v4 as uuidv4 } from 'uuid';
import type {
  Block,
  BlockContent,
  BlockType,
  BlockDefinition,
  FlowEdge,
  GroupFlowNode,
  StartFlowNode,
} from '@/types/flow';
import { BLOCK_DEFINITIONS_MAP } from './block-definitions';

/**
 * NodeManager is a static class that centralises creation, mutation,
 * and querying of flow nodes and their blocks.
 */
export class NodeManager {
  // ─── Block helpers ───────────────────────────────────────────────────────────

  static getBlockDefinition(type: BlockType): BlockDefinition | undefined {
    return BLOCK_DEFINITIONS_MAP.get(type);
  }

  static createBlock(type: BlockType, content: BlockContent = {}): Block {
    return { id: uuidv4(), type, content };
  }

  // ─── Node factories ──────────────────────────────────────────────────────────

  static createStartNode(position: { x: number; y: number }): StartFlowNode {
    return {
      id: uuidv4(),
      type: 'start',
      position,
      data: { label: 'Start' },
      deletable: false,
    };
  }

  static createGroupNode(
    position: { x: number; y: number },
    initialBlocks: Block[] = [],
    title = 'Group'
  ): GroupFlowNode {
    return {
      id: uuidv4(),
      type: 'group',
      position,
      data: {
        title,
        blocks: initialBlocks,
      },
    };
  }

  // ─── Node mutations ──────────────────────────────────────────────────────────

  static updateNodeTitle(node: GroupFlowNode, title: string): GroupFlowNode {
    return { ...node, data: { ...node.data, title } };
  }

  static addBlockToNode(node: GroupFlowNode, block: Block): GroupFlowNode {
    return {
      ...node,
      data: { ...node.data, blocks: [...node.data.blocks, block] },
    };
  }

  static removeBlockFromNode(node: GroupFlowNode, blockId: string): GroupFlowNode {
    return {
      ...node,
      data: {
        ...node.data,
        blocks: node.data.blocks.filter((b) => b.id !== blockId),
      },
    };
  }

  static moveBlock(
    sourceNode: GroupFlowNode,
    targetNode: GroupFlowNode,
    blockId: string
  ): { source: GroupFlowNode; target: GroupFlowNode } {
    const block = sourceNode.data.blocks.find((b) => b.id === blockId);
    if (!block) return { source: sourceNode, target: targetNode };
    return {
      source: NodeManager.removeBlockFromNode(sourceNode, blockId),
      target: NodeManager.addBlockToNode(targetNode, block),
    };
  }

  // ─── Edge factory ────────────────────────────────────────────────────────────

  static createEdge(sourceId: string, targetId: string): FlowEdge {
    return {
      id: `${sourceId}→${targetId}`,
      source: sourceId,
      target: targetId,
      type: 'flow-edge',
      data: {},
    };
  }
}
