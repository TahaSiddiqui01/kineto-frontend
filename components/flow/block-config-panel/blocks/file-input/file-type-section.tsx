import { Checkbox } from '@/components/ui/checkbox';
import type { BlockConfigProps } from '../../types';

export const FILE_TYPE_OPTIONS = [
  { key: 'allowImages', label: 'Images', mime: 'image/*' },
  { key: 'allowVideos', label: 'Videos', mime: 'video/*' },
  { key: 'allowAudio', label: 'Audio', mime: 'audio/*' },
  { key: 'allowPdf', label: 'PDF', mime: '.pdf' },
  { key: 'allowDocuments', label: 'Documents', mime: '.doc,.docx' },
  { key: 'allowSpreadsheets', label: 'Spreadsheets', mime: '.xls,.xlsx' },
  { key: 'allowCsv', label: 'CSV', mime: '.csv' },
] as const;

export function FileTypeSection({
  block,
  onChange,
}: {
  block: { content: Record<string, unknown> };
  onChange: BlockConfigProps['onChange'];
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-gray-400">Allowed file types</label>
      <div className="grid grid-cols-2 gap-2">
        {FILE_TYPE_OPTIONS.map(({ key, label }) => {
          const checked = (block.content[key] as boolean | undefined) ?? true;
          return (
            <div key={key} className="flex items-center gap-2">
              <Checkbox
                id={key}
                checked={checked}
                onCheckedChange={(v) => onChange({ [key]: v === true })}
              />
              <label htmlFor={key} className="text-xs text-gray-400 cursor-pointer select-none">
                {label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
