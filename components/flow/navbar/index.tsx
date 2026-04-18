'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PanelLeftClose,
  PanelLeftOpen, Undo2,
  Redo2,
  HelpCircle,
  Share2,
  Play,
  ChevronDown
} from 'lucide-react';
import { useFlowStore } from '@/store/flow.store';
import { useShallow } from 'zustand/react/shallow';

type NavTab = 'flow' | 'theme' | 'settings' | 'share' | 'results';

interface FlowNavbarProps {
  botName?: string;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function FlowNavbar({
  botName = 'My bot',
  sidebarOpen = true,
  onToggleSidebar,
}: FlowNavbarProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NavTab>('flow');
  const { undo, redo, canUndo, canRedo } = useFlowStore(
    useShallow((s) => ({ undo: s.undo, redo: s.redo, canUndo: s.canUndo, canRedo: s.canRedo }))
  );

  return (
    <header
      className="flex items-center px-2 h-12 shrink-0 z-20"
      style={{ background: '#1a1b1d', borderBottom: '1px solid #2a2b2d' }}
    >
      {/* ── Left group ─────────────────────────────── */}
      <div className="flex items-center gap-0.5 flex-1 min-w-0">
        {/* Sidebar toggle */}
        <NavBtn
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </NavBtn>

        {/* Bot name */}
        <div className="flex items-center gap-1.5 mx-2 px-2 py-1 rounded-lg">
          <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e4e8' }}>{botName}</span>
        </div>

        <div className="mx-1 h-4 w-px" style={{ background: '#2a2b2d' }} />

        {/* Undo */}
        <NavBtn
          onClick={undo}
          title="Undo (⌘Z)"
          disabled={!canUndo}
        >
          <Undo2 size={15} />
        </NavBtn>

        {/* Redo */}
        <NavBtn
          onClick={redo}
          title="Redo (⌘⇧Z)"
          disabled={!canRedo}
        >
          <Redo2 size={15} />
        </NavBtn>

        <div className="mx-1 h-4 w-px" style={{ background: '#2a2b2d' }} />

        {/* Help */}
        <NavBtn title="Help" className="gap-1.5 px-2.5">
          <HelpCircle size={14} />
          <span style={{ fontSize: 13, color: '#9ca3af' }}>Help</span>
        </NavBtn>
      </div>

      {/* ── Center tabs ────────────────────────────── */}
      <nav className="flex items-center gap-0.5 shrink-0">
        {(
          [
            { id: 'flow', label: 'Flow' },
            { id: 'theme', label: 'Theme' },
            { id: 'settings', label: 'Settings' },
            { id: 'share', label: 'Share' },
            { id: 'results', label: 'Results' },
          ] as { id: NavTab; label: string }[]
        ).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="rounded-lg transition-colors"
            style={{
              padding: '5px 13px',
              fontSize: 14,
              color: activeTab === id ? '#fff' : '#6b7280',
              background: activeTab === id ? 'rgba(255,255,255,0.08)' : 'transparent',
              fontWeight: activeTab === id ? 600 : 400,
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ── Right actions ──────────────────────────── */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        <NavBtn title="Share" className="gap-1.5 px-2.5">
          <Share2 size={14} />
          <span style={{ fontSize: 13 }}>Share</span>
        </NavBtn>

        <button
          className="flex items-center gap-1.5 rounded-lg transition-colors hover:bg-white/5"
          style={{
            padding: '5px 13px',
            fontSize: 13,
            color: '#d4d5d7',
            border: '1px solid #363839',
          }}
          title="Test"
        >
          <Play size={13} style={{ color: '#6b7280' }} />
          Test
        </button>

        <div
          className="flex items-center rounded-lg overflow-hidden"
          style={{ background: '#f36b25' }}
        >
          <button
            className="hover:bg-black/10 transition-colors text-white"
            style={{ padding: '6px 16px', fontSize: 13, fontWeight: 600 }}
          >
            Publish
          </button>
          <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(0,0,0,0.2)' }} />
          <button
            className="hover:bg-black/10 transition-colors text-white"
            style={{ padding: '6px 8px' }}
          >
            <ChevronDown size={13} />
          </button>
        </div>
      </div>
    </header>
  );
}

interface NavBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  className?: string;
  disabled?: boolean;
}

function NavBtn({ children, onClick, title, className = '', disabled = false }: NavBtnProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`flex items-center justify-center rounded-lg p-1.5 transition-colors ${disabled
          ? 'opacity-25 cursor-not-allowed'
          : 'hover:bg-white/[0.06]'
        } ${className}`}
      style={{ color: '#6b7280' }}
    >
      {children}
    </button>
  );
}
