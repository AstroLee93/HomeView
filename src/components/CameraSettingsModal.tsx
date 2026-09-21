/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Camera, 
  Link, 
  Sliders, 
  Check, 
  HelpCircle, 
  Radio, 
  Sparkles, 
  Tv 
} from 'lucide-react';
import { CameraFeedConfig, StreamProtocol } from '../types';

interface CameraSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CameraFeedConfig;
  onSaveConfig: (updated: Partial<CameraFeedConfig>) => void;
}

export const CameraSettingsModal: React.FC<CameraSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [protocol, setProtocol] = useState<StreamProtocol>(config.protocol);
  const [customStreamUrl, setCustomStreamUrl] = useState<string>(config.customStreamUrl);
  const [aqaraRTSPUrl, setAqaraRTSPUrl] = useState<string>(config.aqaraRTSPUrl);
  const [mjpegProxyUrl, setMjpegProxyUrl] = useState<string>(config.mjpegProxyUrl);
  const [cameraName, setCameraName] = useState<string>(config.cameraName);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      protocol,
      customStreamUrl,
      aqaraRTSPUrl,
      mjpegProxyUrl,
      cameraName,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const setPresetGo2rtc = () => {
    setProtocol('mjpeg');
    setCustomStreamUrl('http://192.168.1.100:1984/api/stream.mjpeg?src=aqara_g400');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl text-zinc-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Camera className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Doorbell Video Feed Settings</h3>
              <p className="text-xs text-zinc-400">Configure simulated or live RTSP / MJPEG stream</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Stream Mode Selection */}
          <div>
            <label className="block font-semibold text-white mb-2">Stream Source Mode</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setProtocol('simulated')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                  protocol === 'simulated'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  {protocol === 'simulated' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="font-bold text-xs text-white">Simulated Porch</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Realistic CCTV canvas with motion &amp; IR</div>
              </button>

              <button
                type="button"
                onClick={() => setProtocol('mjpeg')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                  protocol === 'mjpeg'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Tv className="w-4 h-4 text-indigo-400" />
                  {protocol === 'mjpeg' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <div className="font-bold text-xs text-white">go2rtc MJPEG</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Best for ESP32-S3 (15–20 FPS)</div>
              </button>

              <button
                type="button"
                onClick={() => setProtocol('snapshot_poll')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                  protocol === 'snapshot_poll'
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  {protocol === 'snapshot_poll' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <div className="font-bold text-xs text-white">Image Polling</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Direct camera snapshot URL</div>
              </button>
            </div>
          </div>

          {/* Custom Stream URL input */}
          {protocol !== 'simulated' && (
            <div className="space-y-3 p-3.5 bg-zinc-950 rounded-xl border border-zinc-800">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-white">Live Stream URL (MJPEG / HTTP)</label>
                  <button
                    type="button"
                    onClick={setPresetGo2rtc}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Paste go2rtc preset
                  </button>
                </div>
                <input
                  type="text"
                  value={customStreamUrl}
                  onChange={(e) => setCustomStreamUrl(e.target.value)}
                  placeholder="http://192.168.1.100:1984/api/stream.mjpeg?src=aqara_g400"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-medium text-white block mb-1">Camera Display Title</label>
                <input
                  type="text"
                  value={cameraName}
                  onChange={(e) => setCameraName(e.target.value)}
                  placeholder="Aqara G400 Front Porch"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Doorbell RTSP Reference */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <label className="font-medium text-white block mb-1">Doorbell Native RTSP URL (Reference)</label>
            <input
              type="text"
              value={aqaraRTSPUrl}
              onChange={(e) => setAqaraRTSPUrl(e.target.value)}
              placeholder="rtsp://admin:password@192.168.1.55:554/live/ch0"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-zinc-300 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Used inside Home Assistant's go2rtc config to pull the raw stream from the Aqara G400.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium transition text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition text-xs shadow-lg"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{savedSuccess ? 'Saved!' : 'Save & Apply'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
