import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import './VECTAWEDDINGSDIRECTORSCUT.css';
type Format = 'photo' | 'cinema' | 'both';
const services: {
  key: Format;
  num: string;
  title: string;
  tagline: string;
  description: string;
  url: string;
}[] = [{
  key: 'photo',
  num: '01',
  title: 'Фотографии',
  tagline: 'Мгновения останутся.',
  description: 'Портреты, близкие люди, живой репортаж и детали вашего дня.',
  url: 'https://vecta-weddings.vercel.app/svadebnyy-fotograf/'
}, {
  key: 'cinema',
  num: '02',
  title: 'Кино',
  tagline: 'Чувства оживут.',
  description: 'Голоса, движения, атмосфера вечера и то, что не уместить в кадре.',
  url: 'https://vecta-weddings.vercel.app/svadebnaya-videosemka/'
}, {
  key: 'both',
  num: '03',
  title: 'Фото + кино',
  tagline: 'История целиком.',
  description: 'Два взгляда на один день, которые дополняют друг друга.',
  url: 'https://vecta-weddings.vercel.app/foto-i-video-na-svadbu/'
}];
const frames: {
  number: string;
  category: string;
  title: string;
  kind: 'photo' | 'loop';
}[] = [{
  number: '01',
  category: 'PORTRAIT',
  title: 'Всё начинается со взгляда',
  kind: 'photo'
}, {
  number: '02',
  category: 'DETAIL',
  title: 'Вещи со смыслом',
  kind: 'photo'
}, {
  number: '03',
  category: 'MOTION / LOOP',
  title: 'Момент в движении',
  kind: 'loop'
}, {
  number: '04',
  category: 'PEOPLE',
  title: 'Те, кто рядом',
  kind: 'photo'
}, {
  number: '05',
  category: 'AFTER HOURS',
  title: 'Когда забывают о камере',
  kind: 'photo'
}];
const questions = [{
  question: 'Сколько стоит свадебная съёмка?',
  answer: 'Это зависит от даты, программы, количества часов, состава команды и выбранного формата. Расскажите о свадьбе — обсудим задачу и подготовим предложение. Стоимость подтверждаем лично.'
}, {
  question: 'Что делать, если мы не умеем позировать?',
  answer: 'Ничего специально уметь не нужно. Для портретов мы аккуратно подскажем, а во время церемонии и праздника дадим событиям идти своим чередом.'
}, {
  question: 'Можно написать, если площадки ещё нет?',
  answer: 'Да. Для первого разговора достаточно примерной даты и города. Остальные детали можно определить позже.'
}, {
  question: 'Когда дата считается забронированной?',
  answer: 'Только после личного подтверждения доступности даты и согласования условий. Переход в Telegram сам по себе дату не закрепляет.'
}];
function Arrow({
  diagonal = false
}: {
  diagonal?: boolean;
}) {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter">
    {diagonal ? <path d="M5 19 19 5M8 5h11v11" /> : <path d="M4 12h16m-7-7 7 7-7 7" />}
  </svg>;
}
export const VECTAWEDDINGSDIRECTORSCUT = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState<Format>('both');
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [notes, setNotes] = useState('');
  const [telegramOpened, setTelegramOpened] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);
  const chooseFormat = (format: Format) => {
    setSelected(format);
    setMobileOpen(false);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('vecta-contact')?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
    window.setTimeout(() => dateRef.current?.focus({
      preventScroll: true
    }), reducedMotion ? 50 : 450);
  };
  const goToContact = () => {
    setMobileOpen(false);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('vecta-contact')?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  };
  const selectedTitle = services.find(item => item.key === selected)?.title || 'Фото + кино';
  const message = ['Здравствуйте! Хочу обсудить съёмку свадьбы с VECTA.', 'Формат: ' + selectedTitle, 'Дата: ' + (date || 'пока не определена'), 'Площадка / город: ' + (place.trim() || 'уточню позже'), ...(notes.trim() ? ['Детали: ' + notes.trim()] : []), 'Подскажите, свободна ли дата и какой формат подойдёт?'].join('\n');
  const telegramUrl = 'https://t.me/denisovphotos?text=' + encodeURIComponent(message);
  const navItems = [{
    href: '#vecta-vision',
    label: 'Подход'
  }, {
    href: '#vecta-stories',
    label: 'Истории'
  }, {
    href: '#vecta-services',
    label: 'Форматы'
  }];
  const onMenuLink = () => setMobileOpen(false);
  const onContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTelegramOpened(true);
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };
  return <div className="vcut">
    <a className="vcut-skip" href="#vecta-main">К содержанию</a>

    <header className="vcut-header">
      <a className="vcut-brand" href="#vecta-top" aria-label="VECTA — главная" onClick={onMenuLink}>VECTA<span>.</span></a>
      <nav className="vcut-nav" aria-label="Главное меню">
        {navItems.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}
      </nav>
      <button className="vcut-header-cta" onClick={goToContact} type="button">Уточнить дату <Arrow diagonal /></button>
      <button className="vcut-menu-toggle" onClick={() => setMobileOpen(open => !open)} type="button" aria-expanded={mobileOpen} aria-controls="vcut-mobile-nav" aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}>
        <span className={mobileOpen ? 'vcut-menu-icon is-open' : 'vcut-menu-icon'}><i></i><i></i></span>
      </button>
      {mobileOpen && <nav className="vcut-mobile-nav" id="vcut-mobile-nav" aria-label="Меню на мобильном">
        {navItems.map(item => <a key={item.href} href={item.href} onClick={onMenuLink}>{item.label}</a>)}
        <button type="button" onClick={goToContact}>Уточнить дату <Arrow diagonal /></button>
      </nav>}
    </header>

    <main id="vecta-main">
      <section className="vcut-hero" id="vecta-top" aria-labelledby="vcut-hero-title">
        <div className="vcut-hero-inner">
          <div className="vcut-hero-kicker"><span className="vcut-red-star">✳</span> СВАДЕБНАЯ ФОТОГРАФИЯ И КИНО <span className="vcut-line"></span> МОСКВА / 2027</div>
          <div className="vcut-hero-media" role="img" aria-label="Место для авторского свадебного фото VECTA. Изображение пока не добавлено">
            <span className="vcut-media-topleft">FRAME 001<br />THE BEGINNING</span>
            <div className="vcut-hero-media-cross" aria-hidden="true"><span></span><span></span></div>
            <span className="vcut-media-bottomright">[ ВАШ КАДР ЗДЕСЬ ]</span>
          </div>
          <h1 id="vcut-hero-title" className="vcut-hero-headline"><span>Ваш день.</span><span>Без дублей.</span></h1>
          <div className="vcut-script" aria-label="Навсегда">
            <span className="vcut-script-word">Навсегда</span>
            <svg className="vcut-script-flourish" aria-hidden="true" viewBox="0 0 660 140" preserveAspectRatio="none" fill="none">
              <path d="M10 90 C130 132 252 58 370 88 S553 123 651 22 M620 34 C638 11 653 8 654 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <div className="vcut-hero-subline">
            <p>Живые фотографии, голоса близких, ваш первый танец.<br className="vcut-desktop-only" /> Всё настоящее — в кадрах и свадебном кино.</p>
            <div className="vcut-hero-actions">
              <button type="button" onClick={goToContact} className="vcut-button vcut-button--cream">Обсудить вашу дату <Arrow diagonal /></button>
              <a className="vcut-text-link" href="#vecta-stories">Смотреть истории <span>↓</span></a>
            </div>
          </div>
          <div className="vcut-hero-side">THE VOW / THE MOMENT / THE MEMORY</div>
          <div className="vcut-hero-index"><span>VECTA / WEDDINGS</span><span>ЛИСТАЙТЕ ВНИЗ <span aria-hidden="true">↓</span></span></div>
        </div>
      </section>

      <div className="vcut-running" aria-label="Фотографии. Кино. Настоящие чувства."><span>VECTA</span><span className="vcut-red-star">✳</span><span>ФОТОГРАФИИ</span><span className="vcut-red-star">✳</span><span>КИНО</span><span className="vcut-red-star">✳</span><span>НАСТОЯЩИЕ ЧУВСТВА</span></div>

      <section className="vcut-statement" id="vecta-vision" aria-labelledby="vcut-statement-title">
        <div className="vcut-section-top"><span>01 / НАШ ВЗГЛЯД</span><span>THE WAY WE SEE IT</span></div>
        <div className="vcut-statement-grid">
          <h2 id="vcut-statement-title">Не ставим<br /><em>любовь</em><br />в позу.</h2>
          <div className="vcut-statement-copy">
            <span className="vcut-side-index">V / 01</span>
            <p>Случайный взгляд. Объятия родителей. Слова, сказанные тихо. Ваш день не должен становиться съёмочной площадкой.</p>
            <p>Мы внимательны к моментам, а не к идеальным сценариям. И всё же знаем, когда свет, жест и композиция превращают воспоминание в искусство.</p>
            <a href="#vecta-stories" className="vcut-text-link vcut-text-link--dark">Увидеть нашу эстетику <Arrow diagonal /></a>
          </div>
        </div>
      </section>

      <section className="vcut-stories" id="vecta-stories" aria-labelledby="vcut-stories-title">
        <div className="vcut-section-top"><span>02 / ИСТОРИИ</span><span>STILL / MOTION</span></div>
        <div className="vcut-stories-header">
          <h2 id="vcut-stories-title">Мгновения.<br /><em>И чуть больше.</em></h2>
          <div className="vcut-stories-intro">
            <span className="vcut-eyebrow">EDITORIAL MOSAIC</span>
            <p>Фотографии и короткие фрагменты движения — рядом. Один живой кадр среди неподвижных фотографий. Без плееров, без шума.</p>
          </div>
        </div>
        <div className="vcut-story-ledger" aria-label="Сюжет свадебного дня">
          <span><b>I.</b> ПЕРЕД ЦЕРЕМОНИЕЙ</span>
          <span><b>II.</b> ТАК СКАЗАЛИ «ДА»</span>
          <span><b>III.</b> ПОСЛЕ ПОЛУНОЧИ</span>
        </div>
        <div className="vcut-mosaic" aria-label="Редакционная галерея: четыре места для фотографий и одно для видеолупа">
          {frames.map((frame, index) => <div className={'vcut-mosaic-cell' + (index === 0 ? ' vcut-mosaic-cell--feature' : '') + (frame.kind === 'loop' ? ' vcut-mosaic-cell--motion' : '')} key={frame.number}>
            <div className="vcut-mosaic-meta"><span>{frame.number} / {frame.category}</span><span aria-hidden="true">+</span></div>
            <div className="vcut-mosaic-cross" aria-hidden="true"><i></i><i></i></div>
            <div className="vcut-mosaic-caption">
              <span>{frame.title}</span>
              <small>{frame.kind === 'loop' ? 'ВИДЕОЛУП · ПОСТЕР' : 'ФОТО · МЕДИАОКНО'}</small>
            </div>
          </div>)}
        </div>
        <div className="vcut-stories-bottom"><span>05 МОМЕНТОВ / 04 СНИМКА + 01 ВИДЕОЛУП</span><p>Именно так: одна «живая фотография» среди остальных. Без отдельного видеоплеера и смены пропорций.</p></div>
      </section>

      <section className="vcut-vow" aria-labelledby="vcut-vow-heading">
        <div className="vcut-vow-top"><span>03 / САМОЕ ВАЖНОЕ</span><span>THE VOW / СЛОВО, КОТОРОЕ ОСТАНЕТСЯ</span></div>
        <div className="vcut-vow-main">
          <h2 id="vcut-vow-heading">Да<span>.</span></h2>
          <div className="vcut-vow-copy">
            <span className="vcut-vow-mark">✳</span>
            <p>Одно слово. И целый мир после него.</p>
            <small>В тот день вы будете смотреть друг на друга. Мы — замечать моменты, к которым захочется вернуться.</small>
            <button className="vcut-vow-action" type="button" onClick={goToContact}>Уточнить вашу дату <Arrow diagonal /></button>
          </div>
        </div>
        <div className="vcut-vow-bottom"><span>ОНА И ОН / СЕМЬЯ / ДРУЗЬЯ / ВЫ</span><span>VECTA WEDDINGS 2027</span></div>
      </section>

      <section className="vcut-services" id="vecta-services" aria-labelledby="vcut-services-title">
        <div className="vcut-section-top"><span>04 / ВАШ ФОРМАТ</span><span>ONE STORY. YOUR WAY.</span></div>
        <div className="vcut-services-heading"><h2 id="vcut-services-title">Как вы хотите<br /><em>это помнить?</em></h2><p>У каждого дня свой ритм. Выберите формат, а детали и продолжительность мы обсудим вместе.</p></div>
        <div className="vcut-service-list">
          {services.map(item => <article className="vcut-service" key={item.key}>
            <span className="vcut-service-num">{item.num}</span>
            <div className="vcut-service-main"><h3>{item.title}</h3><p>{item.description}</p></div>
            <div className="vcut-service-action">
              <span>{item.tagline}</span>
              <button type="button" onClick={() => chooseFormat(item.key)} aria-label={'Выбрать ' + item.title + ' и перейти к дате'}>Выбрать <Arrow diagonal /></button>
              <a href={item.url} target="_blank" rel="noopener noreferrer">Подробнее об услуге</a>
            </div>
          </article>)}
        </div>
        <p className="vcut-service-note">Никаких обещаний «всё включено» вслепую. Команда, часы, материалы и стоимость согласуются до бронирования.</p>
      </section>

      <section className="vcut-contact" id="vecta-contact" aria-labelledby="vcut-contact-title">
        <div className="vcut-section-top"><span>05 / НАЧАЛО ЗНАКОМСТВА</span><span>МОСКВА / ПОДМОСКОВЬЕ</span></div>
        <div className="vcut-contact-grid">
          <div className="vcut-contact-lead">
            <span className="vcut-eyebrow">СВАДЕБНЫЙ СЕЗОН / 2027</span>
            <h2 id="vcut-contact-title">Один день.<br /><em>Ваша дата.</em></h2>
            <p>Расскажите самое главное — когда и где планируете свадьбу. Мы лично проверим возможность съёмки и обсудим формат.</p>
            <div className="vcut-contact-subnote">Никаких автоматических бронирований. Ответ и условия — лично.</div>
          </div>
          <form className="vcut-form" onSubmit={onContactSubmit}>
            <fieldset className="vcut-form-choices">
              <legend>01. ЧТО ХОТИТЕ СОХРАНИТЬ?</legend>
              <div className="vcut-format-options">
                {services.map(item => <label key={item.key} className={selected === item.key ? 'is-selected' : ''}>
                  <input type="radio" name="format" value={item.key} checked={selected === item.key} onChange={() => setSelected(item.key)} />
                  <span>{item.title}</span><span aria-hidden="true">{selected === item.key ? '●' : '○'}</span>
                </label>)}
              </div>
            </fieldset>
            <div className="vcut-form-row">
              <label htmlFor="vcut-date">02. ДАТА СВАДЬБЫ <span>(ЕСЛИ ИЗВЕСТНА)</span></label>
              <input ref={dateRef} id="vcut-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="vcut-form-row">
              <label htmlFor="vcut-place">03. ГДЕ ПЛАНИРУЕТЕ?</label>
              <input id="vcut-place" type="text" value={place} onChange={e => setPlace(e.target.value)} placeholder="Город или площадка" maxLength={150} />
            </div>
            <div className="vcut-form-row">
              <label htmlFor="vcut-notes">04. ЧТО ЕЩЁ НАМ ЗНАТЬ? <span>(ПО ЖЕЛАНИЮ)</span></label>
              <textarea id="vcut-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Пара слов о вашем дне…" rows={2} maxLength={800} />
            </div>
            <button type="submit" className="vcut-button vcut-button--cream vcut-button--full">Продолжить в Telegram <Arrow diagonal /></button>
            <p className="vcut-form-explainer">Откроется чат с подготовленным текстом. Отправку сообщения подтвердите сами в Telegram. Ничего не отправляется с этой страницы автоматически.</p>
            {telegramOpened && <p className="vcut-telegram-notice" role="status">Открываем Telegram. Если чат не открылся, <a href={telegramUrl} target="_blank" rel="noopener noreferrer">перейдите по ссылке</a>. Сообщение нужно отправить самостоятельно.</p>}
          </form>
        </div>
      </section>

      <section className="vcut-faq" aria-labelledby="vcut-faq-title">
        <div className="vcut-section-top"><span>06 / ВОПРОСЫ</span><span>BEFORE WE MEET</span></div>
        <div className="vcut-faq-grid">
          <h2 id="vcut-faq-title">Важное<br /><em>заранее.</em></h2>
          <div className="vcut-faq-list">
            {questions.map((item, index) => <details key={item.question}>
              <summary><span className="vcut-faq-no">0{index + 1}</span><span>{item.question}</span><i aria-hidden="true">+</i></summary>
              <p>{item.answer}</p>
            </details>)}
          </div>
        </div>
      </section>
    </main>

    <footer className="vcut-footer">
      <div className="vcut-footer-top"><span>СНИМЕМ ТО, ЧТО ЗАХОЧЕТСЯ ПОМНИТЬ.</span><a href="https://t.me/denisovphotos" target="_blank" rel="noopener noreferrer">НАПИСАТЬ НАПРЯМУЮ <Arrow diagonal /></a></div>
      <div className="vcut-footer-wordmark">VECTA<span>.</span></div>
      <div className="vcut-footer-bottom"><span>© VECTA / WEDDINGS 2027</span><span>МОСКВА И ПОДМОСКОВЬЕ</span><a href="#vecta-top">НАВЕРХ ↑</a></div>
    </footer>
  </div>;
};