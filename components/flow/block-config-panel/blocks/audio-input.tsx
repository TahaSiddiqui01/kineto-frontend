'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react';
import { VariableSelectDropdown } from '../variable-select-dropdown';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BlockConfigProps } from '../types';

type AccessLevel = 'private' | 'public';


// ── Sub-components ────────────────────────────────────────────────────────────

function RecordingTimer({ seconds }: { seconds: number }) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return (
    <span className="font-mono text-sm text-[#e2e4e8] tabular-nums">
      {m}:{s}
    </span>
  );
}

function RecorderSection({
  audioUrl,
  onChange,
}: {
  audioUrl: string | undefined;
  onChange: BlockConfigProps['onChange'];
}) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = useCallback(async () => {
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        onChange({ audioUrl: url, audioFileName: `recording-${Date.now()}.webm` });
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch {
      // microphone permission denied — surface nothing, button stays idle
    }
  }, [onChange]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-medium text-gray-400">Record audio</label>

      {/* Recorder control */}
      <div className="bg-[#16171a] rounded-lg p-4 flex flex-col items-center gap-3">
        {recording ? (
          <>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <RecordingTimer seconds={elapsed} />
            </div>
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 rounded-lg px-4 py-2 text-[13px] font-medium cursor-pointer transition-colors"
            >
              <Square size={14} />
              Stop recording
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/25 rounded-lg px-4 py-2 text-[13px] font-medium cursor-pointer transition-colors"
          >
            <Mic size={14} />
            Start recording
          </button>
        )}
      </div>

      {/* Playback */}
      {audioUrl && !recording && (
        <div className="flex items-center gap-2 bg-[#16171a] rounded-lg px-3 py-2">
          <button
            type="button"
            onClick={handlePlayPause}
            className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer shrink-0 hover:bg-blue-600 transition-colors"
          >
            {playing ? (
              <Pause size={13} className="text-white" />
            ) : (
              <Play size={13} className="text-white ml-0.5" />
            )}
          </button>
          <span className="text-[12px] text-gray-400 flex-1 truncate">
            {(block_content_fileName(audioUrl)) ?? 'Recording'}
          </span>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              onChange({ audioUrl: undefined, audioFileName: undefined });
            }}
            className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setPlaying(false)}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

function block_content_fileName(url: string): string | null {
  try {
    if (url.startsWith('blob:')) return null;
    const parts = new URL(url).pathname.split('/');
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

// ── Main component ────────────────────────────────────────────────────────────

export function AudioInputConfig({ block, onChange }: BlockConfigProps) {
  const audioUrl = block.content.audioUrl as string | undefined;
  const access = (block.content.access as AccessLevel | undefined) ?? 'private';
  const saveAnswerTo = block.content.saveAnswerTo as string | undefined;

  return (
    <div className="flex flex-col gap-4">
      <RecorderSection audioUrl={audioUrl} onChange={onChange} />

      <div className="h-px bg-[#2e2f33]" />

      {/* Access */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Access</label>
        <Select value={access} onValueChange={(val) => onChange({ access: val as AccessLevel })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="private">Private — workspace members only</SelectItem>
            <SelectItem value="public">Public — anyone with link</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[10px] text-gray-600">
          {access === 'private'
            ? 'Only workspace members can access this recording.'
            : 'Anyone with the link can access this recording.'}
        </p>
      </div>

      <div className="h-px bg-[#2e2f33]" />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">
          Save answer into variable{' '}
          <span className="text-gray-600 font-normal">(optional)</span>
        </label>
        <VariableSelectDropdown
          value={saveAnswerTo}
          onChange={(name) => onChange({ saveAnswerTo: name })}
        />
      </div>
    </div>
  );
}
