/* Control the decorative CSS visual independently of the walkthrough. */
(() => {
  'use strict';
  const visual = document.querySelector('.neural-visual');
  const button = document.getElementById('neural-motion-toggle');
  if (!visual || !button) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const english = document.documentElement.lang === 'en';
  let paused = false;
  let inView = true;
  function syncMotion() {
    const stopped = paused || preference.matches || !inView || document.hidden;
    visual.dataset.paused = String(stopped);
    button.hidden = preference.matches;
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = english ? (paused ? 'Resume motion' : 'Pause motion') : (paused ? '動きを再開' : '動きを一時停止');
  }
  button.addEventListener('click', () => {
    paused = !paused;
    syncMotion();
  });
  preference.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      syncMotion();
    });
    observer.observe(visual);
  }
  syncMotion();
})();
