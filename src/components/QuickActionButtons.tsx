/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Lamp, 
  Sun, 
  Bell, 
  BellOff, 
  PackageCheck, 
  ShieldAlert, 
  Volume2, 
  Footprints, 
  Package, 
  MessageSquare,
  Check,
  AlertTriangle,
  Radio
} from 'lucide-react';
import { AutomationItem, ActivityEvent } from '../types';

interface QuickActionButtonsProps {
  automations: AutomationItem[];
  onToggleAutomation: (id: string) => void;
  onAddEvent: (event: Omit<ActivityEvent, 'id'>) => void;
  isCompact?: boolean;
}

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  automations,
  onToggleAutomation,
  onAddEvent,
  isCompact = false,
}) => {
  const [unlockConfirming, setUnlockConfirming] = useState<string | null>(null);
  const [voicePlaying, setVoicePlaying] = useState<string | null>(null);

  // Helper to get matching Lucide icon component
  const renderIcon = (iconName: string, active: boolean, size = 20) => {
    const props = { size, className: 'shrink-0' };
    switch (iconName) {
      case 'Lock':
        return active ? <Lock {...props} /> : <Unlock {...props} />;
      case 'Lamp':
        return <Lamp {...props} />;
      case 'Sun':
        return <Sun {...props} />;
      case 'Bell':
        return active ? <Bell {...props} /> : <BellOff {...props} />;
      case 'PackageCheck':
        return <PackageCheck {...props} />;
      case 'Package':
        return <Package {...props} />;
      case 'Footprints':
        return <Footprints {...props} />;
      case 'ShieldAlert':
        return <ShieldAlert {...props} />;
      default:
        return <MessageSquare {...props} />;
    }
  };

  const handleActionClick = (item: AutomationItem) => {
    // 1. Secure Unlock Action (Hold or Confirmation)
    if (item.id === 'front_door_lock') {
      const isCurrentlyLocked = Boolean(item.state);
      if (isCurrentlyLocked) {
        // Confirm unlock
        if (unlockConfirming === item.id) {
          // Confirmed unlock
          setUnlockConfirming(null);
          onToggleAutomation(item.id);
          onAddEvent({
            timestamp: 'Just now',
            type: 'door_unlock',
            title: 'Front Deadbolt Unlocked',
            detail: 'Triggered from 7" touchscreen panel',
            icon: 'Unlock',
            badgeColor: 'amber'
          });
        } else {
          setUnlockConfirming(item.id);
          setTimeout(() => {
            setUnlockConfirming((prev) => (prev === item.id ? null : prev));
          }, 3500);
        }
        return;
      } else {
        // Instant Lock
        setUnlockConfirming(null);
        onToggleAutomation(item.id);
        onAddEvent({
          timestamp: 'Just now',
          type: 'door_lock',
          title: 'Front Deadbolt Locked',
          detail: 'Secured via touchscreen single tap',
          icon: 'Lock',
          badgeColor: 'emerald'
        });
        return;
      }
    }

    // 2. Quick Voice Replies
    if (item.actionType === 'voice_quick_reply') {
      setVoicePlaying(item.id);
      const textToSpeak = item.voiceText || item.name;

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setVoicePlaying(null);
        utterance.onerror = () => setVoicePlaying(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setVoicePlaying(null), 2500);
      }

      onAddEvent({
        timestamp: 'Just now',
        type: 'voice_reply',
        title: `Doorbell Voice: "${item.name}"`,
        detail: `Spoken via Aqara G400 speaker: "${textToSpeak}"`,
        icon: 'Mic',
        badgeColor: 'teal'
      });
      return;
    }

    // 3. Siren Alarm Alert
    if (item.id === 'siren_deterrent') {
      onToggleAutomation(item.id);
      onAddEvent({
        timestamp: 'Just now',
        type: 'alarm',
        title: item.state ? 'Deterrent Siren Stopped' : 'Deterrent Siren Activated!',
        detail: item.state ? 'Siren disarmed' : '90dB warning chirp & floodlights triggered',
        icon: 'ShieldAlert',
        badgeColor: 'rose'
      });
      return;
    }

    // Standard Toggle
    onToggleAutomation(item.id);
    onAddEvent({
      timestamp: 'Just now',
      type: 'light_toggle',
      title: `${item.name} Toggled`,
      detail: `New State: ${!item.state ? 'ON' : 'OFF'} (${item.entityId})`,
      icon: item.icon,
      badgeColor: 'sky'
    });
  };

  return (
    <div className="w-full h-full flex flex-col p-3.5 bg-zinc-950/90 select-none overflow-y-auto custom-scrollbar">
      {/* Header bar for Quick Controls */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800/80">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
            <span>Entryway Controls</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          </h3>
          <p className="text-[11px] text-zinc-400">Touch triggers for front porch</p>
        </div>
        <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700/60">
          HA Native API
        </span>
      </div>

      {/* Buttons Grid */}
      <div className={`grid ${isCompact ? 'grid-cols-2 gap-2' : 'grid-cols-2 gap-2.5'} auto-rows-fr`}>
        {automations.map((item) => {
          const isActive = Boolean(item.state);
          const isLock = item.id === 'front_door_lock';
          const isConfirmingUnlock = unlockConfirming === item.id;
          const isVoice = item.actionType === 'voice_quick_reply';
          const isCurrentVoicePlaying = voicePlaying === item.id;

          // Compute button styling based on category and state
          let activeStyles = 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:bg-zinc-800/90';

          if (isLock) {
            if (isConfirmingUnlock) {
              activeStyles = 'bg-amber-600 text-white border-amber-400 animate-pulse shadow-lg';
            } else if (isActive) {
              // Locked = Secure green
              activeStyles = 'bg-emerald-950/70 text-emerald-300 border-emerald-600/70 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
            } else {
              // Unlocked = Warning rose/amber
              activeStyles = 'bg-rose-950/70 text-rose-300 border-rose-500/70 shadow-[0_0_12px_rgba(244,63,94,0.15)]';
            }
          } else if (isVoice) {
            if (isCurrentVoicePlaying) {
              activeStyles = 'bg-teal-600 text-white border-teal-300 shadow-lg animate-pulse';
            } else {
              activeStyles = 'bg-zinc-900/95 text-teal-300 border-teal-900/50 hover:border-teal-600/70 hover:bg-teal-950/30';
            }
          } else if (item.id === 'siren_deterrent') {
            if (isActive) {
              activeStyles = 'bg-rose-600 text-white border-rose-400 animate-bounce shadow-xl';
            } else {
              activeStyles = 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-rose-700/60 hover:text-rose-300';
            }
          } else if (isActive) {
            if (item.category === 'lighting') {
              activeStyles = 'bg-amber-950/60 text-amber-200 border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
            } else if (item.category === 'doorbell') {
              activeStyles = 'bg-indigo-950/70 text-indigo-300 border-indigo-500/70 shadow-[0_0_12px_rgba(99,102,241,0.15)]';
            } else {
              activeStyles = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/70';
            }
          }

          return (
            <button
              key={item.id}
              id={`btn-action-${item.id}`}
              onClick={() => handleActionClick(item)}
              className={`relative flex flex-col justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.97] min-h-[76px] ${activeStyles}`}
            >
              {/* Top Row: Icon + State Badge */}
              <div className="flex items-center justify-between w-full">
                <div className="p-1.5 rounded-lg bg-black/30 backdrop-blur-sm">
                  {renderIcon(item.icon, isActive, 19)}
                </div>
                
                {isLock ? (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isConfirmingUnlock
                      ? 'bg-white text-zinc-950 font-black'
                      : isActive
                      ? 'bg-emerald-900/80 text-emerald-300'
                      : 'bg-rose-900/80 text-rose-300'
                  }`}>
                    {isConfirmingUnlock ? 'CONFIRM' : isActive ? 'LOCKED' : 'UNLOCKED'}
                  </span>
                ) : isVoice ? (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-teal-900/50 text-teal-300 flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-spin" />
                    {isCurrentVoicePlaying ? 'SPEAKING' : 'AUDIO'}
                  </span>
                ) : (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    isActive ? 'bg-white/10 text-white' : 'bg-black/30 text-zinc-400'
                  }`}>
                    {isActive ? 'ON' : 'OFF'}
                  </span>
                )}
              </div>

              {/* Bottom Row: Name + Secondary Description */}
              <div className="mt-2">
                <div className="font-semibold text-xs text-white leading-tight">
                  {isConfirmingUnlock ? 'Tap again to Unlock' : item.name}
                </div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {isConfirmingUnlock ? 'Security confirmation' : item.secondaryText || item.entityId}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Voice Prompt Helper Pill */}
      <div className="mt-3 p-2 rounded-lg bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-teal-400" />
          <span>Doorbell 2-way speaker replies</span>
        </span>
        <span className="text-zinc-500 font-mono text-[10px]">Aqara G400 Intercom</span>
      </div>
    </div>
  );
};
