'use client';

import React, { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { FlowNavbar } from '@/components/flow/navbar';
import { NodePalette } from '@/components/flow/node-palette';
import { FlowCanvas } from '@/components/flow/canvas';
import { BlockConfigPanel } from '@/components/flow/block-config-panel';
import { PreviewPanel } from '@/components/flow/preview/preview-panel';

interface BotCanvasProps {
  botName?: string;
}

export default function BotCanvas({ botName }: BotCanvasProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ background: '#111213' }}
    >
      <FlowNavbar
        botName={botName}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <div className="relative flex flex-1 overflow-hidden">
        {/* Sidebar – animated slide */}
        <div
          className="shrink-0 overflow-hidden transition-all duration-200"
          style={{ width: sidebarOpen ? 280 : 0 }}
        >
          {sidebarOpen && <NodePalette />}
        </div>

        <ReactFlowProvider>
          <FlowCanvas />
        </ReactFlowProvider>

        {/* Block config panel – overlays the sidebar area */}
        <BlockConfigPanel />

        {/* Preview panel – slides in from the right */}
        <PreviewPanel />
      </div>
    </div>
  );
}
