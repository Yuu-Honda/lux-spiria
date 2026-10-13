/* Replay published aggregates. No engine execution, private data, storage or requests. */
(() => {
  'use strict';
  const run = document.getElementById('recorded-run');
  if (!run) return;
  const english = document.documentElement.lang === 'en';
  const scenes = [...run.querySelectorAll('[data-trial-scene]')];
  const choices = [...run.querySelectorAll('[data-trial-target]')];
  const button = document.getElementById('trial-play');
  const label = document.getElementById('trial-play-label');
  const status = document.getElementById('trial-state');
  const announcement = document.getElementById('trial-announcement');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duration = english ? 13500 : 11000;
  let step = 0, elapsed = 0, frame = 0, lastTime = null;
  let playing = false, inView = false, interacted = false;
  function active() { return playing && inView && !document.hidden; }
  function render(announce = true) {
    run.dataset.trialStep = String(step);
    scenes.forEach((scene, i) => { scene.hidden = i !== step; });
    choices.forEach((choice, i) => {
      if (i === step) choice.setAttribute('aria-current', 'step');
      else choice.removeAttribute('aria-current');
    });
    if (announce) announcement.textContent = english ? `Stage ${step + 1} of 5. ${scenes[step].querySelector('h3').textContent}` : `段階${step + 1} / 5。${scenes[step].querySelector('h3').textContent}`;
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0; lastTime = null;
    run.dataset.playing = String(active());
    label.textContent = english ? (playing ? 'Pause' : 'Play') : (playing ? '一時停止' : '再生');
    button.setAttribute('aria-label', english ? (playing ? 'Pause the recorded result replay' : 'Play the recorded result replay') : (playing ? '実行結果の再生を一時停止' : '実行結果の再生を開始'));
    status.textContent = active() ? (english ? 'Recorded results / auto loop' : '記録済み結果 / 自動ループ') : playing ? (english ? 'Paused while off screen' : '画面外のため自動停止中') : (english ? 'Paused / select a stage' : '一時停止中 / 段階を選べます');
    if (active()) frame = requestAnimationFrame(tick);
  }
  function tick(now) {
    if (!active()) return;
    if (lastTime !== null) elapsed += Math.min(now - lastTime, 100);
    lastTime = now;
    if (elapsed >= duration) { step = (step + 1) % scenes.length; elapsed = 0; render(); }
    frame = requestAnimationFrame(tick);
  }
  choices.forEach(choice => choice.addEventListener('click', () => {
    interacted = true; playing = false; elapsed = 0;
    run.dataset.static = 'true'; step = Number(choice.dataset.trialTarget);
    render(); sync();
  }));
  button.addEventListener('click', () => {
    interacted = true; playing = !playing;
    if (playing) run.dataset.static = 'false';
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', () => { if (preference.matches) playing = false; sync(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (inView && !interacted && !preference.matches) { playing = true; run.dataset.static = 'false'; }
      sync();
    }, {threshold: .18}).observe(run);
  } else { inView = true; playing = !preference.matches; run.dataset.static = String(!playing); }
  render(false); sync();
})();
