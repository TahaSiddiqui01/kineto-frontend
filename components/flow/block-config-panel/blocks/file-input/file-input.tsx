'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VariableSelectDropdown } from '../../variable-select-dropdown';
import type { BlockConfigProps } from '../../types';
import { FieldWithVariable } from '../number-inputs/field-with-variable';
import { FileTypeSection } from './file-type-section';


export function FileInputConfig({ block, onChange }: BlockConfigProps) {
  const multipleFiles = (block.content.multipleFiles as boolean | undefined) ?? false;
  const visibility = (block.content.visibility as string | undefined) ?? 'public';
  const inputButtonLabel = block.content.inputButtonLabel as string | undefined;
  const submitButtonLabel = block.content.submitButtonLabel as string | undefined;
  const successMessage = block.content.successMessage as string | undefined;
  const internalValue = block.content.internalValue as string | undefined;
  const fileUrlVariable = block.content.fileUrlVariable as string | undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox
          id="multipleFiles"
          checked={multipleFiles}
          onCheckedChange={(checked) => onChange({ multipleFiles: checked === true })}
        />
        <label htmlFor="multipleFiles" className="text-xs font-medium text-gray-400 cursor-pointer select-none">
          Allow multiple files
        </label>
      </div>

      <FileTypeSection block={block} onChange={onChange} />

      <div className="h-px bg-[#2e2f33]" />

      {/* Visibility */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Visibility</label>
        <Select value={visibility} onValueChange={(val) => onChange({ visibility: val })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public — anyone with the link</SelectItem>
            <SelectItem value="private">Private — workspace members only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-px bg-[#2e2f33]" />

      {/* Button labels */}
      <FieldWithVariable
        label="Input button label"
        fieldKey="inputButtonLabel"
        value={inputButtonLabel}
        placeholder="Choose file…"
        onChange={onChange}
      />
      <FieldWithVariable
        label="Submit button label"
        fieldKey="submitButtonLabel"
        value={submitButtonLabel}
        placeholder="Upload"
        onChange={onChange}
      />
      <FieldWithVariable
        label="Success message"
        fieldKey="successMessage"
        value={successMessage}
        placeholder="File uploaded successfully!"
        onChange={onChange}
      />

      <div className="h-px bg-[#2e2f33]" />

      <FieldWithVariable
        label="Internal value"
        fieldKey="internalValue"
        value={internalValue}
        placeholder="Value associated with file…"
        onChange={onChange}
      />

      {/* Save file URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">
          Save file URL into variable{' '}
          <span className="text-gray-600 font-normal">(optional)</span>
        </label>
        <VariableSelectDropdown
          value={fileUrlVariable}
          onChange={(name) => onChange({ fileUrlVariable: name })}
        />
      </div>
    </div>
  );
}
