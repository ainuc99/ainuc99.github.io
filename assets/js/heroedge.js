(function () {

  var DUR        = 900;
  var AUTO_DELAY = 5500;

  var slides    = Array.from(document.querySelectorAll('.hs-slide'));
  var dots      = Array.from(document.querySelectorAll('.hs-dot'));
  var prevBtn   = document.getElementById('hsArr-prev');
  var nextBtn   = document.getElementById('hsArr-next');
  var numEl     = document.getElementById('hsNum');

  var current   = 0;
  var animating = false;
  var autoTimer = null;
  var rafId     = null;
  var progStart = null;

  /* ── Progress bar ──────────────────────────── */
  function startProgress() {
    cancelAnimationFrame(rafId);
    progStart = null;
    rafId = requestAnimationFrame(tick);
  }

  function tick(now) {
    if (!progStart) progStart = now;
    var t = Math.min((now - progStart) / AUTO_DELAY, 1);
    if (t < 1) rafId = requestAnimationFrame(tick);
  }

  /* ── Slide transition ──────────────────────── */
  function goTo(next) {
    if (animating || next === current) return;
    animating = true;

    var leaving  = slides[current];
    var entering = slides[next];

    leaving.classList.add('is-leaving');
    leaving.classList.remove('is-active');
    entering.classList.add('is-entering');

    dots[current].classList.remove('is-active');
    dots[next].classList.add('is-active');

    // Actualizar contador numérico del nav
    numEl.textContent = (next + 1) + '';

    var padded = next + 1 < 10 ? '0' + (next + 1) : '' + (next + 1);
    entering.querySelector('.hs-index').textContent = padded;

    setTimeout(function () {
        leaving.classList.remove('is-leaving');
        entering.classList.remove('is-entering');
        entering.classList.add('is-active');
        current   = next;
        animating = false;
        startProgress();
    }, DUR);
  }

  /* ── Auto advance ──────────────────────────── */
  function advance(dir) {
    clearTimeout(autoTimer);
    cancelAnimationFrame(rafId);
    goTo((current + dir + slides.length) % slides.length);
    schedule();
  }

  function schedule() {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(function () {
      advance(1);
    }, AUTO_DELAY);
  }

  /* ── Events ────────────────────────────────── */
  nextBtn.addEventListener('click', function () { advance(1); });
  prevBtn.addEventListener('click', function () { advance(-1); });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      if (i === current) return;
      clearTimeout(autoTimer);
      cancelAnimationFrame(rafId);
      goTo(i);
      schedule();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') advance(1);
    if (e.key === 'ArrowLeft')  advance(-1);
  });

  /* ── Init ──────────────────────────────────── */
  schedule();
  startProgress();

})();