'use client';

import React, { useState, useMemo } from 'react';
import { Search, Lock } from 'lucide-react';
import { NodeItem } from './node-item';
import { BLOCK_DEFINITIONS, BLOCK_DEFINITIONS_BY_CATEGORY } from '@/lib/flow/block-definitions';
import type { BlockCategory } from '@/types/flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CATEGORY_LABELS: Record<BlockCategory, string> = {
  bubbles: 'Bubbles',
  inputs: 'Inputs',
  logic: 'Logic',
  events: 'Events',
  integrations: 'Integrations',
};

const CATEGORY_ORDER: BlockCategory[] = ['bubbles', 'inputs', 'logic', 'events', 'integrations'];

export function NodePalette() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return BLOCK_DEFINITIONS.filter(
      (d) => d.label.toLowerCase().includes(q) || d.category.includes(q)
    );
  }, [search]);

  return (
    <aside
      className="flex flex-col h-full shrink-0 overflow-hidden"
      style={{
        width: 280,
        background: '#1a1b1d',
        borderRight: '1px solid #2a2b2d',
      }}
    >
      {/* Search bar */}
      <div className="flex items-center gap-1.5 p-2.5">
        <div
          className="flex flex-1 items-center gap-1.5 rounded-lg px-2.5 py-1.5"
          style={{ background: '#111213', border: '1px solid #2a2b2d' }}
        >
          <Search size={12} style={{ color: '#4b5563', flexShrink: 0 }} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent border-none h-6 outline-none placeholder:text-neutral-600"
            style={{ fontSize: 12, color: '#c8cace' }}
          />
        </div>
        <Button className='h-10'>
          <Lock size={12} style={{ color: '#4b5563' }} />
        </Button>
      </div>

      {/* Scrollable block list */}
      <div
        className="flex-1 overflow-y-auto px-2.5 pb-6"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#3a3b3e transparent' }}
      >
        {filtered ? (
          <section className="mb-4">
            <CategoryLabel>Search results</CategoryLabel>
            {filtered.length === 0 ? (
              <p style={{ fontSize: 11, color: '#4b5563' }}>No blocks found.</p>
            ) : (
              <Grid>
                {filtered.map((def) => (
                  <NodeItem key={def.type} definition={def} />
                ))}
              </Grid>
            )}
          </section>
        ) : (
          CATEGORY_ORDER.map((cat) => (
            <section key={cat} className="mb-4">
              <CategoryLabel>{CATEGORY_LABELS[cat]}</CategoryLabel>
              <Grid>
                {BLOCK_DEFINITIONS_BY_CATEGORY[cat].map((def) => (
                  <NodeItem key={def.type} definition={def} />
                ))}
              </Grid>
            </section>
          ))
        )}
      </div>
    </aside>
  );
}

function CategoryLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="mb-1.5 uppercase tracking-wider"
      style={{ fontSize: 10, fontWeight: 600, color: '#6b7280' }}
    >
      {children}
    </h3>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {children}
    </div>
  );
}
