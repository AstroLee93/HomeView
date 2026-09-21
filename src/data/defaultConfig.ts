/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AutomationItem, HardwarePinout, EsphomeCustomSettings, ActivityEvent } from '../types';

export const DEFAULT_HARDWARE_PINOUT: HardwarePinout = {
  board: 'Waveshare ESP32-S3 Touch LCD 7 (800x480)',
  screenResolution: '800 x 480 pixels (16:9 widescreen)',
  panelController: 'ST7262 RGB 16-bit 565 Parallel Bus',
  touchController: 'Goodix GT911 Capacitive Touch (I2C)',
  psram: '8MB Octal PSRAM (OPI Mode, High Performance)',
  flash: '16MB QSPI Flash',
  pins: {
    backlight: 6,
    i2cSda: 19,
    i2cScl: 20,
    touchInt: -1, // Not strictly required or GPIO 38
    touchRst: 38,
    pclk: 8,
    de: 18,
    vsync: 17,
    hsync: 16,
    dataR: [15, 7, 6, 5, 4],     // R0-R4 (or standard 5-bit Red)
    dataG: [9, 46, 3, 8, 18, 17], // G0-G5
    dataB: [14, 13, 12, 11, 10],  // B0-B4
  }
};

export const DEFAULT_AUTOMATIONS: AutomationItem[] = [
  {
    id: 'front_door_lock',
    name: 'Front Door Lock',
    category: 'security',
    icon: 'Lock',
    entityId: 'lock.front_door_deadbolt',
    actionType: 'secure_action',
    state: true, // true = Locked, false = Unlocked
    secondaryText: 'Tap & hold to unlock',
    color: 'emerald',
    activeColor: 'rose',
    requiresConfirmation: true,
  },
  {
    id: 'porch_sconces',
    name: 'Porch Sconces',
    category: 'lighting',
    icon: 'Lamp',
    entityId: 'light.front_porch_sconces',
    actionType: 'toggle',
    state: true, // true = On
    secondaryText: 'Warm White • 80%',
    color: 'amber',
    activeColor: 'amber',
  },
  {
    id: 'walkway_floodlight',
    name: 'Entry Floodlight',
    category: 'lighting',
    icon: 'Sun',
    entityId: 'light.walkway_floodlights',
    actionType: 'toggle',
    state: false,
    secondaryText: 'Auto motion mode',
    color: 'sky',
    activeColor: 'sky',
  },
  {
    id: 'doorbell_chime',
    name: 'Doorbell Chime',
    category: 'doorbell',
    icon: 'Bell',
    entityId: 'switch.aqara_g400_chime_sound',
    actionType: 'toggle',
    state: true, // true = enabled, false = DND muted
    secondaryText: 'Chime Active (DND Off)',
    color: 'indigo',
    activeColor: 'indigo',
  },
  {
    id: 'parcel_guard',
    name: 'Package Drop Guard',
    category: 'security',
    icon: 'PackageCheck',
    entityId: 'input_boolean.porch_package_guard',
    actionType: 'toggle',
    state: true,
    secondaryText: 'Porch camera alert armed',
    color: 'emerald',
    activeColor: 'emerald',
  },
  {
    id: 'voice_reply_package',
    name: 'Leave at Door',
    category: 'intercom',
    icon: 'Package',
    entityId: 'script.aqara_doorbell_say_leave_package',
    actionType: 'voice_quick_reply',
    state: false,
    voiceText: 'Please leave the package by the front door. Thank you!',
    secondaryText: 'Plays through Aqara G400 speaker',
    color: 'teal',
    activeColor: 'teal',
  },
  {
    id: 'voice_reply_coming',
    name: 'Coming to Door',
    category: 'intercom',
    icon: 'Footprints',
    entityId: 'script.aqara_doorbell_say_coming',
    actionType: 'voice_quick_reply',
    state: false,
    voiceText: 'One moment please, coming to the door now!',
    secondaryText: 'Plays through Aqara G400 speaker',
    color: 'blue',
    activeColor: 'blue',
  },
  {
    id: 'siren_deterrent',
    name: 'Deterrent Alarm',
    category: 'security',
    icon: 'ShieldAlert',
    entityId: 'siren.aqara_g400_deterrent_siren',
    actionType: 'secure_action',
    state: false,
    secondaryText: 'Flash lights & sound siren',
    color: 'rose',
    activeColor: 'rose',
    requiresConfirmation: true,
  }
];

