'use client';

import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useReactFlow,
  SelectionMode,
  Controls,
  ControlButton,
  type Viewport,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Code2, MoreHorizontal } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { GroupNode } from '../nodes/group-node';
import { StartNode } from '../nodes/start-node';
import { FlowEdgeComponent } from '../edges/custom-edge';
import { useFlowStore } from '@/store/flow.store';
import type { BlockType } from '@/types/flow';
import { VariablesPanel } from '../variables/variable-panel';

const NODE_TYPES = { group: GroupNode, start: StartNode } as const;
const EDGE_TYPES = { 'flow-edge': FlowEdgeComponent } as const;
const DEFAULT_VIEWPORT = { zoom: 1, x: 120, y: 140 };
const PRO_OPTIONS = { hideAttribution: true } as const;
const DEFAULT_EDGE_OPTIONS = { type: 'flow-edge' } as const;
const CANVAS_STYLE = { background: '#111213' } as const;

export function FlowCanvas() {
  const {
    nodes, edges, onNodesChange, onEdgesChange, onConnect, addGroupNode,
    undo, redo, setViewport, clearSelectedBlock,
    variablePanelOpen, setVariablePanelOpen,
  } = useFlowStore(
    useShallow((s) => ({
      nodes: s.nodes,
      edges: s.edges,
      onNodesChange: s.onNodesChange,
      onEdgesChange: s.onEdgesChange,
      onConnect: s.onConnect,
      addGroupNode: s.addGroupNode,
      undo: s.undo,
      redo: s.redo,
      setViewport: s.setViewport,
      clearSelectedBlock: s.clearSelectedBlock,
      variablePanelOpen: s.variablePanelOpen,
      setVariablePanelOpen: s.setVariablePanelOpen,
    }))
  );
  const { screenToFlowPosition } = useReactFlow();

  // ── Keyboard shortcuts ──────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  // ── Drag-and-drop from palette ──────────────────────────────────────────
  const onDragOver = useCallback((e: React.DragEvent) => {
    const has =
      e.dataTransfer.types.includes('application/flow-block') ||
      e.dataTransfer.types.includes('application/flow-block-move');
    if (!has) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const blockData = e.dataTransfer.getData('application/flow-block');
      if (!blockData) return;
      const { type } = JSON.parse(blockData) as { type: BlockType };
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addGroupNode({ x: position.x - 115, y: position.y - 30 }, type);
    },
    [screenToFlowPosition, addGroupNode]
  );

  const handleMoveEnd = useCallback(
    (_: unknown, vp: Viewport) => setViewport(vp),
    [setViewport]
  );

  return (
    <div className="relative flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onMoveEnd={handleMoveEnd}
        onPaneClick={clearSelectedBlock}
        style={CANVAS_STYLE}
        minZoom={0.1}
        maxZoom={5}
        defaultViewport={DEFAULT_VIEWPORT}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        selectionMode={SelectionMode.Partial}
        proOptions={PRO_OPTIONS}
        elevateNodesOnSelect
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#2a2b2d"
          bgColor="#111213"
          gap={16}
          size={1.2}
        />

        <Controls position="top-right" showInteractive={false}>
          {/* JSON preview – opens the sheet */}
          <ControlButton
            title="View flow JSON"
            className="custom-ctrl"
            onClick={() => setVariablePanelOpen(true)}
          >
            <Code2 size={12} />
          </ControlButton>
          <ControlButton title="More options" className="custom-ctrl">
            <MoreHorizontal size={12} />
          </ControlButton>
        </Controls>
      </ReactFlow>

      {/* JSON preview sheet */}
      <VariablesPanel panOpen={variablePanelOpen} onPanChange={setVariablePanelOpen} />
    </div>
  );
}
