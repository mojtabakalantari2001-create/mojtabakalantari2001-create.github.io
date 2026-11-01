/* Accessible tabs and direct links for the retained project-page layout. */
(() => {
  document.querySelectorAll('.project-tab-group').forEach(group => {
    const tabs = [...group.querySelectorAll('[role="tab"]')];
    const panels = [...group.querySelectorAll('[role="tabpanel"]')];
    if (!tabs.length || !panels.length) return;

    const activate = (tab, updateUrl = false) => {
      const target = tab.getAttribute('aria-controls');
      tabs.forEach(item => {
        const selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      panels.forEach(panel => panel.classList.toggle('active', panel.id === target));
      if (updateUrl) history.replaceState(null, '', '#' + target);
    };
    const fromHash = () => tabs.find(tab => '#' + tab.getAttribute('aria-controls') === location.hash);

    group.classList.add('project-tabs-ready');
    activate(fromHash() || tabs[0]);
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab, true));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        activate(tabs[next], true);
        tabs[next].focus();
      });
    });
    window.addEventListener('hashchange', () => {
      const tab = fromHash();
      if (tab) activate(tab);
    });
  });
})();
