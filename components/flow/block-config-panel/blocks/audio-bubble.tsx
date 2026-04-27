'use client';

import { useState, useRef, useCallback } from 'react';
import { VariablePickerPopover } from '../variable-picker-popover';
import { useVariableInsertion } from '../hooks/use-variable-insertion';
import type { BlockConfigProps } from '../types';

type AudioTab = 'link' | 'upload';

const TABS: { id: AudioTab; label: string }[] = [
  { id: 'link', label: 'Link / Embed' },
  { id: 'upload', label: 'Upload' },
];

// WhatsApp supports AAC, MP4 audio (m4a), MPEG (mp3), AMR, OGG (Opus); max 16 MB
const ACCEPTED_AUDIO_TYPES = [
  'audio/mpeg',   // mp3
  'audio/ogg',
  'audio/mp4',   // m4a
  'audio/aac',
  'audio/amr',
];

const ACCEPTED_AUDIO_EXTENSIONS = '.mp3,.ogg,.m4a,.aac,.amr';
const MAX_AUDIO_SIZE_MB = 16;

// Known embeddable domains
const KNOWN_EMBED_DOMAINS = [
  'soundcloud.com',
  'open.spotify.com',
  'music.apple.com',
  'podcasts.apple.com',
  'anchor.fm',
  'buzzsprout.com',
  'podbean.com',
  'audiomack.com',
];

// Direct-linkable audio extensions
const DIRECT_AUDIO_EXTS = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm'];

function isValidAudioUrl(url: string): { valid: boolean; message?: string } {
  if (!url.trim()) return { valid: false };
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');

    if (KNOWN_EMBED_DOMAINS.some((d) => hostname === d || hostname.endsWith(`.${d}`))) {
      return { valid: true };
    }

    const path = parsed.pathname.toLowerCase();
    if (DIRECT_AUDIO_EXTS.some((ext) => path.endsWith(ext))) {
      return { valid: true };
    }

    return {
      valid: false,
      message: `Unsupported source. Use a direct audio file (.mp3, .wav…) or a link from: ${KNOWN_EMBED_DOMAINS.join(', ')}.`,
    };
  } catch {
    return { valid: false, message: 'Enter a valid URL.' };
  }
}

const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

// ── Sub-components ────────────────────────────────────────────────────────────

