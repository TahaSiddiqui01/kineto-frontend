'use client';

import type { BlockConfigProps } from '../../types';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldWithVariable } from '../number-inputs/field-with-variable';

export function RedirectConfig({ block, onChange }: BlockConfigProps) {
  const url = block.content.url as string | undefined;
  const newTab = (block.content.newTab as boolean | undefined) ?? false;

  return (
    <div className="flex flex-col gap-4">
      <FieldWithVariable
        label="URL"
        fieldKey="url"
        value={url}
        placeholder="https://…"
        onChange={onChange}
      />
      <div className="flex items-center gap-2">
        <Checkbox
          id="redirect-new-tab"
          checked={newTab}
          onCheckedChange={(checked) => onChange({ newTab: checked === true })}
        />
        <label htmlFor="redirect-new-tab" className="text-xs font-medium text-gray-400 cursor-pointer select-none">
          Open in new tab
        </label>
      </div>
      {newTab && (
        <p className="text-[10px] text-gray-600">
          Note: Safari and iOS may block new tab redirects — a popup will be shown instead.
        </p>
      )}
    </div>
  );
}
