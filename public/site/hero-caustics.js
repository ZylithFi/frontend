
  /* === Zylith caustics hero + parallax lift === */
  (function () {
    "use strict";
    var STOPS = [
      [0.00, [5, 5, 8]], [0.16, [8, 13, 24]], [0.34, [17, 30, 56]],
      [0.54, [42, 74, 126]], [0.74, [110, 150, 206]], [0.90, [168, 200, 255]], [1.00, [222, 233, 252]]
    ];
    /* tint the bright streaks toward Rose Bone (#E6E0D8) so they read less icy */
    (function () { var SH = [216, 199, 195];
      STOPS[4][1] = [lerp(STOPS[4][1][0], SH[0], 0.30), lerp(STOPS[4][1][1], SH[1], 0.30), lerp(STOPS[4][1][2], SH[2], 0.30)];
      STOPS[5][1] = [lerp(STOPS[5][1][0], SH[0], 0.60), lerp(STOPS[5][1][1], SH[1], 0.60), lerp(STOPS[5][1][2], SH[2], 0.60)];
      STOPS[6][1] = [lerp(STOPS[6][1][0], SH[0], 0.78), lerp(STOPS[6][1][1], SH[1], 0.78), lerp(STOPS[6][1][2], SH[2], 0.78)];
    })();
    function lerp(a, b, t) { return a + (b - a) * t; }
    function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
    var LUT = (function () {
      var a = new Uint8Array(256 * 3);
      for (var i = 0; i < 256; i++) {
        var t = i / 255, s = 0;
        while (s < STOPS.length - 2 && STOPS[s + 1][0] < t) s++;
        var p = STOPS[s], q = STOPS[s + 1], lt = (t - p[0]) / (q[0] - p[0]);
        a[i*3] = lerp(p[1][0], q[1][0], lt); a[i*3+1] = lerp(p[1][1], q[1][1], lt); a[i*3+2] = lerp(p[1][2], q[1][2], lt);
      }
      return a;
    })();
    // Hero motion preset.
    var CV = { freq: 0.6, pow: 2.3, warp: 0.06, base: 0.44, amp: 1.05, speed: 1.6 };

    function hash(x, y) { var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
    function vnoise(x, y) {
      var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      var a = hash(xi, yi), b = hash(xi+1, yi), c = hash(xi, yi+1), d = hash(xi+1, yi+1);
      var ux = xf*xf*(3-2*xf), uy = yf*yf*(3-2*yf);
      return a*(1-ux)*(1-uy) + b*ux*(1-uy) + c*(1-ux)*uy + d*ux*uy;
    }
    function fbm(x, y) { var s = 0, a = 0.5, f = 1; for (var i = 0; i < 4; i++) { s += a * vnoise(x*f, y*f); f *= 2; a *= 0.5; } return s; }

    var canvas = document.getElementById("cxglass"), ctx = canvas.getContext("2d", { alpha: false });
    var off = document.createElement("canvas"), offctx = off.getContext("2d");
    var SCALE = 4, ow, oh, buf, field, cssW, cssH;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var t = 0, last = 0, introClock = 0, powerStart = 0;

    function resize() {
      var r = canvas.getBoundingClientRect();
      cssW = Math.max(1, r.width); cssH = Math.max(1, r.height);
      canvas.width = Math.round(cssW); canvas.height = Math.round(cssH);
      ow = Math.max(2, Math.round(cssW / SCALE)); oh = Math.max(2, Math.round(cssH / SCALE));
      off.width = ow; off.height = oh; buf = offctx.createImageData(ow, oh);
      field = new Float32Array(ow * oh);
      for (var y = 0; y < oh; y++) { var v = y / (oh - 1);
        for (var x = 0; x < ow; x++) { var u = x / (ow - 1);
          var n = fbm(u * 3.2 + 1.7, v * 3.2 + 4.3);
          var dx = (u - 0.5) * 1.15, dy = (v - 0.46) * 1.0;
          var vig = 1 - Math.min(1, (dx*dx + dy*dy) * 1.25);
          field[y*ow + x] = clamp01(0.35 + 0.8 * n) * clamp01(0.35 + 0.75 * vig);
        }
      }
    }
    var ROSE = [[0.0,[0,0,0,0]],[0.28,[96,96,140,0.6]],[0.48,[214,196,202,0.95]],[0.64,[206,178,184,0.85]],[0.82,[130,98,118,0.42]],[1.0,[0,0,0,0]]];
    var A_HAZE = [34,38,58], A_BASE = [7,9,14];
    function render(time, isStatic) {
      var aw = ow, ah = oh;
      offctx.clearRect(0,0,aw,ah);
      var bg = offctx.createLinearGradient(0,0,aw,ah);
      bg.addColorStop(0, "rgb("+(A_BASE[0]+8)+","+(A_BASE[1]+7)+","+(A_BASE[2]+10)+")");
      bg.addColorStop(1, "rgb("+A_BASE[0]+","+A_BASE[1]+","+A_BASE[2]+")");
      offctx.fillStyle = bg; offctx.fillRect(0,0,aw,ah);
      var hz = offctx.createRadialGradient(aw*0.88, ah*0.12, 0, aw*0.88, ah*0.12, aw*0.7);
      hz.addColorStop(0, "rgba("+A_HAZE[0]+","+A_HAZE[1]+","+A_HAZE[2]+",0.5)"); hz.addColorStop(1,"rgba(0,0,0,0)");
      offctx.fillStyle = hz; offctx.fillRect(0,0,aw,ah);      var power = 1, dur = 1.4 / 0.4, pe = (introClock - powerStart) / dur;
      if (!isStatic && pe < 1) { var e = clamp01(pe); power = 1 - (1 - e) * (1 - e); }
      var drift = isStatic ? 0 : Math.sin(time*0.15)*0.04;
      offctx.save(); offctx.translate(aw*(0.72+drift), ah*(0.72-drift)); offctx.rotate(-0.84);
      var bandW = aw*2.0, bandH = aw*0.58;
      var sg = offctx.createLinearGradient(0,-bandH/2,0,bandH/2);
      ROSE.forEach(function(s){ sg.addColorStop(s[0], "rgba("+s[1][0]+","+s[1][1]+","+s[1][2]+","+((s[1][3]!==undefined?s[1][3]:1)*power)+")"); });
      offctx.globalCompositeOperation = "screen"; offctx.fillStyle = sg;
      offctx.fillRect(-bandW/2, -bandH/2, bandW, bandH); offctx.restore();
      ctx.fillStyle = "rgb("+A_BASE[0]+","+A_BASE[1]+","+A_BASE[2]+")"; ctx.fillRect(0,0,cssW,cssH);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      ctx.drawImage(off, 0, 0, aw, ah, 0, 0, cssW, cssH);
    }
    function frame(now) {
      if (!last) last = now;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      t += dt * CV.speed; introClock += dt;
      render(t, false);
      requestAnimationFrame(frame);
    }

    /* Parallax lift on scroll. */
    var hero = document.querySelector(".cx-hero");
    var copy = document.querySelector(".cx-copy");
    var dim = document.querySelector(".cx-dim");
    function ease(x) { return x * x * (3 - 2 * x); }
    var pr = 0, ticking = false;
    function applyScroll() {
      if (reduced) { dim.style.opacity = "0"; return; }
      var e = ease(pr);
      canvas.style.transform = "translateY(" + (-e * 90).toFixed(1) + "px)";
      copy.style.transform = "translateY(" + (-e * 180).toFixed(1) + "px)";
      copy.style.opacity = clamp01(1 - pr * 1.5).toFixed(3);
      dim.style.opacity = (e * 0.92).toFixed(3);
    }
    function onScroll() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var h = hero.offsetHeight || window.innerHeight;
        pr = clamp01(window.scrollY / h); applyScroll(); ticking = false;
      });
    }

    window.addEventListener("resize", resize);
    resize(); applyScroll(); render(2.0, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    if (reduced) { render(2.0, true); } else { requestAnimationFrame(frame); }
  })();
