'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useFlowStore } from '@/store/flow.store';
import { PlatformSelector } from './platform-selector';
import { ChatWindow } from './chat-window';
import type { Platform } from './registry/types';

export function PreviewPanel() {
  const { previewOpen, setPreviewOpen } = useFlowStore(
    useShallow((s) => ({ previewOpen: s.previewOpen, setPreviewOpen: s.setPreviewOpen }))
  );

  const [platform, setPlatform] = useState<Platform>('website');

  return (
    <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
      <SheetContent
        side="right"
        className="flex flex-col p-0 w-95 sm:w-105"
        style={{ background: 'var(--canvas-surface)', borderLeft: '1px solid var(--canvas-border)' }}
      >
        {/* Header */}
        <SheetHeader
          className="px-4 pt-5 pb-4 shrink-0"
          style={{ borderBottom: '1px solid var(--canvas-border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{ background: 'rgba(99,102,241,0.15)' }}
            >
              <Eye className="h-3.5 w-3.5" style={{ color: '#818cf8' }} />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-sm font-semibold" style={{ color: 'var(--node-title-color)' }}>
                Preview
              </SheetTitle>
              <p className="text-xs mt-0.5" style={{ color: 'var(--canvas-icon)' }}>
                Simulate the conversation
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Platform selector */}
        <div className="px-3 py-3 shrink-0" style={{ borderBottom: '1px solid var(--canvas-border)' }}>
          <PlatformSelector value={platform} onChange={setPlatform} />
        </div>

        {/* Chat window — key remounts + restarts when platform changes */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow key={platform} platform={platform} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
