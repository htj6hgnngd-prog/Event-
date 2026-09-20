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
document.querySelectorAll('.hero-media video,.work-cell video,.photo-editorial video,.video-card video,.signature video').forEach(video=>{prepareVideo(video);mediaObserver.observe(video)});

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
const caseLoop=document.querySelector('#case-loop');
const casePoster=document.querySelector('#case-poster');
const caseNoteText=document.querySelector('#case-note-text');
const caseContact=document.querySelector('.case-contact');

const caseData={
  '01':{
    title:'LIVE EVENT / 01',
    format:'LIVE EVENT / VIDEO PRODUCTION',
    summary:'Динамичный live-event с акцентом на сцену, публику и энергию момента. Визуальный ритм строится на чередовании общего масштаба, реакций людей и сильных сценических эпизодов.',
    focus:'PEOPLE / STAGE / ENERGY',
    film:'/media/event-1',
    poster:'/cover/event-1?v=final2',
    loop:'/clip/work-top',
    loopPoster:'/clip-poster/work-top',
    note:'Сначала читаем пространство и свет, затем собираем действия, реакции и детали в единый визуальный ритм. Камера работает внутри события и не ломает его естественный ход.'
  },
  '02':{
    title:'LIVE EVENT / 02',
    format:'LIVE EVENT / VIDEO PRODUCTION',
    summary:'Событие показано через людей, сценический свет и атмосферу площадки. Монтаж держит ощущение присутствия и соединяет масштаб, движение и короткие эмоциональные детали.',
    focus:'ATMOSPHERE / PEOPLE / MOTION',
    film:'/media/event-2',
    poster:'/clip-poster/work-bottom?v=2',
    loop:'/clip/work-bottom',
    loopPoster:'/clip-poster/work-bottom',
    note:'Ключевой принцип: не просто зафиксировать программу, а передать ощущение присутствия. Для этого чередуем масштаб, людей, сцену и короткие детали, сохраняя естественный темп события.'
  }
};

let lastCaseTrigger=null;

