const nav=document.querySelector('.nav');
let lastY=0;
const navLinks=[...document.querySelectorAll('[data-nav-target]')];
const navProgress=document.querySelector('.nav-progress span');
const navSections=navLinks.map(link=>document.getElementById(link.dataset.navTarget)).filter(Boolean);
const syncNav=()=>{const y=window.scrollY;nav.classList.toggle('nav-solid',y>24);nav.style.transform=y>lastY&&y>170?'translateY(-100%)':'translateY(0)';lastY=y;const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);if(navProgress)navProgress.style.width=Math.min(100,Math.max(0,(y/max)*100))+'%';};
const navSectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)navLinks.forEach(link=>link.classList.toggle('active',link.dataset.navTarget===entry.target.id))}),{rootMargin:'-34% 0px -54% 0px',threshold:0});navSections.forEach(section=>navSectionObserver.observe(section));
window.addEventListener('scroll',syncNav,{passive:true});syncNav();

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:reduceMotion.matches?0:.08,rootMargin:'0px 0px -30px'});
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
const saveData=Boolean(navigator.connection?.saveData);
const markMediaFailure=video=>{
  video.dataset.mediaState='error';
  const host=video.closest('.media,.frame-builder-media,.case-output-panel');
  host?.classList.add('media-error');
  if(!host||host.querySelector('.media-retry'))return;
  const retry=document.createElement('button');
  retry.type='button';retry.className='media-retry';retry.textContent='RELOAD MEDIA';
  retry.addEventListener('click',event=>{
    event.stopPropagation();
    host.classList.remove('media-error');video.dataset.mediaState='loading';
    const current=video.currentTime;
    video.load();
    const p=video.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
    try{video.currentTime=current}catch(_){}
  });
  host.appendChild(retry);
};
document.querySelectorAll('video').forEach(video=>{video.addEventListener('error',()=>markMediaFailure(video));video.addEventListener('canplay',()=>{video.dataset.mediaState='ready';video.closest('.media-error')?.classList.remove('media-error')})});
const mediaObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  const video=entry.target;
  if(entry.isIntersecting&&!reduceMotion.matches&&!saveData){
    const p=video.play();
    if(p&&typeof p.catch==='function')p.catch(()=>{});
  }else{
    video.pause();
  }
}),{rootMargin:'180px 0px',threshold:.05});
document.querySelectorAll('.hero-media video,.work-cell video,.photo-editorial video,.video-card video,.signature video').forEach(video=>{prepareVideo(video);mediaObserver.observe(video)});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){
    document.querySelectorAll('video').forEach(video=>video.pause());
  }else if(!reduceMotion.matches&&!saveData){
    document.querySelectorAll('.hero-media video,.work-cell video,.photo-editorial video,.signature video').forEach(video=>{
      if(video.closest('.project-viewer')||video.closest('.frame-builder'))return;
      const rect=video.getBoundingClientRect();
      if(rect.bottom>0&&rect.top<window.innerHeight){const p=video.play();if(p&&typeof p.catch==='function')p.catch(()=>{});}
    });
  }
});

/* Full film stops when the video section leaves the viewport. */
if(featuredVideo){
  const featuredObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting&&!featuredVideo.paused)featuredVideo.pause();
  }),{threshold:.08});
  const section=document.querySelector('#video');
  if(section)featuredObserver.observe(section);
}
setPlayState();


/* Selected Work opens as a complete fullscreen case study on desktop. */
const projectViewer=document.querySelector('#project-viewer');
const projectViewerVideo=document.querySelector('#project-viewer-video');
const projectViewerClose=document.querySelector('.project-viewer-close');
const mediaCursor=document.querySelector('.media-cursor');
const caseNumber=document.querySelector('#case-number');
const caseFormat=document.querySelector('#case-format');
const caseTitle=document.querySelector('#case-title');
const caseSummary=document.querySelector('#case-summary');
const caseFocus=document.querySelector('#case-focus');
const caseTask=document.querySelector('#case-task');
const casePlan=document.querySelector('#case-plan');
const caseCoverage=document.querySelector('#case-coverage');
const caseOutputs=document.querySelector('#case-outputs');
const caseDelivery=document.querySelector('#case-delivery');
const caseOutputTabs=[...document.querySelectorAll('[data-case-output]')];
const caseOutputPanels=[...document.querySelectorAll('[data-case-panel]')];
const caseLoop=document.querySelector('#case-loop');
const casePoster=document.querySelector('#case-poster');
const caseNoteText=document.querySelector('#case-note-text');
const caseContact=document.querySelector('.case-contact');

