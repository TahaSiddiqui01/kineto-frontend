'use client';

import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FileText, X, Link2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { extractFileNameFromUrl } from '@/helpers';
import { VariablePickerPopover } from '../variable-picker-popover';
import { useVariableInsertion } from '../hooks/use-variable-insertion';
import type { BlockConfigProps } from '../types';

type DocTab = 'link' | 'upload';

const ACCEPTED_EXTENSIONS = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt';
const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/csv',
  'text/plain',
];

async function uploadDocumentFn(file: File): Promise<{ url: string; fileName: string }> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/v1/media/document-upload', { method: 'POST', body: form });
  const json = await res.json() as { data?: { url: string; fileName: string }; error?: string };
  if (!res.ok) throw new Error(json.error ?? 'Upload failed');
  return { url: json.data!.url, fileName: json.data!.fileName };
}

export function DocumentBubbleConfig({ block, onChange }: BlockConfigProps) {
  const documentUrl = block.content.documentUrl as string | undefined;
  const documentFileName = block.content.documentFileName as string | undefined;
  const caption = block.content.caption as string | undefined;

  const [activeTab, setActiveTab] = useState<DocTab>('link');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { inputRef: urlRef, onInsert: onInsertUrl } = useVariableInsertion(
    documentUrl,
    'documentUrl',
    onChange,
  );

  const upload = useMutation({
    mutationFn: uploadDocumentFn,
    onSuccess: ({ url, fileName }) => onChange({ documentUrl: url, documentFileName: fileName }),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) return;
    upload.mutate(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tab bar */}
      <div className="flex gap-0.5 bg-[#16171a] rounded-lg p-0.5">
        {([{ id: 'link' as DocTab, label: 'Link', icon: Link2 }, { id: 'upload' as DocTab, label: 'Upload', icon: Upload }]).map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(id)}
            className={`flex-1 gap-1.5 text-[11px] font-medium py-1 h-auto rounded-md transition-all ${
              activeTab === id
                ? 'bg-[#2e2f33] text-[#e2e4e8] hover:bg-[#2e2f33] hover:text-[#e2e4e8]'
                : 'bg-transparent text-gray-500 hover:bg-transparent hover:text-gray-300'
            }`}
          >
            <Icon size={11} />
            {label}
          </Button>
        ))}
      </div>

      {/* Link tab */}
      {activeTab === 'link' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-gray-400">Document URL</Label>
              <VariablePickerPopover onSelect={onInsertUrl} />
            </div>
            <Input
              ref={urlRef as React.Ref<HTMLInputElement>}
              value={documentUrl ?? ''}
              onChange={(e) => {
                const newUrl = e.target.value;
                const newAuto = extractFileNameFromUrl(newUrl);
                const oldAuto = extractFileNameFromUrl(documentUrl ?? '');
                // Keep current name unless it was auto-extracted (or empty)
                const shouldAutoFill = !documentFileName || documentFileName === oldAuto;
                onChange({
                  documentUrl: newUrl,
                  ...(shouldAutoFill ? { documentFileName: newAuto ?? undefined } : {}),
                });
              }}
              placeholder="https://example.com/report.pdf"
              className="bg-[#1c1d20] border-[#2e2f33] text-[#e2e4e8] placeholder:text-gray-600 focus-visible:border-blue-500 focus-visible:ring-0"
            />
          </div>

          {/* File name — auto-filled from URL, user can override */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-gray-400">
              File name{' '}
              <span className="font-normal text-gray-600">(optional)</span>
            </Label>
            <Input
              value={documentFileName ?? ''}
              onChange={(e) => onChange({ documentFileName: e.target.value || undefined })}
              placeholder={extractFileNameFromUrl(documentUrl ?? '') ?? 'e.g. report.pdf'}
              className="bg-[#1c1d20] border-[#2e2f33] text-[#e2e4e8] placeholder:text-gray-600 focus-visible:border-blue-500 focus-visible:ring-0"
            />
            {documentFileName && documentFileName === extractFileNameFromUrl(documentUrl ?? '') && (
              <p className="text-[10px] text-gray-500">Auto-extracted from URL</p>
            )}
          </div>

          <div className="rounded-lg bg-[#16171a] p-3 flex flex-col gap-1">
            <p className="text-[11px] font-medium text-gray-500">Supported formats</p>
            <p className="text-[11px] text-gray-600">PDF, Word (.doc, .docx), Excel (.xls, .xlsx), PowerPoint, CSV, TXT</p>
          </div>
        </div>
      )}

      {/* Upload tab */}
      {activeTab === 'upload' && (
        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            className="hidden"
            onChange={handleFileChange}
          />
          <div
            onClick={() => !upload.isPending && fileInputRef.current?.click()}
            className={`border-2 border-dashed border-[#2e2f33] rounded-lg p-8 text-center transition-colors bg-[#16171a] ${
              upload.isPending ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:border-[#3e3f43]'
            }`}
          >
            <FileText
              className="mx-auto mb-2 text-gray-600"
              size={24}
              strokeWidth={1.5}
            />
            {upload.isPending ? (
              <p className="text-[13px] text-gray-400">Uploading…</p>
            ) : documentFileName ? (
              <p className="text-[13px] text-[#e2e4e8] font-medium truncate px-2">{documentFileName}</p>
            ) : (
              <p className="text-[13px] text-gray-400">Click to upload</p>
            )}
            <p className="text-[11px] text-gray-600 mt-0.5">PDF, Word, Excel, CSV · max 50 MB</p>
          </div>

          {upload.isError && (
            <p className="text-[12px] text-red-400">{(upload.error as Error).message}</p>
          )}

          {documentFileName && documentUrl && !upload.isPending && (
            <div className="flex items-center gap-2 rounded-lg bg-[#16171a] px-3 py-2">
              <FileText size={14} className="shrink-0 text-blue-400" />
              <span className="flex-1 truncate text-[12px] text-[#e2e4e8]">{documentFileName}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onChange({ documentUrl: undefined, documentFileName: undefined })}
                className="shrink-0 text-gray-500 hover:text-gray-300"
              >
                <X size={12} />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Caption */}
      <div className="h-px bg-[#2e2f33]" />
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-gray-400">
          Caption <span className="font-normal text-gray-600">(optional)</span>
        </Label>
        <Input
          value={caption ?? ''}
          onChange={(e) => onChange({ caption: e.target.value })}
          placeholder="Add a short description…"
          className="bg-[#1c1d20] border-[#2e2f33] text-[#e2e4e8] placeholder:text-gray-600 focus-visible:border-blue-500 focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
