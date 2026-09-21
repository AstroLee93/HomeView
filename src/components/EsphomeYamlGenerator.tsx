/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Cpu, 
  Layers, 
  Sliders, 
  ExternalLink, 
  Terminal, 
  Info,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { EsphomeCustomSettings, HardwarePinout } from '../types';
import { DEFAULT_HARDWARE_PINOUT, generateEsphomeYaml } from '../data/defaultConfig';

interface EsphomeYamlGeneratorProps {
  settings: EsphomeCustomSettings;
  onUpdateSettings: (partial: Partial<EsphomeCustomSettings>) => void;
}

export const EsphomeYamlGenerator: React.FC<EsphomeYamlGeneratorProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'yaml' | 'pinout' | 'flashing'>('yaml');

  const yamlContent = generateEsphomeYaml(settings);

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadYaml = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${settings.nodeName}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-6 text-zinc-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <FileCode className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white">ESPHome Firmware Generator</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Production-ready configuration crafted for Waveshare ESP32-S3 Touch LCD 7" (800×480 RGB + GT911)
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            id="tab-btn-yaml"
            onClick={() => setActiveTab('yaml')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'yaml' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            ESPHome YAML
          </button>
          <button
            id="tab-btn-pinout"
            onClick={() => setActiveTab('pinout')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'pinout' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Hardware Pinout
          </button>
          <button
            id="tab-btn-flashing"
            onClick={() => setActiveTab('flashing')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'flashing' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Flashing Guide
          </button>
        </div>
      </div>

      {/* Sub-content based on active tab */}
      {activeTab === 'yaml' && (
        <div className="mt-5 space-y-6">
          {/* Settings Grid for Customizing the YAML */}
          <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Customize Entities &amp; Wi-Fi Parameters</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Wi-Fi SSID</label>
                <input
                  id="input-wifi-ssid"
                  type="text"
                  value={settings.wifiSsid}
                  onChange={(e) => onUpdateSettings({ wifiSsid: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Wi-Fi Password</label>
                <input
                  id="input-wifi-password"
                  type="password"
                  value={settings.wifiPassword}
                  onChange={(e) => onUpdateSettings({ wifiPassword: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Home Assistant IP</label>
                <input
                  id="input-ha-host"
                  type="text"
                  value={settings.haHost}
                  onChange={(e) => onUpdateSettings({ haHost: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Front Door Deadbolt Entity</label>
                <input
                  id="input-lock-entity"
                  type="text"
                  value={settings.lockEntityId}
                  onChange={(e) => onUpdateSettings({ lockEntityId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Porch Lights Entity</label>
                <input
                  id="input-light-entity"
                  type="text"
                  value={settings.porchLightEntityId}
                  onChange={(e) => onUpdateSettings({ porchLightEntityId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Doorbell go2rtc MJPEG URL</label>
                <input
                  id="input-go2rtc-url"
                  type="text"
                  value={settings.go2rtcUrl}
                  onChange={(e) => onUpdateSettings({ go2rtcUrl: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-white font-mono text-[11px] focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* YAML Code Display with Action Bar */}
          <div className="relative bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-xs">
              <span className="font-mono text-zinc-400">{settings.nodeName}.yaml</span>
              <div className="flex items-center gap-2">
                <button
                  id="btn-copy-yaml"
                  onClick={handleCopyYaml}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy YAML'}</span>
                </button>
                <button
                  id="btn-download-yaml"
                  onClick={handleDownloadYaml}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .yaml</span>
                </button>
              </div>
            </div>

            <pre className="p-4 text-[12px] font-mono leading-relaxed text-zinc-300 max-h-[440px] overflow-y-auto custom-scrollbar select-all">
              {yamlContent}
            </pre>
          </div>
        </div>
      )}

      {/* Hardware Pinout Tab */}
      {activeTab === 'pinout' && (
        <div className="mt-5 space-y-5 text-xs">
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Waveshare ESP32-S3 Touch LCD 7" Hardware Specs</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="text-zinc-400 text-[11px]">Resolution</div>
                <div className="text-white font-semibold text-sm">800 × 480 (5:3)</div>
              </div>
              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="text-zinc-400 text-[11px]">Panel Interface</div>
                <div className="text-white font-semibold text-sm">ST7262 RGB 16-Bit</div>
              </div>
              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="text-zinc-400 text-[11px]">Touch Controller</div>
                <div className="text-white font-semibold text-sm">Goodix GT911 (I2C)</div>
              </div>
              <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="text-zinc-400 text-[11px]">PSRAM / Flash</div>
                <div className="text-white font-semibold text-sm">8MB Octal / 16MB</div>
              </div>
            </div>
          </div>

          {/* Pin Connections Reference Table */}
          <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900 text-zinc-300 font-semibold border-b border-zinc-800">
                  <th className="p-3">Function</th>
                  <th className="p-3">ESP32-S3 GPIO</th>
                  <th className="p-3">Signal Name</th>
                  <th className="p-3">Component Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                <tr>
                  <td className="p-3 text-white font-sans font-medium">LCD Backlight</td>
                  <td className="p-3 text-amber-400 font-bold">GPIO 6</td>
                  <td className="p-3">PWM Dimming</td>
                  <td className="p-3 text-zinc-400 font-sans">LEDC 1200Hz</td>
                </tr>
                <tr>
                  <td className="p-3 text-white font-sans font-medium">Touchscreen I2C SDA</td>
                  <td className="p-3 text-cyan-400 font-bold">GPIO 19</td>
                  <td className="p-3">GT911 Data</td>
                  <td className="p-3 text-zinc-400 font-sans">I2C Bus 400kHz</td>
                </tr>
                <tr>
                  <td className="p-3 text-white font-sans font-medium">Touchscreen I2C SCL</td>
                  <td className="p-3 text-cyan-400 font-bold">GPIO 20</td>
                  <td className="p-3">GT911 Clock</td>
                  <td className="p-3 text-zinc-400 font-sans">I2C Bus 400kHz</td>
                </tr>
                <tr>
                  <td className="p-3 text-white font-sans font-medium">Touch Reset</td>
                  <td className="p-3 text-cyan-400 font-bold">GPIO 38</td>
                  <td className="p-3">RST</td>
                  <td className="p-3 text-zinc-400 font-sans">GT911 Hardware Reset</td>
                </tr>
                <tr>
                  <td className="p-3 text-white font-sans font-medium">RGB Pixel Clock</td>
                  <td className="p-3 text-indigo-400 font-bold">GPIO 8</td>
                  <td className="p-3">PCLK</td>
                  <td className="p-3 text-zinc-400 font-sans">ST7262 Dot Clock 16MHz</td>
                </tr>
                <tr>
                  <td className="p-3 text-white font-sans font-medium">RGB Data Enable</td>
                  <td className="p-3 text-indigo-400 font-bold">GPIO 18</td>
                  <td className="p-3">DE</td>
                  <td className="p-3 text-zinc-400 font-sans">RGB Timing</td>
                </tr>
                <tr>
                  <td className="p-3 text-white font-sans font-medium">RGB Vertical Sync</td>
                  <td className="p-3 text-indigo-400 font-bold">GPIO 17</td>
                  <td className="p-3">VSYNC</td>
                  <td className="p-3 text-zinc-400 font-sans">RGB Timing</td>
                </tr>
                <tr>
                  <td className="p-3 text-white font-sans font-medium">RGB Horizontal Sync</td>
                  <td className="p-3 text-indigo-400 font-bold">GPIO 16</td>
                  <td className="p-3">HSYNC</td>
                  <td className="p-3 text-zinc-400 font-sans">RGB Timing</td>
                </tr>
                <tr>
                  <td className="p-3 text-white font-sans font-medium">RGB Red Data Pins</td>
                  <td className="p-3 text-rose-400">GPIO 15, 7, 6, 5, 4</td>
                  <td className="p-3">R0 ~ R4</td>
                  <td className="p-3 text-zinc-400 font-sans">16-bit RGB565</td>
                </tr>
                <tr>
                  <td className="p-3 text-white font-sans font-medium">RGB Green Data Pins</td>
                  <td className="p-3 text-emerald-400">GPIO 9, 46, 3, 8, 18, 17</td>
                  <td className="p-3">G0 ~ G5</td>
                  <td className="p-3 text-zinc-400 font-sans">16-bit RGB565</td>
                </tr>
                <tr>
                  <td className="p-3 text-white font-sans font-medium">RGB Blue Data Pins</td>
                  <td className="p-3 text-blue-400">GPIO 14, 13, 12, 11, 10</td>
                  <td className="p-3">B0 ~ B4</td>
                  <td className="p-3 text-zinc-400 font-sans">16-bit RGB565</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Flashing Guide Tab */}
      {activeTab === 'flashing' && (
        <div className="mt-5 space-y-4 text-xs">
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
            <h4 className="font-bold text-white text-sm mb-2">Option A: Web Browser Flashing (Easiest)</h4>
            <ol className="list-decimal list-inside space-y-2 text-zinc-300">
              <li>Connect your Waveshare ESP32-S3 Touch LCD 7" to your PC via a USB-C data cable (use the port labeled <strong>USB</strong> or <strong>UART</strong>).</li>
              <li>Open <a href="https://web.esphome.io" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-semibold">web.esphome.io</a> in Google Chrome or Microsoft Edge.</li>
              <li>Click <strong>Connect</strong>, select the ESP32-S3 serial COM port, and flash the compiled binary or upload via the Home Assistant ESPHome Dashboard.</li>
            </ol>
          </div>

          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
            <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Option B: Command Line (ESPHome CLI)</span>
            </h4>
            <div className="p-3 bg-zinc-900 rounded-lg font-mono text-[11px] text-emerald-300">
              esphome run {settings.nodeName}.yaml
            </div>
            <p className="text-zinc-400 mt-2">
              The CLI compiles the ESP-IDF framework, links Octal PSRAM drivers, sets up the ST7262 RGB timings, and flashes over USB or OTA.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
