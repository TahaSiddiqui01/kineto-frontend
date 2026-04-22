'use client';

import type { BlockConfigProps } from '../../types';
import { Checkbox } from '@/components/ui/checkbox';

const codeAreaClass = 'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 font-mono resize-none placeholder:text-gray-600';

export function ScriptConfig({ block, onChange }: BlockConfigProps) {
  const code = block.content.code as string | undefined;
  const executeOnClient = (block.content.executeOnClient as boolean | undefined) ?? false;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Code</label>
        <textarea
          value={code ?? ''}
          onChange={(e) => onChange({ code: e.target.value })}
          placeholder="// Write JavaScript here…"
          rows={8}
          className={codeAreaClass}
        />
      </div>

      <div className="h-px bg-[#2e2f33]" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="script-exec-client"
            checked={executeOnClient}
            onCheckedChange={(checked) => onChange({ executeOnClient: checked === true })}
          />
          <label htmlFor="script-exec-client" className="text-xs font-medium text-gray-400 cursor-pointer select-none">
            Execute on client
          </label>
        </div>
        <p className="text-[10px] text-gray-600 pl-6">
          {executeOnClient
            ? 'Runs in the user\'s browser. Has access to window, document, and localStorage.'
            : 'Runs on the server. Use setVariable() to set variables. No browser APIs available.'}
        </p>
      </div>
    </div>
  );
}