const caseData={
  '01':{
    title:'СОБЫТИЕ / 01',
    format:'СОБЫТИЕ / ВИДЕО',
    summary:'Съёмка события с акцентом на сцену, людей и ключевые моменты программы.',
    focus:'ЛЮДИ / СЦЕНА / СОБЫТИЕ',
    task:'Показать событие через людей, сцену и ключевые моменты',
    plan:'СЦЕНА / ЛЮДИ / ДЕТАЛИ',
    coverage:'СЦЕНА / ГОСТИ / ДЕТАЛИ',
    outputs:'ФИЛЬМ / КОРОТКАЯ ВЕРСИЯ / ОБЛОЖКА',
    delivery:'ФИЛЬМ / 16:9',
    film:'https://d2ol7oe51mr4n.cloudfront.net/user_3DAx441iE4cBNKdBbYvFbic9eQg/d23736c7-652b-49e8-bb9b-8e181dd9c667.mp4',
    poster:'https://d2ol7oe51mr4n.cloudfront.net/user_3DAx441iE4cBNKdBbYvFbic9eQg/36364aa2-55cb-4bc6-9cc1-581564d9b402.jpg',
    loop:'https://d2ol7oe51mr4n.cloudfront.net/user_3DAx441iE4cBNKdBbYvFbic9eQg/d23736c7-652b-49e8-bb9b-8e181dd9c667.mp4',
    loopPoster:'https://d2ol7oe51mr4n.cloudfront.net/user_3DAx441iE4cBNKdBbYvFbic9eQg/36364aa2-55cb-4bc6-9cc1-581564d9b402.jpg',
    note:'Снимаем происходящее внутри события, не мешая программе.'
  },
  '02':{
    title:'СОБЫТИЕ / 02',
    format:'СОБЫТИЕ / ВИДЕО',
    summary:'Событие показано через людей, сцену, движение и детали площадки.',
    focus:'АТМОСФЕРА / ЛЮДИ / ДВИЖЕНИЕ',
    task:'Показать атмосферу через людей, свет и движение',
    plan:'ЛЮДИ / СВЕТ / СЦЕНА',
    coverage:'ЛЮДИ / СВЕТ / СЦЕНА',
    outputs:'ФИЛЬМ / КОРОТКАЯ ВЕРСИЯ / ОБЛОЖКА',
    delivery:'ФИЛЬМ / 16:9',
    film:'/media/event-2',
    poster:'/clip-poster/work-bottom?v=2',
    loop:'/clip/work-bottom',
    loopPoster:'/clip-poster/work-bottom',
    note:'Не просто фиксируем программу, а собираем цельную историю события.'
  }
};

let lastCaseTrigger=null;
let activeCaseOutput='film';

const setCaseOutput=mode=>{
  activeCaseOutput=mode;
  caseOutputTabs.forEach(button=>{
    const active=button.dataset.caseOutput===mode;
    button.classList.toggle('active',active);
    button.setAttribute('aria-selected',active?'true':'false');
  });
  caseOutputPanels.forEach(panel=>panel.classList.toggle('active',panel.dataset.casePanel===mode));
  if(mode==='motion'&&caseLoop){
    if(!caseLoop.src&&caseLoop.dataset.src)caseLoop.src=caseLoop.dataset.src;
    caseLoop.muted=true;
    const play=caseLoop.play();
    if(play&&typeof play.catch==='function')play.catch(()=>{});
  }else if(caseLoop){
    caseLoop.pause();
  }
  if(mode!=='film'&&projectViewerVideo&&!projectViewerVideo.paused)projectViewerVideo.pause();
};

caseOutputTabs.forEach(button=>button.addEventListener('click',()=>setCaseOutput(button.dataset.caseOutput||'film')));
caseOutputTabs.forEach((button,index)=>button.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  if(event.key==='Home'||event.key==='End'){const target=caseOutputTabs[event.key==='Home'?0:caseOutputTabs.length-1];setCaseOutput(target.dataset.caseOutput||'film');target.focus();return;}
  const direction=event.key==='ArrowRight'?1:-1;
  const next=(index+direction+caseOutputTabs.length)%caseOutputTabs.length;
  const target=caseOutputTabs[next];
  setCaseOutput(target.dataset.caseOutput||'film');
  target.focus();
}));

