'use client';

import React, { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Loader2 } from 'lucide-react';
import { FlowNavbar } from '@/components/flow/navbar';
import { NodePalette } from '@/components/flow/node-palette';
import { FlowCanvas } from '@/components/flow/canvas';
import { BlockConfigPanel } from '@/components/flow/block-config-panel';
import { PreviewPanel } from '@/components/flow/preview/preview-panel';
import { useBotDataLoader, useBotAutoSave } from '@/hooks/use-bot-data';

interface BotCanvasProps {
  botId: string;
  botName?: string;
}

/** Null-rendering component — subscribes to store changes and debounce-saves.
 *  Lives inside ReactFlowProvider so its re-renders on drag are fully isolated
 *  from the BotCanvas layout tree. */
function BotAutoSave({ botId }: { botId: string }) {
  useBotAutoSave(botId);
  return null;
}

export default function BotCanvas({ botId, botName }: BotCanvasProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Only subscribes to isLoading — does NOT subscribe to nodes/edges/variables.
  // BotCanvas will not re-render on every drag event.
  const { isLoading } = useBotDataLoader(botId);

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
          <Loader2 className="animate-spin" size={18} />
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
            <BotAutoSave botId={botId} />
            <FlowCanvas />
          </ReactFlowProvider>

          <BlockConfigPanel />
          <PreviewPanel />
        </div>
      )}
    </div>
  );
}
