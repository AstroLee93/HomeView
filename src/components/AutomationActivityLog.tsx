/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  BellRing, 
  Lock, 
  Unlock, 
  Lamp, 
  Mic, 
  ShieldAlert, 
  Eye, 
  Camera,
  CheckCircle2
} from 'lucide-react';
import { ActivityEvent } from '../types';

interface AutomationActivityLogProps {
  events: ActivityEvent[];
  onClearEvents: () => void;
}

export const AutomationActivityLog: React.FC<AutomationActivityLogProps> = ({
  events,
  onClearEvents,
}) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'security') return e.type.includes('lock') || e.type === 'alarm';
    if (filter === 'doorbell') return e.type.includes('doorbell') || e.type.includes('motion') || e.type === 'voice_reply';
    if (filter === 'lighting') return e.type.includes('light');
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'doorbell_ring':
        return <BellRing className="w-4 h-4 text-indigo-400" />;
      case 'door_unlock':
        return <Unlock className="w-4 h-4 text-amber-400" />;
      case 'door_lock':
        return <Lock className="w-4 h-4 text-emerald-400" />;
      case 'light_toggle':
        return <Lamp className="w-4 h-4 text-amber-300" />;
      case 'voice_reply':
        return <Mic className="w-4 h-4 text-teal-400" />;
      case 'alarm':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'motion':
        return <Eye className="w-4 h-4 text-amber-400" />;
      default:
        return <Camera className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="w-full max-w-5xl bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-6 text-zinc-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <History className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">Entryway Activity &amp; Trigger Log</h2>
            <p className="text-xs text-zinc-400">
              Live telemetry of touchscreen presses, doorbell rings, and sensor triggers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md transition ${filter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('security')}
              className={`px-2.5 py-1 rounded-md transition ${filter === 'security' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Security
            </button>
            <button
              onClick={() => setFilter('doorbell')}
              className={`px-2.5 py-1 rounded-md transition ${filter === 'doorbell' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Doorbell
            </button>
          </div>

          <button
            onClick={onClearEvents}
            className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg transition"
            title="Clear Event Log"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 divide-y divide-zinc-800/80 max-h-[360px] overflow-y-auto custom-scrollbar">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs">
            No events recorded in this category.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div key={evt.id} className="py-3 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800 shrink-0 mt-0.5">
                  {getIcon(evt.type)}
                </div>
                <div>
                  <div className="font-semibold text-white">{evt.title}</div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">{evt.detail}</div>
                </div>
              </div>
              <span className="font-mono text-[11px] text-zinc-500 shrink-0 whitespace-nowrap bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80">
                {evt.timestamp}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
