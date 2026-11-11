import {createClient} from '@sanity/client'
import {services, type Service} from '../data/services'
import {weddingGallery} from '../data/weddingGallery'
import type {FiveTileGrid, EditorialLayout, MediaTile} from '../data/mediaTypes'

export type Intro = {_type:'introSection';_key?:string;eyebrow?:string;title:string;muted?:string;paragraphs:string[]}
export type Services = {_type:'servicesSection';_key?:string;eyebrow?:string;title:string;muted?:string;description?:string}
export type Mosaic = {_type:'mosaicSection';_key?:string;eyebrow?:string;title:string;muted?:string;description?:string;layout:EditorialLayout;spacing:'tight'|'regular'|'airy';scale:'balanced'|'dramatic';items:FiveTileGrid}
export type Process = {_type:'processSection';_key?:string;eyebrow?:string;title:string;muted?:string;steps:{_key?:string;title:string;description?:string}[]}
export type Contact = {_type:'contactSection';_key?:string;eyebrow?:string;title:string;accent?:string;description?:string;ctaLabel?:string}
export type HomeSection = Intro|Services|Mosaic|Process|Contact
export type HomeContent = {
  seoTitle:string
  seoDescription:string
  heroEyebrow:string
  heroTitle:string
  heroAccent:string
  heroDescription:string
  heroMedia?:MediaTile
  sections:HomeSection[]
}

export const defaultHome:HomeContent={
  seoTitle:'Свадебный фотограф и видеосъёмка в Москве | VECTA',
  seoDescription:'Свадебные фотографии и фильмы в Москве и Подмосковье. Живые моменты, портреты и история вашего дня. Принимаем запросы на даты свадебного сезона 2027.',
  heroEyebrow:'СВАДЕБНАЯ ФОТО- И ВИДЕОСЪЁМКА · МОСКВА',
  heroTitle:'Ваша история.',
  heroAccent:'В каждом кадре.',
  heroDescription:'Живые фотографии и свадебные фильмы, в которых остаются ваши эмоции, близкие люди и атмосфера дня.',
  sections:[
    {_type:'introSection',_key:'intro',eyebrow:'01 / О ТОМ, ЧТО ВАЖНО',title:'Не только красивые кадры.',muted:'Ваши настоящие моменты.',paragraphs:[
      'Свадебный день проходит быстро. В памяти остаются отдельные моменты: встреча, улыбка родителей, слова на церемонии, вечер с близкими.',
      'Мы сочетаем внимательный репортаж с продуманными портретами, чтобы фотографии и фильм были не просто красивыми, а вашими.'
    ]},
    {_type:'servicesSection',_key:'services',eyebrow:'02 / ФОРМАТЫ СЪЁМКИ',title:'Выберите то,',muted:'что важно вам.',description:'Только фотографии, свадебный фильм или оба формата. Состав и длительность съёмки подбираем под день.'},
    {_type:'mosaicSection',_key:'mosaic',eyebrow:'03 / СВАДЕБНЫЕ ИСТОРИИ',title:'Мгновения.',muted:'И чуть больше.',description:'Фотографии и короткие движения рядом. Каждый кадр — часть одной истории.',layout:weddingGallery.layout,spacing:'regular',scale:'balanced',items:weddingGallery.items},
    {_type:'processSection',_key:'process',eyebrow:'04 / КАК МЫ РАБОТАЕМ',title:'От первого разговора',muted:'до готовой истории.',steps:[
      {title:'Знакомство',description:'Обсуждаем дату, программу свадьбы и то, что для вас действительно важно.'},
      {title:'Подготовка',description:'Согласуем формат, длительность съёмки, основные сцены и условия работы.'},
      {title:'Ваш день',description:'Снимаем живые моменты, помогаем с портретами и остаёмся внимательны к деталям.'},
      {title:'Воспоминания',description:'Обрабатываем фотографии, монтируем фильм и передаём материалы в согласованные сроки.'}
    ]},
    {_type:'contactSection',_key:'contact',eyebrow:'05 / СВАДЕБНЫЙ СЕЗОН 2027',title:'Уже выбрали',accent:'свою дату?',description:'Напишите дату свадьбы, площадку и какой формат съёмки рассматриваете. Уточним возможность съёмки и обсудим подходящий вариант.',ctaLabel:'Написать о дате в Telegram'}
  ]
}

