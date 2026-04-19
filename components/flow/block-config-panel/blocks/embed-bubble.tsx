'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info, ChevronDown, Check } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useFlowStore } from '@/store/flow.store';
import { VariablePickerPopover } from '../variable-picker-popover';
import { useVariableInsertion } from '../hooks/use-variable-insertion';
import type { BlockConfigProps } from '../types';

// ── Types ─────────────────────────────────────────────────────────────────────

type EmbedTab = 'url' | 'upload';

const TABS: { id: EmbedTab; label: string }[] = [
  { id: 'url', label: 'URL' },
  { id: 'upload', label: 'Upload PDF' },
];

const ACCEPTED_PDF_TYPES = ['application/pdf'];

const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

function detectEmbedType(url: string): 'pdf' | 'url' {
  try {
    const path = new URL(url).pathname.toLowerCase();
    if (path.endsWith('.pdf')) return 'pdf';
  } catch {
    // ignore
  }
  return 'url';
}

/**
 * Convert a user-facing URL to its embeddable equivalent.
 * Many sites (YouTube, Vimeo, Google Maps…) block direct iframes
 * and require a dedicated /embed/ endpoint.
 */
function toEmbedSrc(url: string): { src: string; label?: string } {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');

    // ── YouTube ──────────────────────────────────────────────────────────────
    // https://youtube.com/watch?v=ID  →  https://www.youtube.com/embed/ID
    // https://youtu.be/ID             →  https://www.youtube.com/embed/ID
    // https://youtube.com/shorts/ID   →  https://www.youtube.com/embed/ID
    if (host === 'youtube.com' || host === 'youtu.be') {
      let videoId: string | null = null;
      if (host === 'youtu.be') {
        videoId = u.pathname.slice(1).split('/')[0];
      } else if (u.pathname.startsWith('/shorts/')) {
        videoId = u.pathname.split('/')[2];
      } else {
        videoId = u.searchParams.get('v');
      }
      if (videoId) {
        return {
          src: `https://www.youtube.com/embed/${videoId}`,
          label: 'YouTube',
        };
      }
    }

    // ── Vimeo ────────────────────────────────────────────────────────────────
    // https://vimeo.com/ID  →  https://player.vimeo.com/video/ID
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) {
        return { src: `https://player.vimeo.com/video/${id}`, label: 'Vimeo' };
      }
    }

    // ── Google Maps ──────────────────────────────────────────────────────────
    // https://maps.google.com/…  →  use /maps/embed equivalent
    if (host === 'maps.google.com' || host === 'google.com' && u.pathname.startsWith('/maps')) {
      // If user pastes the share URL just use the embed API with the query
      const q = u.searchParams.get('q') ?? u.searchParams.get('query') ?? '';
      if (q) {
        return {
          src: `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`,
          label: 'Google Maps',
        };
      }
    }
  } catch {
    // not a valid URL yet — return as-is
  }

  return { src: url };
}

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
  );
}

/** Info popover explaining "wait for event" — rendered into a portal so it
 *  escapes the config panel's overflow-y-auto clipping. */
function EventInfoPopover() {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + 6, left: r.left });
    }
    setOpen((o) => !o);
  };

  // Close on scroll/resize so the popover doesn't drift
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className="flex items-center justify-center w-4 h-4 rounded-full text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
        aria-label="What is wait for event?"
      >
        <Info size={13} />
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[9999] w-64 bg-[#1c1d20] border border-[#2e2f33] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.6)] p-3 flex flex-col gap-2"
            style={{ top: coords.top, left: coords.left }}
          >
            <p className="text-[12px] font-semibold text-[#e2e4e8]">Wait for event</p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              When enabled, the bot pauses here and listens for a{' '}
              <code className="text-violet-400 bg-violet-400/10 rounded px-1 text-[10px]">
                postMessage
              </code>{' '}
              event sent from the embedded page to its parent frame.
            </p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              The embedded page triggers this by calling:
            </p>
            <pre className="text-[10px] text-green-400 bg-[#16171a] rounded-md px-2.5 py-2 leading-relaxed overflow-x-auto">
              {`window.parent.postMessage(\n  { type: "my-event", data: {...} },\n  "*"\n)`}
            </pre>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              The bot resumes when the{' '}
              <span className="text-[#e2e4e8]">event name</span> matches, and
              optionally saves the event payload to a variable.
            </p>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}

