/* =============================================================================
   Zylith - shared primitive library for concept-direction scenes.
   Palette, math, and on-brand canvas drawing helpers. Exposed as window.ZLIB.
   ============================================================================ */
(function () {
  "use strict";
  var C = {
    void1: "#06080d", panel: "#0a0e16", panel2: "#0c121d",
    deep: "#0f1825", core: "#182f57", mid: "#253d6b", highlight: "#365380",
    bright: "#4d6f9e", frost: "#8aafd4", white: "#c8dff5",
    info: "#60a5fa", good: "#4ade80", warn: "#fbbf24",
    buy: "#3f8f6a", buyT: "#a7f3d0", sell: "#a85555", sellT: "#fecaca",
    muted: "#4a5058", body: "#6b7280", line: "rgba(40,46,56,0.6)"
  };
  var TAU = Math.PI * 2;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function easeOut(t) { return 1 - Math.pow(1 - clamp(t, 0, 1), 3); }
  function easeIn(t) { t = clamp(t, 0, 1); return t * t; }
  function easeInOut(t) { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function ramp(t, s, e) { return smooth((t - s) / (e - s)); }
  function pulse(t, s, e) { var m = (s + e) / 2; return t < m ? ramp(t, s, m) : 1 - ramp(t, m, e); }
  function hex(c, a) { var n = parseInt(c.slice(1), 16); return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
  function rnd(s) { var x = Math.sin(s * 12.9898) * 43758.5453; return x - Math.floor(x); }

  function bg(ctx, w, h, cx, cy) {
    ctx.fillStyle = "#06080d"; ctx.fillRect(0, 0, w, h);
    var g = ctx.createRadialGradient(cx || w / 2, cy || h * 0.42, 0, cx || w / 2, cy || h * 0.42, Math.max(w, h) * 0.72);
    g.addColorStop(0, hex(C.core, 0.12)); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  function vignette(ctx, w, h) {
    var g = ctx.createRadialGradient(w / 2, h * 0.46, h * 0.2, w / 2, h * 0.5, Math.max(w, h) * 0.72);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(3,5,9,0.5)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  function panel(ctx, x, y, w, h, fill, stroke, a) {
    a = a == null ? 1 : a; ctx.globalAlpha = a;
    ctx.fillStyle = fill || hex(C.panel, 0.95); ctx.fillRect(x, y, w, h);
    if (stroke !== false) { ctx.strokeStyle = stroke || hex(C.mid, 0.5); ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); }
    ctx.globalAlpha = 1;
  }
  function cutPanel(ctx, x, y, w, h, cut, fill, stroke, a) {
    a = a == null ? 1 : a; ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.moveTo(x + cut, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + h - cut);
    ctx.lineTo(x + w - cut, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + cut); ctx.closePath();
    ctx.fillStyle = fill; ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  function txt(ctx, str, x, y, size, color, opts) {
    opts = opts || {}; ctx.save();
    ctx.font = (opts.weight || 500) + " " + size + "px " + (opts.amt ? "'Syne'," : "") + "'IBM Plex Mono', monospace";
    ctx.fillStyle = color; ctx.textAlign = opts.align || "left"; ctx.textBaseline = opts.base || "alphabetic";
    ctx.globalAlpha = opts.alpha == null ? 1 : opts.alpha;
    if (opts.track) {
      var ls = opts.track, total = 0, ws = [];
      for (var i = 0; i < str.length; i++) { var ww = ctx.measureText(str[i]).width; ws.push(ww); total += ww + ls; }
      total -= ls;
      var sx = opts.align === "center" ? x - total / 2 : opts.align === "right" ? x - total : x;
      ctx.textAlign = "left";
      for (var j = 0; j < str.length; j++) { ctx.fillText(str[j], sx, y); sx += ws[j] + ls; }
    } else ctx.fillText(str, x, y);
    ctx.restore();
  }
  function pill(ctx, str, x, y, u, color, alpha) {
    ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.font = "500 " + (9 * u) + "px 'IBM Plex Mono', monospace";
    var pad = 6 * u, ls = 0.8 * u, total = 0;
    for (var i = 0; i < str.length; i++) total += ctx.measureText(str[i]).width + ls;
    var ww = total - ls + pad * 2, hh = 15 * u;
    ctx.fillStyle = hex(color, 0.14); ctx.fillRect(x, y, ww, hh);
    ctx.strokeStyle = hex(color, 0.5); ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, ww - 1, hh - 1);
    ctx.fillStyle = color; ctx.textBaseline = "middle"; ctx.textAlign = "left";
    var sx = x + pad;
    for (var j = 0; j < str.length; j++) { ctx.fillText(str[j], sx, y + hh / 2 + 0.5 * u); sx += ctx.measureText(str[j]).width + ls; }
    ctx.restore(); return ww;
  }
  function lock(ctx, cx, cy, s, color, open) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = Math.max(1, s * 0.13); ctx.lineJoin = "round";
    ctx.strokeRect(cx - s * 0.42, cy - s * 0.05, s * 0.84, s * 0.62);
    ctx.beginPath();
    if (open) ctx.arc(cx - s * 0.18, cy - s * 0.05, s * 0.32, Math.PI, TAU * 0.78, false);
    else ctx.arc(cx, cy - s * 0.05, s * 0.30, Math.PI, 0);
    ctx.stroke(); ctx.restore();
  }
  function redact(ctx, x, y, w, h, prog, a) {
    if (prog <= 0) return;
    ctx.fillStyle = hex("#0a0d13", 0.97 * (a == null ? 1 : a));
    ctx.fillRect(x, y, w * prog, h);
    ctx.strokeStyle = hex(C.mid, 0.45 * prog * (a == null ? 1 : a)); ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w * prog - 1, h - 1);
  }
  // frosted hatch veil - for "hidden" things (maker curves, balances)
  function veil(ctx, x, y, w, h, u, a) {
    a = a == null ? 1 : a; ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = hex(C.deep, 0.72 * a); ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = hex(C.highlight, 0.16 * a); ctx.lineWidth = 1;
    for (var d = -h; d < w; d += 6 * u) { ctx.beginPath(); ctx.moveTo(x + d, y + h); ctx.lineTo(x + d + h, y); ctx.stroke(); }
    ctx.restore();
  }
  function connector(ctx, x1, y1, x2, y2, u, color, prog, flow, t) {
    if (prog <= 0) return;
    var ex = lerp(x1, x2, prog), ey = lerp(y1, y2, prog);
    ctx.save(); ctx.strokeStyle = hex(color, 0.5); ctx.lineWidth = 1.2;
    if (flow) { ctx.setLineDash([4 * u, 5 * u]); ctx.lineDashOffset = -(t * 30 * u); }
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore();
  }
  function packet(ctx, x, y, u, color, a, r) {
    ctx.save(); ctx.globalAlpha = a == null ? 1 : a;
    var R = (r || 14) * u;
    var gg = ctx.createRadialGradient(x, y, 0, x, y, R);
    gg.addColorStop(0, hex(color, 0.55)); gg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill();
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(x, y, 2.4 * u, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function checkRow(ctx, x, y, u, label, state, a) {
    ctx.save(); ctx.globalAlpha = a == null ? 1 : a;
    var col = state === 1 ? C.good : state === -1 ? C.sell : C.body;
    ctx.strokeStyle = hex(col, 0.85); ctx.lineWidth = 1.4 * u; ctx.lineCap = "round";
    if (state === 1) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 3 * u, y + 3.4 * u); ctx.lineTo(x + 8 * u, y - 3.4 * u); ctx.stroke(); }
    else if (state === -1) { ctx.beginPath(); ctx.moveTo(x, y - 3.2 * u); ctx.lineTo(x + 7 * u, y + 3.2 * u); ctx.moveTo(x + 7 * u, y - 3.2 * u); ctx.lineTo(x, y + 3.2 * u); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(x + 4 * u, y, 2 * u, 0, TAU); ctx.stroke(); }
    if (label) txt(ctx, label, x + 16 * u, y + 0.5 * u, 10.5 * u, state === 0 ? C.body : C.frost, { base: "middle" });
    ctx.restore();
  }
  // hexagon proof seal with compile ring
  function hexSeal(ctx, cx, cy, r, prog, label, sub, color) {
    color = color || C.info;
    var gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.4);
    gg.addColorStop(0, hex(color, 0.20 * Math.max(0.2, prog))); gg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(cx, cy, r * 2.4, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(cx, cy);
    ctx.beginPath();
    for (var v = 0; v < 6; v++) { var a = -Math.PI / 2 + v * TAU / 6; var hx = Math.cos(a) * r, hy = Math.sin(a) * r; v === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy); }
    ctx.closePath(); ctx.fillStyle = hex(C.panel2, 0.98); ctx.fill();
    ctx.strokeStyle = hex(C.highlight, 0.7); ctx.lineWidth = 1.4; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r * 0.68, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(prog, 0, 1));
    ctx.strokeStyle = hex(color, 0.9); ctx.lineWidth = 2.4; ctx.stroke();
    ctx.restore();
    var u = r / 50;
    if (label) txt(ctx, label, cx, cy - 2 * u, 11 * u, C.white, { align: "center", base: "middle", weight: 500 });
    if (sub) txt(ctx, sub, cx, cy + 13 * u, 8 * u, prog >= 1 ? C.good : C.body, { align: "center", base: "middle", track: 1 * u });
  }
  // intro/outro fade
  function shell(ctx, w, h, lt, P, cx, cy) { bg(ctx, w, h, cx, cy); return clamp(ramp(lt, 0, 0.5) - ramp(lt, P - 0.5, P), 0, 1); }

  window.ZLIB = {
    C: C, TAU: TAU, clamp: clamp, lerp: lerp, smooth: smooth, easeOut: easeOut, easeIn: easeIn,
    easeInOut: easeInOut, ramp: ramp, pulse: pulse, hex: hex, rnd: rnd,
    bg: bg, vignette: vignette, panel: panel, cutPanel: cutPanel, txt: txt, pill: pill,
    lock: lock, redact: redact, veil: veil, connector: connector, packet: packet,
    checkRow: checkRow, hexSeal: hexSeal, shell: shell
  };
})();
