import {defineType, defineField, defineArrayMember} from 'sanity'

const required = (Rule: any) => Rule.required()

const mediaTile = defineType({
  name: 'mediaTile', title: 'Фото или видеолуп', type: 'object',
  fields: [
    defineField({name: 'kind', title: 'Тип медиа', type: 'string',
      initialValue: 'photo',
      options: {list: [{title:'Фотография',value:'photo'},{title:'Видеолуп',value:'loop'}],layout:'radio'},
      validation: required}),
    defineField({name:'alt',title:'Описание изображения (доступность / Яндекс)',type:'string'}),
    defineField({name:'photo',title:'Фотография',type:'image',
      options:{hotspot:true},
      hidden:({parent})=>parent?.kind !== 'photo'}),
    defineField({name:'loopFile',title:'Короткий MP4 (без звука)',type:'file',
      options:{accept:'video/mp4'},
      description:'Рекомендуем 2–4 секунды, H.264 MP4, без звуковой дорожки.',
      hidden:({parent})=>parent?.kind !== 'loop'}),
    defineField({name:'poster',title:'Статичный постер видеолупа',type:'image',
      options:{hotspot:true},
      hidden:({parent})=>parent?.kind !== 'loop'}),
  ],
  preview: {
    select:{title:'alt',kind:'kind',photo:'photo',poster:'poster'},
    prepare({title,kind,photo,poster}){
      return {title:title|| (kind==='loop'?'Видеолуп':'Фото'),subtitle:kind==='loop'?'Видео':'Фотография',media:kind==='loop'?poster:photo}
    }
  }
})

const introSection = defineType({
  name:'introSection',title:'О нас / Подход',type:'object',
  fields:[
    defineField({name:'eyebrow',title:'Надзаголовок',type:'string'}),
    defineField({name:'title',title:'Крупный заголовок',type:'string',validation:required}),
    defineField({name:'muted',title:'Вторая строка',type:'string'}),
    defineField({name:'paragraphs',title:'Абзацы',type:'array',of:[defineArrayMember({type:'text',rows:3})]}),
  ],
  preview:{select:{title:'title'},prepare:({title})=>({title:title||'О нас / Подход'})}
})

const servicesSection = defineType({
  name:'servicesSection',title:'Форматы съёмки',type:'object',
  fields:[
    defineField({name:'eyebrow',title:'Надзаголовок',type:'string'}),
    defineField({name:'title',title:'Заголовок',type:'string'}),
    defineField({name:'muted',title:'Вторая строка',type:'string'}),
    defineField({name:'description',title:'Описание',type:'text',rows:3}),
  ],
  preview:{select:{title:'title'},prepare:({title})=>({title:title||'Услуги'})}
})

const mosaicSection = defineType({
  name:'mosaicSection',title:'Editorial Mosaic (фото + живые кадры)',type:'object',
  fields:[
    defineField({name:'eyebrow',title:'Надзаголовок',type:'string'}),
    defineField({name:'title',title:'Заголовок',type:'string'}),
    defineField({name:'muted',title:'Вторая строка',type:'string'}),
    defineField({name:'description',title:'Описание',type:'text',rows:3}),
    defineField({name:'layout',title:'Где крупная ячейка',type:'string',
      initialValue:'feature-left',
      options:{layout:'radio',list:[
        {title:'Слева',value:'feature-left'},{title:'Справа',value:'feature-right'}
      ]}}),
    defineField({name:'spacing',title:'Интервал между кадрами',type:'string',
      initialValue:'regular',
      options:{list:[
        {title:'Плотно',value:'tight'},{title:'Нормально',value:'regular'},{title:'Воздух',value:'airy'}
      ]}}),
    defineField({name:'scale',title:'Размер главного кадра',type:'string',
      initialValue:'balanced',
      options:{list:[{title:'Сбалансированный',value:'balanced'},{title:'Крупнее',value:'dramatic'}]}}),
    defineField({name:'tiles',title:'Ячейки — перетаскивайте для смены порядка',type:'array',
      description:'Первая ячейка — большая. Остальные четыре — одинаковые по размеру. Смешивайте фото и видео.',
      of:[defineArrayMember({type:'mediaTile'})],
      validation:Rule=>Rule.required().length(5)}),
  ],
  preview:{select:{title:'title',layout:'layout'},prepare:({title,layout})=>({title:title||'Свадебные истории',subtitle:layout==='feature-right'?'Крупный справа':'Крупный слева'})}
})

