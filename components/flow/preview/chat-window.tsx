'use client';

import { useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { useChatRunner } from './hooks/use-chat-runner';
import { ChatMessageBubble } from './chat-message';
import type { Platform } from './registry/types';

interface ChatWindowProps {
  platform: Platform;
}

export function ChatWindow({ platform }: ChatWindowProps) {
  const {
    messages,
    status,
    pendingMsgId,
    variables,
    start,
    answer,
    restart,
  } = useChatRunner(platform);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-start on mount. Parent uses key={platform} to remount on platform change.
  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep latest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <span className="text-xs text-muted-foreground">
          {status === 'running' && 'Bot is typing\u2026'}
          {status === 'waiting' && 'Waiting for your response'}
          {status === 'done' && 'Conversation ended'}
          {status === 'idle' && 'Ready to start'}
        </span>
        <button
          type="button"
          onClick={restart}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <RefreshCw size={12} />
          Restart
        </button>
      </div>

      {/* Messages — inputs render inline inside their bubble */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.length === 0 && status === 'idle' && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Preview will start automatically</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            message={msg}
            variables={variables}
            platform={platform}
            isPendingInput={msg.id === pendingMsgId}
            onAnswer={msg.id === pendingMsgId ? answer : undefined}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
