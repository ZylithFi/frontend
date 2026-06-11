export type CausticMode =
  | "caustics"
  | "caustics-fine"
  | "caustics-bold"
  | "caustics-veil"
  | "caustics-deep"
  | "caustics-swirl"
  | "caustics-layer"
  | "flowing"
  | "ribbons"
  | "frosted";

export type CausticOptions = {
  mode?: CausticMode;
  speed?: number;
  intensity?: number;
  waveFlow?: boolean;
  calmPulse?: boolean;
  introSpeed?: number;
  mouse?: boolean;
  scale?: number;
  mapSrc?: string;
};

type CausticVariant = {
  freq: number;
  pow: number;
  warp: number;
  base: number;
  amp: number;
  swirl?: number;
  layers?: boolean;
};

type LightMap = {
  w: number;
  h: number;
  l: Float32Array;
};

const STOPS: Array<[number, [number, number, number]]> = [
  [0, [6, 10, 18]],
  [0.14, [11, 24, 46]],
  [0.32, [20, 47, 84]],
  [0.52, [40, 78, 130]],
  [0.72, [83, 124, 184]],
  [0.88, [150, 184, 224]],
  [1, [214, 230, 248]],
];

const CAUSTICS: Record<string, CausticVariant> = {
  caustics: { freq: 1, pow: 3, warp: 0.05, base: 0.42, amp: 0.95 },
  "caustics-fine": { freq: 1.85, pow: 3.2, warp: 0.038, base: 0.4, amp: 0.9 },
  "caustics-bold": { freq: 0.6, pow: 2.3, warp: 0.06, base: 0.45, amp: 1.05 },
  "caustics-veil": { freq: 1.1, pow: 1.6, warp: 0.05, base: 0.52, amp: 0.8 },
  "caustics-deep": { freq: 1, pow: 4.6, warp: 0.05, base: 0.32, amp: 1.12 },
  "caustics-swirl": { freq: 1, pow: 3, warp: 0.05, base: 0.42, amp: 0.95, swirl: 0.6 },
  "caustics-layer": { freq: 1, pow: 3, warp: 0.05, base: 0.4, amp: 0.95, layers: true },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

const LUT = (() => {
  const a = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i += 1) {
    const t = i / 255;
    let s = 0;
    while (s < STOPS.length - 2 && STOPS[s + 1][0] < t) s += 1;
    const p = STOPS[s];
    const q = STOPS[s + 1];
    const lt = (t - p[0]) / (q[0] - p[0]);
    a[i * 3] = lerp(p[1][0], q[1][0], lt);
    a[i * 3 + 1] = lerp(p[1][1], q[1][1], lt);
    a[i * 3 + 2] = lerp(p[1][2], q[1][2], lt);
  }
  return a;
})();

export class CausticField {
  private ctx: CanvasRenderingContext2D;
  private params: Required<CausticOptions>;
  private t = 0;
  private last = 0;
  private introClock = 0;
  private mx = 0.5;
  private my = 0.5;
  private cmx = 0.5;
  private cmy = 0.5;
  private pointerInside = false;
  private aspect = 1;
  private powerStart = 0;
  private raf: number | null = null;
  private staticRenderTimer: ReturnType<typeof window.setInterval> | null = null;
  private map: LightMap | null = null;
  private off: HTMLCanvasElement;
  private offctx: CanvasRenderingContext2D;
  private buf: ImageData;
  private cssW = 1;
  private cssH = 1;
  private ow = 2;
  private oh = 2;
  private reduced = false;

