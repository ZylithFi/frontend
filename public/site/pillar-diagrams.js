/* =============================================================================
   Zylith pillar diagrams.
   Shared canvas scenes for the marketing page concept sections.
   Requires concept-lib.js (window.ZLIB). Pushes window.ZYLITH_DIAGRAMS.
   ============================================================================ */
(function () {
  "use strict";
  var L = window.ZLIB, TAU = L.TAU;
  // Dark base palette with the Zylith ice accent.
  var C = Object.assign({}, L.C, {
    info: "#a8c8ff", good: "#a8c8ff", bright: "#8fb3e8",
    frost: "#c6c6cd", white: "#e5e2e1",
    core: "#0a1221", mid: "#2a3550", highlight: "#3f4758",
    deep: "#0D1117", void1: "#050505", body: "#8f9097", muted: "#5a5e66"
  });
  var clamp = L.clamp, lerp = L.lerp, ramp = L.ramp, pulse = L.pulse, hex = L.hex,
      easeOut = L.easeOut, easeIn = L.easeIn, easeInOut = L.easeInOut, rnd = L.rnd, smooth = L.smooth;
  var txt = L.txt, pill = L.pill;

  // soft radial glow
  function glow(ctx, x, y, r, color, a) {
    if (window.__ZDISABLEMONOGLOW) return;
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, hex(color, a)); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  // flat black field with one faint navy bloom + heavy vignette (premium dark)
  function field(ctx, w, h, bx, by) {
    if (window.__ZDISABLEMONOGLOW) { ctx.clearRect(0, 0, w, h); return; }
    if (window.__ZTRANSPARENTBG) { ctx.clearRect(0, 0, w, h); }
    else { ctx.fillStyle = "#050505"; ctx.fillRect(0, 0, w, h); }
    var g = ctx.createRadialGradient(bx || w / 2, by || h * 0.44, 0, bx || w / 2, by || h * 0.44, Math.max(w, h) * 0.6);
    g.addColorStop(0, hex("#16223c", 0.5)); g.addColorStop(0.5, hex("#0c1426", 0.28)); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  function vign(ctx, w, h) {
    if (window.__ZTRANSPARENTBG) return;
    var g = ctx.createRadialGradient(w / 2, h * 0.46, h * 0.18, w / 2, h * 0.5, Math.max(w, h) * 0.68);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(2,3,6,0.72)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  function shell(ctx, w, h, lt, P, bx, by) { field(ctx, w, h, bx, by); return clamp(ramp(lt, 0, 0.6) - ramp(lt, P - 0.6, P), 0, 1); }
  function cap(ctx, w, h, u, s, a) { if (window.__ZHIDELABELS) return; txt(ctx, s, w / 2, h - 18 * u, 9 * u, hex(C.frost, 0.46 * a), { align: "center", track: 1.8 * u }); }
  function eyebrow(ctx, w, h, u, s, a) { if (window.__ZHIDELABELS) return; txt(ctx, s, w / 2, 30 * u, 8.5 * u, hex(C.bright, 0.6 * a), { align: "center", track: 2.2 * u }); }

  /* Faceted polygon with radial vertices, jitter, and shaded faces. */
  function facetGon(ctx, cx, cy, r, n, seed, rot, shade, a) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var ang = rot + (i / n) * TAU;
      var rr = r * (0.78 + 0.34 * rnd(seed + i * 1.7));
      pts.push([cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr * 0.96]);
    }
    // body
    ctx.beginPath();
    pts.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
    ctx.closePath();
    var g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    g.addColorStop(0, hex(C.deep, 0.96 * a)); g.addColorStop(0.55, hex("#0a111d", 0.98 * a)); g.addColorStop(1, hex(C.void1 || "#06080d", 0.99 * a));
    ctx.fillStyle = g; ctx.fill();
    // internal facets from a slightly offset center
    var ix = cx - r * 0.18, iy = cy - r * 0.16;
    for (var k = 0; k < n; k++) {
      var p1 = pts[k], p2 = pts[(k + 1) % n];
      ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.closePath();
      var lightness = shade[k % shade.length];
      ctx.fillStyle = hex(lightness, (0.14 + 0.5 * rnd(seed + k * 3.1)) * a);
      ctx.fill();
      ctx.strokeStyle = hex(C.highlight, 0.12 * a); ctx.lineWidth = 0.6; ctx.stroke();
    }
    // rim highlight
    ctx.beginPath();
    pts.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
    ctx.closePath();
    ctx.strokeStyle = hex(C.bright, 0.4 * a); ctx.lineWidth = 1; ctx.stroke();
    return pts;
  }

  /* ══ HERO · THE INSTITUTIONAL DARK POOL ════════════════════════════════ */
  function hero(ctx, t, w, h) {
    var P = 14, lt = t % P, u = h / 560, A = shell(ctx, w, h, lt, P);
    var cx = w / 2, cy = h * 0.46 + Math.sin(t * 0.5) * 6 * u;   // gentle bob
    var r = Math.min(w, h) * 0.27;
    var rot = t * 0.12;
    // backlight bloom
    glow(ctx, cx, cy, r * 2.1, C.core, 0.20 * A);
    glow(ctx, cx - r * 0.4, cy - r * 0.4, r * 0.9, C.bright, 0.10 * A);
    ctx.save(); ctx.globalAlpha = A;
    facetGon(ctx, cx, cy, r, 11, 4.0, rot, [C.mid, C.core, C.highlight, C.deep, C.bright], 1);
    // a few specular sparks along the upper rim
    for (var s = 0; s < 3; s++) {
      var ang = rot + 4.0 + (s / 3) * TAU + 0.4;
      var rr = r * 0.92;
      var sx = cx + Math.cos(ang) * rr, sy = cy + Math.sin(ang) * rr * 0.96;
      var tw = 0.5 + 0.5 * Math.sin(t * 2 + s * 2.1);
      glow(ctx, sx, sy, 10 * u, C.frost, 0.5 * tw);
    }
    ctx.restore();
    // reflection beneath
    ctx.save(); ctx.globalAlpha = 0.16 * A; ctx.translate(cx, cy + r * 1.5); ctx.scale(1, -0.4);
    facetGon(ctx, 0, 0, r, 11, 4.0, rot, [C.mid, C.core, C.highlight, C.deep, C.bright], 1);
    ctx.restore();
    var fade = ctx.createLinearGradient(0, cy + r * 0.6, 0, cy + r * 2.2);
    fade.addColorStop(0, "rgba(0,0,0,0)"); fade.addColorStop(1, "#050505");
    ctx.fillStyle = fade; ctx.fillRect(0, cy + r * 0.6, w, r * 1.8);
    vign(ctx, w, h);
    cap(ctx, w, h, u, "PRIVATE FREQUENT CALL-AUCTION DARKPOOL", A);
  }

  /* ══ 01 · THE EPOCH PULSE  (Private Call Auctions) ═════════════════════
     Ref-aligned: expanding concentric pulse rings, one rotated navy square
     bearing the serif Z, a horizontal ice execution line, floating shards.   */
  function epochPulse(ctx, t, w, h) {
    var P = 6, lt = t % P, u = h / 560, A = shell(ctx, w, h, lt, P);
    var cx = w / 2, cy = h * 0.46, r = Math.min(w, h) * 0.16;
    var beat = ramp(lt, 4.6, 5.1) - ramp(lt, 5.4, 5.9);   // clearing pulse on the square

    // horizontal execution line across the full width, ice with soft glow
    ctx.save();
    ctx.strokeStyle = hex(C.info, (0.4 + beat * 0.5) * A); ctx.lineWidth = 1 * u;
    ctx.shadowColor = hex(C.info, 0.5 * A); ctx.shadowBlur = 14 * u;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.restore();

    // expanding concentric pulse rings (ref: pulse-circle)
    for (var i = 0; i < 4; i++) {
      var rp = (t * 0.26 + i / 4) % 1, rr = r * (0.55 + rp * 2.8), ra = Math.sin(rp * Math.PI) * 0.42 * A;
      ctx.strokeStyle = hex(C.info, ra * (1 - i * 0.12)); ctx.lineWidth = 1 * u;
      ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU); ctx.stroke();
    }

    // floating shards around the core
    function shard(sx, sy, s, rot, fill) {
      ctx.save(); ctx.globalAlpha = A; ctx.translate(sx, sy); ctx.rotate(rot);
      ctx.fillStyle = fill; ctx.fillRect(-s, -s, s * 2, s * 2);
      ctx.strokeStyle = hex(C.info, 0.4); ctx.lineWidth = 1; ctx.strokeRect(-s, -s, s * 2, s * 2);
      ctx.restore();
    }
    var bob = Math.sin(t * 0.8) * 3 * u;
    shard(cx - r * 1.7, cy - r * 1.5 + bob, 7 * u, 0.21, hex("#0D1117", 0.8 * A));
    shard(cx + r * 1.8, cy - r * 0.2 - bob, 5 * u, Math.PI / 4, hex("#0D1117", 0.7 * A));
    ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = hex(C.info, 0.5);
    ctx.beginPath(); ctx.arc(cx + r * 1.3, cy + r * 1.4 - bob, 2.6 * u, 0, TAU); ctx.fill(); ctx.restore();

    // central rotated square (diamond) with ice glow + serif Z
    glow(ctx, cx, cy, r * (1.7 + beat * 0.5), C.info, (0.12 + beat * 0.3) * A);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4);
    var sc = 1 + beat * 0.05; ctx.scale(sc, sc);
    ctx.shadowColor = hex(C.info, 0.32 * A); ctx.shadowBlur = 44 * u;
    ctx.fillStyle = hex("#020617", 0.96 * A); ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = hex("#ffffff", (0.14 + beat * 0.3) * A); ctx.lineWidth = 1 * u;
    ctx.strokeRect(-r, -r, r * 2, r * 2);
    ctx.restore();
    // serif Z, upright
    ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = hex(C.white, 0.92 + beat * 0.08);
    ctx.font = "400 " + (r * 1.05) + "px 'Libre Caslon Text', Georgia, serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("Z", cx, cy + r * 0.04); ctx.restore();

    vign(ctx, w, h);
    eyebrow(ctx, w, h, u, "PRIVATE CALL AUCTIONS", A);
    cap(ctx, w, h, u, "ORDERS ALIGN TO THE PROTOCOL CLOCK", A);
  }

  /* == 02 · THE SUBSURFACE CURVE  (Hidden LP Liquidity) ==================
     A luminous liquidity slice spans a dark panel. A reveal sweep lifts the
     veil to show the weight of hidden depth, then re-veils.                  */
  function subsurface(ctx, t, w, h) {
    var P = 9, lt = t % P, u = h / 560, A = shell(ctx, w, h, lt, P);
    var px = w * 0.10, py = h * 0.24, pw = w * 0.80, ph = h * 0.46;
    var midY = py + ph * 0.5;
    // panel frame
    ctx.strokeStyle = hex(C.mid, 0.35 * A); ctx.lineWidth = 1; ctx.strokeRect(px + 0.5, py + 0.5, pw, ph);

    // the curve: a slow sine that holds depth beneath it
    function curveY(x) {
      var p = (x - px) / pw;
      return midY + Math.sin(p * Math.PI * 1.4 + t * 0.4) * ph * 0.26 + Math.sin(p * Math.PI * 3 - t * 0.2) * ph * 0.05;
    }
    // reveal sweep position
    var sweep = (lt % P) / P;                       // 0..1 traveling reveal
    var revealX = px + pw * sweep;
    var revealW = pw * 0.26;

    // depth fill below the curve, only bright within the reveal window
    ctx.save(); ctx.beginPath();
    ctx.moveTo(px, py + ph);
    for (var x = px; x <= px + pw; x += 4 * u) ctx.lineTo(x, curveY(x));
    ctx.lineTo(px + pw, py + ph); ctx.closePath(); ctx.clip();
    // base veil
    L.veil(ctx, px, py, pw, ph, u, 0.9 * A);
    // luminous depth caustics inside the reveal window
    var grad = ctx.createLinearGradient(revealX - revealW, 0, revealX + revealW, 0);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(0.5, hex(C.bright, 0.30 * A));
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad; ctx.fillRect(px, py, pw, ph);
    // depth striations
    ctx.strokeStyle = hex(C.highlight, 0.18 * A); ctx.lineWidth = 1;
    for (var dy = midY; dy < py + ph; dy += 9 * u) { ctx.beginPath(); ctx.moveTo(px, dy + Math.sin(t * 0.4) * 2 * u); ctx.lineTo(px + pw, dy); ctx.stroke(); }
    ctx.restore();

    // the curve line itself, glowing
    ctx.save();
    ctx.strokeStyle = hex(C.frost, 0.7 * A); ctx.lineWidth = 1.6 * u; ctx.beginPath();
    for (var cxp = px; cxp <= px + pw; cxp += 3 * u) { var yy = curveY(cxp); cxp === px ? ctx.moveTo(cxp, yy) : ctx.lineTo(cxp, yy); }
    ctx.stroke();
    // brighten curve within reveal
    ctx.strokeStyle = hex(C.info, 0.9 * A); ctx.lineWidth = 2 * u; ctx.beginPath(); var started = false;
    for (var cx2 = revealX - revealW; cx2 <= revealX + revealW; cx2 += 3 * u) { if (cx2 < px || cx2 > px + pw) continue; var yy2 = curveY(cx2); started ? ctx.lineTo(cx2, yy2) : (ctx.moveTo(cx2, yy2), started = true); }
    ctx.stroke(); ctx.restore();

    // reveal marker
    var ry = curveY(revealX);
    glow(ctx, revealX, ry, 18 * u, C.info, 0.5 * A);
    ctx.fillStyle = hex(C.white, A); ctx.beginPath(); ctx.arc(revealX, ry, 2.6 * u, 0, TAU); ctx.fill();

    pill(ctx, "DEPTH · REVEAL ON CONSUME", px, py - 20 * u, u, C.bright, A);
    txt(ctx, "SHAPE HELD PRIVATE", px + pw, py - 12 * u, 8 * u, hex(C.body, A), { align: "right", track: 1.4 * u });
    vign(ctx, w, h);
    eyebrow(ctx, w, h, u, "HIDDEN LP DEPTH", A);
    cap(ctx, w, h, u, "DEPTH HELD BENEATH THE SURFACE", A);
  }

  /* ══ 03 · THE KINETIC MONOLITH  (Private Matching) ═════════════════════
     A grid of faceted cells. Atomic matching: a buy cell and a sell cell
     light, a line binds them, they clear together, the match propagates.     */
  function kinetic(ctx, t, w, h) {
    var P = 7, lt = t % P, u = h / 560, A = shell(ctx, w, h, lt, P);
    var N = 3, gap = 12 * u, cell = Math.min(w, h) * 0.16;
    var gw = N * cell + (N - 1) * gap, gx = (w - gw) / 2, gy = h * 0.42 - gw / 2;
    // cycle: scattered → converge & lock → hold → release
    var align = ramp(lt, 1.4, 3.4) - ramp(lt, 5.4, 6.4);   // 0 scattered → 1 locked → 0
    var locked = align > 0.92;
    var pct = Math.round(align * 100);

    for (var i = 0; i < N * N; i++) {
      var r = Math.floor(i / N), c = i % N;
      var baseX = gx + c * (cell + gap), baseY = gy + r * (cell + gap);
      var off = 1 - align;
      // per-plate scatter offset + slight rotation when unaligned
      var ox = (rnd(i + 1) - 0.5) * cell * 0.7 * off;
      var oy = (rnd(i + 7) - 0.5) * cell * 0.7 * off;
      var rot = (rnd(i + 13) - 0.5) * 0.4 * off;
      var x = baseX + ox, y = baseY + oy;
      var isCenter = (i === 4);

      ctx.save(); ctx.globalAlpha = A;
      ctx.translate(x + cell / 2, y + cell / 2); ctx.rotate(rot); ctx.translate(-cell / 2, -cell / 2);
      // plate fill - center plate carries a faint ice wash
      var bg = ctx.createLinearGradient(0, 0, cell, cell);
      if (isCenter) { bg.addColorStop(0, hex(C.info, 0.12)); bg.addColorStop(1, hex("#0a1322", 0.96)); }
      else { bg.addColorStop(0, hex("#141d30", 0.96)); bg.addColorStop(1, hex("#0a1120", 0.98)); }
      ctx.fillStyle = bg; ctx.fillRect(0, 0, cell, cell);
      // top rim light
      ctx.strokeStyle = hex("#ffffff", 0.07); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0.5, 0.5); ctx.lineTo(cell - 0.5, 0.5); ctx.stroke();
      // border - ice on center always; others brighten toward ice as they lock
      var bcol = isCenter ? C.info : C.mid;
      var ba = isCenter ? (0.55 + align * 0.4) : (0.5 + align * 0.45);
      if (!isCenter && align > 0.5) bcol = C.info;
      ctx.strokeStyle = hex(bcol, ba); ctx.lineWidth = (isCenter ? 1.6 : 1) * u;
      ctx.strokeRect(0.5, 0.5, cell - 1, cell - 1);
      ctx.restore();

      // center plate glow, pulsing while locked
      if (isCenter) {
        var pulseA = 0.18 + (locked ? 0.22 * (0.5 + 0.5 * Math.sin(t * 2.4)) : 0.1 * align);
        glow(ctx, baseX + cell / 2 + ox, baseY + cell / 2 + oy, cell * 0.75, C.info, pulseA * A);
      }
    }

    // alignment readout (ref: "ALIGNMENT: 74%")
    txt(ctx, "ALIGNMENT", gx, gy + gw + 22 * u, 9 * u, hex(C.body, A), { track: 1.4 * u });
    txt(ctx, (locked ? "LOCKED" : pct + "%"), gx + gw, gy + gw + 22 * u, 10 * u,
      hex(locked ? C.info : C.frost, A), { align: "right", track: 0.6 * u });
    vign(ctx, w, h);
    eyebrow(ctx, w, h, u, "PRIVATE MATCHING", A);
    cap(ctx, w, h, u, "PLATES LOCK WITH ZERO FRICTION", A);
  }

  /* ══ 04 · THE NEURAL LEDGER  (ZK-STARK Settlement / Shielded Notes) ════
     A central encrypted shard radiates to satellite shards; faint hashes
     stream on a ring. Private state reconstructs; public sees only roots.    */
  function neural(ctx, t, w, h) {
    var P = 9, lt = t % P, u = h / 560, A = shell(ctx, w, h, lt, P);
    var cx = w / 2, cy = h * 0.44, R = Math.min(w, h) * 0.22;
    // ring of streaming hashes
    if (!window.__ZHIDELABELS) {
      ctx.save(); ctx.globalAlpha = 0.5 * A;
      for (var i = 0; i < 10; i++) {
        var ang = t * 0.12 + (i / 10) * TAU;
        var hx = cx + Math.cos(ang) * R * 1.55, hy = cy + Math.sin(ang) * R * 1.2;
        txt(ctx, "0x" + (rnd(i + 1) * 65535 | 0).toString(16).padStart(2, "0") + "…" + (rnd(i + 4) * 255 | 0).toString(16), hx, hy, 8 * u, hex(C.body, 0.7), { align: "center", base: "middle" });
      }
      ctx.restore();
    }

    // spokes to satellites
    var shards = 6;
    glow(ctx, cx, cy, R * 1.4, C.core, 0.18 * A);
    for (var s = 0; s < shards; s++) {
      var a2 = (s / shards) * TAU - Math.PI / 2 + Math.sin(t * 0.3) * 0.04;
      var sx = cx + Math.cos(a2) * R, sy = cy + Math.sin(a2) * R * 0.92;
      var pulseP = 0.5 + 0.5 * Math.sin(t * 1.5 - s * 1.1);
      ctx.strokeStyle = hex(C.highlight, (0.25 + pulseP * 0.3) * A); ctx.lineWidth = 1 * u;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(sx, sy); ctx.stroke();
      // satellite shard (small diamond)
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(Math.PI / 4); ctx.globalAlpha = A;
      var ss = 9 * u;
      ctx.fillStyle = hex(C.deep, 0.96); ctx.fillRect(-ss, -ss, ss * 2, ss * 2);
      ctx.strokeStyle = hex(C.bright, 0.5 + pulseP * 0.4); ctx.lineWidth = 1; ctx.strokeRect(-ss, -ss, ss * 2, ss * 2);
      ctx.restore();
      // packet traveling inbound (reconstruction)
      var travel = (t * 0.4 + s / shards) % 1;
      var tx = lerp(sx, cx, travel), ty = lerp(sy, cy, travel);
      L.packet(ctx, tx, ty, u, C.frost, (1 - travel) * 0.7 * A, 8);
    }

    // central shard - primary, encrypted
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4 + t * 0.1); ctx.globalAlpha = A;
    var cs = R * 0.34;
    var cg = ctx.createLinearGradient(-cs, -cs, cs, cs);
    cg.addColorStop(0, hex(C.core, 0.98)); cg.addColorStop(1, hex("#080f1c", 0.99));
    ctx.fillStyle = cg; ctx.fillRect(-cs, -cs, cs * 2, cs * 2);
    ctx.strokeStyle = hex(C.bright, 0.7); ctx.lineWidth = 1.4 * u; ctx.strokeRect(-cs, -cs, cs * 2, cs * 2);
    ctx.strokeStyle = hex(C.highlight, 0.4); ctx.lineWidth = 1; ctx.strokeRect(-cs * 0.6, -cs * 0.6, cs * 1.2, cs * 1.2);
    ctx.restore();
    L.lock(ctx, cx, cy, 14 * u, hex(C.frost, A), false);

    if (!window.__ZHIDELABELS) pill(ctx, "NODE STATUS · ENCRYPTED", cx - 66 * u, cy + R * 1.5, u, C.bright, A);
    vign(ctx, w, h);
    eyebrow(ctx, w, h, u, "SHIELDED STATE", A);
    cap(ctx, w, h, u, "BALANCES RECONSTRUCT - CHAIN HOLDS ROOTS", A);
  }

  /* ══ THE DEFLECTION  (MEV-Resistant Execution) ════════════════════════
     A sealed batch at center; predator orders (front-run, sandwich) approach
     from both sides and deflect - there is no exposed intent to target.      */
  function mev(ctx, t, w, h) {
    var P = 6.5, lt = t % P, u = h / 560, A = shell(ctx, w, h, lt, P);
    var cx = w / 2, cy = h * 0.44, bw = Math.min(w, h) * 0.17, bh = Math.min(w, h) * 0.27;
    var DANGER = "#ffb4ab";

    // central sealed batch (cut capsule) with ice glow + lock
    glow(ctx, cx, cy, bw * 1.8, C.info, 0.12 * A);
    L.cutPanel(ctx, cx - bw / 2, cy - bh / 2, bw, bh, 16 * u, hex("#0D1117", 0.97 * A), hex(C.info, 0.5 * A));
    ctx.strokeStyle = hex(C.info, 0.32 * A); ctx.lineWidth = 1 * u;
    ctx.beginPath(); ctx.moveTo(cx - bw * 0.3, cy + bh * 0.12); ctx.lineTo(cx + bw * 0.3, cy + bh * 0.12); ctx.stroke();
    L.lock(ctx, cx, cy - bh * 0.08, 16 * u, hex(C.frost, A), false);
    txt(ctx, "SEALED BATCH", cx, cy + bh / 2 - 12 * u, 8 * u, hex(C.body, A), { align: "center", track: 1 * u });

    // predators approach then deflect away
    [-1, 1].forEach(function (s, k) {
      var approach = ramp(lt, 0.5 + k * 0.2, 2.0);
      var hitX = cx + s * (bw / 2 + 30 * u), startX = cx + s * w * 0.55;
      var x = lerp(startX, hitX, easeOut(clamp(approach, 0, 1)));
      var deflect = ramp(lt, 2.2, 3.8);
      if (deflect > 0) x = lerp(hitX, startX, easeIn(deflect));
      var fade = 1 - ramp(lt, 4.0, 4.8), a = fade * A, laneY = cy + (k ? -15 : 15) * u, dir = -s;
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = hex(DANGER, 0.8); ctx.fillStyle = hex(DANGER, 0.8); ctx.lineWidth = 1.6 * u;
      ctx.beginPath(); ctx.moveTo(x - dir * 22 * u, laneY); ctx.lineTo(x, laneY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, laneY); ctx.lineTo(x - dir * 6 * u, laneY - 4 * u); ctx.lineTo(x - dir * 6 * u, laneY + 4 * u); ctx.closePath(); ctx.fill();
      ctx.restore();
      txt(ctx, k ? "sandwich" : "front-run", startX, laneY - 13 * u, 8 * u, hex(DANGER, 0.75 * fade * A), { align: s < 0 ? "left" : "right", track: 0.8 * u });
    });

    // deflection sparks at the boundary
    var sp = pulse(lt, 1.9, 2.7);
    if (sp > 0) {
      ctx.strokeStyle = hex(C.info, 0.7 * sp * A); ctx.lineWidth = 1.4 * u;
      [-1, 1].forEach(function (s) {
        var hx = cx + s * (bw / 2 + 4 * u);
        for (var ri = 0; ri < 3; ri++) { ctx.beginPath(); ctx.arc(hx, cy, (7 + ri * 7) * u, s < 0 ? Math.PI * 0.6 : -Math.PI * 0.4, s < 0 ? Math.PI * 1.4 : Math.PI * 0.4); ctx.stroke(); }
      });
    }
    vign(ctx, w, h);
    eyebrow(ctx, w, h, u, "MEV-RESISTANT EXECUTION", A);
    cap(ctx, w, h, u, "NO EXPOSED INTENT TO TARGET", A);
  }

  /* ══ THE IMMUTABLE FACT  (ZK-STARK Settlement) - three variations ══════ */

  // A - reference-aligned: two counter-rotating square frames, a steady ice
  //     point with a soft bloom, and orbiting proof text top & bottom.
  function immutableA(ctx, t, w, h) {
    var P = 9, lt = t % P, u = h / 560, A = shell(ctx, w, h, lt, P);
    var cx = w / 2, cy = h * 0.44, R = Math.min(w, h) * 0.25;
    glow(ctx, cx, cy, R * 2.3, C.info, 0.15 * A);
    // outer square frame, slow spin (sharp white)
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4 + t * 0.16);
    ctx.strokeStyle = hex("#ffffff", 0.14 * A); ctx.lineWidth = 1 * u; ctx.strokeRect(-R, -R, 2 * R, 2 * R); ctx.restore();
    // inner square frame, counter-rotate (ice)
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.2 - t * 0.22);
    ctx.strokeStyle = hex(C.info, 0.3 * A); ctx.lineWidth = 1 * u; ctx.strokeRect(-R * 0.7, -R * 0.7, R * 1.4, R * 1.4); ctx.restore();
    // steady bright point
    var tw = 0.85 + 0.15 * Math.sin(t * 1.5);
    glow(ctx, cx, cy, R * 0.5 * tw, C.info, 0.55 * A);
    glow(ctx, cx, cy, 18 * u * tw, C.white, 0.6 * A);
    ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(cx, cy, 3.4 * u, 0, TAU); ctx.fill(); ctx.restore();
    // orbiting proof text
    txt(ctx, "0x82F…91A  VERIFIED", cx, cy - R * 1.3, 8 * u, hex(C.body, 0.62 * A), { align: "center", track: 3 * u });
    txt(ctx, "PROOF GENERATED IN 2.1S", cx, cy + R * 1.34, 8 * u, hex(C.body, 0.62 * A), { align: "center", track: 3 * u });
    vign(ctx, w, h);
    eyebrow(ctx, w, h, u, "ZK-STARK SETTLEMENT", A);
    cap(ctx, w, h, u, "ONE UNDENIABLE POINT OF TRUTH", A);
  }

  // B - compression: nested frames collapse inward, then the point ignites.
  function immutableB(ctx, t, w, h) {
    var P = 8.5, lt = t % P, u = h / 560, A = shell(ctx, w, h, lt, P);
    var cx = w / 2, cy = h * 0.44, R = Math.min(w, h) * 0.24;
    var collapse = ramp(lt, 1.0, 4.4), ignite = ramp(lt, 4.4, 5.4);
    var hold = ramp(lt, 5.4, 6.0) - ramp(lt, 7.6, 8.2);
    if (collapse < 1) {
      for (var i = 0; i < 14; i++) {
        var ang = (i / 14) * TAU + 0.2, prog = clamp((collapse - rnd(i) * 0.3) / 0.5, 0, 1);
        var rr = lerp(R * 1.5, R * 0.2, easeIn(prog));
        var x = cx + Math.cos(ang) * rr, y = cy + Math.sin(ang) * rr * 0.94;
        ctx.fillStyle = hex(C.frost, 0.5 * (1 - prog) * A); ctx.beginPath(); ctx.arc(x, y, 2 * u, 0, TAU); ctx.fill();
      }
    }
    for (var f = 0; f < 3; f++) {
      var fr = R * (1 - f * 0.26) * (1 - collapse * 0.12);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4 + t * 0.08 * (f % 2 ? -1 : 1));
      ctx.strokeStyle = hex(f === 0 ? C.bright : C.highlight, (0.5 - f * 0.12) * A); ctx.lineWidth = (1.4 - f * 0.3) * u;
      ctx.strokeRect(-fr * 0.72, -fr * 0.72, fr * 1.44, fr * 1.44);
      ctx.restore();
    }
    if (ignite > 0) {
      var pr = (10 + ignite * 26) * u * (1 + hold * 0.2);
      glow(ctx, cx, cy, pr * 2.4, C.info, (0.5 + hold * 0.3) * ignite * A);
      glow(ctx, cx, cy, pr, C.white, 0.5 * ignite * A);
      ctx.fillStyle = hex(C.white, ignite * A); ctx.beginPath(); ctx.arc(cx, cy, 3.4 * u, 0, TAU); ctx.fill();
      ctx.save(); ctx.globalAlpha = 0.6 * ignite * A; ctx.strokeStyle = hex(C.info, 1); ctx.lineWidth = 1 * u;
      for (var k = 0; k < 4; k++) { var ra = k * Math.PI / 2 + Math.PI / 4 + t * 0.2; ctx.beginPath(); ctx.moveTo(cx + Math.cos(ra) * pr * 0.4, cy + Math.sin(ra) * pr * 0.4); ctx.lineTo(cx + Math.cos(ra) * pr * 1.8, cy + Math.sin(ra) * pr * 1.8); ctx.stroke(); }
      ctx.restore();
    }
    vign(ctx, w, h);
    eyebrow(ctx, w, h, u, "ZK-STARK SETTLEMENT", A);
    cap(ctx, w, h, u, "SETTLEMENT IS THE FINAL COMPRESSION", A);
  }

  // C - convergence: many interaction lines spiral into one point, ringed by
  //     streaming proof hashes.
  function immutableC(ctx, t, w, h) {
    var P = 8, lt = t % P, u = h / 560, A = shell(ctx, w, h, lt, P);
    var cx = w / 2, cy = h * 0.44, R = Math.min(w, h) * 0.26, conv = lt / P;
    for (var i = 0; i < 26; i++) {
      var base = (i / 26) * TAU, prog = clamp(conv * 1.4 - rnd(i) * 0.4, 0, 1);
      var ang = base + prog * 1.6, rr = lerp(R * 1.5, 5 * u, easeIn(prog));
      var x = cx + Math.cos(ang) * rr, y = cy + Math.sin(ang) * rr * 0.92;
      var ang2 = ang + 0.14, rr2 = rr * 1.07, x2 = cx + Math.cos(ang2) * rr2, y2 = cy + Math.sin(ang2) * rr2 * 0.92;
      ctx.strokeStyle = hex(C.frost, 0.25 * (1 - prog) * A); ctx.lineWidth = 1 * u;
      ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x, y); ctx.stroke();
    }
    glow(ctx, cx, cy, R * 0.6, C.info, 0.42 * A);
    glow(ctx, cx, cy, 16 * u, C.white, 0.6 * A);
    ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(cx, cy, 3 * u, 0, TAU); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.5 * A;
    for (var k = 0; k < 8; k++) { var a2 = t * 0.1 + (k / 8) * TAU; var hx = cx + Math.cos(a2) * R * 1.4, hy = cy + Math.sin(a2) * R * 1.12; txt(ctx, "0x" + (rnd(k + 1) * 65535 | 0).toString(16) + "…", hx, hy, 7.5 * u, hex(C.body, 0.85), { align: "center", base: "middle" }); }
    ctx.restore();
    vign(ctx, w, h);
    eyebrow(ctx, w, h, u, "ZK-STARK SETTLEMENT", A);
    cap(ctx, w, h, u, "THOUSANDS OF INTERACTIONS → ONE FACT", A);
  }

  /* ── helpers for note/tree/root scenes ─────────────────────────────── */
  function rrect(ctx, x, y, w2, h2, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w2, y, x + w2, y + h2, r); ctx.arcTo(x + w2, y + h2, x, y + h2, r);
    ctx.arcTo(x, y + h2, x, y, r); ctx.arcTo(x, y, x + w2, y, r); ctx.closePath();
  }
  function diamondNode(ctx, x, cy, s, A, fill, stroke, lw) {
    ctx.save(); ctx.translate(x, cy); ctx.rotate(Math.PI / 4); ctx.globalAlpha = A;
    ctx.fillStyle = hex(fill, 0.97); ctx.fillRect(-s, -s, s * 2, s * 2);
    ctx.strokeStyle = hex(stroke, 0.85); ctx.lineWidth = (lw || 1.3); ctx.strokeRect(-s, -s, s * 2, s * 2);
    ctx.restore();
  }

  /* Shielded Notes - B · Note Set: private note cards, balances masked, one
     reconstructs locally; public state below shows only commitment hashes.   */
  function noteSet(ctx, t, w, h) {
    var P = 8, lt = t % P, u = h / 560, A = shell(ctx, w, h, lt, P);
    var n = 4, cardW = Math.min(w, h) * 0.16, cardH = cardW * 1.32, gap = w * 0.045;
    var totalW = n * cardW + (n - 1) * gap, x0 = (w - totalW) / 2, cy = h * 0.40;
    var active = Math.floor(lt / 2) % n, local = (lt % 2) / 2;
    for (var i = 0; i < n; i++) {
      var x = x0 + i * (cardW + gap), y = cy - cardH / 2;
      var rec = (i === active) ? smooth(clamp(local / 0.3, 0, 1)) * (1 - smooth(clamp((local - 0.7) / 0.3, 0, 1))) : 0;
      if (rec > 0.05) glow(ctx, x + cardW / 2, y + cardH / 2, cardW * 0.8, C.info, 0.22 * rec * A);
      ctx.save(); ctx.globalAlpha = A;
      var g = ctx.createLinearGradient(x, y, x, y + cardH);
      g.addColorStop(0, hex(C.deep, 0.96)); g.addColorStop(1, hex("#070c15", 0.98));
      ctx.fillStyle = g; rrect(ctx, x, y, cardW, cardH, 4 * u); ctx.fill();
      ctx.strokeStyle = hex(rec > 0 ? C.info : C.mid, 0.5 + rec * 0.5); ctx.lineWidth = (rec > 0 ? 1.5 : 1) * u; ctx.stroke();
      ctx.restore();
      L.lock(ctx, x + cardW / 2, y + cardH * 0.31, 11 * u, hex(C.frost, (0.5 + rec * 0.5) * A), false);
      if (rec > 0.4 && !window.__ZHIDELABELS) {
        txt(ctx, "12.84", x + cardW / 2, y + cardH * 0.66, 13 * u, hex(C.white, rec), { align: "center", base: "middle" });
      } else {
        for (var d = 0; d < 3; d++) { ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = hex(C.bright, 0.5); ctx.beginPath(); ctx.arc(x + cardW * 0.34 + d * cardW * 0.16, y + cardH * 0.66, 2 * u, 0, TAU); ctx.fill(); ctx.restore(); }
      }
    }
    ctx.save(); ctx.globalAlpha = 0.6 * A;
    if (!window.__ZHIDELABELS) {
      txt(ctx, "PUBLIC STATE", w / 2, cy + cardH * 0.74, 8 * u, hex(C.body, 1), { align: "center", track: 2 * u });
      for (var k = 0; k < n; k++) { txt(ctx, "0x" + (rnd(k + 1 + Math.floor(lt)) * 65535 | 0).toString(16).padStart(4, "0"), x0 + cardW / 2 + k * (cardW + gap), cy + cardH * 0.96, 7.5 * u, hex(C.mid, 1), { align: "center" }); }
    }
    ctx.restore();
    vign(ctx, w, h);
    eyebrow(ctx, w, h, u, "SHIELDED NOTE BALANCES", A);
    cap(ctx, w, h, u, "BALANCES RECONSTRUCT LOCALLY", A);
  }

  /* Shielded Notes - C · Commitment Tree: a Merkle tree of note commitments;
     a leaf update re-hashes the path up to the single public root.           */
  function commitTree(ctx, t, w, h) {
    var P = 8, lt = t % P, u = h / 560, A = shell(ctx, w, h, lt, P);
    var cx = w / 2, topY = h * 0.20, levelH = h * 0.155, levels = [1, 2, 4], coords = [];
    for (var l = 0; l < levels.length; l++) {
      var cnt = levels[l], rowY = topY + l * levelH, spread = w * 0.6, row = [];
      for (var i = 0; i < cnt; i++) { var x = cx + (cnt === 1 ? 0 : (i / (cnt - 1) - 0.5) * spread); row.push([x, rowY]); }
      coords.push(row);
    }
    var activeLeaf = Math.floor(lt / 2) % 4, local = (lt % 2) / 2, up = clamp(local / 0.6, 0, 1);
    ctx.lineWidth = 1 * u;
    for (var l2 = 1; l2 < coords.length; l2++) {
      for (var i2 = 0; i2 < coords[l2].length; i2++) {
        var parent = coords[l2 - 1][Math.floor(i2 / 2)], node = coords[l2][i2];
        var onPath = (l2 === 2 && i2 === activeLeaf) || (l2 === 1 && i2 === Math.floor(activeLeaf / 2));
        ctx.strokeStyle = hex(onPath ? C.info : C.highlight, (onPath ? 0.6 * up : 0.25) * A);
        ctx.beginPath(); ctx.moveTo(node[0], node[1]); ctx.lineTo(parent[0], parent[1]); ctx.stroke();
      }
    }
    for (var l3 = 0; l3 < coords.length; l3++) {
      for (var i3 = 0; i3 < coords[l3].length; i3++) {
        var p = coords[l3][i3], isRoot = (l3 === 0), isLeaf = (l3 === coords.length - 1);
        var onPath2 = isRoot || (isLeaf && i3 === activeLeaf) || (l3 === 1 && i3 === Math.floor(activeLeaf / 2));
        var sz = (isRoot ? 13 : isLeaf ? 10 : 11) * u;
        if (isRoot) glow(ctx, p[0], p[1], 26 * u, C.info, 0.3 * A);
        diamondNode(ctx, p[0], p[1], sz, A, C.deep, isRoot ? C.info : (onPath2 ? C.bright : C.mid), (isRoot ? 1.5 : 1) * u);
        if (isLeaf) L.lock(ctx, p[0], p[1], 7 * u, hex(C.frost, 0.8 * A), false);
      }
    }
    txt(ctx, "ROOT", cx, topY - 16 * u, 8 * u, hex(C.info, 0.7 * A), { align: "center", track: 2 * u });
    txt(ctx, "NOTE COMMITMENTS", cx, topY + 2 * levelH + 24 * u, 8 * u, hex(C.body, A), { align: "center", track: 1.8 * u });
    vign(ctx, w, h);
    eyebrow(ctx, w, h, u, "SHIELDED NOTE BALANCES", A);
    cap(ctx, w, h, u, "COMMITMENTS · NULLIFIERS · ROOTS", A);
  }

  /* ZK-STARK - D · Root Transition: old root → proof → new root; the chain
     advances exactly one verified root from public calldata.                 */
  function immutableD(ctx, t, w, h) {
    var P = 8, lt = t % P, u = h / 560, A = shell(ctx, w, h, lt, P);
    var cy = h * 0.44, x1 = w * 0.24, x2 = w * 0.76, mx = w / 2;
    var prog = ramp(lt, 1.2, 4.0), done = ramp(lt, 4.0, 4.8);
    ctx.strokeStyle = hex(C.highlight, 0.4 * A); ctx.lineWidth = 1 * u;
    ctx.beginPath(); ctx.moveTo(x1 + 22 * u, cy); ctx.lineTo(x2 - 22 * u, cy); ctx.stroke();
    diamondNode(ctx, x1, cy, 16 * u, A, "#16223c", C.mid, 1.3 * u);
    diamondNode(ctx, x2, cy, 16 * u, A, done > 0 ? "#0c1830" : "#10182a", done > 0 ? C.info : C.highlight, 1.3 * u);
    txt(ctx, "ROOT n", x1, cy + 30 * u, 8 * u, hex(C.body, 0.7 * A), { align: "center", track: 1.2 * u });
    txt(ctx, "ROOT n+1", x2, cy + 30 * u, 8 * u, hex(done > 0 ? C.info : C.body, 0.7 * A), { align: "center", track: 1.2 * u });
    glow(ctx, mx, cy, 40 * u, C.info, 0.2 * A * (0.5 + 0.5 * prog));
    diamondNode(ctx, mx, cy, 20 * u, A, "#0a1322", C.info, 1.4 * u);
    txt(ctx, "PROOF", mx, cy + 1 * u, 8 * u, hex(C.white, A), { align: "center", base: "middle", track: 1 * u });
    var tx = lerp(x1 + 22 * u, x2 - 22 * u, (t * 0.5) % 1);
    L.packet(ctx, tx, cy, u, C.info, 0.7 * A, 8);
    txt(ctx, "PUBLIC CALLDATA · ROOT TRANSITION", w / 2, cy + h * 0.2, 8 * u, hex(C.body, 0.6 * A), { align: "center", track: 1.6 * u });
    vign(ctx, w, h);
    eyebrow(ctx, w, h, u, "ZK-STARK SETTLEMENT", A);
    cap(ctx, w, h, u, "THE CHAIN ADVANCES ONE VERIFIED ROOT", A);
  }

  /* ZK-STARK - E · Verifier Check: the verifier ticks each proof fact, then
     stamps the batch verified on Starknet.                                   */
  function immutableE(ctx, t, w, h) {
    var P = 8, lt = t % P, u = h / 560, A = shell(ctx, w, h, lt, P);
    var rows = ["FILL VALIDITY", "FEES", "ROOT TRANSITION", "CLEARING PRICE"];
    var cx = w / 2, x0 = w * 0.30, y0 = h * 0.27, rh = h * 0.108;
    for (var i = 0; i < rows.length; i++) {
      var y = y0 + i * rh, on = ramp(lt, 0.8 + i * 0.7, 1.6 + i * 0.7);
      ctx.save(); ctx.globalAlpha = A;
      ctx.strokeStyle = hex(on > 0.5 ? C.info : C.mid, 0.6 + on * 0.4); ctx.lineWidth = 1.2 * u;
      ctx.strokeRect(x0, y - 7 * u, 14 * u, 14 * u);
      if (on > 0.4) { ctx.strokeStyle = hex(C.info, on); ctx.lineWidth = 1.6 * u; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(x0 + 3 * u, y); ctx.lineTo(x0 + 6 * u, y + 4 * u); ctx.lineTo(x0 + 11 * u, y - 4 * u); ctx.stroke(); }
      ctx.restore();
      txt(ctx, rows[i], x0 + 26 * u, y, 9 * u, hex(on > 0.5 ? C.frost : C.body, A), { base: "middle", track: 1.2 * u });
    }
    var all = ramp(lt, 4.2, 5.0);
    if (all > 0) {
      var sy = y0 + rows.length * rh + 6 * u;
      glow(ctx, cx, sy, 44 * u, C.good, 0.2 * all * A);
      txt(ctx, "VERIFIED ON STARKNET", cx, sy + 6 * u, 9 * u, hex(C.good, all * A), { align: "center", track: 2 * u });
    }
    vign(ctx, w, h);
    eyebrow(ctx, w, h, u, "ZK-STARK SETTLEMENT", A);
    cap(ctx, w, h, u, "THE VERIFIER CHECKS EVERY FACT", A);
  }

  /* Shielded Notes - D · Nullifier Set: spent notes burn into nullifiers that
     the public set records; balances never appear.                           */
  function nullifierSet(ctx, t, w, h) {
    var P = 8, lt = t % P, u = h / 560, A = shell(ctx, w, h, lt, P), DANGER = "#ffb4ab";
    var n = 5, sz = Math.min(w, h) * 0.105, gap = w * 0.035;
    var totalW = n * sz + (n - 1) * gap, x0 = (w - totalW) / 2, cy = h * 0.37;
    var spentIdx = Math.floor(lt / 1.6) % n, local = (lt % 1.6) / 1.6;
    for (var i = 0; i < n; i++) {
      var x = x0 + i * (sz + gap), isSpent = (i === spentIdx) && local > 0.4;
      diamondNode(ctx, x + sz / 2, cy, sz / 2, A, C.deep, isSpent ? DANGER : C.bright, 1 * u);
      if (isSpent) {
        ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = hex(DANGER, 0.85); ctx.lineWidth = 1.6 * u; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(x + sz * 0.32, cy - sz * 0.18); ctx.lineTo(x + sz * 0.68, cy + sz * 0.18);
        ctx.moveTo(x + sz * 0.68, cy - sz * 0.18); ctx.lineTo(x + sz * 0.32, cy + sz * 0.18); ctx.stroke(); ctx.restore();
      } else { L.lock(ctx, x + sz / 2, cy, 8 * u, hex(C.frost, 0.8 * A), false); }
    }
    txt(ctx, "PRIVATE NOTES", w / 2, cy - sz * 1.05, 8 * u, hex(C.body, A), { align: "center", track: 2 * u });
    txt(ctx, "PUBLIC NULLIFIER SET", w / 2, cy + h * 0.19, 8 * u, hex(C.body, 0.7 * A), { align: "center", track: 1.8 * u });
    ctx.save(); ctx.globalAlpha = 0.6 * A;
    for (var k = 0; k < n; k++) { var spent = k < spentIdx || (k === spentIdx && local > 0.4); txt(ctx, "0x" + (rnd(k + 3) * 65535 | 0).toString(16).padStart(4, "0"), x0 + sz / 2 + k * (sz + gap), cy + h * 0.25, 7.5 * u, hex(spent ? DANGER : C.mid, 1), { align: "center" }); }
    ctx.restore();
    vign(ctx, w, h);
    eyebrow(ctx, w, h, u, "SHIELDED NOTE BALANCES", A);
    cap(ctx, w, h, u, "SPENT NOTES BECOME NULLIFIERS", A);
  }

  window.ZYLITH_DIAGRAMS = [
    { id: "hero", title: "The Institutional Dark Pool", concept: "Hero",
      mechanism: "A private frequent call-auction darkpool on Starknet. Orders submit privately, clear in fixed epochs, settle under proof.", draw: hero, feature: true },
    { id: "epoch", title: "The Epoch Pulse", concept: "Private Call Auctions",
      meta: "Live Pulse · 0.04ms Precision",
      frameClass: "frame-open",
      mechanism: "Fragmented orders are gathered in secret. At the turn of the epoch, the Pulse aligns disparate shards into a single, optimized price execution line - invisible to the public, mathematically certain for the participant.",
      html:
        '<div class="epoch-stage">' +
        '<div class="ec-frame ec-r1"></div>' +
        '<div class="ec-frame ec-r2"></div>' +
        '<div class="ec-frame ec-r3"></div>' +
        '<div class="ec-line"></div>' +
        '<div class="ec-diamond"></div>' +
        '<div class="ec-shard-a"></div>' +
        '<div class="ec-shard-dot"></div>' +
        '</div>' },
    { id: "commit", title: "Order Commitment", concept: "Order Commitment",
      meta: "Sealed Before Epoch",
      frameClass: "frame-open",
      mechanism: "Each order is bound to a private commitment before its epoch. The public surface carries the commitment and routing metadata; the encrypted payload opens only inside prover ingress during witness assembly.",
      options: [
        { label: "Commit Seal", html:
          '<div class="opt-stage">' +
          '<div class="oc-order"><span class="r a"></span><span class="r b"></span><span class="r c"></span></div>' +
          '<div class="oc-flow"></div>' +
          '<div class="oc-pkt"></div>' +
          '<div class="oc-seal"><svg viewBox="0 0 24 24" fill="none"><rect x="5" y="10.5" width="14" height="9.5" rx="1" stroke="#c6c6cd" stroke-width="1.4"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" stroke="#c6c6cd" stroke-width="1.4"/></svg></div>' +
          '<div class="opt-status">Order → Commitment</div>' +
          '</div>' },
        { label: "Prover Ingress", html:
          '<div class="opt-stage">' +
          '<div class="oc-boundary"></div>' +
          '<div class="oc-blabel">Prover Boundary</div>' +
          '<div class="oc-payload"><svg viewBox="0 0 24 24" fill="none"><rect x="5" y="10.5" width="14" height="9.5" rx="1" stroke="#a8c8ff" stroke-width="1.4"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" stroke="#a8c8ff" stroke-width="1.4"/></svg></div>' +
          '<div class="opt-status">Opened In Witness</div>' +
          '</div>' }
      ] },
    { id: "clearing", title: "The Clearing Line", concept: "Clearing Price",
      meta: "Uniform Price · Locked",
      frameClass: "frame-open",
      mechanism: "Every batch clears at one uniform price. Private limits and hidden LP depth meet where executable volume is greatest, and all eligible orders settle at that single line.",
      options: [
        { label: "Cross", html:
          '<div class="opt-stage">' +
          '<div class="clr-line"></div>' +
          '<div class="clr-supply"></div>' +
          '<div class="clr-demand"></div>' +
          '<div class="clr-chip"><span class="k">Clearing</span><span class="v">0.4831</span></div>' +
          '<div class="clr-node"></div>' +
          '<div class="opt-status">Supply · Demand</div>' +
          '</div>' },
        { label: "Uniform Line", html:
          '<div class="opt-stage">' +
          '<div class="uni-line"></div>' +
          '<span class="uni-tick" style="left:14%;top:calc(50% - 22px);height:22px;animation-delay:0s;"></span>' +
          '<span class="uni-tick" style="left:26%;top:50%;height:18px;animation-delay:0.15s;"></span>' +
          '<span class="uni-tick" style="left:38%;top:calc(50% - 28px);height:28px;animation-delay:0.3s;"></span>' +
          '<span class="uni-tick" style="left:62%;top:50%;height:24px;animation-delay:0.45s;"></span>' +
          '<span class="uni-tick" style="left:74%;top:calc(50% - 20px);height:20px;animation-delay:0.6s;"></span>' +
          '<span class="uni-tick" style="left:86%;top:50%;height:26px;animation-delay:0.75s;"></span>' +
          '<div class="uni-node"></div>' +
          '<div class="clr-chip"><span class="k">Clearing</span><span class="v">0.4831</span></div>' +
          '<div class="opt-status">Orders Aligned</div>' +
          '</div>' },
        { label: "Volume", html:
          '<div class="opt-stage">' +
          '<div class="reco">Recommended</div>' +
          '<div class="vol-base"></div>' +
          '<div class="vol-line"></div>' +
          '<div class="vol-bar" style="left:14%;height:12%;"></div>' +
          '<div class="vol-bar" style="left:23%;height:20%;"></div>' +
          '<div class="vol-bar" style="left:32%;height:32%;"></div>' +
          '<div class="vol-bar" style="left:41%;height:50%;"></div>' +
          '<div class="vol-bar" style="left:50%;height:66%;"></div>' +
          '<div class="vol-bar" style="left:59%;height:50%;"></div>' +
          '<div class="vol-bar" style="left:68%;height:32%;"></div>' +
          '<div class="vol-bar" style="left:77%;height:20%;"></div>' +
          '<div class="vol-bar" style="left:86%;height:12%;"></div>' +
          '<div class="vol-cap">0.4831</div>' +
          '<div class="opt-status">Volume Maximized</div>' +
          '</div>' }
      ] },
    { id: "subsurface", title: "The Subsurface Curve", concept: "Hidden LP Liquidity",
      meta: "System Scanner · Active",
      mechanism: "Private liquidity positions materialize hidden slices across price levels; the auction consumes eligible depth without exposing shape or reserves.", draw: subsurface },
    { id: "kinetic", title: "Private Matching", concept: "Private Matching",
      meta: "Atomic Execution Logic",
      frameClass: "frame-glass",
      mechanism: "The matching engine works as a mechanism of high-security plates. When trade constraints align across parties, the plates lock with zero friction - a single atomic movement that never exposes individual intent.",
      options: [
        { label: "Plates", html:
        '<div class="kin-stage">' +
        '<div class="kin-grid">' +
        '<div class="kin-cell kin-h-a"></div>' +
        '<div class="kin-cell kin-h-b"></div>' +
        '<div class="kin-cell kin-h-c"></div>' +
        '<div class="kin-cell kin-edge"></div>' +
        '<div class="kin-cell kin-center"></div>' +
        '<div class="kin-cell"></div>' +
        '<div class="kin-cell kin-h-d"></div>' +
        '<div class="kin-cell"></div>' +
        '<div class="kin-cell kin-h-e"></div>' +
        '</div>' +
        '<div class="kin-align">Alignment: 74% · hover plates</div>' +
        '</div>' },
        { label: "Constraint Lock", html:
        '<div class="opt-stage lock-stage">' +
        '<div class="lock-half lock-l"></div>' +
        '<div class="lock-half lock-r"></div>' +
        '<div class="lock-seam"></div>' +
        '<div class="opt-status">Constraints Aligned</div>' +
        '</div>' }
      ] },
    { id: "neural", title: "The Shielded Ledger", concept: "Shielded Note Balances",
      meta: "Node Status · Encrypted",
      mechanism: "Funds live as private notes reconstructed locally; public state records commitments, nullifiers, and roots.",
      draw: noteSet,
      variants: [
        { label: "Note Set", draw: noteSet },
        { label: "Neural Ledger", draw: neural },
        { label: "Commitment Tree", draw: commitTree },
        { label: "Nullifier Set", draw: nullifierSet }
      ] },
    { id: "immutable", title: "The Immutable Fact", concept: "ZK-STARK Settlement",
      meta: "Proof Verified On Starknet",
      mechanism: "The clearing result is distilled into a single ZK-STARK proof verified on Starknet - the chain records the fact, not the orders.",
      draw: immutableB,
      variants: [
        { label: "Compression", draw: immutableB },
        { label: "Aligned to reference", draw: immutableA },
        { label: "Convergence", draw: immutableC },
        { label: "Root Transition", draw: immutableD },
        { label: "Verifier Check", draw: immutableE }
      ] },
    { id: "batch", title: "Batch Settlement", concept: "Batch Settlement",
      meta: "One Root · Verified",
      frameClass: "frame-open",
      mechanism: "The private witness carries consumed notes, nullifiers, output commitments, fees, fills, and the clearing price. Public calldata carries root commitments, and Starknet finalizes the batch only after the proof facts verify.",
      options: [
        { label: "Bundle", html:
          '<div class="opt-stage">' +
          '<div class="bs-row" style="top:36%;width:24%;animation-delay:0s;"></div>' +
          '<div class="bs-row" style="top:46%;width:28%;animation-delay:0.18s;"></div>' +
          '<div class="bs-row" style="top:56%;width:21%;animation-delay:0.36s;"></div>' +
          '<div class="bs-row" style="top:66%;width:26%;animation-delay:0.54s;"></div>' +
          '<div class="bs-root"></div>' +
          '<div class="bs-rootlabel">ROOT</div>' +
          '<div class="opt-status">Fills → One Root</div>' +
          '</div>' },
        { label: "Finalize", html:
          '<div class="opt-stage">' +
          '<div class="bs-flow"></div>' +
          '<div class="bs-proof"></div>' +
          '<div class="bs-block"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4 4 10-10" stroke="#a8c8ff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
          '<div class="bs-fin">Finalized on Starknet</div>' +
          '<div class="opt-status">Proof → Finalize</div>' +
          '</div>' }
      ] },
    { id: "mev", title: "The Deflection", concept: "MEV-Resistant Execution",
      meta: "Extraction Surface · Null",
      frameClass: "frame-open",
      mechanism: "Trading intent stays hidden until the batch clears, collapsing the surface for front-running, sandwiching, copy-trading, and order-flow extraction. Predatory flow finds nothing to target and is turned away at the boundary.",
      options: [
        { label: "Sandwich", html:
          '<div class="opt-stage snd-stage">' +
          '<div class="snd-batch"><svg class="mev-lock" viewBox="0 0 24 24" fill="none"><rect x="5" y="10.5" width="14" height="9.5" rx="1" stroke="#c6c6cd" stroke-width="1.4"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" stroke="#c6c6cd" stroke-width="1.4"/></svg></div>' +
          '<div class="snd-pred snd-pred-l"></div>' +
          '<div class="snd-pred snd-pred-r"></div>' +
          '<div class="snd-spark snd-spark-l"></div>' +
          '<div class="snd-spark snd-spark-r"></div>' +
          '<div class="snd-tag snd-tag-l">Front-Run</div>' +
          '<div class="snd-tag snd-tag-r">Back-Run</div>' +
          '<div class="opt-status">Sandwich · Deflected</div>' +
          '</div>' },
        { label: "Barrier Vault", html:
          '<div class="mev-stage">' +
          '<div class="mev-shield mev-shield-2"></div>' +
          '<div class="mev-shield mev-shield-1"></div>' +
          '<div class="mev-flash"></div>' +
          '<div class="mev-vault">' +
          '<div class="mev-core"></div>' +
          '<svg class="mev-lock" viewBox="0 0 24 24" fill="none"><rect x="5" y="10.5" width="14" height="9.5" rx="1" stroke="#c6c6cd" stroke-width="1.4"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" stroke="#c6c6cd" stroke-width="1.4"/></svg>' +
          '<div class="mev-vlabel">SEALED</div>' +
          '</div>' +
          '<div class="mev-vec mev-vec-l"></div>' +
          '<div class="mev-vec mev-vec-r"></div>' +
          '<div class="mev-vec mev-vec-t"></div>' +
          '<div class="mev-status">Extraction Surface · Null</div>' +
          '</div>' },
        { label: "Blind Tape", html:
          '<div class="opt-stage obs-stage">' +
          '<div class="obs-row"><span class="obs-pair">STRK/USDC</span><span class="obs-blk" style="width:38px"></span><span class="obs-blk" style="width:60px"></span><span class="obs-blk" style="width:46px"></span></div>' +
          '<div class="obs-row"><span class="obs-pair">ETH/USDC</span><span class="obs-blk" style="width:52px"></span><span class="obs-blk" style="width:44px"></span><span class="obs-blk" style="width:58px"></span></div>' +
          '<div class="obs-row"><span class="obs-pair">strkBTC/USDC</span><span class="obs-blk" style="width:40px"></span><span class="obs-blk" style="width:62px"></span><span class="obs-blk" style="width:48px"></span></div>' +
          '<div class="obs-row"><span class="obs-pair">STRK/USDC</span><span class="obs-blk" style="width:56px"></span><span class="obs-blk" style="width:42px"></span><span class="obs-blk" style="width:54px"></span></div>' +
          '<div class="obs-scan"></div>' +
          '<div class="opt-status">Observer · No Read</div>' +
          '</div>' }
      ] }
  ];
})();
