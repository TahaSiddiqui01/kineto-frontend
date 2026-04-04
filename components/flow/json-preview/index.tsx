'use client';

import React, { useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useFlowStore } from '@/store/flow.store';

interface JsonPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JsonPreviewSheet({ open, onOpenChange }: JsonPreviewSheetProps) {
  const { nodes, edges } = useFlowStore();
  const [copied, setCopied] = React.useState(false);

  const json = useMemo(
    () =>
      JSON.stringify(
        {
          nodes: nodes.map((n) => ({
            id: n.id,
            type: n.type,
            position: n.position,
            data: n.data,
          })),
          edges: edges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            type: e.type,
            data: e.data,
          })),
        },
        null,
        2
      ),
    [nodes, edges]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        style={{ background: '#1a1b1d', borderColor: '#2a2b2d', width: 480 }}
      >
        <SheetHeader>
          <div className="flex items-center justify-between pr-8">
            <div>
              <SheetTitle>Flow JSON</SheetTitle>
              <SheetDescription className="mt-0.5">
                Live snapshot of your flow graph
              </SheetDescription>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:bg-white/5"
              style={{
                border: '1px solid #2e3033',
                color: copied ? '#22c55e' : '#9ca3af',
              }}
              title="Copy JSON"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </SheetHeader>

        {/* JSON body */}
        <div
          className="flex-1 overflow-y-auto p-4"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#3a3b3e transparent' }}
        >
          <pre
            className="text-xs leading-relaxed whitespace-pre-wrap break-all"
            style={{ color: '#a8b4c8', fontFamily: 'var(--font-geist-mono, monospace)' }}
          >
            <JsonHighlight json={json} />
          </pre>
        </div>

        {/* Footer stats */}
        <div
          className="flex items-center gap-4 px-5 py-3 text-xs"
          style={{ borderTop: '1px solid #2a2b2d', color: '#4b5563' }}
        >
          <span>{nodes.length} nodes</span>
          <span>·</span>
          <span>{edges.length} edges</span>
          <span>·</span>
          <span>{json.length.toLocaleString()} chars</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Minimal syntax highlighter – no extra deps
function JsonHighlight({ json }: { json: string }) {
  const highlighted = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // strings
    .replace(/"([^"]+)":/g, '<span style="color:#7dd3fc">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span style="color:#86efac">"$1"</span>')
    // numbers / booleans / null
    .replace(/: (-?\d+\.?\d*)/g, ': <span style="color:#fcd34d">$1</span>')
    .replace(/: (true|false)/g, ': <span style="color:#f9a8d4">$1</span>')
    .replace(/: (null)/g, ': <span style="color:#94a3b8">$1</span>');

  return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
}
