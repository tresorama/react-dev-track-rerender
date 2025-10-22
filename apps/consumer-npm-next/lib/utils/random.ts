import { lerp, clamp } from './math';

export const getRandomInteger = (min: number, max: number) => {
  const value = lerp(min, max, Math.random());
  return clamp(min, max, Math.round(value));
};

export const getRandomArrayItem = <T>(array: T[]): T => {
  const index = getRandomInteger(0, array.length - 1);
  const value = array[index];
  if (!value) throw new Error('Value not found');
  return value;
};


export const getRandomColor = ({
  h,
  s,
  l,
}: {
  h?: number,
  s?: number,
  l?: number,
} = {}) => {
  const _h = h ?? getRandomInteger(0, 360);
  const _s = s ?? getRandomInteger(0, 100);
  const _l = l ?? getRandomInteger(0, 100);
  return {
    h: _h,
    s: _s,
    l: _l,
    hsl: `hsl(${_h} ${_s}% ${_l}%)`,
  };
};

export const getRandomString = () => `${new Date().valueOf()}-${Number(Math.random() * 100000).toFixed(0)}`;
export const getRandomString2 = (seed = Math.random()) => (seed * Math.random()).toString(36).substring(3, 8);


export const getRandomUnsplashImage = ({
  // tags = ['fun'],
  w = 900,
  h = 700,
}: {
  // tags?: string[],
  w?: number,
  h?: number,
}) => {
  // `https://picsum.photos/200/300?grayscale`

  const url = new URL(`https://picsum.photos/${w}/${h}`);
  url.searchParams.set("last-mod", getRandomString());
  // url.searchParams.set(tags.join(","), '');

  return url.toString();
};

export const getRandomDateInRange = (start: Date, end: Date) => {
  const DAY_IN_MS = 1000 * 60 * 60 * 24;
  const differenceBetweenStartAndEnd_inMs = end.getTime() - start.getTime();
  const differenceBetweenStartAndEnd_inDays = differenceBetweenStartAndEnd_inMs / DAY_IN_MS;
  const randomNumberOfDays = getRandomInteger(0, differenceBetweenStartAndEnd_inDays);
  const randomNumberOfDays_inMs = randomNumberOfDays * DAY_IN_MS;
  const randomDate = new Date(start.getTime() + randomNumberOfDays_inMs);
  return randomDate;
};


/**
 * Deterministic pseudo-random string generator
 * given a seed and an optional length.
 */

export function getRandomIdWithSeed(seed = Math.random(), length: number = 12): string {
  // 1️⃣ Seed hashing function (xmur3)
  function xmur3(str: string) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return h >>> 0;
    };
  }

  // 2️⃣ PRNG function (sfc32)
  function sfc32(a: number, b: number, c: number, d: number) {
    return function () {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
      let t = (a + b) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21 | c >>> 11);
      d = (d + 1) | 0;
      t = (t + d) | 0;
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }

  // 3️⃣ Initialize PRNG using the seed
  const seedGen = xmur3(seed.toString());
  const rand = sfc32(seedGen(), seedGen(), seedGen(), seedGen());

  // 4️⃣ Generate deterministic characters
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(rand() * chars.length);
    id += chars[idx];
  }

  return id.slice(0, 6);
}