const stepItem = defineType({
  name:'stepItem',title:'Шаг',type:'object',
  fields:[
    defineField({name:'title',title:'Название',type:'string',validation:required}),
    defineField({name:'description',title:'Описание',type:'text',rows:2}),
  ],
  preview:{select:{title:'title'}}
})
const processSection = defineType({
  name:'processSection',title:'Процесс работы',type:'object',
  fields:[
    defineField({name:'eyebrow',title:'Надзаголовок',type:'string'}),
    defineField({name:'title',title:'Заголовок',type:'string'}),
    defineField({name:'muted',title:'Вторая строка',type:'string'}),
    defineField({name:'steps',title:'Этапы',type:'array',
      of:[defineArrayMember({type:'stepItem'})],
      validation:Rule=>Rule.min(1).max(6)}),
  ],
  preview:{select:{title:'title'}}
})
const contactSection = defineType({
  name:'contactSection',title:'Проверка свадебной даты',type:'object',
  fields:[
    defineField({name:'eyebrow',title:'Надзаголовок',type:'string'}),
    defineField({name:'title',title:'Заголовок',type:'string'}),
    defineField({name:'accent',title:'Крупная акцентная строка',type:'string'}),
    defineField({name:'description',title:'Описание',type:'text',rows:3}),
    defineField({name:'ctaLabel',title:'Текст кнопки',type:'string'}),
  ],
  preview:{select:{title:'title'}}
})

