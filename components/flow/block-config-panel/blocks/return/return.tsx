import type { BlockConfigProps } from '../../types';

export function ReturnConfig(_props: BlockConfigProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border border-[#2e2f33] bg-[#1c1d20] px-3 py-2.5">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Returns to the parent typebot. Use this inside a linked bot to hand control back to the caller.
        </p>
      </div>
    </div>
  );
}
