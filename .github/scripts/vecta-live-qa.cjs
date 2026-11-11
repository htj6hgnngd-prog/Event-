/* Browser QA for the LIVE VECTA Work deployment. Read-only: no forms, no external link navigation. */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const base = process.env.VECTA_LIVE_URL || 'https://vecta-weddings.vercel.app';
const sizes = [
  { label: 'mobile-320', width: 320, height: 780, isMobile: true, deviceScaleFactor: 1 },
  { label: 'mobile-360', width: 360, height: 780, isMobile: true, deviceScaleFactor: 1 },
  { label: 'mobile-390', width: 390, height: 844, isMobile: true, deviceScaleFactor: 1 },
  { label: 'tablet-768', width: 768, height: 1024, isMobile: true, deviceScaleFactor: 1 },
  { label: 'desktop-1440', width: 1440, height: 900, deviceScaleFactor: 1 }
];
const outDir = path.resolve('vecta-qa-artifacts');
fs.mkdirSync(outDir, { recursive: true });

async function inspect(page, size) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e.message).slice(0, 200)));
  page.on('console', message => {
    if (message.type() === 'error') errors.push('console: ' + message.text().slice(0, 180));
  });
  const response = await page.goto(base, {waitUntil: 'domcontentloaded', timeout: 45000});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const before = await page.evaluate(() => {
    const rect = element => {
      if (!element) return null;
      const r = element.getBoundingClientRect();
      return {x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height)};
    };
    const font = element => element ? ({
      family: getComputedStyle(element).fontFamily,
      size: getComputedStyle(element).fontSize,
      lineHeight: getComputedStyle(element).lineHeight,
      weight: getComputedStyle(element).fontWeight,
    }) : null;
    const h1 = document.querySelector('h1');
    const header = document.querySelector('header');
    const hero = document.querySelector('.wedding-hero, .hero, section:first-of-type');
    const mosaic = document.querySelector('.editorial-mosaic, [data-editorial-mosaic]');
    const selectorCandidates = [...document.querySelectorAll('details, button[aria-expanded], [role="button"][aria-expanded]')].slice(0, 15).map((el,i)=>({
      i,tag:el.tagName, text:el.innerText?.trim().slice(0, 70)||'', open:el.open??null, expanded:el.getAttribute('aria-expanded')
    }));
    const wide = [...document.querySelectorAll('body *')].filter(el=>{
      const r=el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && (r.right>innerWidth+8 || r.left < -8);
    }).slice(0, 12).map(el=>({tag:el.tagName,class:typeof el.className==='string'?el.className.slice(0,65):'',rect:rect(el)}));
    const text = s => document.querySelector(s)?.innerText?.trim().slice(0,150);
    return {
      title:document.title,
      viewportWidth:innerWidth,scrollWidth:document.documentElement.scrollWidth,
      bodyWidth:document.body.scrollWidth,
      fontStatus:document.fonts.status,
      h1Text:h1?.innerText?.slice(0,200),
      h1Font:font(h1),
      h1Rect:rect(h1),headerRect:rect(header),heroRect:rect(hero),
      mosaicRect:rect(mosaic),
      controls:selectorCandidates,
      wide,
      shootingText: text('#services')||text('.services')||null,
      fontFaces:[...document.styleSheets].length
    };
  });
  // Preserve a read-only snapshot of the exact Work deployment for reliable follow-up fixes.
  if (size.label === 'mobile-360') {
    const dom = await page.evaluate(() => ({
      services: [...document.querySelectorAll('section')].filter(el=>/Фотографии|Фото \+ кино|Кино/.test(el.innerText||'')).slice(0,3).map(el=>el.outerHTML.slice(0,14000)),
      form: [...document.querySelectorAll('form')].map(el=>el.outerHTML.slice(0,14000)),
      inputControls: [...document.querySelectorAll('input, select, textarea, button')].map(el=>({
        tag:el.tagName, type:el.getAttribute('type'), name:el.getAttribute('name'), id:el.id,
        text:(el.innerText||'').trim().slice(0,100), value:el.getAttribute('value')
      })),
      fontFaces:[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight})),
      links:[...document.querySelectorAll('a')].filter(a=>/съёмке|Кино|Фотограф|формат/i.test(a.innerText||'')).map(a=>({text:a.innerText.trim().slice(0,80),href:a.getAttribute('href')}))
    }));
    fs.writeFileSync(path.join(outDir,'dom-mobile-360.json'), JSON.stringify(dom,null,2));
    fs.writeFileSync(path.join(outDir,'live-index.html'), await page.content());
    for(const urlPath of ['/site.css','/robots.txt']) {
      const response=await page.request.get(new URL(urlPath,base).toString());
      if(response.ok())fs.writeFileSync(path.join(outDir,urlPath.slice(1)),await response.body());
    }
  }
  await page.screenshot({path:path.join(outDir, size.label+'-top.png'),fullPage:false});
  await page.screenshot({path:path.join(outDir, size.label+'-full.png'),fullPage:true});
  const interaction=[];
  const selectors=await page.locator('details summary').count();
  for (let i=0; i<Math.min(selectors,5); i++){
    const sum=page.locator('details summary').nth(i);
    if(!await sum.isVisible()) continue;
    const text=(await sum.innerText()).trim().slice(0,60);
    await sum.click({timeout:5000});
    const opened=await sum.evaluate(el=>el.parentElement?.open||false);
    interaction.push({type:'details',text,opened});
    if(opened)await sum.click({timeout:5000});
  }
  let buttons=page.locator('button[aria-expanded]');
  const num=await buttons.count();
  for(let i=0;i<Math.min(num,5);i++){
    const btn=buttons.nth(i);
    if(!await btn.isVisible())continue;
    const beforeExpand=await btn.getAttribute('aria-expanded');
    const text=(await btn.innerText()).trim().slice(0,60);
    try{
      await btn.click({timeout:5000});
      const afterExpand=await btn.getAttribute('aria-expanded');
      interaction.push({type:'button',text,beforeExpand,afterExpand});
      if(afterExpand==='true')await btn.click({timeout:5000});
    }catch(e){interaction.push({type:'button',text,error:String(e.message).slice(0,120)})}
  }
  const summary={size:size.label,status:response?.status(),url:page.url(),before,interaction,errors};
  return summary;
}

