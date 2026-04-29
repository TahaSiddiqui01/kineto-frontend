'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import type { ChatBlockProps } from '../types';
import { Button } from '@/components/ui/button';

async function uploadAudioBlob(blob: Blob): Promise<string> {
  const fd = new FormData();
  fd.append('file', blob, `recording-${Date.now()}.webm`);
  const res = await fetch('/api/v1/media/audio-upload', { method: 'POST', body: fd });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? 'Upload failed');
  }
  const json = await res.json();
  return (json as { data: { url: string } }).data.url;
}

export function AudioInputChat({ onAnswer }: ChatBlockProps) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { mutate, isPending, error } = useMutation({
    mutationFn: uploadAudioBlob,
    onSuccess: (url) => onAnswer?.(url),
  });

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const startRecording = useCallback(async () => {
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        mutate(new Blob(chunksRef.current, { type: 'audio/webm' }));
      };
      mr.start();
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } catch {
      // microphone permission denied — stay idle
    }
  }, [mutate]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 size={14} className="animate-spin" />
        Uploading…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {recording ? (
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm text-destructive">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            {fmt(elapsed)}
          </span>
          <Button type="button" variant="destructive" size="sm" onClick={stopRecording} className="cursor-pointer">
            <Square size={12} />
            Stop &amp; send
          </Button>
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={startRecording} className="cursor-pointer w-fit">
          <Mic size={14} />
          Record audio
        </Button>
      )}
      {error && <p className="text-xs text-destructive">{(error as Error).message}</p>}
    </div>
  );
}
