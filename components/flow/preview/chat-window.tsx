'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useChatRunner } from './hooks/use-chat-runner';
import { ChatMessageBubble } from './chat-message';
import type { Platform } from './registry/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ── WhatsApp gate ─────────────────────────────────────────────────────────────

const whatsappSchema = z.object({
  phoneNumber: z
    .string()
    .min(7, 'Phone number is too short')
    .regex(/^\+?[\d\s\-(). ]+$/, 'Enter a valid phone number'),
});

type WhatsAppFormData = z.infer<typeof whatsappSchema>;

function WhatsAppGate({ onSubmit }: { onSubmit: (number: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WhatsAppFormData>({
    resolver: zodResolver(whatsappSchema),
  });

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl text-2xl"
          style={{ background: 'rgba(37,211,102,0.12)' }}>
          💬
        </div>
        <h2 className="text-sm font-semibold text-foreground">WhatsApp Preview</h2>
        <p className="text-xs text-muted-foreground max-w-56 leading-relaxed">
          Enter the WhatsApp number to simulate the conversation as a recipient would see it.
        </p>
      </div>

      <form
        onSubmit={handleSubmit((data) => onSubmit(data.phoneNumber))}
        className="flex flex-col gap-3 w-full max-w-64"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="wa-phone">Phone number</Label>
          <Input
            id="wa-phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
            autoFocus
            {...register('phoneNumber')}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer"
          style={{ background: '#25D366', color: '#fff' }}>
          Start preview
        </Button>
      </form>
    </div>
  );
}

// ── Main chat window ──────────────────────────────────────────────────────────

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

  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isWhatsApp = platform === 'whatsapp';
  const showGate = isWhatsApp && whatsappNumber === null;

  // Auto-start for non-WhatsApp platforms on mount
  useEffect(() => {
    if (!isWhatsApp) {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep latest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleWhatsAppSubmit(number: string) {
    setWhatsappNumber(number);
    start();
  }

  function handleRestart() {
    restart();
    // For WhatsApp, keep the number but restart the conversation
  }

  if (showGate) {
    return <WhatsAppGate onSubmit={handleWhatsAppSubmit} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <span className="text-xs text-muted-foreground">
          {isWhatsApp && whatsappNumber && (
            <span className="font-mono text-[11px]" style={{ color: '#25D366' }}>
              {whatsappNumber}
            </span>
          )}
          {!isWhatsApp && (
            <>
              {status === 'running' && 'Bot is typing…'}
              {status === 'waiting' && 'Waiting for your response'}
              {status === 'done' && 'Conversation ended'}
              {status === 'idle' && 'Ready to start'}
            </>
          )}
          {isWhatsApp && (
            <>
              {' '}
              {status === 'running' && '· typing…'}
              {status === 'waiting' && '· waiting'}
              {status === 'done' && '· ended'}
            </>
          )}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRestart}
          className="cursor-pointer"
        >
          <RefreshCw size={12} />
          Restart
        </Button>
      </div>

      {/* Messages */}
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
