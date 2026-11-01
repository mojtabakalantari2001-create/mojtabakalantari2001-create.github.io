/* Independent navigation, tabs, and introduction interactions. */
(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const closeMenu = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    nav.dataset.open = 'false';
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.dataset.open = String(open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });

  document.querySelectorAll('[data-tab-set]').forEach(group => {
    const tabs = [...group.querySelectorAll('[role="tab"]')];
    const panels = [...group.querySelectorAll('[role="tabpanel"]')];
    const select = (tab, updateUrl = false) => {
      tabs.forEach(item => {
        const active = tab === item;
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
      });
      panels.forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
      if (updateUrl) history.replaceState(null, '', '#' + tab.getAttribute('aria-controls'));
    };
    const fromHash = () => tabs.find(tab => '#' + tab.getAttribute('aria-controls') === location.hash);
    if (!tabs.length) return;
    group.dataset.ready = 'true';
    select(fromHash() || tabs[0]);
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab, true));
      tab.addEventListener('keydown', event => {
        const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length
          : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length
          : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
        if (next < 0) return;
        event.preventDefault();
        select(tabs[next], true);
        tabs[next].focus();
      });
    });
    window.addEventListener('hashchange', () => { const tab = fromHash(); if (tab) select(tab); });
  });

  const role = document.querySelector('[data-roles]');
  if (role) {
    const words = role.dataset.roles.split('|');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let word = 0, letters = words[0].length, erasing = true, timer;
    const tick = () => {
      if (reduced.matches) { role.textContent = words[0]; return; }
      if (document.hidden) { timer = setTimeout(tick, 500); return; }
      letters += erasing ? -1 : 1;
      role.textContent = words[word].slice(0, letters);
      let pause = erasing ? 45 : 85;
      if (letters <= 0) { erasing = false; word = (word + 1) % words.length; pause = 250; }
      else if (letters >= words[word].length) { erasing = true; pause = 2200; }
      timer = setTimeout(tick, pause);
    };
    if (!reduced.matches) timer = setTimeout(tick, 2500);
    reduced.addEventListener('change', () => { clearTimeout(timer); role.textContent = words[0]; if (!reduced.matches) timer = setTimeout(tick, 2500); });
  }
})();