(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-sandbox']});
  const results=[];
  let hasFailure=false;
  try{
    for(const size of sizes){
      const context=await browser.newContext({viewport:{width:size.width,height:size.height},isMobile:!!size.isMobile,deviceScaleFactor:1,locale:'ru-RU'});
      const page=await context.newPage();
      try{
        const result=await inspect(page,size);
        results.push(result);
        const overflow=result.before.scrollWidth>size.width+8;
        const responseError=!(result.status>=200 && result.status<400);
        const badControl=result.interaction.some(x=>x.error||x.opened===false||(x.afterExpand&&x.afterExpand===x.beforeExpand));
        if(overflow || responseError || badControl || result.errors.length)hasFailure=true;
        console.log('QA '+JSON.stringify({size:result.size,status:result.status,h1:result.before.h1Text,
          fonts:result.before.h1Font,overflow,scrollWidth:result.before.scrollWidth,
          controlCount:result.before.controls.length,interaction:result.interaction,errors:result.errors,
          tooWide:result.before.wide}).slice(0,6500));
      }catch(e){
        hasFailure=true;
        results.push({size:size.label,error:String(e.stack||e).slice(0,850)});
        console.error('QA_FAILED '+size.label+' '+String(e.message).slice(0,600));
      }finally{await context.close()}
    }
  }finally{await browser.close()}
  const report=path.join(outDir,'report.json');
  fs.writeFileSync(report,JSON.stringify(results,null,2));
  console.log('QA artifacts '+outDir);
  console.log('QA_RESULT '+(hasFailure?'FAIL':'PASS'));
  if(hasFailure)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1});
