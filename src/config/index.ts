// Site-wide configuration — edit these values to customize the experience
export const SITE_CONFIG = {
  UNLOCK_DATE: new Date('2025-08-12T00:00:00'),
  SITE_TITLE: 'A Special Story ❤️',
  SITE_DESCRIPTION: 'An interactive love story',
  // Admin passwords (full access: manage + view)
  ADMIN_PASSWORDS: ['admin2025'],
  // User passwords (one-time view only, expires after use)
  USER_PASSWORDS: ['preview2025', 'love2025', 'bestfriend2025'],
  RECORDING: {
    VIDEO_BITS_PER_SECOND: 2_500_000,
    AUDIO_BITS_PER_SECOND: 128_000,
    MIME_TYPE: 'video/webm;codecs=vp9,opus',
  },
  TIMING: {
    SCENE_TRANSITION: 800,
    CONFETTI_DURATION: 3000,
    FIREWORKS_DURATION: 5000,
    COMFORT_ASK_DELAY: 3000,
  },
  CONFETTI_COLORS: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#E8BAFF', '#FFD9BA'],
  HEART_COLORS: ['#FF6B8A', '#FF8FA3', '#FFB3C1', '#FF4D6D'],
} as const;
