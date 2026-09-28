/* Scripts for the homepage: portrait fallback, the "Show all news" button,
   section highlighting, the "last updated" date, the visitor counter and the
   interactive uncertainty plot.
   You normally don't need to edit this file: the visitor-counter settings
   live in index.html (search for "VISITOR COUNTER"). */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  portraitFallback();
  newsToggle();
  publicationFilter();
  sectionHighlight();
  lastUpdated();
  visitorCounter();
  uncertaintyPlot();

  /* ---------- Show initials until a photo is added ---------- */
  function portraitFallback() {
    var img = document.querySelector('.portrait img');
    if (!img) return;
    var fail = function () { img.parentNode.classList.add('is-empty'); };
    if (img.complete && !img.naturalWidth) fail();
    else img.addEventListener('error', fail);
  }

  /* ---------- News and Blogs: show the first N items, with a button for the rest ---------- */
  function newsToggle() {
    Array.prototype.forEach.call(document.querySelectorAll('ol[data-show]'), collapseList);
  }
  function collapseList(list) {
    var noun = list.getAttribute('data-noun') || 'items';
    var limit = parseInt(list.getAttribute('data-show'), 10) || 8;
    var items = Array.prototype.slice.call(list.children);
    if (items.length <= limit) return;
    var extra = items.slice(limit);
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'text-button more';
    button.setAttribute('aria-controls', list.id);
    function set(open) {
      extra.forEach(function (li) { li.hidden = !open; });
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? 'Show fewer' : 'Show all ' + items.length + ' ' + noun;
    }
    button.addEventListener('click', function () {
      var open = button.getAttribute('aria-expanded') !== 'true';
      set(open);
      if (!open) button.scrollIntoView({ block: 'nearest' });
    });
    set(false);
    list.insertAdjacentElement('afterend', button);
  }

  /* ---------- Publications: switch between all papers and the selected ones ---------- */
  function publicationFilter() {
    var section = document.getElementById('publications');
    if (!section) return;
    var groups = Array.prototype.slice.call(section.querySelectorAll('.pub-year-group'));
    var items = Array.prototype.slice.call(section.querySelectorAll('li.pub'));
    var picks = items.filter(function (li) { return li.classList.contains('is-selected'); });
    if (!items.length || !picks.length) return;

    var bar = document.createElement('div');
    bar.className = 'pub-filter';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Show publications');
    function makeButton(label, count, view) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('data-view', view);
      b.appendChild(document.createTextNode(label));
      var c = document.createElement('span');
      c.className = 'count';
      c.textContent = count;
      b.appendChild(c);
      bar.appendChild(b);
      return b;
    }
    // "Selected" comes first and is what visitors see first; "All" shows every paper.
    var buttons = [makeButton('Selected', picks.length, 'selected'), makeButton('All', items.length, 'all')];

    function show(view) {
      var only = view === 'selected';
      section.classList.toggle('only-selected', only);
      items.forEach(function (li) { li.hidden = only && !li.classList.contains('is-selected'); });
      groups.forEach(function (g) { g.hidden = only && !g.querySelector('li.is-selected'); });
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === view)); });
    }
    bar.addEventListener('click', function (event) {
      var b = event.target.closest('button');
      if (b) show(b.getAttribute('data-view'));
    });
    show('selected');
    var anchor = section.querySelector('.prose') || section.querySelector('h2');
    anchor.insertAdjacentElement('afterend', bar);
  }

  /* ---------- Highlight the section you are reading in the top bar ---------- */
  function sectionHighlight() {
    if (!('IntersectionObserver' in window)) return;
    var bar = document.querySelector('.sections ul');
    var links = Array.prototype.slice.call(document.querySelectorAll('.sections a[href^="#"]'));
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);
    if (!bar || !sections.length) return;
    var visible = {};
    var current = null;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var active = sections.filter(function (s) { return visible[s.id]; })[0];
      if (!active || active === current) return;
      current = active;
      links.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + active.id;
        if (on) {
          a.setAttribute('aria-current', 'true');
          if (bar.scrollWidth > bar.clientWidth) {
            bar.scrollTo({ left: a.offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
          }
        } else {
          a.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- "Last updated": uses the date GitHub Pages published the page ---------- */
  function lastUpdated() {
    var el = document.querySelector('[data-last-updated]');
    if (!el) return;
    var d = new Date(document.lastModified);
    // If the server sent no date, the browser reports "now"; keep the text in the HTML then.
    if (isNaN(d.getTime()) || Math.abs(Date.now() - d.getTime()) < 60 * 1000) return;
    el.setAttribute('datetime', d.toISOString().slice(0, 10));
    el.textContent = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  /* ---------- Visitor counter ---------- */
  function visitorCounter() {
    var box = document.getElementById('visits');
    if (!box) return;
    var number = box.querySelector('[data-visits-number]');
    var label = box.querySelector('[data-visits-label]');
    var provider = (box.getAttribute('data-provider') || '').trim().toLowerCase();

    function show(value) {
      var text = typeof value === 'number' ? value.toLocaleString('en-US') : String(value).trim();
      if (!text) return;
      number.textContent = text;
      if (label) label.textContent = text === '1' ? 'visitor' : 'visitors';
      box.hidden = false;
    }

    function loadScript(src, attrs) {
      var s = document.createElement('script');
      s.async = true;
      s.src = src;
      Object.keys(attrs || {}).forEach(function (k) { s.setAttribute(k, attrs[k]); });
      document.head.appendChild(s);
      return s;
    }

    if (provider === 'goatcounter') {
      // GoatCounter (goatcounter.com): records the visit, then reads the site total.
      var code = (box.getAttribute('data-code') || '').trim().toLowerCase();
      if (!/^[a-z0-9][a-z0-9-]*$/.test(code)) return; // no code yet: stay hidden
      var base = 'https://' + code + '.goatcounter.com';
      loadScript('https://gc.zgo.at/count.js', { 'data-goatcounter': base + '/count' });
      if (!window.fetch) return;
      fetch(base + '/counter/TOTAL.json', { mode: 'cors', credentials: 'omit' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
          if (!data) return;
          var value = data.count != null ? data.count : data.count_unique;
          if (value != null) show(value);
        })
        .catch(function () { /* blocked or offline: stay hidden */ });
    } else if (provider === 'busuanzi') {
      // Busuanzi 不蒜子 (busuanzi.ibruce.info): no sign-up; it fills in the element below.
      var target = document.createElement('span');
      target.id = 'busuanzi_value_site_uv';
      number.textContent = '';
      number.appendChild(target);
      var watch = new MutationObserver(function () {
        if (target.textContent.trim()) {
          watch.disconnect();
          show(target.textContent);
        }
      });
      watch.observe(target, { childList: true, characterData: true, subtree: true });
      loadScript('https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js');
    }
  }

  /* ---------- The uncertainty plot: a small Gaussian process, fitted live ---------- */
  function uncertaintyPlot() {
    var figure = document.getElementById('posterior');
    if (!figure) return;
    var svg = figure.querySelector('svg');
    var queryButton = figure.querySelector('[data-action="query"]');
    var resetButton = figure.querySelector('[data-action="reset"]');
    var NS = 'http://www.w3.org/2000/svg';

    function make(name, cls) {
      var e = document.createElementNS(NS, name);
      if (cls) e.setAttribute('class', cls);
      return e;
    }
    var outer = make('path', 'band-outer');
    var inner = make('path', 'band-inner');
    var meanLine = make('path', 'mean');
    var dots = make('g', 'obs');
    var ghost = make('circle', 'ghost');
    ghost.setAttribute('r', '5');
    ghost.style.display = 'none';
    svg.appendChild(outer); svg.appendChild(inner); svg.appendChild(meanLine);
    svg.appendChild(dots); svg.appendChild(ghost);

    var LENGTH = 0.075;   // kernel length-scale, as a fraction of the width
    var SIGNAL = 1;       // prior variance
    var NOISE = 0.003;    // observation noise variance
    var YMAX = 2.6;       // half of the vertical range shown
    var GRID = 180;
    var MAX_POINTS = 40;

    var xs = [];
    for (var g = 0; g < GRID; g++) xs.push(g / (GRID - 1));
    function truth(x) {
      return 0.9 * Math.sin(2 * Math.PI * (1.2 * x + 0.05)) + 0.45 * Math.sin(2 * Math.PI * (3.4 * x + 0.3));
    }
    var seed = [0.07, 0.19, 0.44, 0.52, 0.88].map(function (x) { return { x: x, y: truth(x) }; });
    var points = [];
    var W = 0, H = 0, frame = 0;
    var shown = prior();

    function kernel(a, b) { var d = (a - b) / LENGTH; return SIGNAL * Math.exp(-0.5 * d * d); }
    function prior() {
      var mu = new Float64Array(GRID), sd = new Float64Array(GRID);
      for (var i = 0; i < GRID; i++) sd[i] = Math.sqrt(SIGNAL);
      return { mu: mu, sd: sd };
    }

    // Exact GP regression: Cholesky factor of K + noise, then mean and s.d. on the grid.
    function fit(obs) {
      var n = obs.length;
      if (!n) return prior();
      var L = [], i, j, k, s;
      for (i = 0; i < n; i++) {
        L.push(new Float64Array(n));
        for (j = 0; j <= i; j++) {
          s = kernel(obs[i].x, obs[j].x) + (i === j ? NOISE : 0);
          for (k = 0; k < j; k++) s -= L[i][k] * L[j][k];
          L[i][j] = i === j ? Math.sqrt(Math.max(s, 1e-12)) : s / L[j][j];
        }
      }
      function forward(b) {
        var z = new Float64Array(n);
        for (var r = 0; r < n; r++) {
          var t = b[r];
          for (var c = 0; c < r; c++) t -= L[r][c] * z[c];
          z[r] = t / L[r][r];
        }
        return z;
      }
      function backward(z) {
        var a = new Float64Array(n);
        for (var r = n - 1; r >= 0; r--) {
          var t = z[r];
          for (var c = r + 1; c < n; c++) t -= L[c][r] * a[c];
          a[r] = t / L[r][r];
        }
        return a;
      }
      var alpha = backward(forward(obs.map(function (p) { return p.y; })));
      var mu = new Float64Array(GRID), sd = new Float64Array(GRID), kx = new Float64Array(n);
      for (var gi = 0; gi < GRID; gi++) {
        var m = 0;
        for (i = 0; i < n; i++) { kx[i] = kernel(obs[i].x, xs[gi]); m += kx[i] * alpha[i]; }
        var v = forward(kx), q = 0;
        for (i = 0; i < n; i++) q += v[i] * v[i];
        mu[gi] = m;
        sd[gi] = Math.sqrt(Math.max(SIGNAL - q, 1e-9));
      }
      return { mu: mu, sd: sd };
    }

    function sx(x) { return x * W; }
    function sy(y) { return H / 2 - (y / YMAX) * (H / 2); }
    function f(n) { return Math.round(n * 10) / 10; }

    function band(state, z) {
      var d = '', i;
      for (i = 0; i < GRID; i++) d += (i ? 'L' : 'M') + f(sx(xs[i])) + ' ' + f(sy(state.mu[i] + z * state.sd[i]));
      for (i = GRID - 1; i >= 0; i--) d += 'L' + f(sx(xs[i])) + ' ' + f(sy(state.mu[i] - z * state.sd[i]));
      return d + 'Z';
    }
    function line(state) {
      var d = '';
      for (var i = 0; i < GRID; i++) d += (i ? 'L' : 'M') + f(sx(xs[i])) + ' ' + f(sy(state.mu[i]));
      return d;
    }
    function draw(state) {
      if (!W) return;
      outer.setAttribute('d', band(state, 2));
      inner.setAttribute('d', band(state, 1));
      meanLine.setAttribute('d', line(state));
    }
    function drawPoints() {
      while (dots.firstChild) dots.removeChild(dots.firstChild);
      var r = W < 600 ? 3.5 : 4.25;
      points.forEach(function (p) {
        var c = make('circle');
        c.setAttribute('cx', f(sx(p.x)));
        c.setAttribute('cy', f(sy(p.y)));
        c.setAttribute('r', r);
        dots.appendChild(c);
      });
    }

    function update(animate) {
      var target = fit(points);
      drawPoints();
      cancelAnimationFrame(frame);
      if (!animate || reduceMotion || !W) { shown = target; draw(shown); return; }
      var from = shown, start = performance.now(), DURATION = 420;
      var now = { mu: new Float64Array(GRID), sd: new Float64Array(GRID) };
      function step(t) {
        var p = Math.min(1, (t - start) / DURATION), e = 1 - Math.pow(1 - p, 3);
        for (var i = 0; i < GRID; i++) {
          now.mu[i] = from.mu[i] + (target.mu[i] - from.mu[i]) * e;
          now.sd[i] = from.sd[i] + (target.sd[i] - from.sd[i]) * e;
        }
        shown = now;
        draw(now);
        if (p < 1) frame = requestAnimationFrame(step);
        else shown = target;
      }
      frame = requestAnimationFrame(step);
    }

    // If someone interacts during the opening animation, finish it at once.
    var introTimers = [];
    function finishIntro() {
      if (!introTimers.length) return;
      introTimers.forEach(clearTimeout);
      introTimers = [];
      seed.forEach(function (p) { if (points.indexOf(p) < 0) points.push(p); });
    }

    function addPoint(p) {
      finishIntro();
      points.push(p);
      if (points.length > MAX_POINTS) points.shift();
      if (resetButton) resetButton.hidden = false;
      update(true);
    }

    function localXY(event) {
      var box = svg.getBoundingClientRect();
      return { x: event.clientX - box.left, y: event.clientY - box.top };
    }

    svg.addEventListener('click', function (event) {
      if (!W) return;
      var pos = localXY(event);
      var x = Math.min(1, Math.max(0, pos.x / W));
      var y = (H / 2 - pos.y) / (H / 2) * YMAX;
      addPoint({ x: x, y: Math.max(-YMAX * 0.92, Math.min(YMAX * 0.92, y)) });
    });
    svg.addEventListener('pointermove', function (event) {
      if (event.pointerType !== 'mouse') return;
      var pos = localXY(event);
      ghost.setAttribute('cx', f(pos.x));
      ghost.setAttribute('cy', f(pos.y));
      ghost.style.display = '';
    });
    svg.addEventListener('pointerleave', function () { ghost.style.display = 'none'; });

    // "Query where it's least certain": add an observation where the band is widest.
    if (queryButton) queryButton.addEventListener('click', function () {
      finishIntro();
      var state = fit(points), best = -1, widest = -1;
      for (var i = 0; i < GRID; i++) {
        if (xs[i] < 0.03 || xs[i] > 0.97) continue;
        if (state.sd[i] > widest) { widest = state.sd[i]; best = i; }
      }
      if (best >= 0) addPoint({ x: xs[best], y: truth(xs[best]) });
    });
    if (resetButton) resetButton.addEventListener('click', function () {
      finishIntro();
      points = seed.slice();
      resetButton.hidden = true;
      update(true);
      if (queryButton) queryButton.focus();
    });

    function resize() {
      var box = svg.getBoundingClientRect();
      if (!box.width || !box.height) return;
      W = box.width; H = box.height;
      svg.setAttribute('viewBox', '0 0 ' + f(W) + ' ' + f(H));
      draw(shown);
      drawPoints();
    }
    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(svg);
    else window.addEventListener('resize', resize);

    // Opening moment: start from the prior and let the first observations arrive one by one.
    if (reduceMotion) {
      points = seed.slice();
      update(false);
    } else {
      update(false);
      introTimers = seed.map(function (p, i) {
        return setTimeout(function () {
          points.push(p);
          if (i === seed.length - 1) introTimers = [];
          update(true);
        }, 450 + i * 280);
      });
    }
  }
})();
