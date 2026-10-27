(()=>{
const menu=document.querySelector('.menu-button'),nav=document.querySelector('#navigation');
const closeMenu=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');};
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
const header=document.querySelector('#header'),updateHeader=()=>header.classList.toggle('scrolled',window.scrollY>30);
updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});
const tabs=[...document.querySelectorAll('[role="tab"]')];
const selectTab=(tab,focus=false)=>{tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!selected;});if(focus)tab.focus();};
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',e=>{let target;if(e.key==='ArrowDown'||e.key==='ArrowRight')target=(index+1)%tabs.length;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')target=(index-1+tabs.length)%tabs.length;else if(e.key==='Home')target=0;else if(e.key==='End')target=tabs.length-1;if(target!==undefined){e.preventDefault();selectTab(tabs[target],true);}});});
selectTab(tabs[0]);
if('IntersectionObserver' in window){const links=[...nav.querySelectorAll('a[href^="#"]')];const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)links.forEach(link=>{if(link.getAttribute('href')==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});});},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main > section[id]').forEach(section=>observer.observe(section));}
document.querySelector('#year').textContent=String(new Date().getFullYear());
})();
