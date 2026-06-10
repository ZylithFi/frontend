/* =============================================================================
   Zylith — Halftone hero light-field engine (production)
   -----------------------------------------------------------------------------
   Renders a fine grid of rounded-square "pixels" whose brightness is read from
   a baked light-field texture (public/hero-field.png) extracted from the brand
   frame — so the wavy draped blue gradient + top-center bloom match the source.
   On top of the baked base it adds gentle motion:
     - waveFlow  : the baked waves slowly undulate (domain warp)
     - calmPulse : a slow global brightness breathing
   Colors come from the canonical Zylith navy ladder. No external deps.
   ============================================================================ */

export interface HalftoneOptions {
  /** target number of dots across the width (drives dot size). Default 350. */
  cols?: number;
  /** master brightness multiplier. Default 0.9. */
  intensity?: number;
  /** time multiplier for the motion. Default 2. */
  speed?: number;
  /** wavy domain-warp undulation. Default true. */
  waveFlow?: boolean;
  /** slow global brightness breathing. Default true. */
  calmPulse?: boolean;
  /** one-shot "fade up" reveal on first start. Default true. */
  powerOnReveal?: boolean;
  /** speed of the intro fade-up, independent of `speed`. Lower = slower. Default 0.35. */
  introSpeed?: number;
  /** path to the baked field texture. Default "/hero-field.png". */
  src?: string;
}

const LEVELS = 30;
const FILL = 0.66; // pixel size as a fraction of cell (rest is the dark gap)
const TWO_PI = Math.PI * 2;