/** Dropdown to select a variable from the store — portal-rendered to escape
 *  the config panel's overflow-y-auto clipping. */
function VariableSelectDropdown({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (name: string | undefined) => void;
}) {
  const { variables, setVariablePanelOpen } = useFlowStore(
    useShallow((s) => ({ variables: s.variables, setVariablePanelOpen: s.setVariablePanelOpen })),
  );

  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const selected = variables.find((v) => v.name === value);

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-2 w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[13px] outline-none px-2.5 py-[7px] transition-colors hover:border-[#3e3f43] cursor-pointer"
      >
        {selected ? (
          <span className="font-mono text-[11px] text-violet-400 bg-violet-400/[0.12] rounded px-[5px] py-px">
            {`{{${selected.name}}}`}
          </span>
        ) : (
          <span className="text-gray-600 flex-1 text-left">Select a variable…</span>
        )}
        <ChevronDown size={12} className="text-gray-500 shrink-0 ml-auto" />
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[9999] max-h-48 overflow-y-auto bg-[#1c1d20] border border-[#2e2f33] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.45)] py-1"
            style={{ top: coords.top, left: coords.left, width: coords.width }}
          >
            {value && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(undefined);
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-1.5 bg-transparent border-none cursor-pointer text-left text-gray-500 text-[12px] hover:bg-white/5 transition-colors"
              >
                Clear selection
              </button>
            )}
            {variables.length === 0 ? (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  setVariablePanelOpen(true);
                }}
                className="flex items-center gap-1.5 w-full px-3 py-2 bg-transparent border-none cursor-pointer text-violet-400 text-xs font-medium hover:bg-violet-400/8 transition-colors"
              >
                Add Variable
              </button>
            ) : (
              variables.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(v.name);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between gap-2 w-full px-3 py-1.5 bg-transparent border-none cursor-pointer text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-mono text-[11px] text-violet-400 bg-violet-400/[0.12] rounded px-[5px] py-px">
                    {`{{${v.name}}}`}
                  </span>
                  {v.name === value && <Check size={11} className="text-blue-400 shrink-0" />}
                </button>
              ))
            )}
          </div>
        </>,
        document.body,
      )}
    </>
  );
}

// ── URL Tab ───────────────────────────────────────────────────────────────────