const closeProjectViewer=(restoreHistory=true)=>{
  if(!projectViewer)return;
  projectViewer.classList.remove('open');
  if(restoreHistory&&window.location.hash.startsWith('#case-')&&window.history&&window.history.replaceState)window.history.replaceState(null,'','#work');
  projectViewer.setAttribute('aria-hidden','true');
  document.body.classList.remove('viewer-open');
  if(mediaCursor)mediaCursor.classList.remove('visible');
  setDocumentTitle(defaultDocumentTitle);
  if(projectViewerVideo){
    projectViewerVideo.pause();
    projectViewerVideo.removeAttribute('src');
    projectViewerVideo.removeAttribute('poster');
    projectViewerVideo.load();
  }
  if(caseLoop){
    caseLoop.pause();
    caseLoop.removeAttribute('src');
    caseLoop.removeAttribute('poster');
    caseLoop.load();
  }
  if(casePoster)casePoster.removeAttribute('src');
  if(lastCaseTrigger)lastCaseTrigger.focus({preventScroll:true});
};

const openProjectViewer=(card,{fromHistory=false}={})=>{
  if(!projectViewer||!projectViewerVideo||window.innerWidth<1101)return;
  const data=caseData[card.dataset.case];
  if(!data)return;
  lastCaseTrigger=card;
  if(caseNumber)caseNumber.textContent=card.dataset.case;
  if(caseFormat)caseFormat.textContent=data.format;
  if(caseTitle)caseTitle.textContent=data.title;
  if(caseSummary)caseSummary.textContent=data.summary;
  if(caseFocus)caseFocus.textContent=data.focus;
  if(caseTask)caseTask.textContent=data.task;
  if(casePlan)casePlan.textContent=data.plan;
  if(caseCoverage)caseCoverage.textContent=data.coverage;
  if(caseOutputs)caseOutputs.textContent=data.outputs;
  if(caseDelivery)caseDelivery.textContent=data.delivery;
  if(caseNoteText)caseNoteText.textContent=data.note;
  setDocumentTitle(data.title+' | VECTA');

  projectViewerVideo.src=data.film;
  projectViewerVideo.poster=data.poster;
  if(caseLoop){
    caseLoop.src=data.loop;
    caseLoop.poster=data.loopPoster;
    caseLoop.muted=true;
    caseLoop.loop=true;
    caseLoop.playsInline=true;
    caseLoop.load();
  }
  if(casePoster)casePoster.src=data.poster;

  projectViewer.scrollTop=0;
  setCaseOutput('film');
  projectViewer.classList.add('open');
  const caseId=card?.dataset?.case||'01';
  if(window.history&&!fromHistory)window.history.pushState({vectaCase:caseId},'','#case-'+caseId);
  projectViewer.setAttribute('aria-hidden','false');
  document.body.classList.add('viewer-open');
  if(mediaCursor)mediaCursor.classList.remove('visible');
  projectViewerVideo.load();
  projectViewerVideo.muted=false;
  window.setTimeout(()=>projectViewerClose?.focus({preventScroll:true}),80);
};

document.querySelectorAll('.project-open').forEach(card=>{
  card.addEventListener('click',()=>openProjectViewer(card));
  card.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){
      event.preventDefault();
      openProjectViewer(card);
    }
  });
  if(mediaCursor){
    card.addEventListener('pointerenter',()=>mediaCursor.classList.add('visible'));
    card.addEventListener('pointerleave',()=>mediaCursor.classList.remove('visible'));
    card.addEventListener('pointermove',event=>{
      mediaCursor.style.left=event.clientX+'px';
      mediaCursor.style.top=event.clientY+'px';
    });
  }
});

