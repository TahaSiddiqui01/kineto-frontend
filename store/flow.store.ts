import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import type { NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import type { FlowNode, FlowEdge, BlockType, BlockContent, GroupFlowNode } from '@/types/flow';
import { NodeManager } from '@/lib/flow/node-manager';

export interface ActiveDragBlock {
  type: BlockType;
  iconName: string;
  color: string;
  label: string;
}

interface FlowSnapshot {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

const HISTORY_LIMIT = 50;

const INITIAL_START_NODE = NodeManager.createStartNode({ x: 80, y: 260 });
const INITIAL_GROUP_NODE = NodeManager.createGroupNode(
  { x: 380, y: 180 },
  [NodeManager.createBlock('text-bubble', { text: 'Hey, what is your name?' })],
  'Grab the name'
);
const INITIAL_EDGE = NodeManager.createEdge(INITIAL_START_NODE.id, INITIAL_GROUP_NODE.id);

interface FlowStore {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string | null;

  // History for undo/redo
  past: FlowSnapshot[];
  future: FlowSnapshot[];
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;

  // React Flow change handlers
  onNodesChange: (changes: NodeChange<FlowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<FlowEdge>[]) => void;
  onConnect: (connection: Connection) => void;

  // Node mutations
  addGroupNode: (position: { x: number; y: number }, firstBlockType?: BlockType) => string;
  updateNodeTitle: (nodeId: string, title: string) => void;
  addBlockToNode: (nodeId: string, blockType: BlockType) => void;
  removeBlockFromNode: (nodeId: string, blockId: string) => void;
  moveBlockBetweenNodes: (sourceNodeId: string, targetNodeId: string, blockId: string) => void;
  reorderBlockInNode: (nodeId: string, blockId: string, targetIndex: number) => void;
  deleteNode: (nodeId: string) => void;

  // Selection
  setSelectedNodeId: (id: string | null) => void;

  // Block selection (for config panel)
  selectedBlockId: string | null;
  selectedBlockNodeId: string | null;
  setSelectedBlock: (blockId: string | null, nodeId: string | null) => void;
  clearSelectedBlock: () => void;
  updateBlockContent: (nodeId: string, blockId: string, patch: Partial<BlockContent>) => void;

  // Viewport (synced from React Flow)
  viewport: { zoom: number; x: number; y: number };
  setViewport: (vp: { zoom: number; x: number; y: number }) => void;

  // Drag tracking (for drop indicator previews)
  activeDragBlock: ActiveDragBlock | null;
  setActiveDragBlock: (block: ActiveDragBlock | null) => void;
}

/** Push current nodes/edges onto the past stack and clear future. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function snapshot(set: (p: any) => void, get: () => FlowStore) {
  const { nodes, edges, past } = get();
  set({
    past: [...past.slice(-(HISTORY_LIMIT - 1)), { nodes, edges }],
    future: [],
    canUndo: true,
    canRedo: false,
  });
}

export const useFlowStore = create<FlowStore>()(
  devtools(
    (set, get) => ({
      nodes: [INITIAL_START_NODE, INITIAL_GROUP_NODE] as FlowNode[],
      edges: [INITIAL_EDGE] as FlowEdge[],
      selectedNodeId: null,
      activeDragBlock: null,
      selectedBlockId: null,
      selectedBlockNodeId: null,
      viewport: { zoom: 1, x: 120, y: 140 },

      // ── History ────────────────────────────────────────────────────────────
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,

      undo: () => {
        const { past, nodes, edges, future } = get();
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);
        set(
          {
            nodes: previous.nodes,
            edges: previous.edges,
            past: newPast,
            future: [{ nodes, edges }, ...future].slice(0, HISTORY_LIMIT),
            canUndo: newPast.length > 0,
            canRedo: true,
          },
          false,
          'undo'
        );
      },

      redo: () => {
        const { past, nodes, edges, future } = get();
        if (future.length === 0) return;
        const next = future[0];
        const newFuture = future.slice(1);
        set(
          {
            nodes: next.nodes,
            edges: next.edges,
            past: [...past, { nodes, edges }].slice(-HISTORY_LIMIT),
            future: newFuture,
            canUndo: true,
            canRedo: newFuture.length > 0,
          },
          false,
          'redo'
        );
      },

      // ── React Flow handlers (no history – these are view-level changes) ───
      onNodesChange: (changes) =>
        set(
          (s) => ({ nodes: applyNodeChanges(changes, s.nodes) as FlowNode[] }),
          false,
          'onNodesChange'
        ),

      onEdgesChange: (changes) =>
        set(
          (s) => ({ edges: applyEdgeChanges(changes, s.edges) as FlowEdge[] }),
          false,
          'onEdgesChange'
        ),

      onConnect: (connection) => {
        snapshot(set, get);
        set(
          (s) => ({
            edges: addEdge(
              { ...connection, id: uuidv4(), type: 'flow-edge', data: {} },
              s.edges
            ) as FlowEdge[],
          }),
          false,
          'onConnect'
        );
      },

      // ── Node mutations (all snapshotted) ──────────────────────────────────
      addGroupNode: (position, firstBlockType) => {
        snapshot(set, get);
        const blocks = firstBlockType ? [NodeManager.createBlock(firstBlockType)] : [];
        const node = NodeManager.createGroupNode(position, blocks);
        set((s) => ({ nodes: [...s.nodes, node] }), false, 'addGroupNode');
        return node.id;
      },

      updateNodeTitle: (nodeId, title) => {
        snapshot(set, get);
        set(
          (s) => ({
            nodes: s.nodes.map((n) =>
              n.id === nodeId && n.type === 'group'
                ? NodeManager.updateNodeTitle(n as GroupFlowNode, title)
                : n
            ),
          }),
          false,
          'updateNodeTitle'
        );
      },

      addBlockToNode: (nodeId, blockType) => {
        snapshot(set, get);
        set(
          (s) => ({
            nodes: s.nodes.map((n) =>
              n.id === nodeId && n.type === 'group'
                ? NodeManager.addBlockToNode(n as GroupFlowNode, NodeManager.createBlock(blockType))
                : n
            ),
          }),
          false,
          'addBlockToNode'
        );
      },

      removeBlockFromNode: (nodeId, blockId) => {
        snapshot(set, get);
        set(
          (s) => ({
            nodes: s.nodes.map((n) =>
              n.id === nodeId && n.type === 'group'
                ? NodeManager.removeBlockFromNode(n as GroupFlowNode, blockId)
                : n
            ),
          }),
          false,
          'removeBlockFromNode'
        );
      },

      reorderBlockInNode: (nodeId, blockId, targetIndex) => {
        snapshot(set, get);
        set(
          (s) => ({
            nodes: s.nodes.map((n) => {
              if (n.id !== nodeId || n.type !== 'group') return n;
              const gn = n as GroupFlowNode;
              const blocks = [...gn.data.blocks];
              const fromIndex = blocks.findIndex((b) => b.id === blockId);
              if (fromIndex === -1) return n;
              const [moved] = blocks.splice(fromIndex, 1);
              const insertAt = Math.min(
                targetIndex > fromIndex ? targetIndex - 1 : targetIndex,
                blocks.length
              );
              blocks.splice(insertAt, 0, moved);
              return { ...gn, data: { ...gn.data, blocks } };
            }),
          }),
          false,
          'reorderBlockInNode'
        );
      },

      moveBlockBetweenNodes: (sourceNodeId, targetNodeId, blockId) => {
        snapshot(set, get);
        const { nodes } = get();
        const sourceNode = nodes.find(
          (n) => n.id === sourceNodeId && n.type === 'group'
        ) as GroupFlowNode | undefined;
        const targetNode = nodes.find(
          (n) => n.id === targetNodeId && n.type === 'group'
        ) as GroupFlowNode | undefined;
        if (!sourceNode || !targetNode) return;
        const { source, target } = NodeManager.moveBlock(sourceNode, targetNode, blockId);
        set(
          (s) => ({
            nodes: s.nodes.map((n) => {
              if (n.id === sourceNodeId) return source;
              if (n.id === targetNodeId) return target;
              return n;
            }),
          }),
          false,
          'moveBlockBetweenNodes'
        );
      },

      deleteNode: (nodeId) => {
        snapshot(set, get);
        set(
          (s) => ({
            nodes: s.nodes.filter((n) => n.id !== nodeId),
            edges: s.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
          }),
          false,
          'deleteNode'
        );
      },

      setSelectedNodeId: (id) => set({ selectedNodeId: id }, false, 'setSelectedNodeId'),

      setSelectedBlock: (blockId, nodeId) =>
        set({ selectedBlockId: blockId, selectedBlockNodeId: nodeId }, false, 'setSelectedBlock'),

      clearSelectedBlock: () =>
        set({ selectedBlockId: null, selectedBlockNodeId: null }, false, 'clearSelectedBlock'),

      updateBlockContent: (nodeId, blockId, patch) => {
        set(
          (s) => ({
            nodes: s.nodes.map((n) => {
              if (n.id !== nodeId || n.type !== 'group') return n;
              const gn = n as GroupFlowNode;
              return {
                ...gn,
                data: {
                  ...gn.data,
                  blocks: gn.data.blocks.map((b) =>
                    b.id === blockId ? { ...b, content: { ...b.content, ...patch } } : b
                  ),
                },
              };
            }),
          }),
          false,
          'updateBlockContent'
        );
      },

      setViewport: (vp) => set({ viewport: vp }, false, 'setViewport'),

      setActiveDragBlock: (block) => set({ activeDragBlock: block }, false, 'setActiveDragBlock'),
    }),
    { name: 'flow-store' }
  )
);
