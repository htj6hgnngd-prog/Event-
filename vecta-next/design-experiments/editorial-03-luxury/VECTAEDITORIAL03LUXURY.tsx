import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import './VECTAEDITORIAL03LUXURY.css';
type Format = 'photo' | 'video' | 'both';
const formats: {
  key: Format;
  title: string;
  detail: string;
  index: string;
  url: string;
}[] = [{
  key: 'photo',
  title: 'Фото',
  index: '01',
  detail: 'Репортаж, портреты, детали и атмосфера события.',
  url: 'https://vecta-weddings.vercel.app/svadebnyy-fotograf/'
}, {
  key: 'video',
  title: 'Видео',
  index: '02',
  detail: 'Свадебный фильм. Движение, звук и монтаж.',
  url: 'https://vecta-weddings.vercel.app/svadebnaya-videosemka/'
}, {
  key: 'both',
  title: 'Фото + видео',
  index: '03',
  detail: 'Согласованная работа двух форматов в течение свадебного дня.',
  url: 'https://vecta-weddings.vercel.app/foto-i-video-na-svadbu/'
}];
const frames = [{
  id: '01',
  type: 'PHOTO',
  className: 'hero',
  title: 'PORTFOLIO / 01'
}, {
  id: '02',
  type: 'PHOTO',
  className: 'small',
  title: 'PORTFOLIO / 02'
}, {
  id: '03',
  type: 'VIDEO LOOP',
  className: 'loop',
  title: 'MOTION / 03'
}, {
  id: '04',
  type: 'PHOTO',
  className: 'small',
  title: 'PORTFOLIO / 04'
}, {
  id: '05',
  type: 'PHOTO',
  className: 'small',
  title: 'PORTFOLIO / 05'
}];
const questions = [{
  question: 'Как формируется стоимость?',
  answer: 'Зависит от даты, места проведения, продолжительности и выбранного формата. После первого обращения уточним задачи и подготовим персональное предложение.'
}, {
  question: 'Можно ли связаться через организатора?',
  answer: 'Да. Контакт свадебного организатора можно указать в запросе. Детали подготовки и взаимодействия обсудим отдельно.'
}, {
  question: 'Как подтвердить дату?',
  answer: 'Доступность проверяется лично. Дата считается согласованной только после обсуждения условий и подтверждения бронирования.'
}];
function Arrow({
  diag = false
}: {
  diag?: boolean;
}) {
  return <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="square" strokeLinejoin="miter">
 {diag ? <path d="M5 19 19 5M8 5h11v11" /> : <path d="M4 12h16m-6-6 6 6-6 6" />}
 </svg>;
}
function Emblem() {
  return <svg className="vlux-emblem" viewBox="0 0 480 510" fill="none" aria-hidden="true">
  <path d="M55 54C106 40 118 103 140 178C168 273 188 355 235 447C244 466 256 443 281 397C348 274 381 150 451 36" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
  <path d="M37 62C68 18 125 19 164 76C199 128 215 163 236 201" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
  <path d="M408 88C446 42 464 17 470 2" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
  <path d="M221 439C270 471 333 490 442 461C455 456 460 444 446 440C427 435 413 453 423 470" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
  <path d="M198 472C241 495 316 504 363 500" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
 </svg>;
}
export const VECTAEDITORIAL03LUXURY = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Format>('both');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [comment, setComment] = useState('');
  const [opened, setOpened] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);
  const toContact = () => {
    setMenuOpen(false);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('vlux-enquiry')?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth'
    });
  };
  const selectFormat = (v: Format) => {
    setSelected(v);
    setOpened(false);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('vlux-enquiry')?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth'
    });
    window.setTimeout(() => dateRef.current?.focus({
      preventScroll: true
    }), reduce ? 30 : 470);
  };
  const label = formats.find(x => x.key === selected)?.title || 'Фото + видео';
  const draft = ['Здравствуйте! Хочу запросить предложение на свадебную съёмку VECTA.', 'Формат: ' + label, 'Дата: ' + (date || 'уточняется'), 'Площадка / город: ' + (venue.trim() || 'уточняется'), ...(comment.trim() ? ['Дополнительная информация: ' + comment.trim()] : []), 'Подскажите, пожалуйста, доступность и условия.'].join('\n');
  const telegramUrl = 'https://t.me/denisovphotos?text=' + encodeURIComponent(draft);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpened(true);
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };
  return <div className="vlux" id="vlux-top">
  <a className="vlux-skip" href="#vlux-main">К содержанию</a>
  <header className="vlux-header">
   <a href="#vlux-top" className="vlux-logo" aria-label="VECTA — главная" onClick={() => setMenuOpen(false)}>VECTA<span>.</span></a>
   <nav className="vlux-desktop-nav" aria-label="Основная навигация">
    <a href="#vlux-work">Портфолио</a><a href="#vlux-approach">Подход</a><a href="#vlux-formats">Форматы</a>
   </nav>
   <button type="button" className="vlux-header-cta" onClick={toContact}>Запросить предложение <Arrow diag /></button>
   <button type="button" className="vlux-menu-toggle" aria-expanded={menuOpen} aria-controls="vlux-mobile-nav" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setMenuOpen(v => !v)}>
    <span></span><span></span>
   </button>
   {menuOpen && <nav className="vlux-mobile-nav" id="vlux-mobile-nav" aria-label="Мобильная навигация">
    <a href="#vlux-work" onClick={() => setMenuOpen(false)}>Портфолио</a>
    <a href="#vlux-approach" onClick={() => setMenuOpen(false)}>Подход</a>
    <a href="#vlux-formats" onClick={() => setMenuOpen(false)}>Форматы</a>
    <button type="button" onClick={toContact}>Запросить предложение <Arrow diag /></button>
   </nav>}
  </header>
  <main id="vlux-main">
   <section className="vlux-hero" aria-labelledby="vlux-h1">
    <div className="vlux-hero-meta">
     <span>WEDDING PHOTO & FILM</span><span>МОСКВА · СЕЗОН 2027</span>
    </div>
    <div className="vlux-hero-portrait" role="img" aria-label="Медиаокно для портфолио VECTA — фотография пока не добавлена">
     <span className="vlux-portrait-label">PORTFOLIO / HERO</span>
     <span className="vlux-portrait-status">PHOTO / PENDING</span>
    </div>
    <Emblem />
    <div className="vlux-brand-display" aria-hidden="true">VECTA<span>.</span></div>
    <div className="vlux-hero-foot">
     <div className="vlux-hero-info">
      <h1 id="vlux-h1">Свадебная фотография и кино.</h1>
      <p>Москва и Подмосковье. Индивидуальный формат съёмки под программу вашего события.</p>
     </div>
     <button type="button" onClick={toContact} className="vlux-primary">Запросить предложение <Arrow diag /></button>
    </div>
    <div className="vlux-hero-baseline"><span>VECTA / WEDDINGS</span><a href="#vlux-work">ПОРТФОЛИО <span aria-hidden="true">↓</span></a></div>
   </section>

   <section className="vlux-work" id="vlux-work" aria-labelledby="vlux-work-h">
    <div className="vlux-section-meta"><span>SELECTED WORK</span><span>PHOTO / MOTION</span></div>
    <div className="vlux-work-heading">
     <h2 id="vlux-work-h">Портфолио<span>.</span></h2>
     <p>Фотография и короткие видеосцены в одной редакционной композиции.</p>
    </div>
    <div className="vlux-mosaic" aria-label="Портфолио: четыре фото и один видеолуп, пока без загруженных медиа">
      {frames.map((frame, i) => <div key={frame.id} data-media={frame.type === 'VIDEO LOOP' ? 'loop' : 'photo'} className={'vlux-tile ' + (i === 0 ? 'vlux-tile--lead ' : '') + (frame.type === 'VIDEO LOOP' ? 'vlux-tile--loop' : '')}>
        <div className="vlux-tile-top"><span>{frame.id}</span><span>{frame.type}</span></div>
        <div className="vlux-tile-foot"><span>VECTA / {frame.title}</span><span className="vlux-tile-empty">МЕДИА БУДЕТ ДОБАВЛЕНО</span></div>
      </div>)}
    </div>
    <div className="vlux-work-bottom"><span>04 STILL / 01 MOTION</span><span>Все видеолупы — в размерах фотографий. Без встроенного видеоплеера.</span></div>
   </section>

   <section className="vlux-approach" id="vlux-approach" aria-labelledby="vlux-approach-h">
    <div className="vlux-section-meta"><span>ПОДХОД</span><span>VECTA / EDITORIAL</span></div>
    <div className="vlux-approach-grid">
     <h2 id="vlux-approach-h">Эстетика.<br /><em>Дисциплина.</em></h2>
     <div className="vlux-approach-copy">
      <p>Свет. Композиция. Тайминг. Внимание к людям и деталям.</p>
      <p>Фотографии и видео должны быть частью вашей свадьбы, а не причиной перестраивать её программу. Формат, съёмочный план и взаимодействие с организатором обсуждаем заранее.</p>
      <a href="#vlux-formats" className="vlux-inline-link">Форматы съёмки <Arrow diag /></a>
     </div>
    </div>
   </section>

   <section className="vlux-services" id="vlux-formats" aria-labelledby="vlux-services-h">
    <div className="vlux-section-meta"><span>ФОРМАТЫ</span><span>ФОТО / ВИДЕО</span></div>
    <div className="vlux-services-head">
     <h2 id="vlux-services-h">Форматы<span>.</span></h2>
     <p>Выбирайте необходимый объём работы. Детали, состав команды и условия согласуем перед съёмкой.</p>
    </div>
    <div className="vlux-service-list">
      {formats.map(item => <article className="vlux-service" key={item.key}>
       <span className="vlux-service-num">{item.index}</span>
       <div className="vlux-service-main"><h3>{item.title}</h3><p>{item.detail}</p></div>
       <div className="vlux-service-actions">
        <button type="button" onClick={() => selectFormat(item.key)}>Выбрать формат <Arrow diag /></button>
        <a href={item.url} target="_blank" rel="noopener noreferrer">Подробнее</a>
       </div>
      </article>)}
    </div>
   </section>

   <section className="vlux-enquiry" id="vlux-enquiry" aria-labelledby="vlux-enquiry-h">
    <div className="vlux-section-meta"><span>ЗАПРОС</span><span>СВАДЕБНЫЙ СЕЗОН 2027</span></div>
    <div className="vlux-enquiry-grid">
     <div className="vlux-enquiry-intro">
      <h2 id="vlux-enquiry-h">Запросить<br /><em>предложение.</em></h2>
      <p>Укажите формат, дату и место проведения. Обсудим задачу и подготовим условия съёмки.</p>
      <div className="vlux-enquiry-note">Наличие свободной даты подтверждаем лично.</div>
     </div>
     <form className="vlux-form" onSubmit={onSubmit}>
      <fieldset className="vlux-formats-field">
       <legend>ФОРМАТ СЪЁМКИ</legend>
       <div className="vlux-choice-grid">
        {formats.map(item => <label className={selected === item.key ? 'is-selected' : ''} key={item.key}>
         <input type="radio" name="format" value={item.key} checked={selected === item.key} onChange={() => {
                    setSelected(item.key);
                    setOpened(false);
                  }} />
         <span>{item.title}</span><span aria-hidden="true">{selected === item.key ? '●' : '○'}</span>
        </label>)}
       </div>
      </fieldset>
      <div className="vlux-input-row">
       <label htmlFor="vlux-date">ДАТА <span>ЕСЛИ ИЗВЕСТНА</span></label>
       <input ref={dateRef} id="vlux-date" type="date" value={date} onChange={e => {
                setDate(e.target.value);
                setOpened(false);
              }} />
      </div>
      <div className="vlux-input-row">
       <label htmlFor="vlux-venue">МЕСТО ПРОВЕДЕНИЯ</label>
       <input id="vlux-venue" type="text" maxLength={140} placeholder="Город / площадка" value={venue} onChange={e => {
                setVenue(e.target.value);
                setOpened(false);
              }} />
      </div>
      <div className="vlux-input-row">
       <label htmlFor="vlux-notes">КОММЕНТАРИЙ <span>ПО ЖЕЛАНИЮ</span></label>
       <textarea id="vlux-notes" rows={2} maxLength={650} placeholder="Программа, пожелания, контакты организатора…" value={comment} onChange={e => {
                setComment(e.target.value);
                setOpened(false);
              }} />
      </div>
      <button className="vlux-submit" type="submit">Продолжить в Telegram <Arrow diag /></button>
      <p className="vlux-legal">Откроется чат с подготовленным текстом. Сообщение вы отправляете самостоятельно.</p>
      {opened && <p className="vlux-fallback" role="status">Если Telegram не открылся, <a href={telegramUrl} target="_blank" rel="noopener noreferrer">откройте чат вручную</a>.</p>}
     </form>
    </div>
   </section>

   <section className="vlux-faq" aria-labelledby="vlux-faq-h">
    <div className="vlux-section-meta"><span>ИНФОРМАЦИЯ</span><span>BEFORE BOOKING</span></div>
    <div className="vlux-faq-grid">
     <h2 id="vlux-faq-h">Вопросы<span>.</span></h2>
     <div className="vlux-faq-list">
      {questions.map(q => <details key={q.question}>
       <summary><span>{q.question}</span><span className="vlux-plus" aria-hidden="true">+</span></summary>
       <p>{q.answer}</p>
      </details>)}
     </div>
    </div>
   </section>
  </main>
  <footer className="vlux-footer">
   <div className="vlux-footer-top"><span>WEDDING PHOTO & FILM</span><a href="https://t.me/denisovphotos" target="_blank" rel="noopener noreferrer">СВЯЗАТЬСЯ <Arrow diag /></a></div>
   <div className="vlux-footer-logo" aria-hidden="true">VECTA<span>.</span></div>
   <div className="vlux-footer-bottom"><span>© VECTA · 2027</span><span>МОСКВА / ПОДМОСКОВЬЕ</span><a href="#vlux-top">НАВЕРХ ↑</a></div>
  </footer>
 </div>;
};