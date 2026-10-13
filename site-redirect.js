/* Preserve bookmarked sections and query parameters across the site migration. */
(() => {
  'use strict';
  const meta = document.querySelector('meta[name="site-destination"]');
  if (!meta) return;
  const destination = new URL(meta.content);
  if (destination.origin !== 'https://yuu-honda.github.io' || !destination.pathname.startsWith('/lux-spiria-results/')) return;
  destination.search = window.location.search;
  destination.hash = window.location.hash;
  document.querySelectorAll('a').forEach(link => {
    if (link.href === meta.content) link.href = destination.href;
  });
  window.location.replace(destination.href);
})();