export const DEFAULT_ACTIVITY_LOGS: ActivityEvent[] = [
  {
    id: 'act_1',
    timestamp: 'Just now',
    type: 'motion',
    title: 'PIR Motion Detected',
    detail: 'Aqara G400 front porch zone',
    icon: 'Eye',
    badgeColor: 'amber'
  },
  {
    id: 'act_2',
    timestamp: '14 min ago',
    type: 'doorbell_ring',
    title: 'Doorbell Rang',
    detail: 'Chime sounded • Video recording saved',
    icon: 'BellRing',
    badgeColor: 'indigo'
  },
  {
    id: 'act_3',
    timestamp: '42 min ago',
    type: 'door_lock',
    title: 'Front Deadbolt Locked',
    detail: 'Auto-relock timeout triggered',
    icon: 'Lock',
    badgeColor: 'emerald'
  },
  {
    id: 'act_4',
    timestamp: '1 hr ago',
    type: 'voice_reply',
    title: 'Quick Voice Reply Sent',
    detail: '"Please leave the package by the front door"',
    icon: 'Mic',
    badgeColor: 'teal'
  }
];

export const DEFAULT_ESPHOME_SETTINGS: EsphomeCustomSettings = {
  nodeName: 'entryway-display-7in',
  friendlyName: 'Front Porch 7-Inch Monitor',
  wifiSsid: 'MyHomeWiFi_IoT',
  wifiPassword: 'your_secret_wifi_password',
  haHost: '192.168.1.100',
  haPort: 8123,
  haApiPassword: '',
  go2rtcUrl: 'http://192.168.1.100:1984/api/stream.mjpeg?src=aqara_g400',
  lockEntityId: 'lock.front_door_deadbolt',
  porchLightEntityId: 'light.front_porch_sconces',
  floodlightEntityId: 'light.walkway_floodlights',
  doorbellChimeEntityId: 'switch.aqara_g400_chime_sound',
  motionSensorEntityId: 'binary_sensor.aqara_g400_motion',
  enableMjpegStream: true,
  screenSleepSeconds: 120,
  screenBrightnessPercent: 85,
};