const caseShare=document.querySelector('.case-share');
const defaultDocumentTitle=document.title;
const setDocumentTitle=(title)=>{document.title=title||defaultDocumentTitle;};
const copyText=async value=>{
  try{await navigator.clipboard.writeText(value);return true}catch(_){
    try{const area=document.createElement('textarea');area.value=value;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();const ok=document.execCommand('copy');area.remove();return ok}catch(__){return false}
  }
};
caseShare?.addEventListener('click',async()=>{
  const ok=await copyText(window.location.href);
  const label=caseShare.textContent;
  caseShare.textContent=ok?'LINK COPIED':'SELECT LINK';
  window.setTimeout(()=>{caseShare.textContent=label},1400);
});
if(projectViewerClose)projectViewerClose.addEventListener('click',closeProjectViewer);
window.addEventListener('popstate',()=>{
  const match=window.location.hash.match(/^#case-(01|02)$/);
  if(match){const card=document.querySelector('.project-open[data-case="'+match[1]+'"]');if(card)openProjectViewer(card,{fromHistory:true});}
  else if(projectViewer?.classList.contains('open'))closeProjectViewer(false);
});
if(caseContact)caseContact.addEventListener('click',event=>{
  event.preventDefault();
  closeProjectViewer();
  window.setTimeout(()=>document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'}),80);
});
document.addEventListener('keydown',event=>{
  if(!projectViewer?.classList.contains('open'))return;
  if(event.key==='Escape'){
    event.preventDefault();
    closeProjectViewer();
    return;
  }
  if(event.key!=='Tab')return;
  const focusable=[...projectViewer.querySelectorAll('button:not([disabled]),a[href],video[controls]')].filter(el=>el.offsetParent!==null);
  if(!focusable.length)return;
  const first=focusable[0],last=focusable[focusable.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
});

/* Заявка на расчёт */
const briefForm=document.querySelector('#project-brief');
const briefStatus=document.querySelector('#brief-status');
const briefCopy=document.querySelector('.brief-copy');
const briefServices=document.querySelector('.brief-services');
const BRIEF_DRAFT_KEY='vecta-brief-draft-v2';

const collectBrief=()=>{
  if(!briefForm)return null;
  const data=new FormData(briefForm);
  return {
    date:String(data.get('date')||'').trim(),
    venue:String(data.get('venue')||'').trim(),
    format:String(data.get('format')||'').trim(),
    services:data.getAll('services').map(String),
    contact:String(data.get('contact')||'').trim()
  };
};

const saveBriefDraft=()=>{
  try{
    const brief=collectBrief();
    if(brief)window.localStorage.setItem(BRIEF_DRAFT_KEY,JSON.stringify(brief));
  }catch(_){}
};

const restoreBriefDraft=()=>{
  try{
    const saved=JSON.parse(window.localStorage.getItem(BRIEF_DRAFT_KEY)||'null');
    if(!saved||!briefForm)return;
    ['date','venue','format','contact'].forEach(key=>{
      const input=briefForm.elements.namedItem(key);
      if(input&&typeof saved[key]==='string')input.value=saved[key];
    });
    if(Array.isArray(saved.services)){
      briefForm.querySelectorAll('input[name="services"]').forEach(input=>{
        input.checked=saved.services.includes(input.value);
      });
    }
  }catch(_){}
};

const setBriefStatus=(message,state='')=>{
  if(!briefStatus)return;
  briefStatus.textContent=message;
  briefStatus.classList.toggle('is-success',state==='success');
  briefForm?.classList.toggle('is-invalid',state==='error');
};

const validateBrief=()=>{
  if(!briefForm)return null;
  if(!briefForm.checkValidity()){
    briefForm.reportValidity();
    setBriefStatus('Заполните обязательные поля.','error');
    return null;
  }
  const brief=collectBrief();
  if(!brief||!brief.services.length){
    briefServices?.setAttribute('aria-invalid','true');
    setBriefStatus('Выберите фото, видео или оба варианта.','error');
    return null;
  }
  briefServices?.removeAttribute('aria-invalid');
  return brief;
};

const formatBriefText=brief=>[
  'VECTA - НОВАЯ ЗАЯВКА',
  '',
  'Дата: '+brief.date,
  'Город и площадка: '+brief.venue,
  'Мероприятие: '+brief.format,
  'Нужно: '+brief.services.join(', '),
  'Контакт: '+brief.contact
].join('\\n');

if(briefForm){
  restoreBriefDraft();

  briefForm.addEventListener('input',()=>{
    saveBriefDraft();
    briefForm.classList.remove('is-invalid');
    if(briefStatus&&!briefStatus.classList.contains('is-success')){
      briefStatus.textContent='Данные можно проверить перед отправкой';
    }
  });

  briefServices?.addEventListener('change',event=>{
    const selected=event.target;
    if(!(selected instanceof HTMLInputElement)||selected.name!=='services'||!selected.checked)return;
    const boxes=[...briefServices.querySelectorAll('input[name="services"]')];
    if(selected.value==='Фото + видео'){
      boxes.filter(box=>box!==selected).forEach(box=>box.checked=false);
    }else{
      boxes.filter(box=>box.value==='Фото + видео').forEach(box=>box.checked=false);
    }
    saveBriefDraft();
  });

  briefForm.addEventListener('submit',async event=>{
    event.preventDefault();
    const brief=validateBrief();
    if(!brief)return;

    setBriefStatus('Отправляем заявку...');

    try{
      const response=await fetch('/api/lead',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(brief)
      });
      const data=await response.json().catch(()=>({}));

      if(!response.ok)throw new Error(data.message||'Ошибка отправки');

      window.dispatchEvent(new CustomEvent('vecta:lead',{detail:brief}));
      setBriefStatus('Заявка получена. Мы свяжемся с вами и подготовим расчёт.','success');
      briefForm.reset();

      try{window.localStorage.removeItem(BRIEF_DRAFT_KEY)}catch(_){}

      if(data.telegramUrl){
        const link=document.createElement('a');
        link.href=data.telegramUrl;
        link.target='_blank';
        link.rel='noopener';
        link.textContent='Можно сразу написать нам в Telegram';
        link.className='brief-telegram-link';
        briefStatus.insertAdjacentElement('afterend',link);
      }
    }catch(error){
      setBriefStatus('Не удалось отправить заявку. Попробуйте ещё раз или скопируйте данные и отправьте их вручную.','error');
    }
  });
}

if(briefCopy){
  briefCopy.addEventListener('click',async()=>{
    const brief=validateBrief();
    if(!brief)return;
    try{
      await navigator.clipboard.writeText(formatBriefText(brief));
      setBriefStatus('Данные скопированы.','success');
    }catch(_){
      setBriefStatus('Не удалось скопировать автоматически.','error');
    }
  });
}

/* Case deep links: open a selected case directly without changing page content. */
const openCaseFromHash=()=>{const match=window.location.hash.match(/^#case-(01|02)$/);if(!match)return;const card=document.querySelector('.project-open[data-case="'+match[1]+'"]');if(card)window.setTimeout(()=>openProjectViewer(card,{fromHistory:true}),120)};
openCaseFromHash();

/* VECTA / Mobile navigation */
const mobileNavToggle=document.querySelector('.mobile-nav-toggle');
const mobileNav=document.querySelector('#mobile-nav');
const setMobileNav=(open)=>{
  if(!mobileNav||!mobileNavToggle)return;
  mobileNav.hidden=!open;
  mobileNavToggle.setAttribute('aria-expanded',open?'true':'false');
  mobileNavToggle.textContent=open?'ЗАКРЫТЬ':'МЕНЮ';
  document.body.classList.toggle('mobile-nav-open',open);
};
mobileNavToggle?.addEventListener('click',()=>setMobileNav(mobileNav.hidden));
mobileNav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMobileNav(false)));
window.addEventListener('hashchange',()=>{if(mobileNav&&!mobileNav.hidden)setMobileNav(false)});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&mobileNav&&!mobileNav.hidden){event.preventDefault();setMobileNav(false);mobileNavToggle?.focus({preventScroll:true})}
});
window.addEventListener('resize',()=>{if(window.innerWidth>=1101&&mobileNav&&!mobileNav.hidden)setMobileNav(false)});

