'use client';
import { Mic } from 'lucide-react';
import type { ChatBlockProps } from '../types';

export function AudioInputChat({ onAnswer }: ChatBlockProps) {
  return (
    <button
      type="button"
      onClick={() => onAnswer?.('[Audio recording]')}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:border-primary text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
    >
      <Mic size={14} />
      Record audio
    </button>
  );
}
