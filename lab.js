/* Local, fictional walkthrough. This illustrates roles; it does not run either engine. */
(() => {
  'use strict';
  const engine = document.getElementById('memory-demo');
  if (!engine) return;
  const scenes = [...engine.querySelectorAll('[data-scene]')];
  const choices = [...engine.querySelectorAll('[data-step-target]')];
  const playButton = document.getElementById('play-toggle');
  const previousButton = document.getElementById('previous-step');
  const nextButton = document.getElementById('next-step');
  const replayButton = document.getElementById('replay');
  const playIcon = document.getElementById('play-icon');
  const playLabel = document.getElementById('play-label');
  const status = document.getElementById('playback-state');
  const progress = document.getElementById('stage-progress');
  const announcement = document.getElementById('stage-announcement');
  const flowNodes = [...engine.querySelectorAll('[data-flow-node]')];
  const flowArrows = [...engine.querySelectorAll('[data-flow-arrow]')];
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const titles = ['原文を保存', '意味候補を作る', 'レビューして索引へ', '今日の手掛かりを拾う', '同じ場面へ合流', '原文を返す', 'LREで以前と今を比較', 'AIが意味を決める'];
  const owners = ['SHIORI / CAPTURE', 'SHIORI / PREPARE', 'SHIORI / REVIEW', 'SHIORI / RECALL', 'SHIORI / CONVERGENCE', 'SHIORI / SOURCE RETURN', 'LRE / LIVE COMPARISON', 'AI / MEANING & RESPONSE'];
  const durations = [7500, 8000, 8000, 10000, 9000, 8000, 11500, 12000];
  let step = 0;
  let elapsed = 0;
  let playing = false;
  let inView = false;
  let userInteracted = false;
  let frame = 0;
  let lastTime = null;

  function canAnimate() {
    return playing && inView && !document.hidden;
  }
  function syncPlayback() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = null;
    const active = canAnimate();
    engine.dataset.playing = String(active);
    playIcon.textContent = playing ? 'Ⅱ' : '▶';
    playLabel.textContent = playing ? '一時停止' : '再生';
    playButton.setAttribute('aria-label', playing ? 'アニメーションを一時停止' : 'アニメーションを再生');
    if (playing && !active) status.textContent = '画面外のため自動停止中';
    else if (active) status.textContent = '架空の会話 / 自動ループ · 場面を選ぶと一時停止';
    else if (motionPreference.matches && !userInteracted) status.textContent = '動きを抑える設定中 · 矢印で場面を選べます';
    else status.textContent = '一時停止中 · 矢印または番号で場面を選べます';
    if (active) frame = requestAnimationFrame(tick);
  }
  function renderStep(announce = true) {
    scenes.forEach((scene, index) => { scene.hidden = index !== step; });
    choices.forEach((choice, index) => {
      if (index === step) choice.setAttribute('aria-current', 'step');
      else choice.removeAttribute('aria-current');
    });
    engine.dataset.step = String(step);
    const flowPosition = step < 5 ? 0 : step - 4;
    flowNodes.forEach((node, index) => { node.dataset.active = String(index === flowPosition); });
    flowArrows.forEach((arrow, index) => { arrow.dataset.lit = String(index < flowPosition); });
    document.getElementById('stage-count').textContent = String(step + 1).padStart(2, '0');
    document.getElementById('stage-owner').textContent = owners[step];
    progress.style.width = `${Math.min(100, elapsed / durations[step] * 100)}%`;
    previousButton.disabled = step === 0;
    nextButton.disabled = step === scenes.length - 1;
    if (announce) announcement.textContent = `場面${step + 1} / ${scenes.length}。${titles[step]}。`;
  }
  function tick(now) {
    if (!canAnimate()) return;
    if (lastTime !== null) elapsed += Math.min(now - lastTime, 100);
    lastTime = now;
    if (elapsed >= durations[step]) {
      step = (step + 1) % scenes.length;
      elapsed = 0;
      renderStep();
    }
    progress.style.width = `${Math.min(100, elapsed / durations[step] * 100)}%`;
    frame = requestAnimationFrame(tick);
  }
  function selectStep(index) {
    userInteracted = true;
    playing = false;
    engine.dataset.static = 'true';
    step = Math.max(0, Math.min(scenes.length - 1, index));
    elapsed = 0;
    renderStep();
    syncPlayback();
  }
  playButton.addEventListener('click', () => {
    userInteracted = true;
    playing = !playing;
    if (playing) engine.dataset.static = 'false';
    syncPlayback();
  });
  choices.forEach(choice => choice.addEventListener('click', () => selectStep(Number(choice.dataset.stepTarget))));
  previousButton.addEventListener('click', () => selectStep(step - 1));
  nextButton.addEventListener('click', () => selectStep(step + 1));
  replayButton.addEventListener('click', () => {
    userInteracted = true;
    step = 0;
    elapsed = 0;
    playing = true;
    engine.dataset.static = 'false';
    renderStep();
    syncPlayback();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) playing = false;
    syncPlayback();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (inView && !userInteracted && !motionPreference.matches) {
        playing = true;
        engine.dataset.static = 'false';
      }
      syncPlayback();
    }, {threshold: 0.18});
    observer.observe(engine);
  } else {
    inView = true;
    playing = !motionPreference.matches;
    if (playing) engine.dataset.static = 'false';
  }
  renderStep(false);
  syncPlayback();
})();
