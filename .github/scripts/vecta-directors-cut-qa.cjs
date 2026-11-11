const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const url = 'https://designs.magicpath.ai/v1/zealously-bridge-2536?embed=true';
const widths = [320, 390, 768, 1440];
const out = path.resolve('director-cut-qa');
fs.mkdirSync(out,{recursive:true});
const results=[];

async function appFrame(page) {
  for(let trial=0;trial<45;trial++){
    for(const frame of page.frames()){
      try{if(await frame.locator('.vcut').count())return frame}catch{}
    }
    await page.waitForTimeout(600);
  }
  throw new Error('VECTA component not present in any document/iframe');
}

async function runWidth(browser,width){
  const ctx=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,locale:'ru-RU'});
  const page=await ctx.newPage();
  const errors=[];
  page.on('pageerror',err=>errors.push(String(err.message).slice(0,350)));
  let data;
  try {
    const response=await page.goto(url,{timeout:45000,waitUntil:'domcontentloaded'});
    const frame=await appFrame(page);
    await frame.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(250);
    data=await frame.evaluate(()=>{
      const h=document.querySelector('.vcut-hero-headline');
      const gallery=[...document.querySelectorAll('.vcut-mosaic-cell')];
      const radios=[...document.querySelectorAll('.vcut-format-options label')];
      const script=document.querySelector('.vcut-script-word');
      const media=document.querySelector('.vcut-hero-media');
      const heroSpans=[...document.querySelectorAll('.vcut-hero-headline > span')];
      const titleUnwrapped=heroSpans.every(el=>el.getBoundingClientRect().height <= parseFloat(getComputedStyle(el).lineHeight)*1.25);
      const actualFonts=[...document.fonts].filter(x=>/Comforter Brush/i.test(x.family)).map(x=>({family:x.family,status:x.status}));
      const getRect=e=>{const r=e.getBoundingClientRect();return {width:+r.width.toFixed(2),height:+r.height.toFixed(2),x:+r.x.toFixed(2),y:+r.y.toFixed(2)}};
      return {
        innerWidth,
        bodyScroll:document.documentElement.scrollWidth,
        title:document.querySelector('h1')?.textContent.trim(),
        titleBox:h?getRect(h):null,
        headlineClient:h?.clientHeight,
        headlineScroll:h?.scrollHeight,
        headlineLineHeight:h?getComputedStyle(h).lineHeight:null,
        formatGrid:document.querySelector('.vcut-format-options')?getComputedStyle(document.querySelector('.vcut-format-options')).gridTemplateColumns:null,
        formats:radios.map(el=>({text:el.innerText.trim(),clientWidth:el.clientWidth,scrollWidth:el.scrollWidth,rect:getRect(el)})),
        gallery:gallery.map(el=>({kind:el.className,rect:getRect(el)})),
        fontStatus:document.fonts.status,
        actualFonts,
        titleUnwrapped,
        signature:script?getRect(script):null,
        mediaRect:media?getRect(media):null,
        signatureFont:script?getComputedStyle(script).fontFamily:null,
        vow:document.querySelector('.vcut-vow h2')?.textContent.trim(),
        removedFillerSections:document.querySelectorAll('.vcut-ethos, .vcut-quote').length===0
      };
    });
    data.httpStatus=response?.status();
    data.frameUrl=frame.url();
    data.errors=errors;
    const gallery=data.gallery;
    const sameSmall=gallery.length===5 && gallery.slice(1).every((item)=>Math.abs(item.rect.width-gallery[1].rect.width)<=1 && Math.abs(item.rect.height-gallery[1].rect.height)<=1);
    const clipLabel=data.formats.some(x=>x.scrollWidth>x.clientWidth+2);
    const clipHeadline=(data.headlineScroll||0)>(data.headlineClient||0)+4;
    const noOverflow=data.bodyScroll<=data.innerWidth+4;
    const gridValid=gallery.length===5&&sameSmall;
    const formLabelsFit=!clipLabel;
    const headlineFits=!clipHeadline;
    const titleUnwrapped=data.titleUnwrapped;
    const editorialVow=data.vow==='Да.'&&data.removedFillerSections;
    const signatureVisible=!!data.signature&&data.signature.x>=-8&&data.signature.x+data.signature.width<=data.innerWidth+16;
    if(width<=420 && data.formatGrid.trim().split(/\s+/).length!==1)throw new Error('Narrow screen format options are not single-column');
    const choose=frame.locator('.vcut-service').nth(1).locator('button');
    await choose.click({timeout:8000});
    await page.waitForTimeout(650);
    const chosen=await frame.locator('.vcut-format-options input[value="cinema"]').isChecked();
    const focusedDate=await frame.locator('#vcut-date').evaluate(el=>el===el.ownerDocument.activeElement);
    const firstFAQ=frame.locator('.vcut-faq details').first();
    await firstFAQ.locator('summary').click({timeout:8000});
    const faqOpened=await firstFAQ.evaluate(el=>el.open);
    let mobileMenuPass=true;
    if(width<=767){
      const toggle=frame.locator('.vcut-menu-toggle');
      await toggle.click({timeout:8000});
      const opened=await toggle.getAttribute('aria-expanded');
      const navVisible=await frame.locator('.vcut-mobile-nav').isVisible();
      await toggle.click();
      const closed=await toggle.getAttribute('aria-expanded');
      mobileMenuPass=opened==='true'&&navVisible&&closed==='false';
    }
    data.checks={noOverflow,gridValid,formLabelsFit,headlineFits,titleUnwrapped,editorialVow,signatureVisible,chosen,focusedDate,faqOpened,mobileMenuPass};
    data.success=Object.values(data.checks).every(Boolean)&&errors.length===0;
    try{
      await page.screenshot({path:path.join(out,'top-'+width+'.png'),fullPage:false});
      await page.screenshot({path:path.join(out,'full-'+width+'.png'),fullPage:true});
    }catch{}
    console.log('DIRECTORS_CUT_QA '+JSON.stringify({width,checks:data.checks,headline:[data.headlineClient,data.headlineScroll],script:data.signature,scriptFont:data.signatureFont,actualFonts:data.actualFonts,formats:data.formats.map(x=>[x.text,x.clientWidth,x.scrollWidth]),errors:data.errors,innerWidth:data.innerWidth,bodyScroll:data.bodyScroll}));
  } catch(err){
    data={width,success:false,error:String(err.stack||err).slice(0,1800),errors};
    console.error('QA_ERROR '+width+' '+data.error);
  } finally {
    results.push({width,...data});
    await ctx.close();
  }
}

(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-sandbox']});
  try{for(const width of widths)await runWidth(browser,width)}
  finally{await browser.close()}
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(results,null,2));
  const passed=results.length===widths.length&&results.every(x=>x.success);
  console.log('DIRECTORS_CUT_QA_RESULT '+(passed?'PASS':'FAIL'));
  if(!passed)process.exitCode=1;
})().catch(err=>{console.error(err);process.exitCode=1});