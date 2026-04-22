'use client';
import { useState } from 'react';
import { Upload } from 'lucide-react';
import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';

export function FileInputChat({ block, variables, onAnswer }: ChatBlockProps) {
  const buttonLabel = interpolate(block.content.submitButtonLabel as string ?? '', variables) || 'Upload file';
  const [fileName, setFileName] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onAnswer?.(file.name);
    }
  }

  return (
    <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border hover:border-primary transition-colors cursor-pointer text-sm text-muted-foreground hover:text-foreground">
      <Upload size={14} />
      {fileName ?? buttonLabel}
      <input type="file" className="sr-only" onChange={handleChange} />
    </label>
  );
}
