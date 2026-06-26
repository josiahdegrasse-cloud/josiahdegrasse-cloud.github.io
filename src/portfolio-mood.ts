import type { ChapterId } from "./game-types";

/** Per-room atmosphere: background, fog, ambient fill, key light, and exposure. */
export type Mood = {
  background: number;
  fog: [number, number];
  hemiSky: number;
  hemiGround: number;
  hemiIntensity: number;
  keyColor: number;
  keyIntensity: number;
  keyPosition: [number, number, number];
  exposure: number;
};

export const moods: Record<ChapterId, Mood> = {
  // Cozy morning: low warm fill, strong light raking in from the window.
  recovery: {
    background: 0x1d1a24,
    fog: [11, 64],
    hemiSky: 0xffe6c2,
    hemiGround: 0x2a211a,
    hemiIntensity: 0.55,
    keyColor: 0xffd49a,
    keyIntensity: 2.7,
    keyPosition: [-11, 13, 9],
    exposure: 1.0,
  },
  // Cold industrial hall: cool fill, hard high key.
  helfrich: {
    background: 0x10141a,
    fog: [9, 58],
    hemiSky: 0xb2c4d8,
    hemiGround: 0x14181d,
    hemiIntensity: 0.5,
    keyColor: 0xd2e2ff,
    keyIntensity: 2.5,
    keyPosition: [7, 17, 6],
    exposure: 1.0,
  },
  // Nocturnal listening lounge: very dark, neon does the work.
  headtap: {
    background: 0x090610,
    fog: [6, 40],
    hemiSky: 0x4a3052,
    hemiGround: 0x0a0714,
    hemiIntensity: 0.5,
    keyColor: 0xff7ab8,
    keyIntensity: 1.45,
    keyPosition: [0, 11, 2],
    exposure: 1.32,
  },
  // Clean food lab: neutral-cool, even but crisp.
  nfi: {
    background: 0x151b18,
    fog: [11, 64],
    hemiSky: 0xe2efe2,
    hemiGround: 0x1a201e,
    hemiIntensity: 0.72,
    keyColor: 0xf2fff6,
    keyIntensity: 2.7,
    keyPosition: [-6, 17, 7],
    exposure: 1.05,
  },
  // Glassy studio: professional neutral light.
  "red-hat": {
    background: 0x12141a,
    fog: [11, 64],
    hemiSky: 0xdfe6ee,
    hemiGround: 0x17181d,
    hemiIntensity: 0.62,
    keyColor: 0xffffff,
    keyIntensity: 2.4,
    keyPosition: [5, 17, 9],
    exposure: 1.05,
  },
  // Trophy hall: dramatic, warm, spotlit.
  lacrosse: {
    background: 0x0e1016,
    fog: [9, 58],
    hemiSky: 0xc0d2e8,
    hemiGround: 0x12141a,
    hemiIntensity: 0.4,
    keyColor: 0xffe4ac,
    keyIntensity: 2.3,
    keyPosition: [0, 17, -4],
    exposure: 1.05,
  },
  // Open daylight: the only bright sky in the build — the release.
  field: {
    background: 0x9dcced,
    fog: [42, 185],
    hemiSky: 0xfff4cf,
    hemiGround: 0x244b38,
    hemiIntensity: 2.0,
    keyColor: 0xfff1c4,
    keyIntensity: 3.6,
    keyPosition: [-14, 22, 18],
    exposure: 1.12,
  },
  // Secret rooftop at golden hour: warm sunset glow, soft fill, low raking sun.
  rooftop: {
    background: 0xf0a86a,
    fog: [30, 150],
    hemiSky: 0xffd9a0,
    hemiGround: 0x3a2740,
    hemiIntensity: 1.4,
    keyColor: 0xffb16a,
    keyIntensity: 2.8,
    keyPosition: [-16, 8, -10],
    exposure: 1.16,
  },
};

export const moodFor = (id: ChapterId): Mood => moods[id] ?? moods.recovery;
