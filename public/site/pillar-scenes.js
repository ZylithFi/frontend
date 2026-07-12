
  /* Drive shared canvas scenes into pillar diagrams. */
  (function () {
    var DPR = Math.min(2, window.devicePixelRatio || 1);
    var TAU = Math.PI * 2;
    /* Hidden Maker Liquidity curve, rendered without panel chrome or labels. */
    function makerCurve(ctx, t, w, h) {
      ctx.clearRect(0, 0, w, h);
      var u = h / 560, P = 9, lt = t % P;
      var midY = h * 0.44, ampRef = h * 0.46;
      function hx(c, a) { var n = parseInt(c.slice(1), 16); return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
      var C = { info: '#a8c8ff', bright: '#8fb3e8', frost: '#c6c6cd', white: '#e5e2e1', highlight: '#3f4758' };
      function curveY(x) { var p = x / w; return midY + Math.sin(p * Math.PI * 1.4 + t * 0.4) * ampRef * 0.26 + Math.sin(p * Math.PI * 3 - t * 0.2) * ampRef * 0.05; }
      var sweep = lt / P, revealX = w * sweep, revealW = w * 0.26;
      // depth fill clipped below the curve
      ctx.save(); ctx.beginPath(); ctx.moveTo(0, h);
      for (var x = 0; x <= w; x += 4 * u) ctx.lineTo(x, curveY(x));
      ctx.lineTo(w, h); ctx.closePath(); ctx.clip();
      // base veil
      var vg = ctx.createLinearGradient(0, midY - ampRef * 0.3, 0, h);
      vg.addColorStop(0, 'rgba(18,30,54,0.5)'); vg.addColorStop(1, 'rgba(5,7,11,0.92)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
      // luminous depth caustics inside the reveal window
      var grad = ctx.createLinearGradient(revealX - revealW, 0, revealX + revealW, 0);
      grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(0.5, hx(C.bright, 0.30)); grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
      // depth striations
      ctx.strokeStyle = hx(C.highlight, 0.18); ctx.lineWidth = 1;
      for (var dy = midY; dy < h; dy += 9 * u) { ctx.beginPath(); ctx.moveTo(0, dy + Math.sin(t * 0.4) * 2 * u); ctx.lineTo(w, dy); ctx.stroke(); }
      ctx.restore();
      // the curve line, glowing
      ctx.save();
      ctx.strokeStyle = hx(C.frost, 0.7); ctx.lineWidth = 1.6 * u; ctx.beginPath();
      for (var cxp = 0; cxp <= w; cxp += 3 * u) { var yy = curveY(cxp); cxp === 0 ? ctx.moveTo(cxp, yy) : ctx.lineTo(cxp, yy); }
      ctx.stroke();
      // brighten curve within reveal
      ctx.strokeStyle = hx(C.info, 0.9); ctx.lineWidth = 2 * u; ctx.beginPath(); var started = false;
      for (var cx2 = revealX - revealW; cx2 <= revealX + revealW; cx2 += 3 * u) { if (cx2 < 0 || cx2 > w) continue; var yy2 = curveY(cx2); started ? ctx.lineTo(cx2, yy2) : (ctx.moveTo(cx2, yy2), started = true); }
      ctx.stroke(); ctx.restore();
      // reveal marker
      var ry = curveY(revealX);
      var rgl = ctx.createRadialGradient(revealX, ry, 0, revealX, ry, 18 * u);
      rgl.addColorStop(0, hx(C.info, 0.5)); rgl.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rgl; ctx.beginPath(); ctx.arc(revealX, ry, 18 * u, 0, TAU); ctx.fill();
      ctx.fillStyle = hx(C.white, 1); ctx.beginPath(); ctx.arc(revealX, ry, 2.6 * u, 0, TAU); ctx.fill();
    }
    var LOCAL = { 'maker-curve': makerCurve };
    window.__ZHIDELABELS = true;
    window.__ZTRANSPARENTBG = true;
    var byId = {}; (window.ZYLITH_DIAGRAMS || []).forEach(function (p) { byId[p.id] = p; });
    var list = [].map.call(document.querySelectorAll("canvas[data-scene]"), function (cv) {
      var ctx = cv.getContext("2d");
      function resize() { var r = cv.getBoundingClientRect(); cv.width = Math.max(2, Math.round(r.width * DPR)); cv.height = Math.max(2, Math.round(r.height * DPR)); }
      resize(); window.addEventListener("resize", resize);
      var name = cv.getAttribute("data-scene");
      return { cv: cv, ctx: ctx, name: name, draw: LOCAL[name] || (byId[name] || {}).draw };
    });
    var start = performance.now();
    function frame(now) {
      var t = (now - start) / 1000;
      list.forEach(function (c) {
        if (!c.draw) return;
        var r = c.cv.getBoundingClientRect();
        if (r.bottom < -120 || r.top > window.innerHeight + 120) return;
        window.__ZDISABLEMONOGLOW = c.name === "immutable" || c.name === "neural";
        c.draw(c.ctx, t, c.cv.width, c.cv.height);
        window.__ZDISABLEMONOGLOW = false;
      });
      requestAnimationFrame(frame);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { list.forEach(function (c) { var r = c.cv.getBoundingClientRect(); c.cv.width = Math.max(2, Math.round(r.width * DPR)); c.cv.height = Math.max(2, Math.round(r.height * DPR)); }); requestAnimationFrame(frame); });
    else requestAnimationFrame(frame);
  })();
