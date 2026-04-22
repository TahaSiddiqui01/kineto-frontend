'use client';

import { ImagePicker } from '../shared/image-picker';
import { VariablePickerPopover } from '../variable-picker-popover';
import { useVariableInsertion } from '../hooks/use-variable-insertion';
import type { BlockConfigProps } from '../types';

const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

export function ImageBubbleConfig({ block, onChange }: BlockConfigProps) {
  const imageUrl = block.content.imageUrl as string | undefined;
  const alt = block.content.alt as string | undefined;
  const redirectUrl = block.content.redirectUrl as string | undefined;
  const redirectEnabled = (block.content.redirectEnabled as boolean | undefined) ?? false;
  const iconName = block.content.iconName as string | undefined;
  const iconColor = (block.content.iconColor as string | undefined) ?? '#e2e4e8';

  const { inputRef: altRef, onInsert: onInsertAlt } = useVariableInsertion(alt, 'alt', onChange);
  const { inputRef: redirectRef, onInsert: onInsertRedirect } = useVariableInsertion(redirectUrl, 'redirectUrl', onChange);

  return (
    <div className="flex flex-col gap-4">
      <ImagePicker
        value={{ imageUrl, iconName, iconColor }}
        allowIconsTab
        allowVariables
        onChange={(patch) => onChange(patch)}
      />

      <div className="h-px bg-[#2e2f33]" />

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
