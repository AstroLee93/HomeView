/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Camera, 
  Video, 
  Settings, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Tv, 
  ExternalLink,
  Zap,
  Info
} from 'lucide-react';

interface AqaraSetupGuideProps {
  onApplyGo2rtcUrl: (url: string) => void;
}

export const AqaraSetupGuide: React.FC<AqaraSetupGuideProps> = ({
  onApplyGo2rtcUrl,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const go2rtcConfig = `streams:
  aqara_g400:
    - rtsp://admin:your_password@192.168.1.55:554/live/ch0
    # Or substream for faster loading:
    # - rtsp://admin:your_password@192.168.1.55:554/live/ch1`;

  const haAutomation = `alias: "Doorbell Ring - Wake 7-Inch Display & Popup Camera"
trigger:
  - platform: state
    entity_id: binary_sensor.aqara_g400_doorbell_ring
    to: "on"
action:
  # 1. Turn on Waveshare LCD backlight to 100%
  - service: light.turn_on
    target:
      entity_id: light.entryway_display_7in_backlight
    data:
      brightness_pct: 100

  # 2. Switch LVGL display page to Fullscreen Camera
  - service: esphome.entryway_display_7in_show_fullscreen_camera

  # 3. Sound home chime
  - service: switch.turn_on
    target:
      entity_id: switch.aqara_g400_chime_sound
mode: restart`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  return (
    <div className="w-full max-w-5xl bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-6 text-zinc-300">
      {/* Title */}
      <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
        <span className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg">
          <Video className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-white">Aqara G400 RTSP &amp; Home Assistant Integration</h2>
          <p className="text-xs text-zinc-400">
            How to stream the doorbell feed to the ESP32-S3 with zero latency and high frame rate
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-6 text-xs leading-relaxed">
        {/* Step 1: Enable RTSP on Aqara G400 */}
        <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
            <span>Enable Local RTSP on your Aqara G400 Doorbell</span>
          </div>
          <p className="text-zinc-300">
            The Aqara G400 supports standalone local RTSP streaming directly over your home Wi-Fi network without cloud latency.
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-zinc-400">
            <li>Open the <strong>Aqara Home</strong> app on your phone.</li>
            <li>Go to <strong>Aqara G400 Doorbell</strong> &gt; <strong>Device Settings</strong> &gt; <strong>Function Settings</strong> &gt; <strong>RTSP Stream</strong>.</li>
            <li>Toggle <strong>RTSP Stream</strong> ON, set a secure username and password, and note your doorbell's local IP address (e.g. <code className="text-amber-300 font-mono">192.168.1.55</code>).</li>
          </ul>
          <div className="mt-3 p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-300 flex items-center justify-between">
            <span>rtsp://admin:password@192.168.1.55:554/live/ch0</span>
            <button
              onClick={() => handleCopy('rtsp://admin:password@192.168.1.55:554/live/ch0', 'rtsp_url')}
              className="text-indigo-400 hover:text-indigo-300 font-sans text-xs flex items-center gap-1"
            >
              {copiedSection === 'rtsp_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'rtsp_url' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Step 2: Why go2rtc MJPEG is essential for ESP32-S3 */}
        <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
            <span className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs">2</span>
            <span>Configure go2rtc in Home Assistant (For 15–20 FPS on ESP32-S3)</span>
          </div>
          <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg text-amber-200 mb-3 flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Why not direct H.264 RTSP on the ESP32?</strong>
              <p className="text-[11px] text-amber-300/90 mt-0.5">
                The ESP32-S3 is a microcontroller without an ASIC hardware H.264 video decoder. Decoding raw 1080p H.264 in software would overload the CPU and cause stutter.
                By converting the RTSP feed into an <strong>MJPEG stream via Home Assistant's built-in go2rtc</strong>, the Waveshare ESP32-S3's hardware JPEG decoder and 8MB Octal PSRAM display the video smoothly at 15–20 FPS!
              </p>
            </div>
          </div>

          <p className="text-zinc-300 mb-2">
            Add this to your Home Assistant <code className="text-indigo-300 font-mono">go2rtc.yaml</code> (or under WebRTC Camera integration):
          </p>
          <div className="relative bg-zinc-900 rounded-lg border border-zinc-800 p-3 font-mono text-[11px] text-cyan-300">
            <button
              onClick={() => handleCopy(go2rtcConfig, 'go2rtc')}
              className="absolute top-2 right-2 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] flex items-center gap-1 font-sans"
            >
              {copiedSection === 'go2rtc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSection === 'go2rtc' ? 'Copied' : 'Copy'}</span>
            </button>
            <pre className="overflow-x-auto">{go2rtcConfig}</pre>
          </div>

          <div className="mt-3 flex items-center justify-between p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800 text-[11px]">
            <div>
              <span className="text-zinc-400">Stream endpoint for your ESPHome display:</span>
              <div className="font-mono text-emerald-400 mt-0.5">
                http://[YOUR_HA_IP]:1984/api/stream.mjpeg?src=aqara_g400
              </div>
            </div>
            <button
              onClick={() => onApplyGo2rtcUrl('http://192.168.1.100:1984/api/stream.mjpeg?src=aqara_g400')}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium transition shrink-0 ml-3"
            >
              Set as Test Stream
            </button>
          </div>
        </div>

        {/* Step 3: Home Assistant Automation */}
        <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">3</span>
            <span>Home Assistant Automation (Wake Screen on Doorbell Press)</span>
          </div>
          <p className="text-zinc-300 mb-2">
            When someone pushes the Aqara G400 button or approaches the porch, Home Assistant automatically commands the 7" display to illuminate and show the visitor:
          </p>
          <div className="relative bg-zinc-900 rounded-lg border border-zinc-800 p-3 font-mono text-[11px] text-zinc-300">
            <button
              onClick={() => handleCopy(haAutomation, 'ha_auto')}
              className="absolute top-2 right-2 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] flex items-center gap-1 font-sans"
            >
              {copiedSection === 'ha_auto' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSection === 'ha_auto' ? 'Copied' : 'Copy'}</span>
            </button>
            <pre className="overflow-x-auto">{haAutomation}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