export function generateEsphomeYaml(settings: EsphomeCustomSettings): string {
  return `substitutions:
  name: "${settings.nodeName}"
  friendly_name: "${settings.friendlyName}"

esphome:
  name: \${name}
  friendly_name: \${friendly_name}
  platformio_options:
    board_build.flash_mode: dio
    board_build.f_flash: 80000000L
    board_build.f_cpu: 240000000L

esp32:
  board: esp32-s3-devkitc-1
  variant: esp32s3
  framework:
    type: esp-idf

psram:
  mode: octal
  speed: 80MHz

# --- Wi-Fi & Home Assistant API Connection ---
wifi:
  ssid: "${settings.wifiSsid}"
  password: "${settings.wifiPassword}"
  fast_connect: true
  power_save_mode: none

api:
  encryption:
    key: "GENERATED_32_BYTE_BASE64_KEY_REPLACE_ME"
  reboot_timeout: 0s

ota:
  - platform: esphome

logger:
  level: INFO

# --- Waveshare ESP32-S3 Touch LCD 7" Backlight (PWM) ---
output:
  - platform: ledc
    pin: GPIO6
    id: backlight_pwm
    frequency: 1200Hz

light:
  - platform: monochromatic
    output: backlight_pwm
    name: "\${friendly_name} Backlight"
    id: screen_backlight
    restore_mode: ALWAYS_ON
    default_transition_length: 200ms

# --- I2C Bus & Goodix GT911 Capacitive Touch Controller ---
i2c:
  sda: GPIO19
  scl: GPIO20
  frequency: 400kHz
  id: bus_a

touchscreen:
  - platform: gt911
    i2c_id: bus_a
    interrupt_pin: GPIO-1
    reset_pin: GPIO38
    display: waveshare_rgb_display
    on_touch:
      - lambda: |-
          // Reset screen sleep timer on touch interaction
          id(screen_sleep_timer).reset();
          if (!id(screen_backlight).current_values.is_on()) {
            auto call = id(screen_backlight).turn_on();
            call.set_brightness(${settings.screenBrightnessPercent / 100.0});
            call.perform();
          }

# --- Waveshare 7-Inch 800x480 RGB ST7262 Panel Driver ---
display:
  - platform: rpi_dpi_rgb
    id: waveshare_rgb_display
    dimensions:
      width: 800
      height: 480
    de_pin: GPIO18
    vsync_pin: GPIO17
    hsync_pin: GPIO16
    pclk_pin: GPIO8
    pclk_frequency: 16000000Hz
    data_pins:
      red: [GPIO15, GPIO7, GPIO6, GPIO5, GPIO4]
      green: [GPIO9, GPIO46, GPIO3, GPIO8, GPIO18, GPIO17]
      blue: [GPIO14, GPIO13, GPIO12, GPIO11, GPIO10]
    timings:
      hsync:
        pulse_width: 4
        back_porch: 43
        front_porch: 8
      vsync:
        pulse_width: 4
        back_porch: 12
        front_porch: 8

# --- LVGL Graphical Framework for Touch Buttons & Video Window ---
lvgl:
  displays:
    - display_id: waveshare_rgb_display
  touchscreens:
    - touchscreen_id: gt911_touch
  buffer_size: 40%
  color_depth: 16

# --- Home Assistant Entity Tracking & Actions ---
sensor:
  - platform: homeassistant
    id: ha_porch_temp
    entity_id: sensor.front_porch_temperature

binary_sensor:
  - platform: homeassistant
    id: ha_motion_sensor
    entity_id: ${settings.motionSensorEntityId}
    on_press:
      - then:
          # Wake up screen instantly when someone approaches porch
          - light.turn_on:
              id: screen_backlight
              brightness: ${settings.screenBrightnessPercent / 100.0}

switch:
  - platform: template
    name: "Toggle Porch Light"
    id: btn_porch_light
    turn_on_action:
      - homeassistant.service:
          service: light.turn_on
          data:
            entity_id: ${settings.porchLightEntityId}
    turn_off_action:
      - homeassistant.service:
          service: light.turn_off
          data:
            entity_id: ${settings.porchLightEntityId}

  - platform: template
    name: "Toggle Front Deadbolt"
    id: btn_front_lock
    turn_on_action:
      - homeassistant.service:
          service: lock.lock
          data:
            entity_id: ${settings.lockEntityId}
    turn_off_action:
      - homeassistant.service:
          service: lock.unlock
          data:
            entity_id: ${settings.lockEntityId}

# --- Aqara G400 Video Stream via Home Assistant go2rtc (MJPEG) ---
# ESP32-S3 uses MJPEG decoding for high frame rate, low CPU overhead
${settings.enableMjpegStream ? `mjpeg:
  - url: "${settings.go2rtcUrl}"
    id: doorbell_stream
    target_fps: 15
    on_frame:
      - lambda: |-
          // Draws direct to LVGL canvas or display buffer
` : '# MJPEG streaming disabled'}

# --- Screen Sleep Inactivity Timer ---
interval:
  - interval: ${settings.screenSleepSeconds}s
    id: screen_sleep_timer
    then:
      - light.turn_off: screen_backlight
`;
}