const homePage=defineType({
  name:'homePage',title:'Главная страница',type:'document',
  initialValue:{
    seoTitle:'Свадебный фотограф и видеосъёмка в Москве | VECTA',
    seoDescription:'Свадебные фотографии и фильмы в Москве и Подмосковье. Сезон 2027 — уточните свободную дату.',
    heroEyebrow:'СВАДЕБНАЯ ФОТО- И ВИДЕОСЪЁМКА · МОСКВА',
    heroTitle:'Ваша история.',heroAccent:'В каждом кадре.',
    heroDescription:'Живые фотографии и свадебные фильмы, в которых остаются ваши эмоции, близкие люди и атмосфера дня.',
    sections:[
      {_type:'introSection',_key:'intro-1',eyebrow:'01 / О ТОМ, ЧТО ВАЖНО',title:'Не только красивые кадры.',muted:'Ваши настоящие моменты.',paragraphs:['Свадебный день проходит быстро. В памяти остаются отдельные моменты: встреча, улыбка родителей, слова на церемонии, вечер с близкими.','Мы сочетаем внимательный репортаж с продуманными портретами, чтобы фотографии и фильм были не просто красивыми, а вашими.']},
      {_type:'servicesSection',_key:'services-1',eyebrow:'02 / ФОРМАТЫ СЪЁМКИ',title:'Выберите то,',muted:'что важно вам.',description:'Только фотографии, свадебный фильм или оба формата. Состав и длительность съёмки подбираем под день.'},
      {_type:'mosaicSection',_key:'mosaic-1',eyebrow:'03 / СВАДЕБНЫЕ ИСТОРИИ',title:'Мгновения.',muted:'И чуть больше.',description:'Фотографии и короткие движения рядом. Каждый кадр — часть одной истории.',layout:'feature-left',spacing:'regular',scale:'balanced',tiles:[
        {_type:'mediaTile',_key:'tile-1',kind:'photo'},
        {_type:'mediaTile',_key:'tile-2',kind:'photo'},
        {_type:'mediaTile',_key:'tile-3',kind:'loop'},
        {_type:'mediaTile',_key:'tile-4',kind:'photo'},
        {_type:'mediaTile',_key:'tile-5',kind:'photo'}
      ]},
      {_type:'processSection',_key:'process-1',eyebrow:'04 / КАК МЫ РАБОТАЕМ',title:'От первого разговора',muted:'до готовой истории.',steps:[
        {_type:'stepItem',_key:'step-1',title:'Знакомство',description:'Обсуждаем дату, программу свадьбы и то, что для вас действительно важно.'},
        {_type:'stepItem',_key:'step-2',title:'Подготовка',description:'Согласуем формат, длительность съёмки, основные сцены и условия работы.'},
        {_type:'stepItem',_key:'step-3',title:'Ваш день',description:'Снимаем живые моменты, помогаем с портретами и остаёмся внимательны к деталям.'},
        {_type:'stepItem',_key:'step-4',title:'Воспоминания',description:'Обрабатываем фотографии, монтируем фильм и передаём материалы в согласованные сроки.'}
      ]},
      {_type:'contactSection',_key:'contact-1',eyebrow:'05 / СВАДЕБНЫЙ СЕЗОН 2027',title:'Уже выбрали',accent:'свою дату?',description:'Напишите дату свадьбы, площадку и какой формат съёмки рассматриваете. Уточним возможность съёмки и обсудим подходящий вариант.',ctaLabel:'Написать о дате в Telegram'}
    ]
  },
  fields:[
    defineField({name:'seoTitle',title:'SEO Title / Яндекс',type:'string',validation:required}),
    defineField({name:'seoDescription',title:'SEO Description',type:'text',rows:3,validation:required}),
    defineField({name:'heroEyebrow',title:'Первый экран — надзаголовок',type:'string'}),
    defineField({name:'heroTitle',title:'Первый экран — главная строка',type:'string',validation:required}),
    defineField({name:'heroAccent',title:'Первый экран — акцентная строка',type:'string'}),
    defineField({name:'heroDescription',title:'Первый экран — описание',type:'text',rows:3}),
    defineField({name:'heroMedia',title:'Первый экран — медиа (необязательно)',type:'mediaTile'}),
    defineField({name:'sections',title:'Секции страницы — перетаскивайте для смены порядка',type:'array',
      of:[
        defineArrayMember({type:'introSection'}),
        defineArrayMember({type:'servicesSection'}),
        defineArrayMember({type:'mosaicSection'}),
        defineArrayMember({type:'processSection'}),
        defineArrayMember({type:'contactSection'}),
      ],
      validation:Rule=>Rule.required().min(1)}),
  ],
  preview:{prepare:()=>({title:'Главная VECTA Weddings 2027'})}
})
const servicePage=defineType({
  name:'servicePage',title:'Страница свадебной услуги',type:'document',
  fields:[
    defineField({name:'slug',title:'Адрес страницы',type:'string',
      options:{list:[
        {title:'Свадебный фотограф',value:'svadebnyy-fotograf'},
        {title:'Свадебное видео',value:'svadebnaya-videosemka'},
        {title:'Фото + видео',value:'foto-i-video-na-svadbu'}
      ]},validation:required}),
    defineField({name:'title',title:'Заголовок H1',type:'string',validation:required}),
    defineField({name:'displayName',title:'Название в меню услуг на главной',type:'string'}),
    defineField({name:'seoTitle',title:'SEO Title',type:'string'}),
    defineField({name:'description',title:'SEO Description',type:'text',rows:3}),
    defineField({name:'lead',title:'Вступление',type:'text',rows:4}),
    defineField({name:'points',title:'Порядок работы',type:'array',of:[defineArrayMember({type:'string'})]}),
    defineField({name:'deliverables',title:'Результат съёмки',type:'array',of:[defineArrayMember({type:'string'})]}),
  ],
  preview:{select:{title:'title',subtitle:'slug'}}
})

const siteSettings=defineType({
  name:'siteSettings',title:'Настройки сайта',type:'document',
  initialValue:{telegram:'denisovphotos',footerDescription:'Свадебные фотографии и фильмы. Москва и Подмосковье.',copyrightName:'VECTA'},
  fields:[
    defineField({name:'telegram',title:'Telegram username без @',type:'string',
      description:'Замените на подтверждённый контакт. На сайте ссылки не должны вести в пустоту.',
      validation:Rule=>Rule.regex(/^[A-Za-z0-9_]{5,32}$/).error('Укажите имя пользователя Telegram без @')}),
    defineField({name:'footerDescription',title:'Текст под логотипом',type:'text',rows:3}),
    defineField({name:'copyrightName',title:'Название для подвала сайта',type:'string'}),
  ],
  preview:{prepare:()=>({title:'Настройки VECTA'})}
})

export const schemaTypes=[
  siteSettings,homePage,servicePage,mediaTile,introSection,servicesSection,
  mosaicSection,stepItem,processSection,contactSection
]
