'use client';

import type { BlockConfigProps } from '../../types';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldWithVariable } from '../number-inputs/field-with-variable';

export function WaitConfig({ block, onChange }: BlockConfigProps) {
  const seconds = block.content.seconds as string | undefined;
  const pauseFlow = (block.content.pauseFlow as boolean | undefined) ?? false;

  return (
    <div className="flex flex-col gap-4">
      <FieldWithVariable
        label="Duration (seconds)"
        fieldKey="seconds"
        value={seconds}
        placeholder="e.g. 3"
        onChange={onChange}
      />

      <div className="h-px bg-[#2e2f33]" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="wait-pause-flow"
            checked={pauseFlow}
            onCheckedChange={(checked) => onChange({ pauseFlow: checked === true })}
          />
          <label htmlFor="wait-pause-flow" className="text-xs font-medium text-gray-400 cursor-pointer select-none">
            Pause the flow
          </label>
        </div>
        <p className="text-[10px] text-gray-600 pl-6">
          Marks a pause in the workflow before executing the next sequence of blocks.
        </p>
      </div>
    </div>
  );
}
