(()=>{'use strict';
 const scope=document;
 function filter(button){const value=button.dataset.filter;scope.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let visible=0;scope.querySelectorAll('[data-category]').forEach(entry=>{const show=value==='all'||entry.dataset.category===value||entry.dataset.category==='both';entry.hidden=!show;if(show)visible++;});scope.querySelector('.archive-grid')?.classList.toggle('is-filtered',value!=='all');const status=scope.querySelector('.archive-count');if(status)status.textContent=visible+' '+(visible===1?'макет':visible<5?'макета':'макетов');}
 scope.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>filter(b)));
 const form=scope.querySelector('#brief');if(!form)return;
 const names={photo:'Фотография',highlight:'Фото + Highlight',film:'Фото + фильм',discuss:'Обсудим вместе'};
 const selected=new URLSearchParams(location.search).get('format');if(selected&&names[selected]){const radio=form.querySelector('input[name="format"][value="'+selected+'"]');if(radio)radio.checked=true;}
 function text(){const d=new FormData(form);return ['Здравствуйте, VECTA! Хотим обсудить свадебную съёмку.',`Дата свадьбы: ${d.get('date')||'Уточним'}`,`Город / площадка: ${d.get('venue')||'Уточним'}`,`Формат: ${names[d.get('format')]||names.discuss}`,`О свадьбе: ${d.get('task')||'Обсудим'}`].join('\n');}
 function sync(){scope.querySelector('#telegram-brief').href='https://t.me/denisovphotos?text='+encodeURIComponent(text());}
 form.addEventListener('input',sync);form.addEventListener('submit',e=>e.preventDefault());sync();
 scope.querySelector('#copy-brief').addEventListener('click',async()=>{const status=scope.querySelector('#brief-status');try{await navigator.clipboard.writeText(text());status.textContent='Текст скопирован. Отправьте его удобным способом.';}catch{status.textContent='Копирование недоступно. Откройте Telegram: текст уже подготовлен.';}});
})();