/* VECTA 2.2 / production continuity + accessibility hardening */
const openRouteFromHash=()=>{
  const hash=window.location.hash;
  if(hash==='#agency'){
    if(window.innerWidth>=1101&&!agencyMode?.classList.contains('open'))openAgencyMode(true);
    return;
  }
  if(hash==='#frame'||hash.startsWith('#frame-map=')){
    if(!frameBuilder?.classList.contains('open'))openFrameBuilder(document.querySelector('.frame-builder-trigger'));
  }
};
openRouteFromHash();

const syncNavCurrent=()=>{
  navLinks.forEach(link=>{
    const active=link.classList.contains('active');
    if(active)link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  });
};
window.addEventListener('scroll',syncNavCurrent,{passive:true});
window.addEventListener('hashchange',syncNavCurrent);
syncNavCurrent();

window.addEventListener('resize',()=>{
  if(window.innerWidth<1101){
    if(projectViewer?.classList.contains('open'))closeProjectViewer(false,false);
    if(agencyMode?.classList.contains('open'))closeAgencyMode(false,false);
  }
});

const resetMediaState=video=>{
  if(!video)return;
  video.closest('.media,.frame-builder-media,.case-output-panel')?.classList.remove('media-error');
  video.dataset.mediaState='loading';
};
document.querySelectorAll('video').forEach(video=>{
  video.addEventListener('loadstart',()=>resetMediaState(video),{passive:true});
});