const homeQuery=`*[_type == "homePage" && _id == "homePage"][0]{
  seoTitle,seoDescription,heroEyebrow,heroTitle,heroAccent,heroDescription,
  "heroMedia":heroMedia{
    "id":coalesce(_key,"hero"),kind,alt,
    "src":select(kind=="photo"=>photo.asset->url,kind=="loop"=>loopFile.asset->url),
    "poster":poster.asset->url
  },
  "sections":sections[]{
    ...,
    _type=="mosaicSection" => {
      "items":tiles[]{
        "id":coalesce(_key,"tile"),kind,alt,
        "src":select(kind=="photo"=>photo.asset->url,kind=="loop"=>loopFile.asset->url),
        "poster":poster.asset->url
      }
    }
  }
}`

const serviceQuery=`*[_type=="servicePage" && slug == $slug][0]{
  title,displayName,seoTitle,description,lead,points,deliverables
}`
const settingsQuery=`*[_type=="siteSettings" && _id=="siteSettings"][0]{
  telegram,footerDescription,copyrightName
}`

function client(){
  const projectId=import.meta.env.PUBLIC_SANITY_PROJECT_ID
  if(!projectId) return null
  return createClient({
    projectId,
    dataset:import.meta.env.PUBLIC_SANITY_DATASET||'production',
    apiVersion:'2026-10-01',
    perspective:'published',
    useCdn:false,
  })
}
function validTiles(items:unknown):items is FiveTileGrid {
  return Array.isArray(items) && items.length===5 && items.every(item =>
    item && typeof item.id==='string' && (item.kind==='photo'||item.kind==='loop'))
}
function normalizeHome(input:Partial<HomeContent>):HomeContent {
  if(!Array.isArray(input.sections)||!input.sections.length)return {...defaultHome,...input,sections:defaultHome.sections}
  const sections=input.sections.map((section)=>{
    if(section._type!=='mosaicSection')return section
    const fallback=defaultHome.sections.find(s=>s._type==='mosaicSection') as Mosaic
    return {...fallback,...section,
      items:validTiles(section.items)?section.items:fallback.items,
      layout:section.layout==='feature-right'?'feature-right':'feature-left',
      spacing:['tight','regular','airy'].includes(section.spacing)?section.spacing:'regular',
      scale:section.scale==='dramatic'?'dramatic':'balanced'
    } as Mosaic
  })
  return {...defaultHome,...input,sections}
}

export async function getHomeContent():Promise<HomeContent>{
  const api=client()
  if(!api)return defaultHome
  const page=await api.fetch<Partial<HomeContent>|null>(homeQuery)
  return page?normalizeHome(page):defaultHome
}

export async function getServiceContent(slug:string,original:Service):Promise<Service & {seoTitle?:string}>{
  const api=client()
  if(!api)return original
  const override=await api.fetch<Partial<Service & {seoTitle:string}>|null>(serviceQuery,{slug})
  if(!override)return original
  const cleaned=Object.fromEntries(Object.entries(override).filter(([,v])=>v!==null && v!==undefined))
  return {...original,...cleaned,name:typeof override.displayName==='string'&&override.displayName.trim()?override.displayName:original.name}
}

export type SiteSettings={telegram:string;footerDescription:string;copyrightName:string}
export async function getSiteSettings():Promise<SiteSettings>{
  const defaults={telegram:'denisovphotos',footerDescription:'Свадебные фотографии и фильмы. Москва и Подмосковье.',copyrightName:'VECTA'}
  const api=client()
  if(!api)return defaults
  const settings=await api.fetch<Partial<SiteSettings>|null>(settingsQuery)
  if(!settings)return defaults
  return {...defaults,...settings,telegram:/^[A-Za-z0-9_]{5,32}$/.test(settings.telegram||'')?settings.telegram!:defaults.telegram}
}