const closeProjectViewer=()=>{
  if(!projectViewer)return;
  projectViewer.classList.remove('open');
  projectViewer.setAttribute('aria-hidden','true');
  document.body.classList.remove('viewer-open');
  if(mediaCursor)mediaCursor.classList.remove('visible');
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

const openProjectViewer=card=>{
  if(!projectViewer||!projectViewerVideo||window.innerWidth<1101)return;
  const data=caseData[card.dataset.case];
  if(!data)return;
  lastCaseTrigger=card;
  if(caseNumber)caseNumber.textContent=card.dataset.case;
  if(caseFormat)caseFormat.textContent=data.format;
  if(caseTitle)caseTitle.textContent=data.title;
  if(caseSummary)caseSummary.textContent=data.summary;
  if(caseFocus)caseFocus.textContent=data.focus;
  if(caseNoteText)caseNoteText.textContent=data.note;

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
  projectViewer.classList.add('open');
  projectViewer.setAttribute('aria-hidden','false');
  document.body.classList.add('viewer-open');
  if(mediaCursor)mediaCursor.classList.remove('visible');
  projectViewerVideo.load();
  projectViewerVideo.muted=false;
  if(caseLoop){
    const loopPlay=caseLoop.play();
    if(loopPlay&&typeof loopPlay.catch==='function')loopPlay.catch(()=>{});
  }
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

if(projectViewerClose)projectViewerClose.addEventListener('click',closeProjectViewer);
if(caseContact)caseContact.addEventListener('click',event=>{
  event.preventDefault();
  closeProjectViewer();
  window.setTimeout(()=>document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'}),80);
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&projectViewer?.classList.contains('open'))closeProjectViewer();
});

/* Stage 05 / Conversion brief. The site stores nothing: it prepares a local email draft. */
const briefForm=document.querySelector('#project-brief');
const briefStatus=document.querySelector('#brief-status');
const briefCopy=document.querySelector('.brief-copy');
const briefServices=document.querySelector('.brief-services');
const briefRecipient='79858954264@ya.ru';
const briefDefaultStatus='Данные не сохраняются на сайте. Письмо откроется в вашем почтовом приложении.';

const setBriefStatus=(message,state='')=>{
  if(!briefStatus)return;
  briefStatus.textContent=message;
  briefStatus.classList.toggle('is-success',state==='success');
  if(briefForm)briefForm.classList.toggle('is-invalid',state==='error');
};

const collectBrief=()=>{
  if(!briefForm)return null;
  const data=new FormData(briefForm);
  const services=data.getAll('services').map(String);
  return{
    date:String(data.get('date')||'').trim(),
    venue:String(data.get('venue')||'').trim(),
    format:String(data.get('format')||'').trim(),
    services,
    contact:String(data.get('contact')||'').trim(),
    frame:String(data.get('frame')||'').trim()
  };
};

const validateBrief=()=>{
  if(!briefForm)return null;
  if(!briefForm.checkValidity()){
    briefForm.reportValidity();
    setBriefStatus('Заполните обязательные поля брифа.','error');
    return null;
  }
  const brief=collectBrief();
  if(!brief||!brief.services.length){
    if(briefServices)briefServices.setAttribute('aria-invalid','true');
    setBriefStatus('Выберите, что нужно от продакшена.','error');
    briefServices?.scrollIntoView({behavior:'smooth',block:'center'});
    return null;
  }
  if(briefServices)briefServices.removeAttribute('aria-invalid');
  return brief;
};

const formatBriefText=brief=>{
  const lines=[
    'VECTA - НОВЫЙ ПРОЕКТ',
    '',
    'Дата: '+brief.date,
    'Площадка: '+brief.venue,
    'Формат: '+brief.format,
    'Нужно: '+brief.services.join(', '),
    'Контакт: '+brief.contact
  ];
  if(brief.frame)lines.push('','VECTA FRAME',brief.frame);
  return lines.join('\n');
};

if(briefForm){
  briefForm.addEventListener('input',()=>{
    briefForm.classList.remove('is-invalid');
    if(briefStatus&&!briefStatus.classList.contains('is-success'))briefStatus.textContent=briefDefaultStatus;
  });
  briefForm.addEventListener('change',()=>{
    briefForm.classList.remove('is-invalid');
    if(briefServices)briefServices.removeAttribute('aria-invalid');
    if(briefStatus&&!briefStatus.classList.contains('is-success'))briefStatus.textContent=briefDefaultStatus;
  });
  briefForm.addEventListener('submit',event=>{
    event.preventDefault();
    const brief=validateBrief();
    if(!brief)return;
    const subject='VECTA / Новый проект / '+brief.date;
    const body=formatBriefText(brief);
    setBriefStatus('Бриф собран. Открываю письмо.','success');
    window.location.href='mailto:'+briefRecipient+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
}

if(briefCopy){
  briefCopy.addEventListener('click',async()=>{
    const brief=validateBrief();
    if(!brief)return;
    const text=formatBriefText(brief);
    try{
      if(navigator.clipboard&&window.isSecureContext){
        await navigator.clipboard.writeText(text);
      }else{
        const area=document.createElement('textarea');
        area.value=text;
        area.setAttribute('readonly','');
        area.style.position='fixed';
        area.style.opacity='0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
      }
      setBriefStatus('Бриф скопирован. Его можно отправить в любом мессенджере.','success');
    }catch(error){
      setBriefStatus('Не удалось скопировать автоматически. Выделите данные и отправьте их вручную.','error');
    }
  });
}


/* Stage 06 / Agency mode */
const agencyMode=document.querySelector('#agency-mode');
const agencyModeTrigger=document.querySelector('.agency-mode-trigger');
const agencyModeClose=document.querySelector('.agency-mode-close');
const agencyModeCta=document.querySelector('.agency-mode-cta');
let agencyModeLastFocus=null;
let agencyModeCloseTimer=null;

const openAgencyMode=()=>{
  if(!agencyMode||window.innerWidth<1101)return;
  if(agencyModeCloseTimer){
    window.clearTimeout(agencyModeCloseTimer);
    agencyModeCloseTimer=null;
  }
  agencyModeLastFocus=document.activeElement;
  agencyMode.hidden=false;
  agencyMode.scrollTop=0;
  agencyMode.setAttribute('aria-hidden','false');
  document.body.classList.add('agency-mode-open');
  window.requestAnimationFrame(()=>{
    window.requestAnimationFrame(()=>{
      agencyMode.classList.add('open');
      agencyModeClose?.focus({preventScroll:true});
    });
  });
};

const closeAgencyMode=(restoreFocus=true)=>{
  if(!agencyMode||agencyMode.hidden)return;
  agencyMode.classList.remove('open');
  agencyMode.setAttribute('aria-hidden','true');
  document.body.classList.remove('agency-mode-open');
  agencyModeCloseTimer=window.setTimeout(()=>{
    agencyMode.hidden=true;
    agencyModeCloseTimer=null;
    if(restoreFocus&&agencyModeLastFocus instanceof HTMLElement){
      agencyModeLastFocus.focus({preventScroll:true});
    }
  },320);
};

agencyModeTrigger?.addEventListener('click',openAgencyMode);
agencyModeClose?.addEventListener('click',()=>closeAgencyMode(true));

agencyMode?.addEventListener('click',event=>{
  if(event.target===agencyMode)closeAgencyMode(true);
});

agencyModeCta?.addEventListener('click',event=>{
  event.preventDefault();
  closeAgencyMode(false);
  window.setTimeout(()=>{
    document.querySelector('#contact')?.scrollIntoView({behavior:'smooth',block:'start'});
  },340);
});

document.addEventListener('keydown',event=>{
  if(!agencyMode||agencyMode.hidden||!agencyMode.classList.contains('open'))return;
  if(event.key==='Escape'){
    event.preventDefault();
    closeAgencyMode(true);
    return;
  }
  if(event.key!=='Tab')return;
  const focusable=[...agencyMode.querySelectorAll('button,a[href]')]
    .filter(el=>!el.hasAttribute('disabled')&&el.offsetParent!==null);
  if(!focusable.length)return;
  const first=focusable[0];
  const last=focusable[focusable.length-1];
  if(event.shiftKey&&document.activeElement===first){
    event.preventDefault();
    last.focus();
  }else if(!event.shiftKey&&document.activeElement===last){
    event.preventDefault();
    first.focus();
  }
});


/* VECTA 2.0 / Pass 02 / FRAME Builder */
const frameBuilder=document.querySelector('#frame-builder');
const frameBuilderTriggers=document.querySelectorAll('.frame-builder-trigger');
const frameBuilderClose=document.querySelector('.frame-builder-close');
const frameBuilderSteps=[...document.querySelectorAll('[data-frame-step]')];
const frameBuilderOptions=document.querySelector('#frame-builder-options');
const frameBuilderResult=document.querySelector('#frame-builder-result');
const frameBuilderIndex=document.querySelector('#frame-builder-index');
const frameBuilderTitle=document.querySelector('#frame-builder-title');
const frameBuilderCopy=document.querySelector('#frame-builder-copy');
const frameBuilderLetter=document.querySelector('#frame-builder-letter');
const frameBuilderProgress=document.querySelector('#frame-builder-progress');
const frameBuilderBack=document.querySelector('.frame-builder-back');
const frameBuilderNext=document.querySelector('.frame-builder-next');
const frameMapState=document.querySelector('#frame-map-state');
const frameBuilderVideo=document.querySelector('.frame-builder-media video');
const briefFrame=document.querySelector('#brief-frame');
let frameBuilderLastFocus=null;
let frameBuilderStep=0;
let frameBuilderCloseTimer=null;

const frameConfig=[
  {key:'focus',letter:'F',index:'01 / FOCUS',title:'ЧТО ДОЛЖЕН СДЕЛАТЬ КОНТЕНТ?',copy:'Выберите главную бизнес-задачу. Она определит приоритеты съёмки и набор конечных материалов.',multi:false,options:['PR / СМИ','SOCIAL','HR / EMPLOYER BRAND','BRAND','INTERNAL']},
  {key:'run',letter:'R',index:'02 / RUN',title:'КАК УСТРОЕНО СОБЫТИЕ?',copy:'Тип события задаёт ритм, критические точки программы и логику покрытия на площадке.',multi:false,options:['КОРПОРАТИВ','КОНФЕРЕНЦИЯ','ПРЕЗЕНТАЦИЯ','ПРЕМИЯ','ЧАСТНОЕ СОБЫТИЕ']},
  {key:'architecture',letter:'A',index:'03 / ARCHITECTURE',title:'ЧТО НЕЛЬЗЯ ПОТЕРЯТЬ?',copy:'Выберите приоритеты coverage map. Можно отметить несколько зон внимания.',multi:true,options:['ЛЮДИ','СЦЕНА','СПИКЕРЫ','АТМОСФЕРА','ДЕТАЛИ']},
  {key:'media',letter:'M',index:'04 / MEDIA',title:'КАКИЕ МАТЕРИАЛЫ ДОЛЖНЫ ОСТАТЬСЯ?',copy:'FRAME связывает съёмку с конкретными outputs, а не с абстрактным объёмом материала.',multi:true,options:['PHOTO SERIES','MASTER FILM','HIGHLIGHTS','INTERVIEWS','VERTICAL']},
  {key:'export',letter:'E',index:'05 / EXPORT',title:'ГДЕ БУДЕТ РАБОТАТЬ РЕЗУЛЬТАТ?',copy:'Конечные площадки влияют на версии, формат кадра и приоритет постпродакшна.',multi:true,options:['PR / СМИ','СОЦСЕТИ','ВНУТРЕННИЕ КОММУНИКАЦИИ','АРХИВ','РЕКЛАМНЫЕ МАТЕРИАЛЫ']}
];

const frameState={focus:[],run:[],architecture:[],media:[],export:[]};
const frameValueText=key=>frameState[key].length?frameState[key].join(' / '):'Не выбрано';
const frameFilledCount=()=>Object.values(frameState).filter(values=>values.length).length;

const syncFrameMap=()=>{
  Object.keys(frameState).forEach(key=>{
    const row=document.querySelector('[data-map-layer="'+key+'"]');
    if(!row)return;
    row.classList.toggle('filled',frameState[key].length>0);
    const p=row.querySelector('p');
    if(p)p.textContent=frameValueText(key);
  });
  if(frameMapState)frameMapState.textContent=frameFilledCount()+' / 5 LAYERS';
  frameBuilderSteps.forEach((button,index)=>{
    const cfg=frameConfig[index];
    button.classList.toggle('complete',frameState[cfg.key].length>0);
    button.classList.toggle('active',index===frameBuilderStep&&frameBuilderStep<5);
  });
};

const renderFrameResult=()=>{
  frameBuilderOptions.hidden=true;
  frameBuilderResult.hidden=false;
  frameBuilderResult.innerHTML=frameConfig.map(cfg=>'<div class="frame-result-row"><small>'+cfg.letter+' / '+cfg.key.toUpperCase()+'</small><strong>'+frameValueText(cfg.key)+'</strong></div>').join('');
  frameBuilderIndex.textContent='PRODUCTION MAP / READY';
  frameBuilderTitle.textContent='КАРТА ПРОЕКТА СОБРАНА.';
  frameBuilderCopy.textContent='FRAME собрал исходную архитектуру проекта. Передайте её в бриф, чтобы не вводить выбранные параметры повторно.';
  frameBuilderLetter.textContent='V';
  frameBuilderProgress.textContent='READY';
  frameBuilderBack.disabled=false;
  frameBuilderNext.innerHTML='ПЕРЕДАТЬ В БРИФ <span>↗</span>';
  frameBuilderSteps.forEach(button=>button.classList.remove('active'));
};

const renderFrameStep=()=>{
  if(frameBuilderStep>=5){renderFrameResult();syncFrameMap();return}
  const cfg=frameConfig[frameBuilderStep];
  frameBuilderOptions.hidden=false;
  frameBuilderOptions.innerHTML=cfg.options.map(option=>'<button class="frame-option'+(frameState[cfg.key].includes(option)?' active':'')+'" type="button" data-frame-value="'+option.replace(/"/g,'&quot;')+'">'+option+'</button>').join('');
  frameBuilderResult.hidden=true;
  frameBuilderIndex.textContent=cfg.index;
  frameBuilderTitle.textContent=cfg.title;
  frameBuilderCopy.textContent=cfg.copy;
  frameBuilderLetter.textContent=cfg.letter;
  frameBuilderProgress.textContent=String(frameBuilderStep+1).padStart(2,'0')+' / 05';
  frameBuilderBack.disabled=frameBuilderStep===0;
  frameBuilderNext.innerHTML=(frameBuilderStep===4?'BUILD MAP':'NEXT')+' <span>→</span>';
  syncFrameMap();
};

const chooseFrameOption=value=>{
  const cfg=frameConfig[frameBuilderStep];
  if(!cfg)return;
  const values=frameState[cfg.key];
  if(cfg.multi){
    const index=values.indexOf(value);
    if(index>=0)values.splice(index,1);else values.push(value);
  }else{
    frameState[cfg.key]=[value];
  }
  renderFrameStep();
};

frameBuilderOptions?.addEventListener('click',event=>{
  const option=event.target.closest('.frame-option');
  if(option)chooseFrameOption(option.dataset.frameValue||'');
});

const openFrameBuilder=trigger=>{
  if(!frameBuilder)return;
  if(frameBuilderCloseTimer){window.clearTimeout(frameBuilderCloseTimer);frameBuilderCloseTimer=null}
  frameBuilderLastFocus=trigger||document.activeElement;
  frameBuilder.hidden=false;
  frameBuilder.scrollTop=0;
  frameBuilder.setAttribute('aria-hidden','false');
  document.body.classList.add('frame-builder-open');
  renderFrameStep();
  if(frameBuilderVideo){
    frameBuilderVideo.muted=true;frameBuilderVideo.loop=true;frameBuilderVideo.playsInline=true;frameBuilderVideo.load();
    const play=frameBuilderVideo.play();if(play&&typeof play.catch==='function')play.catch(()=>{});
  }
  window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>{frameBuilder.classList.add('open');frameBuilderClose?.focus({preventScroll:true})}));
};

const closeFrameBuilder=(restoreFocus=true)=>{
  if(!frameBuilder||frameBuilder.hidden)return;
  frameBuilder.classList.remove('open');frameBuilder.setAttribute('aria-hidden','true');document.body.classList.remove('frame-builder-open');frameBuilderVideo?.pause();
  frameBuilderCloseTimer=window.setTimeout(()=>{frameBuilder.hidden=true;frameBuilderCloseTimer=null;if(restoreFocus&&frameBuilderLastFocus instanceof HTMLElement)frameBuilderLastFocus.focus({preventScroll:true})},300);
};

frameBuilderTriggers.forEach(trigger=>trigger.addEventListener('click',()=>openFrameBuilder(trigger)));
frameBuilderClose?.addEventListener('click',()=>closeFrameBuilder(true));
frameBuilderSteps.forEach((button,index)=>button.addEventListener('click',()=>{frameBuilderStep=index;renderFrameStep()}));
frameBuilderBack?.addEventListener('click',()=>{frameBuilderStep=frameBuilderStep===5?4:Math.max(0,frameBuilderStep-1);renderFrameStep()});

const frameSummary=()=>frameConfig.map(cfg=>cfg.letter+' / '+cfg.key.toUpperCase()+': '+frameValueText(cfg.key)).join('\n');

const transferFrameToBrief=()=>{
  const run=frameState.run[0]||'';
  const media=frameState.media;
  const formatInput=document.querySelector('#brief-format');
  if(formatInput&&run)formatInput.value=run.charAt(0)+run.slice(1).toLowerCase();
  if(briefFrame)briefFrame.value=frameSummary();
  const checkboxes=[...document.querySelectorAll('input[name="services"]')];
  checkboxes.forEach(box=>{box.checked=false});
  const hasPhoto=media.includes('PHOTO SERIES');
  const hasVideo=media.some(value=>['MASTER FILM','HIGHLIGHTS','INTERVIEWS'].includes(value));
  const hasContent=media.includes('VERTICAL');
  if(hasPhoto&&hasVideo){const combo=checkboxes.find(box=>box.value==='Фото + видео');if(combo)combo.checked=true}
  else if(hasPhoto){const photo=checkboxes.find(box=>box.value==='Фото');if(photo)photo.checked=true}
  else if(hasVideo){const video=checkboxes.find(box=>box.value==='Видео');if(video)video.checked=true}
  if(hasContent){const content=checkboxes.find(box=>box.value==='Контент');if(content)content.checked=true}
  if(briefStatus){briefStatus.textContent='VECTA FRAME перенесён в бриф. Добавьте дату, площадку и контакт.';briefStatus.classList.add('is-success')}
  closeFrameBuilder(false);
  window.setTimeout(()=>document.querySelector('#contact')?.scrollIntoView({behavior:'smooth',block:'start'}),320);
};

frameBuilderNext?.addEventListener('click',()=>{
  if(frameBuilderStep===5){transferFrameToBrief();return}
  const cfg=frameConfig[frameBuilderStep];
  if(!frameState[cfg.key].length){frameBuilderOptions?.classList.add('needs-choice');window.setTimeout(()=>frameBuilderOptions?.classList.remove('needs-choice'),450);return}
  frameBuilderStep+=1;renderFrameStep();
});

frameBuilder?.addEventListener('click',event=>{if(event.target===frameBuilder)closeFrameBuilder(true)});
document.addEventListener('keydown',event=>{
  if(!frameBuilder||frameBuilder.hidden||!frameBuilder.classList.contains('open'))return;
  if(event.key==='Escape'){event.preventDefault();closeFrameBuilder(true);return}
  if(event.key!=='Tab')return;
  const focusable=[...frameBuilder.querySelectorAll('button:not([disabled]),a[href]')].filter(el=>el.offsetParent!==null);
  if(!focusable.length)return;
  const first=focusable[0],last=focusable[focusable.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
});
