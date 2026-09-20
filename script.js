const nav=document.querySelector('.nav');
let lastY=0;
const syncNav=()=>{const y=window.scrollY;nav.classList.toggle('nav-solid',y>24);nav.style.transform=y>lastY&&y>170?'translateY(-100%)':'translateY(0)';lastY=y};
window.addEventListener('scroll',syncNav,{passive:true});syncNav();

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -30px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const videoMain=document.querySelector('.video-main');
const featuredVideo=document.querySelector('#featured-video');
const videoLabel=document.querySelector('.video-main-label');
const playButton=document.querySelector('.video-play');

const setPlayState=()=>{
  if(!playButton||!featuredVideo||!videoMain)return;
  const paused=featuredVideo.paused;
  playButton.textContent=paused?'PLAY':'PAUSE';
  videoMain.setAttribute('aria-label',paused?'Воспроизвести выбранное видео':'Поставить выбранное видео на паузу');
};
const toggleFeatured=()=>{
  if(!featuredVideo)return;
  if(featuredVideo.paused){
    featuredVideo.muted=false;
    const p=featuredVideo.play();
    if(p&&typeof p.catch==='function')p.catch(()=>{});
  }else{
    featuredVideo.pause();
  }
};
if(featuredVideo){
  featuredVideo.addEventListener('play',setPlayState);
  featuredVideo.addEventListener('pause',setPlayState);
  featuredVideo.addEventListener('ended',setPlayState);
}
if(playButton){
  playButton.addEventListener('click',event=>{event.stopPropagation();toggleFeatured()});
}
if(videoMain){
  videoMain.addEventListener('click',toggleFeatured);
  videoMain.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){
      event.preventDefault();
      toggleFeatured();
    }
  });
}

document.querySelectorAll('.video-card').forEach(card=>card.addEventListener('click',()=>{
  if(card.classList.contains('active'))return;
  document.querySelectorAll('.video-card').forEach(x=>x.classList.remove('active'));
  card.classList.add('active');
  videoMain.classList.add('switching');
  if(featuredVideo){
    featuredVideo.pause();
    featuredVideo.src=card.dataset.src;
    featuredVideo.poster=card.dataset.poster||'';
    featuredVideo.load();
  }
  window.setTimeout(()=>{
    videoLabel.textContent=card.dataset.label;
    videoMain.classList.remove('switching');
    setPlayState();
  },180);
}));

/* Motion previews only run near the viewport. */
const prepareVideo=video=>{video.muted=true;video.loop=true;video.playsInline=true;video.setAttribute('muted','');video.setAttribute('playsinline','')};
const mediaObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  const video=entry.target;
  if(entry.isIntersecting){
    const p=video.play();
    if(p&&typeof p.catch==='function')p.catch(()=>{});
  }else{
    video.pause();
  }
}),{rootMargin:'180px 0px',threshold:.05});
document.querySelectorAll('.hero-media video,.work-cell video,.photo-editorial video,.video-card video').forEach(video=>{prepareVideo(video);mediaObserver.observe(video)});

/* Full film stops when the video section leaves the viewport. */
if(featuredVideo){
  const featuredObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting&&!featuredVideo.paused)featuredVideo.pause();
  }),{threshold:.08});
  const section=document.querySelector('#video');
  if(section)featuredObserver.observe(section);
}
setPlayState();
