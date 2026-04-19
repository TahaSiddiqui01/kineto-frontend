'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { VariablePickerPopover } from '../variable-picker-popover';
import { useVariableInsertion } from '../hooks/use-variable-insertion';
import type { BlockConfigProps } from '../types';

type ImageTab = 'link' | 'upload' | 'unsplash' | 'giphy' | 'icons';

const TABS: { id: ImageTab; label: string }[] = [
  { id: 'link', label: 'Link' },
  { id: 'upload', label: 'Upload' },
  { id: 'unsplash', label: 'Unsplash' },
  { id: 'giphy', label: 'Giphy' },
  { id: 'icons', label: 'Icons' },
];

// lucide icons may be forwardRef objects (typeof === 'object'), not plain functions —
// check for $$typeof which all renderable React components carry at runtime
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
type GiphyResult = { id: string; url: string; preview: string };

export function ImageBubbleConfig({ block, onChange }: BlockConfigProps) {
  const imageUrl = block.content.imageUrl as string | undefined;
  const alt = block.content.alt as string | undefined;
  const redirectUrl = block.content.redirectUrl as string | undefined;
  const redirectEnabled = (block.content.redirectEnabled as boolean | undefined) ?? false;
  const iconName = block.content.iconName as string | undefined;
  const iconColor = (block.content.iconColor as string | undefined) ?? '#e2e4e8';
  const width = block.content.width as number | undefined;

  const [activeTab, setActiveTab] = useState<ImageTab>('link');
  const [iconSearch, setIconSearch] = useState('');
  const [unsplashQuery, setUnsplashQuery] = useState('');
  const [unsplashResults, setUnsplashResults] = useState<UnsplashResult[]>([]);
  const [unsplashError, setUnsplashError] = useState('');
  const [giphyQuery, setGiphyQuery] = useState('');
  const [giphyResults, setGiphyResults] = useState<GiphyResult[]>([]);
  const [giphyError, setGiphyError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { inputRef: urlRef, onInsert: onInsertUrl } = useVariableInsertion(imageUrl, 'imageUrl', onChange);
  const { inputRef: altRef, onInsert: onInsertAlt } = useVariableInsertion(alt, 'alt', onChange);
  const { inputRef: redirectRef, onInsert: onInsertRedirect } = useVariableInsertion(redirectUrl, 'redirectUrl', onChange);

  const filteredIcons = ALL_ICON_NAMES.filter((name) =>
    name.toLowerCase().includes(iconSearch.toLowerCase())
  ).slice(0, 80);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    onChange({ imageUrl: URL.createObjectURL(file), iconName: undefined });
  }, [onChange]);

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

  const handleUnsplashSearch = useCallback(() => {
    fetchUnsplash(unsplashQuery);
  }, [fetchUnsplash, unsplashQuery]);

  useEffect(() => {
    if (activeTab === 'unsplash' && unsplashResults.length === 0 && !unsplashError) {
      fetchUnsplash();
    }
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleGiphySearch = useCallback(() => {
    fetchGiphy(giphyQuery);
  }, [fetchGiphy, giphyQuery]);

  useEffect(() => {
    if (activeTab === 'giphy' && giphyResults.length === 0 && !giphyError) {
      fetchGiphy();
    }
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

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

      {/* Link tab */}
      {activeTab === 'link' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-400">Image URL</label>
              <VariablePickerPopover onSelect={onInsertUrl} />
            </div>
            <input
              ref={urlRef as React.Ref<HTMLInputElement>}
              type="text"
              value={imageUrl ?? ''}
              onChange={(e) => onChange({ imageUrl: e.target.value, iconName: undefined })}
              placeholder="https://example.com/image.png"
              className={inputClass}
            />
          </div>
          {imageUrl && !imageUrl.startsWith('{{') && (
            <img
              src={imageUrl}
              alt={alt ?? ''}
              className="rounded-lg object-cover border border-[#2e2f33]"
              style={{
                width: width ? `${width}px` : '100%',
                maxWidth: '100%',
              }}
            />
          )}
        </div>
      )}

      {/* Upload tab */}
      {activeTab === 'upload' && (
        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#2e2f33] rounded-lg p-8 text-center cursor-pointer hover:border-[#3e3f43] transition-colors bg-[#16171a]"
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
            <p className="text-[13px] text-gray-400">Click to upload</p>
            <p className="text-[11px] text-gray-600 mt-0.5">PNG, JPG, GIF, WebP</p>
          </div>
        </div>
      )}

      {/* Unsplash tab */}
      {activeTab === 'unsplash' && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              value={unsplashQuery}
              onChange={(e) => setUnsplashQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnsplashSearch()}
              placeholder="Search Unsplash photos…"
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={handleUnsplashSearch}
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
                  onClick={() => onChange({ imageUrl: r.url, alt: r.alt, iconName: undefined })}
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
              onKeyDown={(e) => e.key === 'Enter' && handleGiphySearch()}
              placeholder="Search Giphy GIFs…"
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={handleGiphySearch}
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
            <div className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto">
              {giphyResults.map((r) => (
                <img
                  key={r.id}
                  src={r.preview}
                  alt=""
                  onClick={() => onChange({ imageUrl: r.url, iconName: undefined })}
                  className={`w-full aspect-square object-cover rounded-md cursor-pointer transition-all hover:opacity-90 ${
                    imageUrl === r.url ? 'ring-2 ring-blue-500' : ''
                  }`}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-[12px] py-4">
              {giphyQuery ? 'No results found' : 'Search for GIFs above'}
            </p>
          )}
        </div>
      )}

      {/* Icons tab */}
      {activeTab === 'icons' && (
        <div className="flex flex-col gap-3">
          {/* Preview */}
          <div className="flex flex-col items-center gap-1.5 py-4 rounded-lg bg-[#16171a] border border-[#2e2f33]">
            {(() => {
              const SelectedIcon = iconName
                ? (LucideIcons as Record<string, React.ComponentType<{ size: number; color: string; strokeWidth: number }>>)[iconName]
                : null;
              return SelectedIcon ? (
                <>
                  <SelectedIcon size={36} color={iconColor} strokeWidth={1.5} />
                  <span className="text-[11px] text-gray-500">{iconName!.replace(/([A-Z])/g, ' $1').trim()}</span>
                </>
              ) : (
                <span className="text-[12px] text-gray-600">Select an icon below</span>
              );
            })()}
          </div>
          {/* Width */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400">Width</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={2000}
                value={width ?? ''}
                onChange={(e) => onChange({ width: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Auto"
                className={`${inputClass} flex-1`}
              />
              <span className="text-[12px] text-gray-500 shrink-0">px</span>
            </div>
          </div>
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
                  onClick={() => onChange({ iconColor: color })}
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
                onChange={(e) => onChange({ iconColor: e.target.value })}
                className="w-5 h-5 rounded-full cursor-pointer border border-[#2e2f33] bg-transparent p-0 shrink-0"
                title="Custom color"
              />
            </div>
          </div>
          {filteredIcons.length > 0 ? (
            <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
              {filteredIcons.map((name) => {
                const Icon = (LucideIcons as Record<string, React.ComponentType<{ size: number; color: string; strokeWidth: number }>>)[name];
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onChange({ iconName: name, imageUrl: undefined })}
                    title={name}
                    className={`flex items-center justify-center p-1.5 rounded-md border-2 cursor-pointer transition-all hover:bg-[#2e2f33] bg-[#16171a] ${
                      iconName === name ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <Icon size={16} color={iconColor} strokeWidth={2} />
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-[12px] py-4">No icons found</p>
          )}
        </div>
      )}

      <div className="h-px bg-[#2e2f33]" />

      {/* Alt text */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-400">Alt Text</label>
          <VariablePickerPopover onSelect={onInsertAlt} />
        </div>
        <input
          ref={altRef as React.Ref<HTMLInputElement>}
          type="text"
          value={alt ?? ''}
          onChange={(e) => onChange({ alt: e.target.value })}
          placeholder="Describe the image…"
          className={inputClass}
        />
      </div>

      <div className="h-px bg-[#2e2f33]" />

      {/* Navigate on click */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <div
            onClick={() => onChange({ redirectEnabled: !redirectEnabled })}
            className={`w-9 h-5 rounded-[10px] relative cursor-pointer transition-colors shrink-0 ${
              redirectEnabled ? 'bg-blue-500' : 'bg-[#2e2f33]'
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                redirectEnabled ? 'left-4.5' : 'left-0.5'
              }`}
            />
          </div>
          <span className="text-[13px] text-gray-400">Navigate on click</span>
        </label>
        {redirectEnabled && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-400">Redirect URL</label>
              <VariablePickerPopover onSelect={onInsertRedirect} />
            </div>
            <input
              ref={redirectRef as React.Ref<HTMLInputElement>}
              type="text"
              value={redirectUrl ?? ''}
              onChange={(e) => onChange({ redirectUrl: e.target.value })}
              placeholder="https://example.com"
              className={inputClass}
            />
          </div>
        )}
      </div>
    </div>
  );
}
