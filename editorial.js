(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const menuButton = $('#menu-button');
  const nav = $('#site-nav');
  function closeMenu() {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Открыть меню');
  }
  menuButton?.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  $$('#site-nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  const progressBar = $('#reading-progress-bar');
  let scrollScheduled = false;
  function updateProgress() {
    scrollScheduled = false;
    const span = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = `${span > 0 ? Math.min(100, Math.max(0, window.scrollY / span * 100)) : 0}%`;
  }
  window.addEventListener('scroll', () => {
    if (!scrollScheduled) { scrollScheduled = true; window.requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();

  const film = $('#featured-film');
  const filmToggle = $('#film-toggle');
  const filmToggleLabel = $('#film-toggle-label');
  const setFilmState = () => {
    if (!film || !filmToggle) return;
    const paused = film.paused;
    filmToggleLabel.textContent = paused ? 'PLAY FILM' : 'PAUSE FILM';
    filmToggle.setAttribute('aria-label', paused ? 'Воспроизвести фильм' : 'Поставить фильм на паузу');
    film.controls = !paused;
    filmToggle.style.opacity = paused ? '1' : '.04';
  };
  filmToggle?.addEventListener('click', async () => {
    if (!film) return;
    if (!film.paused) { film.pause(); return; }
    try { await film.play(); } catch (_) { filmToggleLabel.textContent = 'VIDEO UNAVAILABLE'; filmToggle.style.opacity = '1'; }
  });
  film?.addEventListener('play', setFilmState);
  film?.addEventListener('pause', setFilmState);
  film?.addEventListener('ended', setFilmState);
  film?.addEventListener('error', () => { if (filmToggleLabel) filmToggleLabel.textContent = 'VIDEO UNAVAILABLE'; });

  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightbox-image');
  const lightboxCounter = $('#lightbox-counter');
  const photoButtons = $$('.project-photo[data-photo]');
  let photoIndex = 0;
  function showPhoto(index) {
    if (!photoButtons.length) return;
    photoIndex = (index + photoButtons.length) % photoButtons.length;
    const img = $('img', photoButtons[photoIndex]);
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt;
    lightboxCounter.textContent = `${String(photoIndex + 1).padStart(2, '0')} / ${String(photoButtons.length).padStart(2, '0')}`;
  }
  photoButtons.forEach((button, index) => button.addEventListener('click', () => {
    showPhoto(index);
    lightbox.showModal();
    document.body.classList.add('modal-open');
  }));
  $('#lightbox-prev')?.addEventListener('click', () => showPhoto(photoIndex - 1));
  $('#lightbox-next')?.addEventListener('click', () => showPhoto(photoIndex + 1));
  $('#lightbox-close')?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('close', () => document.body.classList.remove('modal-open'));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
  lightbox?.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); showPhoto(photoIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); showPhoto(photoIndex + 1); }
  });

  const form = $('#project-brief');
  const formState = $('#form-state');
  const submit = $('#form-submit');
  const draftKey = 'vecta-editorial-brief-v1';
  const collect = () => {
    const data = new FormData(form);
    const services = data.getAll('services').map(String);
    return {
      date: String(data.get('date') || '').trim(),
      venue: String(data.get('venue') || '').trim(),
      format: String(data.get('format') || '').trim(),
      contact: String(data.get('contact') || '').trim(),
      services: services.includes('Фото + видео') ? ['Фото + видео'] : services
    };
  };
  const messageText = (brief) => [
    'Здравствуйте! Хочу обсудить съёмку VECTA.',
    `Дата: ${brief.date || 'уточним'}`,
    `Город / площадка: ${brief.venue || 'уточним'}`,
    `Событие: ${brief.format || 'уточним'}`,
    `Форматы: ${brief.services.join(', ') || 'уточним'}`,
    `Контакт: ${brief.contact || 'уточним'}`
  ].join('\n');
  function status(message, type = '') {
    formState.textContent = message;
    formState.className = `form-state ${type}`.trim();
  }
  try {
    const old = JSON.parse(localStorage.getItem(draftKey) || 'null');
    if (old && form) {
      ['date','venue','format','contact'].forEach(key => { if (typeof old[key] === 'string') form.elements[key].value = old[key]; });
      $$('input[name="services"]', form).forEach(el => { el.checked = Array.isArray(old.services) && old.services.includes(el.value); });
    }
  } catch (_) {}
  form?.addEventListener('input', () => {
    try { localStorage.setItem(draftKey, JSON.stringify(collect())); } catch (_) {}
    if (formState.classList.contains('error')) status('');
  });
  $('#copy-request')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(messageText(collect())); status('Текст запроса скопирован. Можно отправить его удобным способом.', 'success'); }
    catch (_) { status('Не удалось скопировать автоматически. Выделите данные в форме и скопируйте их.', 'error'); }
  });
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) { status('Заполните обязательные поля.', 'error'); return; }
    const brief = collect();
    if (!brief.services.length) { status('Выберите фото, видео или оба формата.', 'error'); return; }
    submit.disabled = true;
    status('Проверяем возможность отправить запрос…');
    try {
      const response = await fetch('/api/lead', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify(brief) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok || !result.delivered) throw new Error('Delivery not confirmed');
      form.reset();
      try { localStorage.removeItem(draftKey); } catch (_) {}
      status('Запрос отправлен. Мы свяжемся с вами по указанному контакту.', 'success');
    } catch (_) {
      status('Автоматическая отправка сейчас недоступна. Данные сохранены в форме — нажмите «Скопировать текст запроса», чтобы не потерять их.', 'error');
    } finally { submit.disabled = false; }
  });
})();