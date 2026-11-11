const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const url='https://designs.magicpath.ai/v1/eagerly-summer-3171?embed=true';
const widths=[320,390,768,1440];
const dir=path.resolve('vecta-luxury-qa');
fs.mkdirSync(dir,{recursive:true});

const reports=[];
async function findApp(page){
 for(let n=0;n<50;n++){
   for(const frame of page.frames()){
    try{if(await frame.locator('.vlux').count())return frame}catch{}
   }
   await page.waitForTimeout(350);
 }
 throw new Error('Luxury prototype .vlux not found');
}
function close(a,b,tolerance=2){return Math.abs(a-b)<=tolerance}
async function test(browser,width){
 const context=await browser.newContext({viewport:{width,height:940},deviceScaleFactor:1,locale:'ru-RU',reducedMotion:'reduce'});
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',e=>errors.push(String(e.message)));
 let result={width};
 try{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:55000});
  const frame=await findApp(page);
  await frame.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(250);
  const metrics=await frame.evaluate(()=>{
   const rect=(el)=>{if(!el)return null;const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
   const qs=s=>document.querySelector(s);
   const tiles=[...document.querySelectorAll('.vlux-tile')];
   const brand=qs('.vlux-brand-display'),portrait=qs('.vlux-hero-portrait'),mark=qs('.vlux-emblem');
   const bodyText=document.querySelector('.vlux')?.innerText||'';
   return {
    innerWidth,scrollWidth:document.documentElement.scrollWidth,
    brand:rect(brand),portrait:rect(portrait),mark:rect(mark),
    headline:qs('h1')?.innerText,h1Count:document.querySelectorAll('h1').length,
    gallery:tiles.map(el=>({rect:rect(el),kind:el.getAttribute('data-media')})),
    loadedPrata:[...document.fonts].filter(f=>/Prata/i.test(f.family)&&f.status==='loaded').length,
    legacyWords:/Навсегда|Без дублей|Просто живите|Мгновения\.|Целый мир после|Ваша любовь/i.test(bodyText),
    hasLegacySections:!!qs('.vcut-vow, .vcut-quote, .vcut-running'),
    mediaItems:document.querySelectorAll('.vlux-mosaic img, .vlux-mosaic video').length,
    formatLabels:[...document.querySelectorAll('.vlux-choice-grid label')].map(el=>({width:el.clientWidth,scrollWidth:el.scrollWidth})),
    heroCTA:rect(qs('.vlux-primary')),
    heroSection:rect(qs('.vlux-hero'))
   };
  });
  const small=metrics.gallery.slice(1).map(el=>el.rect);
  const galleryOK=metrics.gallery.length===5 && metrics.gallery.filter(x=>x.kind==='loop').length===1
    &&small.every(el=>close(el.width,small[0].width)&&close(el.height,small[0].height));
  const noOverflow=metrics.scrollWidth<=metrics.innerWidth+3;
  const luxuryCopy=metrics.h1Count===1&&/Свадебная фотография и кино/i.test(metrics.headline)&&!metrics.legacyWords&&!metrics.hasLegacySections;
  const brandVisible=metrics.brand&&metrics.brand.x>=-30&&metrics.brand.right<=metrics.innerWidth+50;
  const brandOverMedia=metrics.brand&&metrics.portrait&&metrics.brand.right>metrics.portrait.x&&metrics.brand.x<metrics.portrait.right&&metrics.brand.bottom>metrics.portrait.y&&metrics.brand.y<metrics.portrait.bottom;
  const footerFits=metrics.formatLabels.every(x=>x.scrollWidth<=x.width+2);
  const assetTruth=metrics.mediaItems===0;
  const heroCTAFits=metrics.heroCTA&&metrics.heroCTA.x>=-2&&metrics.heroCTA.right<=metrics.innerWidth+2
    &&metrics.heroCTA.bottom<=metrics.heroSection.bottom;
  const videoButton=frame.locator('.vlux-service').nth(1).locator('button');
  await videoButton.click({timeout:7000});
  await page.waitForTimeout(520);
  const selected=await frame.locator('input[name="format"][value="video"]').isChecked();
  const dateFocus=await frame.locator('#vlux-date').evaluate(el=>document.activeElement===el);
  const firstFAQ=frame.locator('.vlux-faq details').first();
  await firstFAQ.locator('summary').click({timeout:7000});
  const faqOpens=await firstFAQ.evaluate(el=>el.open);
  let menuWorks=true;
  if(width<=767){
   const menu=frame.locator('.vlux-menu-toggle');
   await menu.click({timeout:7000});
   menuWorks=(await menu.getAttribute('aria-expanded'))==='true'&&await frame.locator('.vlux-mobile-nav').isVisible();
   await menu.click();
   menuWorks=menuWorks&&(await menu.getAttribute('aria-expanded'))==='false';
  }
  const checks={galleryOK,noOverflow,luxuryCopy,brandVisible,brandOverMedia,footerFits,assetTruth,heroCTAFits,selected,dateFocus,faqOpens,menuWorks};
  result={width,checks,metrics,errors,passed:Object.values(checks).every(Boolean)&&errors.length===0};
  console.log('LUXURY_QA '+JSON.stringify({width,checks,brand:metrics.brand,portrait:metrics.portrait,CTA:metrics.heroCTA,fonts:metrics.loadedPrata,errors}));
  await page.screenshot({path:path.join(dir,'top-'+width+'.png'),fullPage:false});
  await page.screenshot({path:path.join(dir,'full-'+width+'.png'),fullPage:true});
 }catch(e){
  result={width,passed:false,error:String(e.stack||e).slice(0,1800),errors};
  console.error('LUXURY_QA_ERROR '+width+' '+result.error);
 }
 reports.push(result);
 await context.close();
}
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
 try{for(const width of widths)await test(browser,width)}finally{await browser.close()}
 fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(reports,null,2));
 const passed=reports.length===widths.length&&reports.every(r=>r.passed);
 console.log('LUXURY_QA_RESULT '+(passed?'PASS':'FAIL'));
 if(!passed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});