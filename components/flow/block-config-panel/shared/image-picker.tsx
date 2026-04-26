'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { VariablePickerPopover } from '../variable-picker-popover';

export interface ImagePickerValue {
  imageUrl?: string;
  iconName?: string;
  iconColor?: string;
}

interface ImagePickerProps {
  value: ImagePickerValue;
  allowIconsTab?: boolean;
  allowVariables?: boolean;
  onChange: (patch: ImagePickerValue) => void;
}

type ImageTab = 'link' | 'upload' | 'unsplash' | 'giphy' | 'icons';

const ALL_ICON_NAMES = (Object.keys(LucideIcons) as string[]).filter((name) => {
  if (!/^[A-Z]/.test(name)) return false;
  const val = (LucideIcons as Record<string, unknown>)[name];
  return (
    typeof val === 'function' ||
    (typeof val === 'object' && val !== null && '$$typeof' in (val as object))
  );
});

const PRESET_COLORS = [
  '#e2e4e8', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899',
];

const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

type UnsplashResult = { id: string; url: string; thumb: string; alt: string };
type GiphyResult = { id: string; url: string; mp4: string; preview: string };

function isVideoUrl(url: string) {
  return url.toLowerCase().includes('.mp4');
}

function MediaPreview({ src, className }: { src: string; className: string }) {
  if (isVideoUrl(src)) {
    return <video src={src} className={className} autoPlay loop muted playsInline />;
  }
  return <img src={src} alt="" className={className} />;
}

