/* Testimonial carousel — progressive enhancement.
 *
 * The testimonials are plain markup: without this file they render as the
 * grid in styles.css and every quote stays on the page. This script takes
 * over only once it has found what it needs, then shows one quote at a time
 * and rotates through them.
 *
 * The panel animates its height to fit each quote, because the quotes differ
 * a lot in length and a fixed height sized to the longest leaves the short
 * ones swimming in empty space. Heights are measured from the live elements
 * rather than hard-coded, so they stay right when the text is edited.
 */
(function () {
  'use strict';

  var AUTO_MS = 7000;          /* time each quote is held before advancing */
  var TRANSITION_MS = 420;     /* keep in step with styles.css */

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var ICON = {
    prev: '<path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    next: '<path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    pause: '<rect x="7" y="5" width="3.5" height="14" rx="1.2" fill="currentColor"/><rect x="13.5" y="5" width="3.5" height="14" rx="1.2" fill="currentColor"/>',
    play: '<path d="M8 5.2v13.6L19 12z" fill="currentColor"/>'
  };

  function button(className, label, icon) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = className;
    b.setAttribute('aria-label', label);
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + icon + '</svg>';
    return b;
  }

  function init(root) {
    var track = root.querySelector('[data-carousel-track]');
    if (!track) return;

    var slides = Array.prototype.slice.call(track.querySelectorAll('.testimonial'));
    if (slides.length < 2) return;   /* nothing to rotate through */

    var index = 0;
    var timer = null;
    var stopped = reduceMotion.matches;  /* never auto-rotate under reduced motion */
    var suspended = false;               /* hover/focus hold, separate from the button */

    /* ---- controls ---------------------------------------------------- */

    var controls = document.createElement('div');
    controls.className = 'carousel-controls';

    var prevBtn = button('carousel-btn', 'Previous testimonial', ICON.prev);
    var nextBtn = button('carousel-btn', 'Next testimonial', ICON.next);
    var playBtn = button('carousel-btn carousel-play', '', ICON.pause);

    var dotWrap = document.createElement('div');
    dotWrap.className = 'carousel-dots';
    dotWrap.setAttribute('role', 'group');
    dotWrap.setAttribute('aria-label', 'Choose a testimonial');

    var dots = slides.map(function (slide, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'carousel-dot';
      d.setAttribute('aria-label', 'Testimonial ' + (i + 1) + ' of ' + slides.length);
      d.addEventListener('click', function () { stop(); show(i); });
      dotWrap.appendChild(d);
      return d;
    });

    controls.appendChild(prevBtn);
    controls.appendChild(dotWrap);
    controls.appendChild(nextBtn);
    controls.appendChild(playBtn);

    /* ---- height ------------------------------------------------------ */

    function setHeight(animate) {
      var h = slides[index].getBoundingClientRect().height;
      if (!h) return;
      if (!animate) {
        var previous = track.style.transition;
        track.style.transition = 'none';
        track.style.height = h + 'px';
        void track.offsetHeight;              /* flush, so the next frame animates */
        track.style.transition = previous;
        return;
      }
      track.style.height = h + 'px';
    }

    /* ---- moving between slides --------------------------------------- */

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (slide, n) {
        var active = n === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        slide.inert = !active;                /* keep hidden quotes out of tab order */
      });
      dots.forEach(function (d, n) {
        if (n === index) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
      setHeight(true);
    }

    function advance(step) { show(index + step); }

    /* ---- auto-rotation ------------------------------------------------ */

    function tick() {
      if (stopped || suspended) return;
      timer = window.setTimeout(function () { advance(1); tick(); }, AUTO_MS);
    }

    function clear() {
      if (timer !== null) { window.clearTimeout(timer); timer = null; }
    }

    function syncPlayButton() {
      var paused = stopped;
      playBtn.setAttribute('aria-label', paused ? 'Play testimonials' : 'Pause testimonials');
      playBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        (paused ? ICON.play : ICON.pause) + '</svg>';
      /* A live region would fight the rotation while it is running, so it is
         only announced once the carousel is holding still. */
      track.setAttribute('aria-live', paused ? 'polite' : 'off');
    }

    function stop() { stopped = true; clear(); syncPlayButton(); }
    function play() { stopped = false; clear(); tick(); syncPlayButton(); }

    /* A hover or a focus holds the rotation without overriding the button:
       moving away resumes only if the visitor had not paused it themselves. */
    function suspend() { suspended = true; clear(); }
    function resume() { suspended = false; if (!stopped) { clear(); tick(); } }

    playBtn.addEventListener('click', function () { if (stopped) play(); else stop(); });
    prevBtn.addEventListener('click', function () { stop(); advance(-1); });
    nextBtn.addEventListener('click', function () { stop(); advance(1); });

    root.addEventListener('mouseenter', suspend);
    root.addEventListener('mouseleave', resume);
    root.addEventListener('focusin', suspend);
    root.addEventListener('focusout', function (e) {
      if (!root.contains(e.relatedTarget)) resume();
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); stop(); advance(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); stop(); advance(1); }
    });

    /* Swipe, for touch. Ignores mostly-vertical drags so it does not fight
       the page scroll. */
    var touchX = null, touchY = null;
    track.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].clientX;
      touchY = e.changedTouches[0].clientY;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      var dy = e.changedTouches[0].clientY - touchY;
      touchX = touchY = null;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
      stop();
      advance(dx < 0 ? 1 : -1);
    }, { passive: true });

    /* Rotating while the tab is hidden just burns the queue. */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clear();
      else if (!stopped && !suspended) { clear(); tick(); }
    });

    reduceMotion.addEventListener('change', function (e) {
      if (e.matches) stop();
    });

    /* ---- go ------------------------------------------------------------ */

    root.setAttribute('aria-roledescription', 'carousel');
    root.setAttribute('aria-label', 'Testimonials');
    slides.forEach(function (slide, i) {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', (i + 1) + ' of ' + slides.length);
    });

    root.classList.add('is-carousel');
    root.appendChild(controls);

    show(0);
    setHeight(false);        /* first paint should not animate up from zero */
    syncPlayButton();
    if (!stopped) tick();

    /* Re-measure whenever the live text reflows: viewport resize, a font
       finishing loading, or an edit to the quotes. */
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () { setHeight(false); });
      slides.forEach(function (slide) { ro.observe(slide); });
    } else {
      window.addEventListener('resize', function () { setHeight(false); });
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { setHeight(false); });
    }
  }

  var roots = document.querySelectorAll('[data-carousel]');
  Array.prototype.forEach.call(roots, init);
}());
