export const TOTAL_DURATION_IN_FRAMES = 2850; // 95.0s @ 30fps matching Numtera
export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;

export const SCENE_DURATIONS = {
  CHAOS: 360,          // 0s - 12s (frames 0 - 360)
  MEET_SENTINEL: 180,  // 12s - 18s (frames 360 - 540) -> 13s is frame 390!
  INFRASTRUCTURE: 420, // 18s - 32s (frames 540 - 960)
  DETECTION: 540,      // 32s - 50s (frames 960 - 1500)
  WORKFLOW: 750,       // 50s - 75s (frames 1500 - 2250)
  FLEET: 300,          // 75s - 85s (frames 2250 - 2550)
  OUTRO: 300,          // 85s - 95s (frames 2550 - 2850)
};
