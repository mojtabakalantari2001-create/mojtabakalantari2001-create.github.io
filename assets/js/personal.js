/* Keyboard and accessibility enhancements for the adapted Folio template. */
(()=>{
  const menu=document.querySelector('.mobile-nav-toggle');
  const updateMenu=()=>{const open=document.body.classList.contains('mobile-nav-active');menu?.setAttribute('aria-expanded',String(open));menu?.setAttribute('aria-label',open?'Close navigation':'Open navigation');};
  menu?.addEventListener('click',updateMenu);
  document.querySelectorAll('#navmenu a').forEach(link=>link.addEventListener('click',updateMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('mobile-nav-active')){menu?.click();menu?.focus();}});
  document.querySelectorAll('.exp-timeline-row,.track-card-container[role=button]').forEach(item=>item.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();item.click();}}));
  const syncExperience=()=>document.querySelectorAll('.exp-timeline-row').forEach(item=>item.setAttribute('aria-pressed',String(item.classList.contains('active'))));
  const navigation=document.querySelector('#exp-nav-container');
  if(navigation)new MutationObserver(syncExperience).observe(navigation,{subtree:true,attributes:true,attributeFilter:['class']});
  syncExperience();
})();
