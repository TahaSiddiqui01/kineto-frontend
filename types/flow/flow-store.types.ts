import { ActiveDragBlock, BlockContent, BlockType } from "./block.types";
import { FlowEdge } from "./edge.types";
import { FlowNode } from "./node.types";
import type { NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { Variable } from "./variables.types";


interface FlowSnapshot {
    nodes: FlowNode[];
    edges: FlowEdge[];
}


export interface FlowStore {
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

    // Variables
    variables: Variable[];
    setVariable: (v: Variable) => void;
    updateVariable: (v: Partial<Variable>, saveInResultsToggle?: boolean) => void
    deleteVariable: (id: string | number) => void

    // Load persisted flow (replaces all state, clears history)
    flowInitialized: boolean;
    initializeFlow: (nodes: FlowNode[], edges: FlowEdge[], variables: Variable[]) => void;

    // Variables panel visibility
    variablePanelOpen: boolean;
    setVariablePanelOpen: (open: boolean) => void;

    // Preview panel
    previewOpen: boolean;
    setPreviewOpen: (open: boolean) => void;
}