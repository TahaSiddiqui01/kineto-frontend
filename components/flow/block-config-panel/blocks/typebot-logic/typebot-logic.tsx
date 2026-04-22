'use client';

import { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/store/auth.store';
import { botService } from '@/services/bot.service';
import type { Bot } from '@/types/bot';
import type { BlockConfigProps } from '../../types';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const CLEAR_SENTINEL = '__clear__';

export function TypebotLogicConfig({ block, onChange }: BlockConfigProps) {
  const typebotId = block.content.typebotId as string | undefined;
  const mergeAnswers = (block.content.mergeAnswers as boolean | undefined) ?? false;

  const workspaceId = useAuthStore(useShallow((s) => s.currentWorkspace?.id));

  // null = still loading, Bot[] = fetch complete
  const [bots, setBots] = useState<Bot[] | null>(null);

  useEffect(() => {
    if (!workspaceId) return;
    let cancelled = false;
    botService
      .getBots(workspaceId)
      .then((res) => { if (!cancelled) setBots(res.data); })
      .catch(() => { if (!cancelled) setBots([]); });
    return () => { cancelled = true; };
  }, [workspaceId]);

  function handleBotChange(val: string) {
    onChange({ typebotId: val === CLEAR_SENTINEL ? undefined : val });
  }

  const loading = !!workspaceId && bots === null;
  const botList = bots ?? [];
  const selectedBot = botList.find((b) => b.id === typebotId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Linked bot</label>
        {loading ? (
          <div className="w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg px-2.5 py-[7px] text-[13px] text-gray-600 animate-pulse">
            Loading bots&hellip;
          </div>
        ) : botList.length === 0 ? (
          <p className="text-[11px] text-gray-500 bg-[#1c1d20] rounded-lg px-2.5 py-2 border border-[#2e2f33]">
            No bots found in this workspace.
          </p>
        ) : (
          <Select value={typebotId ?? ''} onValueChange={handleBotChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a bot&hellip;">
                {selectedBot && (
                  <span className="text-[#e2e4e8] text-[13px]">{selectedBot.name}</span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {typebotId && (
                <SelectItem value={CLEAR_SENTINEL}>Clear selection</SelectItem>
              )}
              {botList.map((bot) => (
                <SelectItem key={bot.id} value={bot.id}>
                  {bot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <p className="text-[10px] text-gray-600">
          Variables with matching names are automatically shared with the linked bot.
        </p>
      </div>

      <div className="h-px bg-[#2e2f33]" />

      <div className="flex items-center gap-2">
        <Checkbox
          id="typebot-merge"
          checked={mergeAnswers}
          onCheckedChange={(checked) => onChange({ mergeAnswers: checked === true })}
        />
        <label htmlFor="typebot-merge" className="text-xs font-medium text-gray-400 cursor-pointer select-none">
          Merge answers
        </label>
      </div>
      <p className="text-[10px] text-gray-600 -mt-2">
        Consolidates responses from the linked bot into this bot&apos;s results.
      </p>
    </div>
  );
}