// Canonical Zylith navy ladder: void → deep → shadow → core → mid →
// highlight → bright → frost → white. Matches the logo palette / brand tokens.
const STOPS: [number, [number, number, number]][] = [
  [0.0, [7, 9, 14]],
  [0.14, [15, 24, 37]],
  [0.28, [23, 38, 67]],
  [0.42, [24, 47, 87]],
  [0.56, [37, 61, 107]],
  [0.7, [54, 83, 128]],
  [0.82, [77, 111, 158]],
  [0.92, [138, 175, 212]],
  [1.0, [200, 223, 245]],
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

function buildLUT(): string[] {
  const lut: string[] = [];
  for (let i = 0; i < LEVELS; i++) {
    const t = i / (LEVELS - 1);
    let s = 0;
    while (s < STOPS.length - 2 && STOPS[s + 1][0] < t) s++;
    const a = STOPS[s];
    const b = STOPS[s + 1];
    const lt = (t - a[0]) / (b[0] - a[0]);
    lut.push(
      `rgb(${Math.round(lerp(a[1][0], b[1][0], lt))},${Math.round(
        lerp(a[1][1], b[1][1], lt)
      )},${Math.round(lerp(a[1][2], b[1][2], lt))})`
    );
  }
  return lut;
}

type FieldMap = { w: number; h: number; l: Float32Array };

export class HalftoneField {
  private ctx: CanvasRenderingContext2D;
  private lut = buildLUT();
  private opts: Required<HalftoneOptions>;
  private map: FieldMap | null = null;
  private buckets: number[][] = [];
  private raf: number | null = null;
  private t = 0;
  private last = 0;
  private cssW = 1;
  private cssH = 1;
  private cell = 6;
  private cols = 0;
  private rows = 0;
  private powerStart = -1;
  private introClock = 0;
  private static readonly INTRO_BASE = 1.4;
  private reduced = false;

  constructor(private canvas: HTMLCanvasElement, options: HalftoneOptions = {}) {
    this.ctx = canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D;
    this.opts = {
      cols: 350,
      intensity: 0.9,
      speed: 2,
      waveFlow: true,
      calmPulse: true,
      powerOnReveal: true,
      introSpeed: 0.35,
      src: "/hero-field.png",
      ...options,
    };
    this.reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.resize();
    this.loadMap();
  }

  private loadMap() {
    const im = new Image();
    im.onload = () => {
      const w = im.naturalWidth;
      const h = im.naturalHeight;
      const oc = document.createElement("canvas");
      oc.width = w;
      oc.height = h;
      const octx = oc.getContext("2d")!;
      octx.drawImage(im, 0, 0);
      const d = octx.getImageData(0, 0, w, h).data;
      const l = new Float32Array(w * h);
      for (let i = 0; i < w * h; i++) l[i] = d[i * 4] / 255;
      this.map = { w, h, l };
      if (this.reduced) this.renderStatic();
    };
    im.src = this.opts.src;
  }

  private sampleMap(u: number, v: number): number {
    const m = this.map;
    if (!m) return 0;
    u = u < 0 ? 0 : u > 1 ? 1 : u;
    v = v < 0 ? 0 : v > 1 ? 1 : v;
    const fx = u * (m.w - 1);
    const fy = v * (m.h - 1);
    const x0 = fx | 0;
    const y0 = fy | 0;
    const x1 = x0 + 1 < m.w ? x0 + 1 : x0;
    const y1 = y0 + 1 < m.h ? y0 + 1 : y0;
    const tx = fx - x0;
    const ty = fy - y0;
    const w = m.w;
    const L = m.l;
    const a = L[y0 * w + x0];
    const b = L[y0 * w + x1];
    const c = L[y1 * w + x0];
    const d = L[y1 * w + x1];
    return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
  }

  resize = () => {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.cssW = Math.max(1, rect.width);
    this.cssH = Math.max(1, rect.height);
    this.canvas.width = Math.round(this.cssW * dpr);
    this.canvas.height = Math.round(this.cssH * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cell = Math.max(3, Math.round(this.cssW / this.opts.cols));
    this.cols = Math.ceil(this.cssW / this.cell) + 1;
    this.rows = Math.ceil(this.cssH / this.cell) + 1;
  };

  start() {
    if (this.opts.powerOnReveal) this.powerStart = this.introClock;
    if (this.reduced) {
      this.renderStatic();
      return;
    }
    if (this.raf != null) return;
    this.last = 0;
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    if (this.raf != null) cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  private frame = (now: number) => {
    if (!this.last) this.last = now;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.t += dt * this.opts.speed;
    this.introClock += dt;
    this.render(this.t);
    this.raf = requestAnimationFrame(this.frame);
  };

  private renderStatic() {
    this.render(0, true);
  }

  private render(t: number, isStatic = false) {
    const ctx = this.ctx;
    const o = this.opts;
    const cell = this.cell;
    const cols = this.cols;
    const rows = this.rows;
    const W = this.cssW;
    const H = this.cssH;
    const px = cell * FILL;
    const off = (cell - px) / 2;
    const rad = px * 0.3;

    ctx.fillStyle = "#07090e";
    ctx.fillRect(0, 0, W, H);
    if (!this.map) return;

    const wave = o.waveFlow && !isStatic;
    const warpA = 0.016;
    const pulse =
      o.calmPulse && !isStatic ? 0.9 + 0.12 * Math.sin(t * 0.5) : 1;
    let power = -1;
    if (this.powerStart >= 0 && !isStatic) {
      const duration = HalftoneField.INTRO_BASE / this.opts.introSpeed;
      const pe = (this.introClock - this.powerStart) / duration;
      if (pe >= 1) this.powerStart = -1;
      else power = 1 - (1 - pe) * (1 - pe);
    }

    const buckets = this.buckets;
    for (let i = 0; i < LEVELS; i++) {
      if (!buckets[i]) buckets[i] = [];
      else buckets[i].length = 0;
    }

    const t025 = t * 0.25;
    const t02 = t * 0.2;
    for (let ry = 0; ry < rows; ry++) {
      const y = ry * cell;
      const v = y / H;
      for (let rx = 0; rx < cols; rx++) {
        const x = rx * cell;
        const u = x / W;

        let su = u;
        let sv = v;
        if (wave) {
          su = u + warpA * Math.sin(v * 6.0 + t025);
          sv = v + warpA * Math.cos(u * 5.0 + t02);
        }
        let L = this.sampleMap(su, sv) * o.intensity * pulse;

        if (power >= 0) L *= power;

        L = clamp01(L);
        const lvl = (L * (LEVELS - 1)) | 0;
        if (lvl < 1) continue;
        buckets[lvl].push(x + off, y + off);
      }
    }

    const round = !!(ctx as unknown as { roundRect?: unknown }).roundRect;
    for (let lv = 1; lv < LEVELS; lv++) {
      const arr = buckets[lv];
      if (!arr.length) continue;
      ctx.fillStyle = this.lut[lv];
      ctx.beginPath();
      for (let k = 0; k < arr.length; k += 2) {
        if (round) ctx.roundRect(arr[k], arr[k + 1], px, px, rad);
        else ctx.rect(arr[k], arr[k + 1], px, px);
      }
      ctx.fill();
    }
  }
}
