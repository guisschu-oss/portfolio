(function(){
  "use strict";

  var yearEl = document.getElementById('year-line');
  if (yearEl) yearEl.textContent = '© ' + new Date().getFullYear() + ' Guilherme Schuchardt.';

  /* ---------- mobile nav ---------- */
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links){
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      });
    });
  }

  /* ---------- active nav link on scroll ---------- */
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = navAnchors.map(function(a){ return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window){
    var byId = {};
    navAnchors.forEach(function(a){ byId[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var link = byId[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting){
          navAnchors.forEach(function(l){ l.removeAttribute('aria-current'); });
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin:'-45% 0px -50% 0px', threshold:0 });
    sections.forEach(function(s){ io.observe(s); });
  }

  /* ---------- generative project thumbnails ---------- */
  document.querySelectorAll('.thumb-canvas').forEach(function(cv){
    var ctx = cv.getContext('2d');
    var pattern = cv.getAttribute('data-pattern');

    function size(){
      var rect = cv.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(rect.width * dpr);
      cv.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: rect.width, h: rect.height };
    }
    var d = size();

    ctx.fillStyle = '#131320';
    ctx.fillRect(0, 0, d.w, d.h);

    if (pattern === 'labirinto'){
      ctx.strokeStyle = 'rgba(194,42,60,0.45)';
      ctx.lineWidth = 1.4;
      var cell = 16;
      for (var y = 0; y < d.h; y += cell){
        for (var x = 0; x < d.w; x += cell){
          if (Math.random() > 0.55){ ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + cell, y); ctx.stroke(); }
          if (Math.random() > 0.55){ ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + cell); ctx.stroke(); }
        }
      }
    } else if (pattern === 'terminal'){
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(77,61,219,0.65)';
      var lines = ['>>> 12 + 8', '20', '>>> 9 * 3', '27', '>>> 100 / 4', '25', '>>> _'];
      lines.forEach(function(l, i){ ctx.fillText(l, 10, 46 + i * 15); });
    } else if (pattern === 'grid'){
      ctx.strokeStyle = 'rgba(245,243,241,0.14)';
      ctx.setLineDash([3,3]);
      ctx.lineWidth = 1;
      for (var gx = 0; gx < d.w; gx += 18){ ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,d.h); ctx.stroke(); }
      for (var gy = 0; gy < d.h; gy += 18){ ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(d.w,gy); ctx.stroke(); }
    } else if (pattern === 'boxes'){
      ctx.strokeStyle = 'rgba(77,61,219,0.6)';
      ctx.setLineDash([4,4]);
      ctx.lineWidth = 1.3;
      var bs = 22, pad = 8;
      for (var by = pad; by < d.h - pad; by += bs + 6){
        for (var bx = pad; bx < d.w - pad; bx += bs + 6){
          ctx.strokeRect(bx, by, bs, bs * 0.7);
        }
      }
    }
  });
})();