function Toggle({
  enabled,
  onToggle,
  label,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div
        onClick={onToggle}
        className={`w-9 h-5 rounded-[10px] relative cursor-pointer transition-colors shrink-0 ${
          enabled ? 'bg-blue-500' : 'bg-[#2e2f33]'
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
            enabled ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </div>
      <span className="text-[13px] text-gray-400">{label}</span>
    </label>
  );
}

function LinkTab({
  audioUrl,
  onChange,
  onInsertUrl,
  urlRef,
}: {
  audioUrl: string | undefined;
  onChange: BlockConfigProps['onChange'];
  onInsertUrl: (v: string) => void;
  urlRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}) {
  const [touched, setTouched] = useState(false);
  const validation = audioUrl ? isValidAudioUrl(audioUrl) : null;
  const showError = touched && audioUrl && !validation?.valid;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-400">Audio URL</label>
          <VariablePickerPopover onSelect={onInsertUrl} />
        </div>
        <input
          ref={urlRef as React.Ref<HTMLInputElement>}
          type="text"
          value={audioUrl ?? ''}
          onChange={(e) => {
            onChange({ audioUrl: e.target.value, audioFileName: undefined });
            setTouched(true);
          }}
          onBlur={() => setTouched(true)}
          placeholder="https://example.com/audio.mp3 or SoundCloud / Spotify link"
          className={`${inputClass} ${showError ? 'border-red-500' : ''}`}
        />
        {showError && validation?.message && (
          <p className="text-[11px] text-red-400">{validation.message}</p>
        )}
      </div>

      {/* Supported sources hint */}
      <div className="bg-[#16171a] rounded-lg p-3 flex flex-col gap-1">
        <p className="text-[11px] text-gray-500 font-medium">Supported sources</p>
        <p className="text-[11px] text-gray-600">
          Direct files: .mp3 .wav .ogg .m4a .aac .flac
        </p>
        <p className="text-[11px] text-gray-600">
          Embeds: SoundCloud, Spotify, Apple Podcasts, Anchor, Audiomack
        </p>
      </div>

      {audioUrl && !audioUrl.startsWith('{{') && validation?.valid && (
        <audio
          src={audioUrl}
          controls
          className="w-full rounded-lg"
          style={{ accentColor: '#3b82f6' }}
        />
      )}
    </div>
  );
}

function UploadTab({
  audioUrl,
  audioFileName,
  onChange,
}: {
  audioUrl: string | undefined;
  audioFileName: string | undefined;
  onChange: BlockConfigProps['onChange'];
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
        setUploadError('Unsupported format. Use AAC, MP3, M4A, AMR, or OGG.');
        return;
      }
      if (file.size > MAX_AUDIO_SIZE_MB * 1024 * 1024) {
        setUploadError(`File exceeds ${MAX_AUDIO_SIZE_MB} MB limit.`);
        return;
      }
      setUploadError('');
      setIsUploading(true);
      try {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch('/api/v1/media/audio-upload', { method: 'POST', body: form });
        const json = await res.json() as { data?: { url: string }; error?: string };
        if (!res.ok) { setUploadError(json.error ?? 'Upload failed.'); return; }
        onChange({ audioUrl: json.data!.url, audioFileName: file.name });
      } catch {
        setUploadError('Network error. Try again.');
      } finally {
        setIsUploading(false);
      }
    },
    [onChange],
  );

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_AUDIO_EXTENSIONS}
        className="hidden"
        onChange={handleFileChange}
      />
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed border-[#2e2f33] rounded-lg p-8 text-center transition-colors bg-[#16171a] ${isUploading ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:border-[#3e3f43]'}`}
      >
        <svg
          className="mx-auto mb-2 text-gray-600"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        {isUploading ? (
          <p className="text-[13px] text-gray-400">Uploading…</p>
        ) : audioFileName ? (
          <p className="text-[13px] text-[#e2e4e8] font-medium truncate px-2">{audioFileName}</p>
        ) : (
          <p className="text-[13px] text-gray-400">Click to upload</p>
        )}
        <p className="text-[11px] text-gray-600 mt-0.5">MP3, AAC, M4A, OGG, AMR · max {MAX_AUDIO_SIZE_MB} MB</p>
      </div>
      {uploadError && <p className="text-[12px] text-red-400">{uploadError}</p>}

      {audioUrl && !audioUrl.startsWith('blob:') && (
        <audio
          src={audioUrl}
          controls
          className="w-full rounded-lg"
          style={{ accentColor: '#3b82f6' }}
        />
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AudioBubbleConfig({ block, onChange }: BlockConfigProps) {
  const audioUrl = block.content.audioUrl as string | undefined;
  const audioFileName = block.content.audioFileName as string | undefined;
  const autoPlay = (block.content.autoPlay as boolean | undefined) ?? false;

  const [activeTab, setActiveTab] = useState<AudioTab>('link');

  const { inputRef: urlRef, onInsert: onInsertUrl } = useVariableInsertion(
    audioUrl,
    'audioUrl',
    onChange,
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Tab bar */}
      <div className="flex gap-0.5 bg-[#16171a] rounded-lg p-0.5">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex-1 text-[11px] font-medium py-1 rounded-md border-none cursor-pointer transition-all ${
              activeTab === id
                ? 'bg-[#2e2f33] text-[#e2e4e8]'
                : 'bg-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'link' && (
        <LinkTab
          audioUrl={audioUrl}
          onChange={onChange}
          onInsertUrl={onInsertUrl}
          urlRef={urlRef}
        />
      )}
      {activeTab === 'upload' && (
        <UploadTab audioUrl={audioUrl} audioFileName={audioFileName} onChange={onChange} />
      )}

      <div className="h-px bg-[#2e2f33]" />

      {/* Playback options */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium text-gray-400">Playback options</label>
        <Toggle
          enabled={autoPlay}
          onToggle={() => onChange({ autoPlay: !autoPlay })}
          label="Enable auto play"
        />
      </div>
    </div>
  );
}
