/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LayoutMode = 'split' | 'fullscreen_hud' | 'compact_grid';

export type StreamProtocol = 'simulated' | 'mjpeg' | 'hls' | 'snapshot_poll';

export interface AutomationItem {
  id: string;
  name: string;
  category: 'security' | 'lighting' | 'doorbell' | 'intercom';
  icon: string;
  entityId: string;
  actionType: 'toggle' | 'secure_action' | 'trigger' | 'voice_quick_reply' | 'slider';
  state: boolean | number | string;
  secondaryText?: string;
  color: string;
  activeColor: string;
  requiresConfirmation?: boolean;
  pinCode?: string;
  voiceText?: string;
  sliderValue?: number;
  lastTriggered?: string;
}

export interface CameraFeedConfig {
  protocol: StreamProtocol;
  customStreamUrl: string;
  aqaraRTSPUrl: string;
  mjpegProxyUrl: string;
  cameraName: string;
  showOverlayHud: boolean;
  showTimestamp: boolean;
  showBitrate: boolean;
  nightMode: boolean;
  audioIntercomActive: boolean;
  micMuted: boolean;
  speakerVolume: number;
  motionSensitivity: 'low' | 'medium' | 'high';
  recordingActive: boolean;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'doorbell_ring' | 'motion' | 'door_unlock' | 'door_lock' | 'light_toggle' | 'voice_reply' | 'alarm';
  title: string;
  detail: string;
  icon: string;
  badgeColor: string;
}

export interface HardwarePinout {
  board: string;
  screenResolution: string;
  panelController: string;
  touchController: string;
  psram: string;
  flash: string;
  pins: {
    backlight: number;
    i2cSda: number;
    i2cScl: number;
    touchInt: number;
    touchRst: number;
    pclk: number;
    de: number;
    vsync: number;
    hsync: number;
    dataR: number[];
    dataG: number[];
    dataB: number[];
  };
}

export interface EsphomeCustomSettings {
  nodeName: string;
  friendlyName: string;
  wifiSsid: string;
  wifiPassword: string;
  haHost: string;
  haPort: number;
  haApiPassword: string;
  go2rtcUrl: string;
  lockEntityId: string;
  porchLightEntityId: string;
  floodlightEntityId: string;
  doorbellChimeEntityId: string;
  motionSensorEntityId: string;
  enableMjpegStream: boolean;
  screenSleepSeconds: number;
  screenBrightnessPercent: number;
}
