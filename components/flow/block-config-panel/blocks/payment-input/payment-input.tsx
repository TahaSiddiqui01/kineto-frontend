'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CURRENCY_CODES } from '@/helpers';
import { VariableSelectDropdown } from '../../variable-select-dropdown';
import type { BlockConfigProps } from '../../types';
import { FieldWithVariable } from '../number-inputs/field-with-variable';
import { StripeKeysSection } from './stripe-keys-section';

const ADDITIONAL_INFO_FIELDS = [
  { key: 'collectDescription', label: 'Description' },
  { key: 'collectName', label: 'Name' },
  { key: 'collectEmail', label: 'Email' },
  { key: 'collectPhone', label: 'Phone' },
  { key: 'collectAddress', label: 'Address' },
] as const;

export function PaymentInputConfig({ block, onChange }: BlockConfigProps) {
  const provider = (block.content.provider as string | undefined) ?? 'stripe';
  const testSecretKey = block.content.testSecretKey as string | undefined;
  const testPublishKey = block.content.testPublishKey as string | undefined;
  const liveSecretKey = block.content.liveSecretKey as string | undefined;
  const livePublishKey = block.content.livePublishKey as string | undefined;
  const price = block.content.price as string | undefined;
  const currency = (block.content.currency as string | undefined) ?? 'USD';
  const buttonLabel = block.content.buttonLabel as string | undefined;
  const successMessage = block.content.successMessage as string | undefined;
  const saveAnswerTo = block.content.saveAnswerTo as string | undefined;

  return (
    <div className="flex flex-col gap-4">
      {/* Provider */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Provider</label>
        <Select value={provider} onValueChange={(val) => onChange({ provider: val })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stripe">Stripe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Keys */}
      {provider === 'stripe' && (
        <StripeKeysSection
          testSecretKey={testSecretKey}
          testPublishKey={testPublishKey}
          liveSecretKey={liveSecretKey}
          livePublishKey={livePublishKey}
          onChange={onChange}
        />
      )}

      <div className="h-px bg-[#2e2f33]" />

      {/* Price & Currency */}
      <div className="grid grid-cols-2 gap-2">
        <FieldWithVariable
          label="Price"
          fieldKey="price"
          value={price}
          placeholder="9.99"
          onChange={onChange}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400">Currency</label>
          <Select value={currency} onValueChange={(val) => onChange({ currency: val })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_CODES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <FieldWithVariable
        label="Button label"
        fieldKey="buttonLabel"
        value={buttonLabel}
        placeholder="Pay"
        onChange={onChange}
      />

      <FieldWithVariable
        label="Success message"
        fieldKey="successMessage"
        value={successMessage}
        placeholder="Payment successful!"
        onChange={onChange}
      />

      <div className="h-px bg-[#2e2f33]" />

      {/* Additional info */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-400">Collect additional info</label>
        <div className="flex flex-col gap-2 pl-1">
          {ADDITIONAL_INFO_FIELDS.map(({ key, label }) => {
            const checked = (block.content[key] as boolean | undefined) ?? false;
            return (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={key}
                  checked={checked}
                  onCheckedChange={(v) => onChange({ [key]: v === true })}
                />
                <label htmlFor={key} className="text-xs text-gray-400 cursor-pointer select-none">
                  {label}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-[#2e2f33]" />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">
          Save answer into variable{' '}
          <span className="text-gray-600 font-normal">(optional)</span>
        </label>
        <VariableSelectDropdown
          value={saveAnswerTo}
          onChange={(name) => onChange({ saveAnswerTo: name })}
        />
      </div>
    </div>
  );
}
