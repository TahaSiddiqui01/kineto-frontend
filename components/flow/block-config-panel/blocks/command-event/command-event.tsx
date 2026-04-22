'use client';

import type { BlockConfigProps } from '../../types';

const inputClass = 'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

export function CommandEventConfig({ block, onChange }: BlockConfigProps) {
  const command = block.content.command as string | undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Command</label>
        <input
          type="text"
          value={command ?? ''}
          onChange={(e) => onChange({ command: e.target.value })}
          placeholder="/start"
          className={inputClass}
        />
        <p className="text-[10px] text-gray-600">
          Triggers this flow when the user sends this command.
        </p>
      </div>
    </div>
  );
}
