'use client';

import React, { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { FlowNavbar } from '@/components/flow/navbar';
import { NodePalette } from '@/components/flow/node-palette';
import { FlowCanvas } from '@/components/flow/canvas';
import { BlockConfigPanel } from '@/components/flow/block-config-panel';
import { PreviewPanel } from '@/components/flow/preview/preview-panel';
import { useBotDataSync } from '@/hooks/use-bot-data';

interface BotCanvasProps {
  botId: string;
  botName?: string;
}

export default function BotCanvas({ botId, botName }: BotCanvasProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isLoading } = useBotDataSync(botId);

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ background: 'var(--canvas-bg)' }}
    >
      <FlowNavbar
        botName={botName}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <span className="text-muted-foreground text-sm">Loading flow…</span>
        </div>
      ) : (
        <div className="relative flex flex-1 overflow-hidden">
          <div
            className="shrink-0 overflow-hidden transition-all duration-200"
            style={{ width: sidebarOpen ? 280 : 0 }}
          >
            {sidebarOpen && <NodePalette />}
          </div>

          <ReactFlowProvider>
            <FlowCanvas />
          </ReactFlowProvider>

          <BlockConfigPanel />
          <PreviewPanel />
        </div>
      )}
    </div>
  );
}
