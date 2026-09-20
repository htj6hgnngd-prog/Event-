const nav=document.querySelector('.nav');
let lastY=0;
const syncNav=()=>{const y=window.scrollY;nav.classList.toggle('nav-solid',y>24);nav.style.transform=y>lastY&&y>170?'translateY(-100%)':'translateY(0)';lastY=y};
window.addEventListener('scroll',syncNav,{passive:true});syncNav();

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -30px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const videoMain=document.querySelector('.video-main');
const videoLabel=document.querySelector('.video-main-label');
document.querySelectorAll('.video-card').forEach(card=>card.addEventListener('click',()=>{
  if(card.classList.contains('active'))return;
  document.querySelectorAll('.video-card').forEach(x=>x.classList.remove('active'));
  card.classList.add('active');
  videoMain.classList.add('switching');
  window.setTimeout(()=>{videoLabel.textContent=card.dataset.label;videoMain.classList.remove('switching')},180);
}));

/* Future event clips stay silent, looped and only run near the viewport. */
const prepareVideo=video=>{video.muted=true;video.loop=true;video.playsInline=true;video.setAttribute('muted','');video.setAttribute('playsinline','')};
const mediaObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{const video=entry.target;if(entry.isIntersecting){const p=video.play();if(p&&typeof p.catch==='function')p.catch(()=>{})}else{video.pause()}}),{rootMargin:'180px 0px',threshold:.05});
document.querySelectorAll('.hero-media video,.work-cell video,.photo-editorial video').forEach(video=>{prepareVideo(video);mediaObserver.observe(video)});
