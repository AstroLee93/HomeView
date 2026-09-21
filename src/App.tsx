/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Tv, 
  FileCode, 
  BookOpen, 
  History, 
  Settings, 
  BellRing, 
  Radio, 
  Cpu, 
  Layers, 
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';
import { DisplayPanel7Inch } from './components/DisplayPanel7Inch';
import { EsphomeYamlGenerator } from './components/EsphomeYamlGenerator';
import { AqaraSetupGuide } from './components/AqaraSetupGuide';
import { AutomationActivityLog } from './components/AutomationActivityLog';
import { CameraSettingsModal } from './components/CameraSettingsModal';
import { 
  DEFAULT_AUTOMATIONS, 
  DEFAULT_ACTIVITY_LOGS, 
  DEFAULT_ESPHOME_SETTINGS 
} from './data/defaultConfig';
import { 
  AutomationItem, 
  CameraFeedConfig, 
  ActivityEvent, 
  EsphomeCustomSettings, 
  LayoutMode 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'display' | 'esphome' | 'guide' | 'activity'>('display');
  const [automations, setAutomations] = useState<AutomationItem[]>(DEFAULT_AUTOMATIONS);
  const [events, setEvents] = useState<ActivityEvent[]>(DEFAULT_ACTIVITY_LOGS);
  const [esphomeSettings, setEsphomeSettings] = useState<EsphomeCustomSettings>(DEFAULT_ESPHOME_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDoorbellRinging, setIsDoorbellRinging] = useState<boolean>(false);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [showPhysicalBezel, setShowPhysicalBezel] = useState<boolean>(true);

  const [cameraConfig, setCameraConfig] = useState<CameraFeedConfig>({
    protocol: 'simulated',
    customStreamUrl: '',
    aqaraRTSPUrl: 'rtsp://admin:password@192.168.1.55:554/live/ch0',
    mjpegProxyUrl: 'http://192.168.1.100:1984/api/stream.mjpeg?src=aqara_g400',
    cameraName: 'Aqara G400 Front Porch',
    showOverlayHud: true,
    showTimestamp: true,
    showBitrate: true,
    nightMode: false,
    audioIntercomActive: true,
    micMuted: false,
    speakerVolume: 80,
    motionSensitivity: 'medium',
    recordingActive: true,
  });

  const handleUpdateConfig = (partial: Partial<CameraFeedConfig>) => {
    setCameraConfig((prev) => ({ ...prev, ...partial }));
  };

  const handleUpdateEsphomeSettings = (partial: Partial<EsphomeCustomSettings>) => {
    setEsphomeSettings((prev) => ({ ...prev, ...partial }));
  };

  const handleAddEvent = (eventData: Omit<ActivityEvent, 'id'>) => {
    const newEvent: ActivityEvent = {
      ...eventData,
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setEvents((prev) => [newEvent, ...prev.slice(0, 49)]);
  };

  const handleToggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, state: !item.state, lastTriggered: new Date().toLocaleTimeString() };
        }
        return item;
      })
    );
  };

  const handleTriggerDoorbellRing = () => {
    setIsDoorbellRinging(true);
    setTimeout(() => {
      setIsDoorbellRinging(false);
    }, 4500);
  };

  const handleApplyGo2rtcUrl = (url: string) => {
    setCameraConfig((prev) => ({
      ...prev,
      protocol: 'mjpeg',
      customStreamUrl: url,
    }));
    setActiveTab('display');
    handleAddEvent({
      timestamp: 'Just now',
      type: 'motion',
      title: 'Stream URL Configured',
      detail: 'Switched to go2rtc MJPEG stream endpoint',
      icon: 'Camera',
      badgeColor: 'sky',
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/90 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & Hardware Identity */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white rounded-xl shadow-md shrink-0">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  Front Porch CCTV Monitor &amp; Control Panel
                </h1>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-700/60 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  ESPHome Live
                </span>
              </div>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                <span>Waveshare ESP32-S3 Touch LCD 7"</span>
                <span className="text-zinc-600">•</span>
                <span>Aqara G400 Doorbell Feed</span>
                <span className="text-zinc-600">•</span>
                <span>800×480 RGB</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <nav className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs font-medium">
              <button
                id="nav-tab-display"
                onClick={() => setActiveTab('display')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'display'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>7" Display Panel</span>
              </button>

              <button
                id="nav-tab-esphome"
                onClick={() => setActiveTab('esphome')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'esphome'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>ESPHome Firmware</span>
              </button>

              <button
                id="nav-tab-guide"
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'guide'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Aqara RTSP Guide</span>
              </button>

              <button
                id="nav-tab-activity"
                onClick={() => setActiveTab('activity')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'activity'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Activity Log</span>
              </button>
            </nav>

            {/* Quick Test Doorbell Ring Button */}
            <button
              id="header-btn-test-chime"
              onClick={handleTriggerDoorbellRing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow border border-indigo-400/40"
              title="Simulate someone pushing the Aqara G400 doorbell button"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ring Doorbell</span>
            </button>

            {/* Stream Settings Modal Toggle */}
            <button
              id="header-btn-stream-settings"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-zinc-800 transition"
              title="Configure Camera Stream URL & Audio"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-start">
        {activeTab === 'display' && (
          <DisplayPanel7Inch
            config={cameraConfig}
            onUpdateConfig={handleUpdateConfig}
            automations={automations}
            onToggleAutomation={handleToggleAutomation}
            onAddEvent={handleAddEvent}
            isDoorbellRinging={isDoorbellRinging}
            onTriggerRing={handleTriggerDoorbellRing}
            isNightMode={isNightMode}
            onToggleNightMode={() => setIsNightMode(!isNightMode)}
            layoutMode={layoutMode}
            onChangeLayout={setLayoutMode}
            showPhysicalBezel={showPhysicalBezel}
            onToggleBezel={() => setShowPhysicalBezel(!showPhysicalBezel)}
          />
        )}

        {activeTab === 'esphome' && (
          <EsphomeYamlGenerator
            settings={esphomeSettings}
            onUpdateSettings={handleUpdateEsphomeSettings}
          />
        )}

        {activeTab === 'guide' && (
          <AqaraSetupGuide onApplyGo2rtcUrl={handleApplyGo2rtcUrl} />
        )}

        {activeTab === 'activity' && (
          <AutomationActivityLog
            events={events}
            onClearEvents={() => setEvents([])}
          />
        )}
      </main>

      {/* Camera Stream Settings Modal */}
      <CameraSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={cameraConfig}
        onSaveConfig={handleUpdateConfig}
      />

      {/* Footer Info */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 px-6 text-center text-xs text-zinc-500 font-mono">
        Dedicated Front Porch CCTV Monitor &bull; Waveshare ESP32-S3 Touch LCD 7" &bull; Goodix GT911 &bull; ST7262 16-Bit RGB &bull; Aqara G400 RTSP Feed
      </footer>
    </div>
  );
}
