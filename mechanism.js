/* Three independent conceptual animations. No engine, conversation capture or storage. */
(() => {
  'use strict';
  const english = document.documentElement.lang === 'en';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const labels = english ? {
    pause: 'Pause', play: 'Play', running: 'Auto loop · Select a step to pause',
    paused: 'Paused · Select any step', outside: 'Paused while off screen',
    reduced: 'Reduced motion · Select a step',
    action: (scope, playing) => `${playing ? 'Pause' : 'Play'}: ${scope}`,
    scene: (number, title) => `Step ${number} of 5. ${title}`
  } : {
    pause: '一時停止', play: '再生', running: '自動ループ · 工程を押すと停止',
    paused: '一時停止中 · 工程を選べます', outside: '画面外のため自動停止中',
    reduced: '動きを抑える設定 · 工程を選べます',
    action: (scope, playing) => `${scope}を${playing ? '一時停止' : '再生'}`,
    scene: (number, title) => `工程${number} / 5。${title}`
  };
  document.querySelectorAll('[data-mechanism]').forEach(root => {
    const nodes = [...root.querySelectorAll('[data-node]')];
    const links = [...root.querySelectorAll('[data-link]')];
    const scenes = [...root.querySelectorAll('[data-mechanism-scene]')];
    const toggle = root.querySelector('[data-motion-toggle]');
    const status = root.querySelector('[data-motion-status]');
    const progress = root.querySelector('[data-motion-progress]');
    const count = root.querySelector('[data-motion-count]');
    const announcement = root.querySelector('[data-motion-announcement]');
    const duration = english ? 7500 : 6500;
    let step = 0, elapsed = 0, frame = 0, lastTime = null;
    let playing = false, inView = false, interacted = false;
    const active = () => playing && inView && !document.hidden;
    function render(announce = false) {
      root.dataset.step = String(step);
      scenes.forEach((scene, i) => { scene.hidden = i !== step; });
      nodes.forEach((node, i) => {
        node.dataset.state = i === step ? 'active' : i < step ? 'past' : 'future';
        if (i === step) node.setAttribute('aria-current', 'step');
        else node.removeAttribute('aria-current');
      });
      links.forEach((link, i) => {
        link.dataset.lit = String(i < step);
        link.dataset.current = String(i === step - 1);
      });
      count.textContent = `${String(step + 1).padStart(2, '0')} / 05`;
      progress.style.width = `${elapsed / duration * 100}%`;
      if (announce) announcement.textContent = labels.scene(step + 1, scenes[step].querySelector('h4').textContent);
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0; lastTime = null;
      root.dataset.playing = String(active());
      toggle.textContent = playing ? labels.pause : labels.play;
      toggle.setAttribute('aria-label', labels.action(root.dataset.scope, playing));
      status.textContent = active() ? labels.running : playing ? labels.outside : preference.matches && !interacted ? labels.reduced : labels.paused;
      if (active()) frame = requestAnimationFrame(tick);
    }
    function tick(now) {
      if (!active()) return;
      if (lastTime !== null) elapsed += Math.min(now - lastTime, 100);
      lastTime = now;
      if (elapsed >= duration) {
        step = (step + 1) % scenes.length; elapsed = 0; render();
      }
      progress.style.width = `${Math.min(100, elapsed / duration * 100)}%`;
      frame = requestAnimationFrame(tick);
    }
    nodes.forEach((node, i) => node.addEventListener('click', () => {
      interacted = true; playing = false; elapsed = 0; step = i;
      render(true); sync();
    }));
    toggle.addEventListener('click', () => {
      interacted = true; playing = !playing;
      sync();
    });
    document.addEventListener('visibilitychange', sync);
    preference.addEventListener('change', () => {
      if (preference.matches) playing = false;
      else if (!interacted && inView) playing = true;
      sync();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting;
        if (inView && !interacted && !preference.matches) playing = true;
        sync();
      }, {threshold: .18}).observe(root);
    } else { inView = true; playing = !preference.matches; }
    render(); sync();
  });
})();