export function ImagePicker({ value, allowIconsTab = false, allowVariables = false, onChange }: ImagePickerProps) {
  const { imageUrl, iconName, iconColor = '#e2e4e8' } = value;

  const TABS: { id: ImageTab; label: string }[] = [
    { id: 'link', label: 'Link' },
    { id: 'upload', label: 'Upload' },
    { id: 'unsplash', label: 'Unsplash' },
    { id: 'giphy', label: 'Giphy' },
    ...(allowIconsTab ? [{ id: 'icons' as ImageTab, label: 'Icons' }] : []),
  ];

  const [activeTab, setActiveTab] = useState<ImageTab>('link');
  const [iconSearch, setIconSearch] = useState('');
  const [unsplashQuery, setUnsplashQuery] = useState('');
  const [unsplashResults, setUnsplashResults] = useState<UnsplashResult[]>([]);
  const [unsplashError, setUnsplashError] = useState('');
  const [giphyQuery, setGiphyQuery] = useState('');
  const [giphyResults, setGiphyResults] = useState<GiphyResult[]>([]);
  const [giphyError, setGiphyError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const filteredIcons = ALL_ICON_NAMES.filter((name) =>
    name.toLowerCase().includes(iconSearch.toLowerCase())
  ).slice(0, 80);

  function onInsertUrlVar(varName: string) {
    const token = `{{${varName}}}`;
    const cur = imageUrl ?? '';
    const el = urlInputRef.current;
    if (!el) { onChange({ ...value, imageUrl: cur + token, iconName: undefined }); return; }
    const start = el.selectionStart ?? cur.length;
    const end = el.selectionEnd ?? cur.length;
    onChange({ ...value, imageUrl: cur.slice(0, start) + token + cur.slice(end), iconName: undefined });
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + token.length;
      el.setSelectionRange(pos, pos);
    });
  }

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/v1/media/upload', { method: 'POST', body: form });
      const json = await res.json() as { data?: { url: string }; error?: string };
      if (!res.ok) { setUploadError(json.error ?? 'Upload failed.'); return; }
      onChange({ imageUrl: json.data!.url, iconName: undefined });
    } catch {
      setUploadError('Network error. Try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUnsplash = useCallback(async (query?: string) => {
    setIsSearching(true);
    setUnsplashError('');
    try {
      const url = query?.trim()
        ? `/api/v1/media/unsplash?q=${encodeURIComponent(query)}`
        : `/api/v1/media/unsplash`;
      const res = await fetch(url);
      const json = await res.json() as { data?: UnsplashResult[]; error?: string };
      if (!res.ok) {
        setUnsplashError(
          res.status === 503
            ? 'Add UNSPLASH_ACCESS_KEY to your .env to enable this.'
            : (json.error ?? 'Search failed.')
        );
        return;
      }
      setUnsplashResults(json.data ?? []);
    } catch {
      setUnsplashError('Network error. Try again.');
    } finally {
      setIsSearching(false);
    }
  }, []);

  const fetchGiphy = useCallback(async (query?: string) => {
    setIsSearching(true);
    setGiphyError('');
    try {
      const url = query?.trim()
        ? `/api/v1/media/giphy?q=${encodeURIComponent(query)}`
        : `/api/v1/media/giphy`;
      const res = await fetch(url);
      const json = await res.json() as { data?: GiphyResult[]; error?: string };
      if (!res.ok) {
        setGiphyError(
          res.status === 503
            ? 'Add GIPHY_API_KEY to your .env to enable this.'
            : (json.error ?? 'Search failed.')
        );
        return;
      }
      setGiphyResults(json.data ?? []);
    } catch {
      setGiphyError('Network error. Try again.');
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'unsplash' && unsplashResults.length === 0 && !unsplashError) {
      fetchUnsplash();
    }
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeTab === 'giphy' && giphyResults.length === 0 && !giphyError) {
      fetchGiphy();
    }
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-3">
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

      {/* Link tab */}
      {activeTab === 'link' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-400">Image URL</label>
              {allowVariables && <VariablePickerPopover onSelect={onInsertUrlVar} />}
            </div>
            <input
              ref={urlInputRef}
              type="text"
              value={imageUrl ?? ''}
              onChange={(e) => onChange({ ...value, imageUrl: e.target.value, iconName: undefined })}
              placeholder="https://example.com/image.png"
              className={inputClass}
            />
          </div>
          {imageUrl && !imageUrl.startsWith('{{') && (
            <MediaPreview src={imageUrl} className="rounded-lg object-cover border border-[#2e2f33] max-h-32 w-full" />
          )}
        </div>
      )}

      {/* Upload tab */}
      {activeTab === 'upload' && (
        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed border-[#2e2f33] rounded-lg p-8 text-center transition-colors bg-[#16171a] ${isUploading ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:border-[#3e3f43]'}`}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="" className="max-h-28 rounded-md mx-auto mb-2 object-cover" />
            ) : (
              <svg className="mx-auto mb-2 text-gray-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            )}
            <p className="text-[13px] text-gray-400">{isUploading ? 'Uploading…' : 'Click to upload'}</p>
            <p className="text-[11px] text-gray-600 mt-0.5">PNG, JPG, WebP · max 5 MB</p>
          </div>
          {uploadError && <p className="text-[12px] text-red-400">{uploadError}</p>}
        </div>
      )}

      {/* Unsplash tab */}
      {activeTab === 'unsplash' && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              value={unsplashQuery}
              onChange={(e) => setUnsplashQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUnsplash(unsplashQuery)}
              placeholder="Search Unsplash photos…"
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={() => fetchUnsplash(unsplashQuery)}
              disabled={isSearching}
              className="px-3 py-1.5 bg-[#2e2f33] border border-[#3e3f43] rounded-lg text-[#e2e4e8] text-[12px] cursor-pointer hover:bg-[#3e3f43] transition-colors disabled:opacity-50 shrink-0"
            >
              {isSearching ? '…' : 'Search'}
            </button>
          </div>
          {isSearching ? (
            <div className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-full aspect-square rounded-md bg-[#2e2f33] animate-pulse" />
              ))}
            </div>
          ) : unsplashError ? (
            <p className="text-center text-amber-500 text-[12px] py-2">{unsplashError}</p>
          ) : unsplashResults.length > 0 ? (
            <div className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto">
              {unsplashResults.map((r) => (
                <img
                  key={r.id}
                  src={r.thumb}
                  alt={r.alt}
                  onClick={() => onChange({ imageUrl: r.url, iconName: undefined })}
                  className={`w-full aspect-square object-cover rounded-md cursor-pointer transition-all hover:opacity-90 ${
                    imageUrl === r.url ? 'ring-2 ring-blue-500' : ''
                  }`}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-[12px] py-4">
              {unsplashQuery ? 'No results found' : 'Search for photos above'}
            </p>
          )}
        </div>
      )}

      {/* Giphy tab */}
      {activeTab === 'giphy' && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              value={giphyQuery}
              onChange={(e) => setGiphyQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchGiphy(giphyQuery)}
              placeholder="Search Giphy GIFs…"
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={() => fetchGiphy(giphyQuery)}
              disabled={isSearching}
              className="px-3 py-1.5 bg-[#2e2f33] border border-[#3e3f43] rounded-lg text-[#e2e4e8] text-[12px] cursor-pointer hover:bg-[#3e3f43] transition-colors disabled:opacity-50 shrink-0"
            >
              {isSearching ? '…' : 'Search'}
            </button>
          </div>
          {isSearching ? (
            <div className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-full aspect-square rounded-md bg-[#2e2f33] animate-pulse" />
              ))}
            </div>
          ) : giphyError ? (
            <p className="text-center text-amber-500 text-[12px] py-2">{giphyError}</p>
          ) : giphyResults.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto">
                {giphyResults.map((r) => (
                  <img
                    key={r.id}
                    src={r.preview}
                    alt=""
                    onClick={() => onChange({ imageUrl: r.mp4, iconName: undefined })}
                    className={`w-full aspect-square object-cover rounded-md cursor-pointer transition-all hover:opacity-90 ${
                      imageUrl === r.mp4 ? 'ring-2 ring-blue-500' : ''
                    }`}
                  />
                ))}
              </div>
              {imageUrl && isVideoUrl(imageUrl) && (
                <video
                  src={imageUrl}
                  className="rounded-lg border border-[#2e2f33] max-h-32 w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}
            </>
          ) : (
            <p className="text-center text-gray-600 text-[12px] py-4">
              {giphyQuery ? 'No results found' : 'Search for GIFs above'}
            </p>
          )}
        </div>
      )}

      {/* Icons tab */}
      {allowIconsTab && activeTab === 'icons' && (
        <div className="flex flex-col gap-3">
          <input
            value={iconSearch}
            onChange={(e) => setIconSearch(e.target.value)}
            placeholder="Search icons…"
            className={inputClass}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400">Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onChange({ ...value, iconColor: color })}
                  className="w-5 h-5 rounded-full border-2 cursor-pointer transition-all shrink-0"
                  style={{
                    background: color,
                    borderColor: iconColor === color ? '#fff' : 'transparent',
                    outline: iconColor === color ? '1px solid #3e3f43' : 'none',
                  }}
                />
              ))}
              <input
                type="color"
                value={iconColor}
                onChange={(e) => onChange({ ...value, iconColor: e.target.value })}
                className="w-5 h-5 rounded-full cursor-pointer border border-[#2e2f33] bg-transparent p-0 shrink-0"
                title="Custom color"
              />
            </div>
          </div>
          {filteredIcons.length > 0 ? (
            <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
              {filteredIcons.map((name) => {
                const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size: number; color: string; strokeWidth: number }>>)[name];
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onChange({ iconName: name, imageUrl: undefined, iconColor })}
                    title={name}
                    className={`flex items-center justify-center p-1.5 rounded-md border-2 cursor-pointer transition-all hover:bg-[#2e2f33] bg-[#16171a] ${
                      iconName === name ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <Icon size={18} color={iconColor} strokeWidth={2} />
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-[12px] py-4">No icons found</p>
          )}
        </div>
      )}
    </div>
  );
}
