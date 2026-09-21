/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Moon, 
  Sun, 
  RefreshCw, 
  Maximize2, 
  Radio, 
  ShieldAlert,
  Sparkles,
  CameraOff,
  BellRing
} from 'lucide-react';
import { CameraFeedConfig, ActivityEvent } from '../types';

interface CameraStreamViewProps {
  config: CameraFeedConfig;
  onUpdateConfig: (partial: Partial<CameraFeedConfig>) => void;
  onAddEvent: (event: Omit<ActivityEvent, 'id'>) => void;
  isDoorbellRinging: boolean;
  onTriggerRing: () => void;
  isNightMode: boolean;
  onToggleNightMode: () => void;
}

export const CameraStreamView: React.FC<CameraStreamViewProps> = ({
  config,
  onUpdateConfig,
  onAddEvent,
  isDoorbellRinging,
  onTriggerRing,
  isNightMode,
  onToggleNightMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streamError, setStreamError] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [bitrate, setBitrate] = useState<string>('2.4 Mbps');
  const [fps, setFps] = useState<number>(24);
  const [motionBox, setMotionBox] = useState<{ x: number; y: number; w: number; h: number; opacity: number } | null>(null);
  const [motionActive, setMotionActive] = useState(false);
  const [snapshotFlash, setSnapshotFlash] = useState(false);

  // Time updater for CCTV OSD
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0')
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Periodic simulated motion detection on porch (like trees or visitor approaching)
  useEffect(() => {
    if (config.protocol !== 'simulated') return;

    const interval = setInterval(() => {
      // 30% chance of motion event
      if (Math.random() > 0.65) {
        setMotionActive(true);
        setMotionBox({
          x: 220 + Math.random() * 80,
          y: 140 + Math.random() * 40,
          w: 160 + Math.random() * 40,
          h: 180 + Math.random() * 30,
          opacity: 1,
        });

        // Decay motion box
        setTimeout(() => {
          setMotionActive(false);
        }, 4000);
      }
    }, 9000);

    return () => clearInterval(interval);
  }, [config.protocol]);

  // Canvas drawing for realistic porch CCTV feed
  useEffect(() => {
    if (config.protocol !== 'simulated') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let tick = 0;

    const render = () => {
      tick += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // Background Porch Architecture
      ctx.save();

      if (isNightMode) {
        // Infrared night vision look (grayscale with IR highlight)
        ctx.fillStyle = '#101416';
        ctx.fillRect(0, 0, width, height);

        // Ambient IR gradient
        const irGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.7);
        irGrad.addColorStop(0, '#2d3748');
        irGrad.addColorStop(0.5, '#1a202c');
        irGrad.addColorStop(1, '#0d1117');
        ctx.fillStyle = irGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Daytime warm outdoor lighting
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#78909c');
        skyGrad.addColorStop(0.4, '#b0bec5');
        skyGrad.addColorStop(0.42, '#cfd8dc');
        skyGrad.addColorStop(1, '#90a4ae');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Porch Ceiling / Overhang
      ctx.fillStyle = isNightMode ? '#1e242d' : '#37474f';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, 55);
      ctx.lineTo(0, 55);
      ctx.closePath();
      ctx.fill();

      // Ceiling recessed light spot
      ctx.fillStyle = isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 240, 200, 0.35)';
      ctx.beginPath();
      ctx.arc(width * 0.5, 45, 12, 0, Math.PI * 2);
      ctx.fill();

      // Left Pillar / Arch
      ctx.fillStyle = isNightMode ? '#28303d' : '#455a64';
      ctx.fillRect(0, 0, 90, height);
      // Right Pillar
      ctx.fillRect(width - 90, 0, 90, height);

      // Porch Wooden Deck / Floor with perspective lines
      ctx.fillStyle = isNightMode ? '#1c222a' : '#546e7a';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.65);
      ctx.lineTo(width, height * 0.65);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Floor plank grooves
      ctx.strokeStyle = isNightMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 7; i++) {
        const yPos = height * 0.65 + i * 22;
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(width, yPos);
        ctx.stroke();
      }

      // Front Lawn / Garden in distance
      ctx.fillStyle = isNightMode ? '#182026' : '#556b2f';
      ctx.fillRect(90, height * 0.4, width - 180, height * 0.25);

      // Garden pathway stepping stones
      ctx.fillStyle = isNightMode ? '#34404d' : '#8d99ae';
      for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        const stoneY = height * 0.43 + j * 24;
        const stoneX = width * 0.5 + Math.sin(j * 1.5) * 15;
        ctx.ellipse(stoneX, stoneY, 28 - j * 2, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Foliage / bushes moving with wind
      const windSway = Math.sin(tick) * 4;
      ctx.fillStyle = isNightMode ? '#202b33' : '#335022';
      // Left bush
      ctx.beginPath();
      ctx.arc(110 + windSway, height * 0.48, 30, 0, Math.PI * 2);
      ctx.arc(140 + windSway * 0.8, height * 0.46, 26, 0, Math.PI * 2);
      ctx.fill();
      // Right bush
      ctx.beginPath();
      ctx.arc(width - 130 - windSway, height * 0.48, 28, 0, Math.PI * 2);
      ctx.arc(width - 105 - windSway * 0.8, height * 0.47, 24, 0, Math.PI * 2);
      ctx.fill();

      // Front Door Mat with "WELCOME"
      ctx.fillStyle = isNightMode ? '#222932' : '#2b2d42';
      ctx.beginPath();
      ctx.roundRect(width * 0.36, height * 0.72, width * 0.28, 55, 6);
      ctx.fill();

      ctx.strokeStyle = isNightMode ? '#3b4754' : '#8d99ae';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = isNightMode ? '#64748b' : '#cbd5e1';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('WELCOME', width * 0.5, height * 0.72 + 32);

      // Package Box on porch (if delivery present)
      ctx.fillStyle = isNightMode ? '#3a424e' : '#c99a5e';
      ctx.beginPath();
      ctx.roundRect(width * 0.28, height * 0.69, 58, 44, 3);
      ctx.fill();
      // Package tape
      ctx.fillStyle = isNightMode ? '#4b5563' : '#b08447';
      ctx.fillRect(width * 0.28 + 24, height * 0.69, 10, 44);

      // Subtle CCTV Grain / Scanlines
      ctx.fillStyle = isNightMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }

      ctx.restore();
      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [config.protocol, isNightMode]);

  // Audio trigger test ring using Web Audio API
  const handleRingDoorbell = () => {
    onTriggerRing();
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const now = audioCtx.currentTime;

      // Ding (Higher pitch)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 1.2);

      // Dong (Lower pitch)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.35); // E5
      gain2.gain.setValueAtTime(0.35, now + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.35);
      osc2.stop(now + 1.8);
    } catch {
      // Audio context might be blocked if unprimed
    }

    onAddEvent({
      timestamp: 'Just now',
      type: 'doorbell_ring',
      title: 'Aqara G400 Doorbell Pressed',
      detail: 'Chime sounded at 80dB • Wake signal sent to screen',
      icon: 'BellRing',
      badgeColor: 'indigo'
    });
  };

  const handleCaptureSnapshot = () => {
    setSnapshotFlash(true);
    setTimeout(() => setSnapshotFlash(false), 200);

    onAddEvent({
      timestamp: 'Just now',
      type: 'motion',
      title: 'Manual Snapshot Captured',
      detail: 'Saved to local Home Assistant media library',
      icon: 'Camera',
      badgeColor: 'sky'
    });
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center select-none">
      {/* Video Content Canvas or Custom Stream */}
      {config.protocol === 'simulated' ? (
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          className={`w-full h-full object-cover transition-filter duration-500 ${
            isNightMode ? 'contrast-125 brightness-90' : ''
          }`}
        />
      ) : config.protocol === 'mjpeg' || config.protocol === 'snapshot_poll' ? (
        <img
          src={config.customStreamUrl || config.mjpegProxyUrl}
          alt="Aqara G400 Doorbell Stream"
          className="w-full h-full object-cover"
          onError={() => setStreamError(true)}
          onLoad={() => setStreamError(false)}
        />
      ) : (
        <video
          src={config.customStreamUrl}
          autoPlay
          playsInline
          muted
          loop
          className="w-full h-full object-cover"
          onError={() => setStreamError(true)}
        />
      )}

      {/* Snapshot Shutter Flash Effect */}
      {snapshotFlash && (
        <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-200 pointer-events-none" />
      )}

      {/* Stream Error Fallback Notice */}
      {streamError && (
        <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center p-6 text-center text-zinc-300 z-30">
          <CameraOff className="w-12 h-12 text-rose-400 mb-3" />
          <h4 className="text-base font-semibold text-white">Video Stream Unavailable</h4>
          <p className="text-xs text-zinc-400 max-w-sm mt-1">
            Could not connect to URL: <code className="text-amber-300 text-[11px] break-all">{config.customStreamUrl}</code>.
            Switch back to <span className="text-emerald-400 font-medium">Simulated Porch</span> or check Home Assistant go2rtc settings.
          </p>
          <button
            id="btn-fallback-simulated"
            onClick={() => {
              setStreamError(false);
              onUpdateConfig({ protocol: 'simulated' });
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold rounded-lg shadow transition"
          >
            Switch to Simulated Porch Feed
          </button>
        </div>
      )}

      {/* Real-time PIR Motion Detection Bounding Box */}
      {motionActive && motionBox && (
        <div
          className="absolute border-2 border-amber-400/90 rounded bg-amber-500/10 pointer-events-none transition-all duration-300 z-20 flex flex-col justify-between p-1.5 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          style={{
            left: `${(motionBox.x / 800) * 100}%`,
            top: `${(motionBox.y / 480) * 100}%`,
            width: `${(motionBox.w / 800) * 100}%`,
            height: `${(motionBox.h / 480) * 100}%`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="bg-amber-500 text-zinc-950 font-bold text-[9px] px-1 py-0.2 rounded uppercase tracking-wider">
              Person 94%
            </span>
            <span className="text-amber-300 text-[9px] font-mono">PIR #1</span>
          </div>
          <div className="flex justify-end">
            <div className="w-2.5 h-2.5 border-r border-b border-amber-400" />
          </div>
        </div>
      )}

      {/* Doorbell Ringing Alert Overlay Banner */}
      {isDoorbellRinging && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-indigo-600/95 text-white px-5 py-2.5 rounded-full shadow-2xl border border-indigo-400/50 flex items-center gap-3 animate-bounce">
          <div className="p-1.5 bg-white/20 rounded-full animate-spin">
            <BellRing className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider">Doorbell Ringing!</div>
            <div className="text-[11px] text-indigo-100">Visitor at the front door</div>
          </div>
        </div>
      )}

      {/* CCTV OSD Overlay (Top Bar) */}
      <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-xs text-white z-20 font-mono tracking-tight pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-md px-2.5 py-1 rounded border border-zinc-700/50">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold text-[11px] text-red-400">REC</span>
            <span className="text-zinc-400 text-[11px]">|</span>
            <span className="text-zinc-200 text-[11px] font-semibold tracking-normal">Aqara G400</span>
          </div>

          {isNightMode ? (
            <span className="flex items-center gap-1 bg-zinc-800/90 text-zinc-300 px-2 py-1 rounded text-[10px] border border-zinc-700/60 font-sans font-medium">
              <Moon className="w-3 h-3 text-cyan-300" /> IR Night Vision
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-zinc-800/90 text-amber-200 px-2 py-1 rounded text-[10px] border border-zinc-700/60 font-sans font-medium">
              <Sun className="w-3 h-3 text-amber-400" /> Day (Color)
            </span>
          )}

          {config.protocol === 'simulated' ? (
            <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 text-[10px] px-2 py-0.5 rounded font-sans font-semibold">
              HD Simulation
            </span>
          ) : (
            <span className="bg-blue-950/80 text-blue-400 border border-blue-700/60 text-[10px] px-2 py-0.5 rounded font-sans font-semibold">
              Live {config.protocol.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-zinc-300">
            <span className="text-zinc-400">{bitrate}</span>
            <span className="text-zinc-600">•</span>
            <span>{fps} FPS</span>
            <span className="text-zinc-600">•</span>
          </div>
          <span className="bg-zinc-900/90 text-amber-300 px-2 py-1 rounded border border-zinc-700/50 text-[11px] font-mono font-semibold">
            {currentTime}
          </span>
        </div>
      </div>

      {/* CCTV OSD Overlay (Bottom Controls HUD) */}
      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center justify-between z-20 pointer-events-auto">
        {/* Left Quick Camera Controls */}
        <div className="flex items-center gap-2">
          {/* Test Ring Button */}
          <button
            id="btn-test-ring"
            onClick={handleRingDoorbell}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/90 hover:bg-indigo-500 active:scale-95 text-white rounded-lg text-xs font-bold shadow-lg transition backdrop-blur-md border border-indigo-400/40"
            title="Simulate visitor pressing Aqara doorbell button"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Test Chime</span>
          </button>

          {/* Night Mode Toggle */}
          <button
            id="btn-toggle-night"
            onClick={onToggleNightMode}
            className={`p-2 rounded-lg text-xs transition border ${
              isNightMode
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-zinc-900/80 text-zinc-300 hover:text-white border-zinc-700/50'
            }`}
            title="Toggle IR Night Mode"
          >
            {isNightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Snapshot Button */}
          <button
            id="btn-capture-snapshot"
            onClick={handleCaptureSnapshot}
            className="p-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs transition border border-zinc-700/50"
            title="Capture Instant Camera Snapshot"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Audio Intercom Status */}
        <div className="flex items-center gap-2 bg-zinc-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-700/60 text-xs text-zinc-300">
          <button
            id="btn-toggle-speaker"
            onClick={() => onUpdateConfig({ micMuted: !config.micMuted })}
            className={`p-1 rounded transition ${
              config.micMuted ? 'text-rose-400 hover:text-rose-300' : 'text-emerald-400 hover:text-emerald-300'
            }`}
            title={config.micMuted ? 'Unmute 2-way microphone' : 'Mute 2-way microphone'}
          >
            {config.micMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[11px] font-medium text-zinc-300">
            {config.micMuted ? 'Mic Muted' : '2-Way Intercom Ready'}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
