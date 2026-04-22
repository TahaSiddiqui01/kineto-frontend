'use client';

import type { BlockConfigProps } from '../../types';

const inputClass = 'w-20 bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 text-center placeholder:text-gray-600';

export function AbTestConfig({ block, onChange }: BlockConfigProps) {
  const aPercent = (block.content.aPercent as number | undefined) ?? 50;
  const bPercent = 100 - aPercent;

  function handleChange(val: string) {
    const n = Math.min(100, Math.max(0, parseInt(val, 10) || 0));
    onChange({ aPercent: n });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[11px] text-gray-500">
        Splits traffic randomly between two paths.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-400">Path A</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={0}
              max={100}
              value={aPercent}
              onChange={(e) => handleChange(e.target.value)}
              className={inputClass}
            />
            <span className="text-xs text-gray-500">%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-400">Path B</label>
          <div className="flex items-center gap-1">
            <span className="text-[13px] text-[#e2e4e8] w-20 text-center">{bPercent}</span>
            <span className="text-xs text-gray-500">%</span>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-600">
        Stack multiple AB test blocks to add more random paths.
      </p>
    </div>
  );
}
