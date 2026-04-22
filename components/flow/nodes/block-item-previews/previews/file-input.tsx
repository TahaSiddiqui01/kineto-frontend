import type { BlockItemPreviewProps } from '../types';

export function FileInputItemPreview({ block }: BlockItemPreviewProps) {
  const multipleFiles = block.content.multipleFiles as boolean | undefined;
  const visibility = (block.content.visibility as string | undefined) ?? 'public';
  const fileUrlVariable = block.content.fileUrlVariable as string | undefined;
  const submitButtonLabel = block.content.submitButtonLabel as string | undefined;

  const label = submitButtonLabel || 'File upload';

  const tags = [
    multipleFiles ? 'Multiple files' : 'Single file',
    visibility === 'private' ? 'Private' : null,
    fileUrlVariable ? `{{${fileUrlVariable}}}` : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
        <span className="text-[10px] text-gray-600 truncate">{tags}</span>
      </div>
    </div>
  );
}
