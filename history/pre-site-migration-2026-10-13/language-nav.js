/* Native language links work without JavaScript; keep the current section when switching. */
(() => {
  'use strict';
  const links = [...document.querySelectorAll('[data-language-link]')];
  function syncSection() {
    links.forEach(link => {
      const target = new URL(link.getAttribute('href'), location.href);
      target.hash = location.hash;
      link.href = target.href;
    });
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const section = document.getElementById(id);
    if (!section) return;
    let parent = section.parentElement;
    let opened = false;
    while (parent) {
      if (parent.tagName === 'DETAILS' && !parent.open) { parent.open = true; opened = true; }
      parent = parent.parentElement;
    }
    if (opened) section.scrollIntoView({block: 'start'});
  }
  window.addEventListener('hashchange', syncSection);
  syncSection();
})();
