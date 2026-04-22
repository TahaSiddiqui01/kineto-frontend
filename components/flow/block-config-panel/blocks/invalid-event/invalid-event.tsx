import type { BlockConfigProps } from '../../types';

export function InvalidEventConfig(_props: BlockConfigProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border border-[#2e2f33] bg-[#1c1d20] px-3 py-2.5">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Triggers when the user sends an invalid or unrecognized input. Use this to handle fallback scenarios gracefully.
        </p>
      </div>
    </div>
  );
}
