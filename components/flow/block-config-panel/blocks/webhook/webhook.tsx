'use client';

import type { BlockConfigProps } from '../../types';
import { VariableSelectDropdown } from '../../variable-select-dropdown';

export function WebhookConfig({ block, onChange }: BlockConfigProps) {
  const saveResultTo = block.content.saveResultTo as string | undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-[#2e2f33] bg-[#1c1d20] px-3 py-2.5 flex flex-col gap-1">
        <p className="text-[11px] font-medium text-gray-400">How it works</p>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Pauses the conversation until an external service calls the webhook URL. Use the block ID and result ID to construct the URL.
        </p>
      </div>

      <div className="h-px bg-[#2e2f33]" />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">
          Save result into variable <span className="text-gray-600 font-normal">(optional)</span>
        </label>
        <VariableSelectDropdown
          value={saveResultTo}
          onChange={(name) => onChange({ saveResultTo: name })}
        />
      </div>
    </div>
  );
}