function UrlTab({
  embedUrl,
  height,
  onChange,
  onInsertUrl,
  urlRef,
}: {
  embedUrl: string | undefined;
  height: number | undefined;
  onChange: BlockConfigProps['onChange'];
  onInsertUrl: (v: string) => void;
  urlRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}) {
  const isLiteral = embedUrl && !embedUrl.startsWith('{{');
  const detected = isLiteral ? detectEmbedType(embedUrl) : null;
  const embed = isLiteral ? toEmbedSrc(embedUrl) : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-400">Embed URL</label>
          <VariablePickerPopover onSelect={onInsertUrl} />
        </div>
        <input
          ref={urlRef as React.Ref<HTMLInputElement>}
          type="text"
          value={embedUrl ?? ''}
          onChange={(e) => onChange({ embedUrl: e.target.value, embedFileName: undefined })}
          placeholder="https://example.com, YouTube, Vimeo, PDF…"
          className={inputClass}
        />
        <div className="flex items-center gap-1.5 flex-wrap">
          {embed?.label && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-400">
              {embed.label} — auto-converted to embed URL
            </span>
          )}
          {!embed?.label && detected && (
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                detected === 'pdf' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
              }`}
            >
              {detected === 'pdf' ? 'PDF' : 'Website / iframe'}
            </span>
          )}
        </div>
      </div>

      {/* Height */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Height (px)</label>
        <input
          type="number"
          value={height ?? 400}
          min={100}
          max={2000}
          onChange={(e) => onChange({ height: Number(e.target.value) })}
          className={inputClass}
        />
      </div>

      {/* Iframe preview */}
      {embed && (
        <iframe
          key={embed.src}
          src={embed.src}
          className="w-full rounded-lg border border-[#2e2f33]"
          style={{ height: Math.min(height ?? 400, 220), display: 'block' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embed preview"
        />
      )}
    </div>
  );
}

// ── Upload Tab ────────────────────────────────────────────────────────────────

function UploadTab({
  embedUrl,
  embedFileName,
  onChange,
}: {
  embedUrl: string | undefined;
  embedFileName: string | undefined;
  onChange: BlockConfigProps['onChange'];
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!ACCEPTED_PDF_TYPES.includes(file.type)) return;
      onChange({
        embedUrl: URL.createObjectURL(file),
        embedFileName: file.name,
        embedType: 'pdf',
      });
    },
    [onChange],
  );

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#2e2f33] rounded-lg p-8 text-center cursor-pointer hover:border-[#3e3f43] transition-colors bg-[#16171a]"
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        {embedFileName ? (
          <p className="text-[13px] text-[#e2e4e8] font-medium truncate px-2">{embedFileName}</p>
        ) : (
          <p className="text-[13px] text-gray-400">Click to upload PDF</p>
        )}
        <p className="text-[11px] text-gray-600 mt-0.5">PDF files only</p>
      </div>

      {embedUrl && embedUrl.startsWith('blob:') && (
        <div className="rounded-lg overflow-hidden border border-[#2e2f33] bg-[#16171a]" style={{ height: 200 }}>
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            title="PDF preview"
          />
        </div>
      )}
    </div>
  );
}

// ── Wait for Event Section ────────────────────────────────────────────────────

function WaitForEventSection({
  waitForEvent,
  eventName,
  saveResultTo,
  onChange,
  onInsertEventName,
  eventNameRef,
}: {
  waitForEvent: boolean;
  eventName: string | undefined;
  saveResultTo: string | undefined;
  onChange: BlockConfigProps['onChange'];
  onInsertEventName: (v: string) => void;
  eventNameRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">Wait for event</span>
          <EventInfoPopover />
        </div>
        <Toggle
          enabled={waitForEvent}
          onToggle={() => onChange({ waitForEvent: !waitForEvent })}
          label=""
        />
      </div>

      {waitForEvent && (
        <div className="flex flex-col gap-3 pl-1 border-l-2 border-[#2e2f33]">
          {/* Event name */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-400">Event name</label>
              <VariablePickerPopover onSelect={onInsertEventName} />
            </div>
            <input
              ref={eventNameRef as React.Ref<HTMLInputElement>}
              type="text"
              value={eventName ?? ''}
              onChange={(e) => onChange({ eventName: e.target.value })}
              placeholder="my-event or {{variable}}"
              className={inputClass}
            />
          </div>

          {/* Save result to variable */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400">Save result to variable</label>
            <VariableSelectDropdown
              value={saveResultTo}
              onChange={(name) => onChange({ saveResultTo: name })}
            />
            <p className="text-[10px] text-gray-600">
              The event payload will be stored in the selected variable.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function EmbedBubbleConfig({ block, onChange }: BlockConfigProps) {
  const embedUrl = block.content.embedUrl as string | undefined;
  const embedFileName = block.content.embedFileName as string | undefined;
  const height = block.content.height as number | undefined;
  const waitForEvent = (block.content.waitForEvent as boolean | undefined) ?? false;
  const eventName = block.content.eventName as string | undefined;
  const saveResultTo = block.content.saveResultTo as string | undefined;

  const [activeTab, setActiveTab] = useState<EmbedTab>('url');

  const { inputRef: urlRef, onInsert: onInsertUrl } = useVariableInsertion(
    embedUrl,
    'embedUrl',
    onChange,
  );
  const { inputRef: eventNameRef, onInsert: onInsertEventName } = useVariableInsertion(
    eventName,
    'eventName',
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

      {activeTab === 'url' && (
        <UrlTab
          embedUrl={embedUrl}
          height={height}
          onChange={onChange}
          onInsertUrl={onInsertUrl}
          urlRef={urlRef}
        />
      )}
      {activeTab === 'upload' && (
        <UploadTab embedUrl={embedUrl} embedFileName={embedFileName} onChange={onChange} />
      )}

      <div className="h-px bg-[#2e2f33]" />

      <WaitForEventSection
        waitForEvent={waitForEvent}
        eventName={eventName}
        saveResultTo={saveResultTo}
        onChange={onChange}
        onInsertEventName={onInsertEventName}
        eventNameRef={eventNameRef}
      />
    </div>
  );
}
