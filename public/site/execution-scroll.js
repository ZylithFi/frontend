
  /* execution scroll card - internal scroll drives active stage + ticks */
  (function () {
    var stages = document.getElementById("execStages");
    if (!stages) return;
    var slides = stages.querySelectorAll(".exec-slide");
    var dias = document.querySelectorAll(".exec-left .exec-dia");
    var indicators = document.querySelectorAll(".exec-progress [data-i]");
    var card = document.querySelector(".exec-card");
    function setIdx(i) {
      for (var j = 0; j < slides.length; j++) slides[j].classList.toggle("on", j === i);
      for (var d = 0; d < dias.length; d++) dias[d].classList.toggle("on", d === i);
      for (var k = 0; k < indicators.length; k++) indicators[k].classList.toggle("is-on", Number(indicators[k].getAttribute("data-i")) === i);
      if (card) card.style.setProperty("--exec-active", String(i));
    }
    setIdx(0);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { var i = [].indexOf.call(slides, e.target); if (i >= 0) setIdx(i); } });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    slides.forEach(function (s) { io.observe(s); });
  })();