  constructor(private canvas: HTMLCanvasElement, options: CausticOptions = {}) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("2d canvas is unavailable");
    this.ctx = ctx;
    this.params = {
      mode: "caustics",
      speed: 2,
      intensity: 0.9,
      waveFlow: true,
      calmPulse: true,
      introSpeed: 0.35,
      mouse: false,
      scale: 3,
      mapSrc: "/hero-field.png",
      ...options,
    };
    this.reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.off = document.createElement("canvas");
    const offctx = this.off.getContext("2d");
    if (!offctx) throw new Error("2d offscreen canvas is unavailable");
    this.offctx = offctx;
    this.buf = this.offctx.createImageData(this.ow, this.oh);
    this.resize();
    this.load();
  }

  set(options: Partial<CausticOptions>) {
    Object.assign(this.params, options);
    if (this.reduced && this.map) this.render(this.t, true);
  }

  replayIntro() {
    this.powerStart = this.introClock;
  }

  setPointer(u: number, v: number, inside: boolean) {
    this.mx = u;
    this.my = v;
    this.pointerInside = inside;
  }

  resize = () => {
    const rect = this.canvas.getBoundingClientRect();
    this.cssW = Math.max(1, rect.width);
    this.cssH = Math.max(1, rect.height);
    this.canvas.width = Math.round(this.cssW);
    this.canvas.height = Math.round(this.cssH);
    const scale = this.params.scale;
    this.ow = Math.max(2, Math.round(this.cssW / scale));
    this.oh = Math.max(2, Math.round(this.cssH / scale));
    this.off.width = this.ow;
    this.off.height = this.oh;
    this.buf = this.offctx.createImageData(this.ow, this.oh);
    this.aspect = this.cssW / this.cssH;
    this.render(this.t, this.reduced);
  };

  start() {
    if (this.reduced) {
      if (this.staticRenderTimer !== null) return;
      this.staticRenderTimer = window.setInterval(() => {
        if (!this.map) return;
        this.render(2, true);
        if (this.staticRenderTimer !== null) {
          window.clearInterval(this.staticRenderTimer);
          this.staticRenderTimer = null;
        }
      }, 60);
      return;
    }
    if (this.raf != null) return;
    this.last = 0;
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    if (this.raf != null) cancelAnimationFrame(this.raf);
    this.raf = null;
    if (this.staticRenderTimer !== null) {
      window.clearInterval(this.staticRenderTimer);
      this.staticRenderTimer = null;
    }
  }

  private load() {
    const image = new Image();
    image.onload = () => {
      const w = image.naturalWidth;
      const h = image.naturalHeight;
      const oc = document.createElement("canvas");
      oc.width = w;
      oc.height = h;
      const c = oc.getContext("2d");
      if (!c) return;
      c.drawImage(image, 0, 0);
      const d = c.getImageData(0, 0, w, h).data;
      const l = new Float32Array(w * h);
      for (let i = 0; i < w * h; i += 1) l[i] = d[i * 4] / 255;
      this.map = { w, h, l };
      if (this.reduced) this.render(2, true);
    };
    image.src = this.params.mapSrc;
  }

  private sample(u: number, v: number) {
    const map = this.map;
    if (!map) return 0;
    const su = clamp01(u);
    const sv = clamp01(v);
    const fx = su * (map.w - 1);
    const fy = sv * (map.h - 1);
    const x0 = fx | 0;
    const y0 = fy | 0;
    const x1 = x0 + 1 < map.w ? x0 + 1 : x0;
    const y1 = y0 + 1 < map.h ? y0 + 1 : y0;
    const tx = fx - x0;
    const ty = fy - y0;
    const { w, l } = map;
    const a = l[y0 * w + x0];
    const b = l[y0 * w + x1];
    const c = l[y1 * w + x0];
    const d = l[y1 * w + x1];
    return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
  }

  private frame = (now: number) => {
    if (!this.last) this.last = now;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.t += dt * this.params.speed;
    this.introClock += dt;
    const k = Math.min(1, dt * 6);
    this.cmx += (this.mx - this.cmx) * k;
    this.cmy += (this.my - this.cmy) * k;
    this.render(this.t, false);
    this.raf = requestAnimationFrame(this.frame);
  };

  private render(t: number, isStatic: boolean) {
    if (!this.map) {
      this.ctx.fillStyle = "#04060a";
      this.ctx.fillRect(0, 0, this.cssW, this.cssH);
      return;
    }
    const p = this.params;
    const { ow, oh } = this;
    const data = this.buf.data;
    const wave = p.waveFlow && !isStatic;
    const A = 0.016;
    const pulse = p.calmPulse && !isStatic ? 0.9 + 0.12 * Math.sin(t * 0.5) : 1;
    const dur = 1.4 / (p.introSpeed || 1);
    const pe = (this.introClock - this.powerStart) / dur;
    const power = !isStatic && pe < 1 ? 1 - (1 - clamp01(pe)) * (1 - clamp01(pe)) : 1;
    const mode = p.mode;
    const inten = p.intensity;
    const mouseOn = p.mouse && this.pointerInside && !isStatic;
    const { cmx, cmy, aspect } = this;

    for (let oy = 0; oy < oh; oy += 1) {
      const v = oy / (oh - 1);
      for (let ox = 0; ox < ow; ox += 1) {
        const u = ox / (ow - 1);
        let su = u;
        let sv = v;
        if (wave) {
          su = u + A * Math.sin(v * 6 + t * 0.25);
          sv = v + A * Math.cos(u * 5 + t * 0.2);
        }
        const f = this.sample(su, sv);
        let L: number;
        if (mode === "flowing") {
          const n =
            0.5 +
            0.5 *
              (Math.sin(su * 5 + Math.sin(sv * 4 + 0.5 + t * 0.18) * 1.6) * 0.6 +
                Math.cos(sv * 4.4 + Math.sin(su * 3.2 + t * 0.14) * 1.4) * 0.4);
          L = f * (0.5 + 0.7 * n);
        } else if (mode === "ribbons") {
          const c =
            su * 0.7 +
            sv * 0.7 +
            0.16 * Math.sin(sv * 3 + t * 0.4) +
            0.12 * Math.sin(su * 4 + t * 0.25);
          const band = Math.pow(0.5 + 0.5 * Math.sin(c * 7 + t * 0.5), 2.2);
          L = f * (0.45 + 0.95 * band);
        } else if (mode === "frosted") {
          const w1 = Math.sin(su * 3.4 + t * 0.22);
          const w2 = Math.cos(sv * 3 - t * 0.18);
          const soft = 0.5 + 0.5 * (w1 * 0.5 + w2 * 0.5);
          L = f * (0.55 + 0.7 * soft * soft);
        } else {
          const cv = CAUSTICS[mode] ?? CAUSTICS.caustics;
          let ssu = su;
          let ssv = sv;
          if (cv.swirl) {
            const rx = su - 0.5;
            const ry = sv - 0.5;
            const ang = cv.swirl * (Math.sin(t * 0.15) + 0.7 * Math.sqrt(rx * rx + ry * ry) - t * 0.05);
            const cs = Math.cos(ang);
            const sn = Math.sin(ang);
            ssu = rx * cs - ry * sn + 0.5;
            ssv = rx * sn + ry * cs + 0.5;
          }
          const F1 = cv.freq;
          const wx = ssu + cv.warp * Math.sin(ssv * 6 + t * 0.5);
          const wy = ssv + cv.warp * Math.cos(ssu * 5 + t * 0.4);
          let h =
            (Math.sin(wx * 9 * F1 + t * 0.3) +
              Math.sin(wy * 11 * F1 + wx * 2) +
              Math.sin((wx + wy) * 7 * F1 - t * 0.2)) /
            3;
          if (cv.layers) {
            const h2 = (Math.sin(wx * 19 * F1 - t * 0.4) + Math.sin(wy * 23 * F1 + wx * 3)) / 2;
            h = 0.62 * h + 0.38 * h2;
          }
          let bloom = 0;
          if (mouseOn) {
            const dx = (u - cmx) * aspect;
            const dy = v - cmy;
            const d2 = dx * dx + dy * dy;
            const env = Math.exp(-d2 / 0.05);
            h += 0.55 * Math.sin(Math.sqrt(d2) * 40 - t * 3.2) * env;
            bloom = Math.exp(-d2 / 0.035) * 0.5;
          }
          const ridge = Math.pow(1 - Math.abs(h), cv.pow);
          L = f * cv.base + ridge * f * cv.amp + bloom * (0.4 + f);
        }

        const Lc = clamp01(L * inten * pulse * power);
        const idx = (Lc * 255) | 0;
        const o = (oy * ow + ox) * 4;
        const c3 = idx * 3;
        data[o] = LUT[c3];
        data[o + 1] = LUT[c3 + 1];
        data[o + 2] = LUT[c3 + 2];
        data[o + 3] = 255;
      }
    }

    this.offctx.putImageData(this.buf, 0, 0);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = "high";
    this.ctx.drawImage(this.off, 0, 0, ow, oh, 0, 0, this.cssW, this.cssH);
  }
}
