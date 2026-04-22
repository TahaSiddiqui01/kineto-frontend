import { useState } from 'react';
import type { BlockConfigProps } from '../../types';

const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';

type KeyMode = 'test' | 'live';

function KeyField({
  label,
  fieldKey,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  fieldKey: string;
  value: string | undefined;
  placeholder: string;
  onChange: BlockConfigProps['onChange'];
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium text-gray-500">{label}</label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value ?? ''}
          onChange={(e) => onChange({ [fieldKey]: e.target.value })}
          placeholder={placeholder}
          className={`${inputClass} pr-14`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  );
}

export function StripeKeysSection({
  testSecretKey,
  testPublishKey,
  liveSecretKey,
  livePublishKey,
  onChange,
}: {
  testSecretKey: string | undefined;
  testPublishKey: string | undefined;
  liveSecretKey: string | undefined;
  livePublishKey: string | undefined;
  onChange: BlockConfigProps['onChange'];
}) {
  const [mode, setMode] = useState<KeyMode>('test');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-0.5 bg-[#16171a] rounded-lg p-0.5">
        {(['test', 'live'] as KeyMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 text-[11px] font-medium py-1 rounded-md border-none cursor-pointer transition-all capitalize ${
              mode === m
                ? 'bg-[#2e2f33] text-[#e2e4e8]'
                : 'bg-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'test' ? (
        <div className="flex flex-col gap-2 pl-1 border-l-2 border-[#2e2f33]">
          <KeyField
            label="Secret key"
            fieldKey="testSecretKey"
            value={testSecretKey}
            placeholder="sk_test_…"
            onChange={onChange}
          />
          <KeyField
            label="Publishable key"
            fieldKey="testPublishKey"
            value={testPublishKey}
            placeholder="pk_test_…"
            onChange={onChange}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2 pl-1 border-l-2 border-[#2e2f33]">
          <KeyField
            label="Secret key"
            fieldKey="liveSecretKey"
            value={liveSecretKey}
            placeholder="sk_live_…"
            onChange={onChange}
          />
          <KeyField
            label="Publishable key"
            fieldKey="livePublishKey"
            value={livePublishKey}
            placeholder="pk_live_…"
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
}
