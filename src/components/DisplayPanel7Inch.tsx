/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wifi, 
  Cpu, 
  Sun, 
  Moon, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Power, 
  Clock, 
  Thermometer,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { CameraStreamView } from './CameraStreamView';
import { QuickActionButtons } from './QuickActionButtons';
import { AutomationItem, CameraFeedConfig, ActivityEvent, LayoutMode } from '../types';

interface DisplayPanel7InchProps {
  config: CameraFeedConfig;
  onUpdateConfig: (partial: Partial<CameraFeedConfig>) => void;
  automations: AutomationItem[];
  onToggleAutomation: (id: string) => void;
  onAddEvent: (event: Omit<ActivityEvent, 'id'>) => void;
  isDoorbellRinging: boolean;
  onTriggerRing: () => void;
  isNightMode: boolean;
  onToggleNightMode: () => void;
  layoutMode: LayoutMode;
  onChangeLayout: (mode: LayoutMode) => void;
  showPhysicalBezel: boolean;
  onToggleBezel: () => void;
}

export const DisplayPanel7Inch: React.FC<DisplayPanel7InchProps> = ({
  config,
  onUpdateConfig,
  automations,
  onToggleAutomation,
  onAddEvent,
  isDoorbellRinging,
  onTriggerRing,
  isNightMode,
  onToggleNightMode,
  layoutMode,
  onChangeLayout,
  showPhysicalBezel,
  onToggleBezel,
}) => {
  const [brightness, setBrightness] = useState<number>(90);
  const [isAsleep, setIsAsleep] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Wake on touch
  const handleScreenTouch = () => {
    if (isAsleep) {
      setIsAsleep(false);
      onAddEvent({
        timestamp: 'Just now',
        type: 'motion',
        title: 'Display Woke from Sleep',
        detail: 'GT911 touch event detected • Backlight restored',
        icon: 'Sun',
        badgeColor: 'amber',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Control bar above the virtual 7" screen */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 mb-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Waveshare ESP32-S3 Touch LCD 7" (800×480)</span>
          </div>
          <span className="hidden sm:inline text-zinc-500">|</span>
          <div className="hidden sm:flex items-center gap-2 text-zinc-400">
            <span className="font-mono">ST7262 RGB</span>
            <span>•</span>
            <span className="font-mono">GT911 Touch</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Layout Mode Selector */}
          <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
            <button
              id="btn-layout-split"
              onClick={() => onChangeLayout('split')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                layoutMode === 'split' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
              title="Split View: Camera + Controls"
            >
              Split View
            </button>
            <button
              id="btn-layout-fullscreen"
              onClick={() => onChangeLayout('fullscreen_hud')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                layoutMode === 'fullscreen_hud' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
              title="Fullscreen CCTV with Overlay HUD"
            >
              Fullscreen HUD
            </button>
          </div>

          {/* Physical Bezel Toggle */}
          <button
            id="btn-toggle-bezel"
            onClick={onToggleBezel}
            className={`px-2.5 py-1 rounded text-[11px] font-medium border transition ${
              showPhysicalBezel
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {showPhysicalBezel ? 'Bezel: Frame On' : 'Bezel: Raw Panel'}
          </button>

          {/* Sleep / Wake Button */}
          <button
            id="btn-simulate-sleep"
            onClick={() => setIsAsleep(!isAsleep)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium border transition ${
              isAsleep ? 'bg-amber-600 border-amber-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <Power className="w-3 h-3" />
            <span>{isAsleep ? 'Wake Screen' : 'Simulate Sleep'}</span>
          </button>
        </div>
      </div>

      {/* 7-Inch Waveshare Physical Hardware Enclosure / Bezel Wrapper */}
      <div
        className={`relative transition-all duration-300 ${
          showPhysicalBezel
            ? 'p-6 sm:p-8 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black rounded-[28px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-zinc-800/80 ring-1 ring-zinc-700/40'
            : 'w-full max-w-5xl rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl'
        }`}
      >
        {/* Hardware Corner Screws & Markings (if bezel on) */}
        {showPhysicalBezel && (
          <>
            {/* Top Left Gold Mounting Screw */}
            <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-gradient-to-tr from-amber-700 via-yellow-500 to-amber-300 shadow-inner border border-amber-900/60 flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-amber-950 rotate-45" />
            </div>
            {/* Top Right Screw */}
            <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-gradient-to-tr from-amber-700 via-yellow-500 to-amber-300 shadow-inner border border-amber-900/60 flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-amber-950 -rotate-45" />
            </div>
            {/* Bottom Left Screw */}
            <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-gradient-to-tr from-amber-700 via-yellow-500 to-amber-300 shadow-inner border border-amber-900/60 flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-amber-950 rotate-12" />
            </div>
            {/* Bottom Right Screw */}
            <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-gradient-to-tr from-amber-700 via-yellow-500 to-amber-300 shadow-inner border border-amber-900/60 flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-amber-950 -rotate-30" />
            </div>

            {/* Hardware Branding & Power LED */}
            <div className="absolute top-2 inset-x-0 flex items-center justify-between px-10 text-[9px] font-mono text-zinc-500 uppercase tracking-widest pointer-events-none">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span>PWR / ESP32-S3</span>
              </div>
              <span className="text-zinc-400 font-semibold tracking-normal">Waveshare 7.0" Touch LCD (800×480 RGB)</span>
              <div className="flex items-center gap-1 text-zinc-500">
                <span>GT911</span>
              </div>
            </div>
          </>
        )}

        {/* The 800x480 Virtual LCD Display Area (Aspect Ratio 800:480 = 5:3) */}
        <div
          onClick={handleScreenTouch}
          style={{
            filter: `brightness(${brightness}%)`,
          }}
          className="relative w-full aspect-[5/3] max-w-[960px] bg-zinc-950 overflow-hidden select-none cursor-pointer flex flex-col rounded-lg border border-zinc-800 shadow-inner"
        >
          {/* Top Status & Sensor Bar (Rendered on LCD) */}
          <div className="h-7 bg-zinc-950 border-b border-zinc-800/80 px-3 flex items-center justify-between text-[11px] text-zinc-300 z-30 shrink-0">
            {/* Left: Device & Wi-Fi */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 text-emerald-400 font-medium">
                <Wifi className="w-3 h-3" />
                <span className="font-mono text-[10px]">HomeIoT-5G</span>
              </div>
              <span className="text-zinc-600">|</span>
              <div className="flex items-center gap-1 text-zinc-400">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Front Entry Guard</span>
              </div>
            </div>

            {/* Right: Weather & Time */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-200">
                <Thermometer className="w-3 h-3 text-amber-400" />
                <span>71°F Porch</span>
              </div>
              <span className="text-zinc-600">|</span>
              <div className="flex items-center gap-1 text-zinc-200 font-mono font-bold">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>ESPHome Live</span>
              </div>
            </div>
          </div>

          {/* Main LCD Content: Split Mode vs Fullscreen HUD Mode */}
          <div className="relative flex-1 w-full h-[calc(100%-28px)] overflow-hidden">
            {layoutMode === 'split' ? (
              // Split Layout: 65% CCTV Video Feed + 35% Smart Home Automation Touch Tiles
              <div className="w-full h-full flex flex-col md:flex-row">
                {/* Left 62% Camera Feed */}
                <div className="w-full md:w-[62%] h-1/2 md:h-full relative border-r border-zinc-800/80">
                  <CameraStreamView
                    config={config}
                    onUpdateConfig={onUpdateConfig}
                    onAddEvent={onAddEvent}
                    isDoorbellRinging={isDoorbellRinging}
                    onTriggerRing={onTriggerRing}
                    isNightMode={isNightMode}
                    onToggleNightMode={onToggleNightMode}
                  />
                </div>

                {/* Right 38% Touch Action Panel */}
                <div className="w-full md:w-[38%] h-1/2 md:h-full relative bg-zinc-950">
                  <QuickActionButtons
                    automations={automations}
                    onToggleAutomation={onToggleAutomation}
                    onAddEvent={onAddEvent}
                  />
                </div>
              </div>
            ) : (
              // Fullscreen Video with Floating HUD Edge Controls
              <div className="w-full h-full relative">
                <CameraStreamView
                  config={config}
                  onUpdateConfig={onUpdateConfig}
                  onAddEvent={onAddEvent}
                  isDoorbellRinging={isDoorbellRinging}
                  onTriggerRing={onTriggerRing}
                  isNightMode={isNightMode}
                  onToggleNightMode={onToggleNightMode}
                />

                {/* Floating Translucent Touch Controls Bar on Right Side */}
                <div className="absolute top-12 bottom-12 right-3 w-56 bg-zinc-950/85 backdrop-blur-md rounded-2xl border border-zinc-700/60 p-2 shadow-2xl z-30 overflow-y-auto custom-scrollbar">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 py-1 mb-1 border-b border-zinc-800">
                    Quick Access
                  </div>
                  <div className="space-y-1.5">
                    {automations.slice(0, 4).map((item) => {
                      const isActive = Boolean(item.state);
                      return (
                        <button
                          key={item.id}
                          id={`btn-hud-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleAutomation(item.id);
                          }}
                          className={`w-full p-2 rounded-lg text-left text-xs font-semibold flex items-center justify-between border transition ${
                            isActive
                              ? 'bg-zinc-800/90 text-white border-zinc-600'
                              : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-500'
                          }`}>
                            {isActive ? 'ON' : 'OFF'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Asleep / Screen Off Simulator Overlay */}
            {isAsleep && (
              <div
                onClick={handleScreenTouch}
                className="absolute inset-0 bg-black/98 z-50 flex flex-col items-center justify-center text-center p-6 cursor-pointer"
              >
                <Moon className="w-12 h-12 text-zinc-700 mb-3 animate-pulse" />
                <div className="text-zinc-300 text-sm font-semibold">Display in Low-Power Standby</div>
                <p className="text-zinc-500 text-xs mt-1">
                  Backlight PWM disabled • Tap anywhere on the 7" screen to wake instantly
                </p>
                <div className="mt-4 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
                  GT911 touch interrupt active
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bezel Bottom Screws / Label */}
        {showPhysicalBezel && (
          <div className="mt-2 text-center text-[9px] font-mono text-zinc-500 tracking-wider">
            ESPHome • LVGL v8 / v9 • 800×480 RGB 16-bit • Goodix GT911
          </div>
        )}
      </div>

      {/* Screen Brightness Slider under the display */}
      <div className="w-full max-w-5xl flex items-center justify-between mt-3 px-4 py-2 bg-zinc-900/60 border border-zinc-800/70 rounded-xl text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Screen Backlight (GPIO6 PWM):</span>
          <span className="text-white font-mono font-semibold">{brightness}%</span>
        </div>
        <div className="flex items-center gap-3 w-48">
          <input
            id="slider-backlight"
            type="range"
            min={20}
            max={100}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
