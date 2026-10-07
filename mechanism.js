/* Scroll-linked conceptual diagrams. No engine, conversation capture or storage. */
(() => {
  'use strict';
  const english = document.documentElement.lang === 'en';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const labels = english ? {
    scroll: 'Scroll down to advance · Up to revisit',
    reading: 'Scroll to read each step',
    scene: (number, title) => `Step ${number} of 5. ${title}`
  } : {
    scroll: '下へスクロールで進む · 上へ戻すと見直せます',
    reading: 'スクロールして工程を読む',
    scene: (number, title) => `工程${number} / 5。${title}`
  };
  const clamp = value => Math.max(0, Math.min(1, value));
  const stories = [...document.querySelectorAll('[data-mechanism]')].map(root => ({
    root,
    track: root.closest('[data-scroll-story]'),
    nodes: [...root.querySelectorAll('[data-node]')],
    links: [...root.querySelectorAll('[data-link]')],
    scenes: [...root.querySelectorAll('[data-mechanism-scene]')],
    previous: root.querySelector('[data-scroll-previous]'),
    next: root.querySelector('[data-scroll-next]'),
    status: root.querySelector('[data-motion-status]'),
    progress: root.querySelector('[data-motion-progress]'),
    count: root.querySelector('[data-motion-count]'),
    announcement: root.querySelector('[data-motion-announcement]'),
    step: -1, enabled: false, range: 0, pinTop: 16
  })).filter(story => story.track);
  if (!stories.length) return;

  function render(story, step) {
    if (story.step === step) return;
    story.step = step;
    story.root.dataset.step = String(step);
    story.scenes.forEach((scene, index) => { scene.hidden = story.enabled && index !== step; });
    story.nodes.forEach((node, index) => {
      node.dataset.state = index === step ? 'active' : index < step ? 'past' : 'future';
      if (index === step) node.setAttribute('aria-current', 'step');
      else node.removeAttribute('aria-current');
    });
    story.links.forEach((link, index) => {
      link.dataset.lit = String(index < step);
      link.dataset.current = String(index === step - 1);
    });
    story.previous.disabled = step === 0;
    story.next.disabled = step === story.scenes.length - 1;
    story.count.textContent = `${String(step + 1).padStart(2, '0')} / 05`;
  }

  function update() {
    stories.forEach(story => {
      let position, step;
      if (story.enabled) {
        const start = story.track.getBoundingClientRect().top + window.scrollY - story.pinTop;
        position = clamp((window.scrollY - start) / story.range);
        step = Math.min(story.scenes.length - 1, Math.floor(position * story.scenes.length));
      } else {
        const distances = story.scenes.map(scene => {
          const rect = scene.getBoundingClientRect();
          return Math.abs(rect.top + Math.min(rect.height, window.innerHeight) / 2 - window.innerHeight / 2);
        });
        step = distances.indexOf(Math.min(...distances));
        position = step / (story.scenes.length - 1);
      }
      render(story, step);
      story.progress.style.width = `${position * 100}%`;
      if (story.root.dataset.system === 'shiori') {
        const travel = story.enabled ? clamp(position * story.scenes.length - step) : 1;
        story.root.style.setProperty('--thread-travel', String(travel));
      }
    });
  }

  function measure() {
    stories.forEach(story => {
      const current = Math.max(0, story.step);
      story.root.dataset.scrollMode = 'measuring';
      story.root.style.minHeight = '';
      story.status.textContent = labels.scroll;
      let height = 0;
      // Measure each scene once on layout changes, so switching never moves the page.
      story.scenes.forEach((_, index) => {
        story.scenes.forEach((scene, other) => { scene.hidden = other !== index; });
        height = Math.max(height, story.root.getBoundingClientRect().height);
      });
      height = Math.ceil(height);
      story.enabled = height + 32 <= window.innerHeight;
      story.track.dataset.scrollEnabled = String(story.enabled);
      story.root.dataset.scrollMode = story.enabled ? 'scroll' : 'reading';
      story.pinTop = Math.max(12, Math.min(28, Math.floor((window.innerHeight - height) / 2)));
      story.range = (story.scenes.length - 1) * Math.max(220, Math.round(window.innerHeight * .55));
      story.track.style.setProperty('--pin-top', `${story.pinTop}px`);
      story.track.style.setProperty('--story-height', `${height + story.range}px`);
      story.root.style.minHeight = story.enabled ? `${height}px` : '';
      story.status.textContent = story.enabled ? labels.scroll : labels.reading;
      story.step = -1;
      render(story, current);
    });
    update();
  }

  function goToStep(story, index, announce = true, instant = false) {
    const step = Math.max(0, Math.min(story.scenes.length - 1, index));
    const behavior = instant || preference.matches ? 'instant' : 'smooth';
    if (story.enabled) {
      const start = story.track.getBoundingClientRect().top + window.scrollY - story.pinTop;
      window.scrollTo({top: Math.max(0, start + story.range * step / (story.scenes.length - 1)), behavior});
    } else {
      story.scenes[step].scrollIntoView({block: 'center', behavior});
    }
    if (announce) story.announcement.textContent = labels.scene(step + 1, story.scenes[step].querySelector('h4').textContent);
  }
  stories.forEach(story => {
    story.nodes.forEach((node, index) => node.addEventListener('click', () => goToStep(story, index)));
    story.previous.addEventListener('click', () => goToStep(story, story.step - 1));
    story.next.addEventListener('click', () => goToStep(story, story.step + 1));
  });

  let frame = 0, needsMeasure = false;
  function schedule() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (needsMeasure) { needsMeasure = false; measure(); }
      else update();
    });
  }
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', () => { needsMeasure = true; schedule(); });

  function followHash(instant = false) {
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); }
    catch { return; }
    const story = stories.find(item => item.root === target || item.scenes.includes(target));
    if (story) goToStep(story, Math.max(0, story.scenes.indexOf(target)), false, instant);
    else if (target) target.scrollIntoView({block: 'start', behavior: instant || preference.matches ? 'instant' : 'smooth'});
  }
  window.addEventListener('hashchange', () => followHash());
  window.addEventListener('load', () => { measure(); followHash(true); }, {once: true});
  measure();
})();
