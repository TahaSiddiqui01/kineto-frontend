'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { VariablePickerPopover } from '../variable-picker-popover';
import { useVariableInsertion } from '../hooks/use-variable-insertion';
import type { BlockConfigProps } from '../types';

type VideoTab = 'link' | 'upload' | 'pexels';

const TABS: { id: VideoTab; label: string }[] = [
  { id: 'link', label: 'Link' },
  { id: 'upload', label: 'Upload' },
  { id: 'pexels', label: 'Pexels' },
];

type AspectRatio = 'any' | 'landscape' | 'portrait' | 'square';

const ASPECT_RATIOS: { id: AspectRatio; label: string }[] = [
  { id: 'any', label: 'Any' },
  { id: 'landscape', label: 'Landscape (16:9)' },
  { id: 'portrait', label: 'Portrait (9:16)' },
  { id: 'square', label: 'Square (1:1)' },
];

// WhatsApp supports MP4 and 3GPP only; max 16 MB
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/3gpp'];
const MAX_VIDEO_SIZE_MB = 16;

const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

type PexelsResult = { id: string; url: string; thumb: string; width: number; height: number };

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
  videoUrl,
  onChange,
  onInsertUrl,
  urlRef,
}: {
  videoUrl: string | undefined;
  onChange: BlockConfigProps['onChange'];
  onInsertUrl: (v: string) => void;
  urlRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-400">Video URL</label>
          <VariablePickerPopover onSelect={onInsertUrl} />
        </div>
        <input
          ref={urlRef as React.Ref<HTMLInputElement>}
          type="text"
          value={videoUrl ?? ''}
          onChange={(e) => onChange({ videoUrl: e.target.value })}
          placeholder="https://example.com/video.mp4"
          className={inputClass}
        />
      </div>
      {videoUrl && !videoUrl.startsWith('{{') && (
        <video
          src={videoUrl}
          className="w-full rounded-lg border border-[#2e2f33] max-h-40 object-cover"
          muted
          preload="metadata"
        />
      )}
    </div>
  );
}

function UploadTab({
  videoUrl,
  onChange,
}: {
  videoUrl: string | undefined;
  onChange: BlockConfigProps['onChange'];
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        setUploadError('Only MP4 and 3GPP are supported.');
        return;
      }
      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        setUploadError(`File exceeds ${MAX_VIDEO_SIZE_MB} MB limit.`);
        return;
      }
      setUploadError('');
      setIsUploading(true);
      try {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch('/api/v1/media/video-upload', { method: 'POST', body: form });
        const json = await res.json() as { data?: { url: string }; error?: string };
        if (!res.ok) { setUploadError(json.error ?? 'Upload failed.'); return; }
        onChange({ videoUrl: json.data!.url, videoFileName: file.name });
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
        accept={ACCEPTED_VIDEO_TYPES.join(',')}
        className="hidden"
        onChange={handleFileChange}
      />
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed border-[#2e2f33] rounded-lg p-8 text-center transition-colors bg-[#16171a] ${isUploading ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:border-[#3e3f43]'}`}
      >
        {videoUrl ? (
          <video
            src={videoUrl}
            className="max-h-28 rounded-md mx-auto mb-2 object-cover"
            muted
            preload="metadata"
          />
        ) : (
          <svg
            className="mx-auto mb-2 text-gray-600"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        )}
        <p className="text-[13px] text-gray-400">{isUploading ? 'Uploading…' : 'Click to upload'}</p>
        <p className="text-[11px] text-gray-600 mt-0.5">MP4, 3GPP · max {MAX_VIDEO_SIZE_MB} MB</p>
      </div>
      {uploadError && <p className="text-[12px] text-red-400">{uploadError}</p>}
    </div>
  );
}

function PexelsTab({
  videoUrl,
  onChange,
}: {
  videoUrl: string | undefined;
  onChange: BlockConfigProps['onChange'];
}) {
  const [query, setQuery] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('any');
  const [results, setResults] = useState<PexelsResult[]>([]);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchVideos = useCallback(async (q: string, orientation: AspectRatio) => {
    setIsSearching(true);
    setError('');
    try {
      const params = new URLSearchParams({ q: q || 'nature' });
      if (orientation !== 'any') params.set('orientation', orientation);
      const res = await fetch(`/api/v1/media/pexels?${params.toString()}`);
      const json = await res.json() as { data?: PexelsResult[]; error?: string };
      if (!res.ok) {
        setError(
          res.status === 503
            ? 'Add PEXELS_API_KEY to your .env to enable this.'
            : (json.error ?? 'Search failed.'),
        );
        return;
      }
      setResults(json.data ?? []);
    } catch {
      setError('Network error. Try again.');
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos(query, aspectRatio);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => fetchVideos(query, aspectRatio);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search Pexels videos…"
          className={`${inputClass} flex-1`}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="px-3 py-1.5 bg-[#2e2f33] border border-[#3e3f43] rounded-lg text-[#e2e4e8] text-[12px] cursor-pointer hover:bg-[#3e3f43] transition-colors disabled:opacity-50 shrink-0"
        >
          {isSearching ? '…' : 'Search'}
        </button>
      </div>

      {/* Aspect ratio */}
      <div className="flex gap-1 flex-wrap">
        {ASPECT_RATIOS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setAspectRatio(id);
              fetchVideos(query, id);
            }}
            className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
              aspectRatio === id
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'bg-[#1c1d20] border-[#2e2f33] text-gray-400 hover:border-[#3e3f43]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isSearching ? (
        <div className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-full aspect-video rounded-md bg-[#2e2f33] animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-amber-500 text-[12px] py-2">{error}</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto">
          {results.map((r) => (
            <div
              key={r.id}
              onClick={() => onChange({ videoUrl: r.url })}
              className={`relative cursor-pointer rounded-md overflow-hidden transition-all hover:opacity-90 ${
                videoUrl === r.url ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <img
                src={r.thumb}
                alt=""
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                    <polygon points="2,1 9,5 2,9" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-[12px] py-4">No results found</p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function VideoBubbleConfig({ block, onChange }: BlockConfigProps) {
  const videoUrl = block.content.videoUrl as string | undefined;
  const showControls = (block.content.showControls as boolean | undefined) ?? true;
  const autoPlay = (block.content.autoPlay as boolean | undefined) ?? false;

  const [activeTab, setActiveTab] = useState<VideoTab>('link');

  const { inputRef: urlRef, onInsert: onInsertUrl } = useVariableInsertion(
    videoUrl,
    'videoUrl',
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
          videoUrl={videoUrl}
          onChange={onChange}
          onInsertUrl={onInsertUrl}
          urlRef={urlRef}
        />
      )}
      {activeTab === 'upload' && <UploadTab videoUrl={videoUrl} onChange={onChange} />}
      {activeTab === 'pexels' && <PexelsTab videoUrl={videoUrl} onChange={onChange} />}

      <div className="h-px bg-[#2e2f33]" />

      {/* Playback options */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium text-gray-400">Playback options</label>
        <Toggle
          enabled={showControls}
          onToggle={() => onChange({ showControls: !showControls })}
          label="Show controls"
        />
        <Toggle
          enabled={autoPlay}
          onToggle={() => onChange({ autoPlay: !autoPlay })}
          label="Enable auto play"
        />
      </div>
    </div>
  );
}
