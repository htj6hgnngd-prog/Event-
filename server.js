const http=require('http');
const fs=require('fs');
const fsp=fs.promises;
const path=require('path');
const {Readable}=require('stream');
const {pipeline}=require('stream/promises');
const zlib=require('zlib');
const {execFile}=require('child_process');
const {promisify}=require('util');
const {URL}=require('url');
const ffmpeg=require('ffmpeg-static');

const execFileAsync=promisify(execFile);
const root=__dirname;
const port=Number(process.env.PORT||3000);
const mediaRoot=path.join('/tmp','event-production-media');
const sources={
  'event-1':{url:'https://disk.yandex.ru/i/iIj6z28I2z0d3w',poster:'34.8'},
  'event-2':{url:'https://disk.yandex.ru/i/CGJbZxDuh1ORXw',poster:'28.0'}
};
const jobs=new Map();
const sourceJobs=new Map();
const clips={
  'work-top':{source:'event-1',start:'49.2',duration:'4.8',poster:'50.2'},
  'work-bottom':{source:'event-2',start:'43.8',duration:'4.8',poster:'45.0'}
};
const clipJobs=new Map();
let heroJob=null;
let criticalMediaReady=false;
let criticalMediaError='';

const types={
  '.html':'text/html; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.js':'application/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.svg':'image/svg+xml',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg',
  '.webp':'image/webp',
  '.mp4':'video/mp4',
  '.webmanifest':'application/manifest+json; charset=utf-8',
  '.txt':'text/plain; charset=utf-8',
  '.xml':'application/xml; charset=utf-8'
};

async function yandexHref(id){
  const source=sources[id];
  if(!source) throw new Error('Unknown media id');
  const api='https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key='+encodeURIComponent(source.url);
  const r=await fetch(api,{headers:{'User-Agent':'EventProduction/1.0'}});
  if(!r.ok) throw new Error('Yandex API '+r.status);
  const data=await r.json();
  if(!data.href) throw new Error('No Yandex download href');
  return data.href;
}

async function download(id,dest){
  const href=await yandexHref(id);
  const r=await fetch(href,{headers:{'User-Agent':'Mozilla/5.0'},redirect:'follow'});
  if(!r.ok||!r.body) throw new Error('Yandex download '+r.status);
  await pipeline(Readable.fromWeb(r.body),fs.createWriteStream(dest));
}

async function exists(file){
  try{await fsp.access(file);return true}catch{return false}
}

function tempOutput(file){
  const ext=path.extname(file);
  return file.slice(0,-ext.length)+'.part'+ext;
}

async function prepareSource(id){
  if(sourceJobs.has(id)) return sourceJobs.get(id);
  const job=(async()=>{
    await fsp.mkdir(mediaRoot,{recursive:true});
    const source=path.join(mediaRoot,id+'.mov');
    if(await exists(source)) return source;
    const partial=source+'.part';
    await fsp.rm(partial,{force:true});
    console.log('Downloading source:',id);
    try{
      await download(id,partial);
      await fsp.rename(partial,source);
    }finally{
      await fsp.rm(partial,{force:true}).catch(()=>{});
    }
    console.log('Source ready:',id);
    return source;
  })().catch(err=>{sourceJobs.delete(id);throw err});
  sourceJobs.set(id,job);
  return job;
}

async function prepareMedia(id){
  if(jobs.has(id)) return jobs.get(id);
  const job=(async()=>{
    await fsp.mkdir(mediaRoot,{recursive:true});
    const source=await prepareSource(id);
    const video=path.join(mediaRoot,id+'.mp4');
    const poster=path.join(mediaRoot,id+'.jpg');
    if(await exists(video) && await exists(poster)) return {video,poster};

    console.log('Preparing media:',id);

    if(!(await exists(poster))){
      const temp=tempOutput(poster);
      await fsp.rm(temp,{force:true}).catch(()=>{});
      await execFileAsync(ffmpeg,['-y','-v','error','-ss',sources[id].poster,'-i',source,'-frames:v','1','-q:v','2',temp],{maxBuffer:1024*1024*4});
      await fsp.rename(temp,poster);
    }

    if(!(await exists(video))){
      const temp=tempOutput(video);
      await fsp.rm(temp,{force:true}).catch(()=>{});
      await execFileAsync(ffmpeg,[
        '-y','-v','error','-i',source,
        '-map','0:v:0','-map','0:a:0?',
        '-c:v','copy','-c:a','aac','-b:a','160k',
        '-movflags','+faststart',
        temp
      ],{maxBuffer:1024*1024*8});
      await fsp.rename(temp,video);
    }

    console.log('Media ready:',id);
    return {video,poster};
  })().catch(err=>{jobs.delete(id);throw err});
  jobs.set(id,job);
  return job;
}

async function prepareClip(name){
  if(clipJobs.has(name)) return clipJobs.get(name);
  const cfg=clips[name];
  if(!cfg) throw new Error('Unknown clip');
  const job=(async()=>{
    await fsp.mkdir(mediaRoot,{recursive:true});
    const out=path.join(mediaRoot,'clip-'+name+'.mp4');
    const poster=path.join(mediaRoot,'clip-'+name+'.jpg');
    if(await exists(out) && await exists(poster)) return {video:out,poster};

    const source=await prepareSource(cfg.source);

    if(!(await exists(out))){
      const temp=tempOutput(out);
      await fsp.rm(temp,{force:true}).catch(()=>{});
      await execFileAsync(ffmpeg,[
        '-y','-v','error','-ss',cfg.start,'-i',source,'-t',cfg.duration,
        '-an','-vf','scale=1600:-2:flags=lanczos,format=yuv420p',
        '-c:v','libx264','-preset','veryfast','-crf','22',
        '-movflags','+faststart',temp
      ],{maxBuffer:1024*1024*8});
      await fsp.rename(temp,out);
    }
    if(!(await exists(poster))){
      const temp=tempOutput(poster);
      await fsp.rm(temp,{force:true}).catch(()=>{});
      await execFileAsync(ffmpeg,['-y','-v','error','-ss',cfg.poster,'-i',source,'-frames:v','1','-vf','scale=1600:-2:flags=lanczos','-q:v','2',temp],{maxBuffer:1024*1024*4});
      await fsp.rename(temp,poster);
    }
    console.log('Clip ready:',name);
    return {video:out,poster};
  })().catch(err=>{clipJobs.delete(name);throw err});
  clipJobs.set(name,job);
  return job;
}


async function prepareHero(){
  if(heroJob) return heroJob;
  heroJob=(async()=>{
    await fsp.mkdir(mediaRoot,{recursive:true});
    const out=path.join(mediaRoot,'hero-loop.mp4');
    const poster=path.join(mediaRoot,'hero-loop.jpg');
    if(await exists(out) && await exists(poster)) return {video:out,poster};

    const e1=await prepareSource('event-1');
    const e2=await prepareSource('event-2');

    // Curated 6-shot hero rhythm:
    // atmosphere -> team -> production detail -> hero -> audience -> finale.
    // The sequence avoids dance-only fragments so the page reads as production, not nightclub promo.
    const filter=[
      "[1:v]trim=start=11.85:end=12.75,setpts=PTS-STARTPTS,fps=24,scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900,eq=brightness=-0.055:contrast=1.10:saturation=0.70[v0]",
      "[1:v]trim=start=19.65:end=20.65,setpts=PTS-STARTPTS,fps=24,scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900,eq=brightness=-0.075:contrast=1.12:saturation=0.70[v1]",
      "[0:v]trim=start=16.65:end=17.45,setpts=PTS-STARTPTS,fps=24,scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900,eq=brightness=-0.045:contrast=1.08:saturation=0.82[v2]",
      "[0:v]trim=start=53.95:end=55.15,setpts=PTS-STARTPTS,fps=24,scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900,eq=brightness=-0.065:contrast=1.10:saturation=0.84[v3]",
      "[0:v]trim=start=37.65:end=38.65,setpts=PTS-STARTPTS,fps=24,scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900,eq=brightness=-0.075:contrast=1.12:saturation=0.55[v4]",
      "[1:v]trim=start=55.65:end=57.10,setpts=PTS-STARTPTS,fps=24,scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900,eq=brightness=-0.07:contrast=1.10:saturation=0.84[v5]",
      "[v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0,format=yuv420p[v]"
    ].join(';');

    if(!(await exists(out))){
      const temp=tempOutput(out);
      await fsp.rm(temp,{force:true}).catch(()=>{});
      await execFileAsync(ffmpeg,[
        '-y','-v','error','-i',e1,'-i',e2,
        '-filter_complex',filter,'-map','[v]',
        '-an','-c:v','libx264','-profile:v','high','-level','4.1','-preset','medium','-crf','22',
        '-movflags','+faststart',temp
      ],{maxBuffer:1024*1024*12});
      await fsp.rename(temp,out);
    }
    if(!(await exists(poster))){
      const temp=tempOutput(poster);
      await fsp.rm(temp,{force:true}).catch(()=>{});
      await execFileAsync(ffmpeg,['-y','-v','error','-ss','0.35','-i',out,'-frames:v','1','-q:v','2',temp],{maxBuffer:1024*1024*4});
      await fsp.rename(temp,poster);
    }
    console.log('Hero loop ready');
    return {video:out,poster};
  })().catch(err=>{heroJob=null;throw err});
  return heroJob;
}


async function serveFileVideo(req,res,file){
  const st=await fsp.stat(file);
  const range=req.headers.range;
  const etag='W/"'+st.size.toString(16)+'-'+Math.floor(st.mtimeMs).toString(16)+'"';
  const common={
    'Content-Type':'video/mp4',
    'Accept-Ranges':'bytes',
    'Cache-Control':'public, max-age=31536000, immutable',
    'ETag':etag
  };
  if(!range&&req.headers['if-none-match']===etag){
    res.writeHead(304,common);res.end();return;
  }
  if(range){
    const m=/^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if(!m){res.writeHead(416,{'Content-Range':'bytes */'+st.size});res.end();return;}
    let start,end;
    if(m[1]){
      start=Number(m[1]);
      end=m[2]?Number(m[2]):st.size-1;
    }else if(m[2]){
      const suffix=Number(m[2]);
      if(!Number.isFinite(suffix)||suffix<=0){res.writeHead(416,{'Content-Range':'bytes */'+st.size});res.end();return;}
      start=Math.max(0,st.size-suffix);
      end=st.size-1;
    }else{
      res.writeHead(416,{'Content-Range':'bytes */'+st.size});res.end();return;
    }
    if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||start>=st.size||end<start){
      res.writeHead(416,{'Content-Range':'bytes */'+st.size});res.end();return;
    }
    end=Math.min(end,st.size-1);
    res.writeHead(206,{...common,'Content-Range':`bytes ${start}-${end}/${st.size}`,'Content-Length':end-start+1});
    if(req.method==='HEAD'){res.end();return;}
    fs.createReadStream(file,{start,end}).pipe(res);
  }else{
    res.writeHead(200,{...common,'Content-Length':st.size});
    if(req.method==='HEAD'){res.end();return;}
    fs.createReadStream(file).pipe(res);
  }
}

async function serveVideo(req,res,id){
  const {video}=await prepareMedia(id);
  await serveFileVideo(req,res,video);
}

async function servePoster(req,res,id){
  const {poster}=await prepareMedia(id);
  const st=await fsp.stat(poster);
  const etag='W/"'+st.size.toString(16)+'-'+Math.floor(st.mtimeMs).toString(16)+'"';
  if(req.headers['if-none-match']===etag){
    res.writeHead(304,{'ETag':etag,'Cache-Control':'public, max-age=31536000, immutable'});
    res.end();
    return;
  }
  res.writeHead(200,{'Content-Type':'image/jpeg','Content-Length':st.size,'Cache-Control':'public, max-age=31536000, immutable','ETag':etag});
  if(req.method==='HEAD'){res.end();return;}
  fs.createReadStream(poster).pipe(res);
}

async function serveStatic(req,res,pathname){
  let rel=pathname==='/'?'index.html':pathname.replace(/^\/+/, '');
  try{rel=decodeURIComponent(rel)}catch{res.writeHead(400);res.end('Bad request');return;}
  const file=path.resolve(root,rel);
  if(file!==path.join(root,'index.html')&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  let st;
  try{st=await fsp.stat(file)}catch{res.writeHead(404,{'Cache-Control':'no-store'});res.end('Not found');return;}
  if(!st.isFile()){res.writeHead(404,{'Cache-Control':'no-store'});res.end('Not found');return;}

  const isHtml=path.basename(file)==='index.html';
  const ext=path.extname(file).toLowerCase();
  const versioned=String(req.url||'').includes('?v=');
  const etag='W/"'+st.size.toString(16)+'-'+Math.floor(st.mtimeMs).toString(16)+'"';
  const headers={
    'Content-Type':types[ext]||'application/octet-stream',
    'Cache-Control':isHtml?'no-cache':versioned?'public, max-age=31536000, immutable':'public, max-age=3600, stale-while-revalidate=86400',
    'ETag':etag,
    'Last-Modified':st.mtime.toUTCString()
  };
  if(req.headers['if-none-match']===etag){
    res.writeHead(304,headers);res.end();return;
  }

  const compressible=new Set(['.html','.css','.js','.json','.svg','.xml','.txt','.webmanifest']);
  const accepted=String(req.headers['accept-encoding']||'');
  let encoding='';
  if(st.size>1024&&compressible.has(ext)&&accepted.includes('br')) encoding='br';
  else if(st.size>1024&&compressible.has(ext)&&accepted.includes('gzip')) encoding='gzip';

  if(encoding){
    headers['Content-Encoding']=encoding;
    headers['Vary']='Accept-Encoding';
  }else{
    headers['Content-Length']=st.size;
  }

  res.writeHead(200,headers);
  if(req.method==='HEAD'){res.end();return;}
  const stream=fs.createReadStream(file);
  if(encoding==='br') stream.pipe(zlib.createBrotliCompress({params:{[zlib.constants.BROTLI_PARAM_QUALITY]:5}})).pipe(res);
  else if(encoding==='gzip') stream.pipe(zlib.createGzip({level:6})).pipe(res);
  else stream.pipe(res);
}

const securityHeaders={
  'X-Content-Type-Options':'nosniff',
  'X-Frame-Options':'DENY',
  'Referrer-Policy':'strict-origin-when-cross-origin',
  'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy':'same-origin',
  'Strict-Transport-Security':'max-age=31536000',
  'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
};

http.createServer(async(req,res)=>{
  for(const [name,value] of Object.entries(securityHeaders)) res.setHeader(name,value);
  try{
    if(req.method!=='GET'&&req.method!=='HEAD'){
      res.writeHead(405,{'Allow':'GET, HEAD','Cache-Control':'no-store'});
      res.end('Method not allowed');
      return;
    }
    const u=new URL(req.url,'http://localhost');
    if(u.pathname==='/health'){
      const status=criticalMediaReady?200:503;
      const body=JSON.stringify({
        ok:criticalMediaReady,
        service:'vecta',
        state:criticalMediaReady?'ready':'warming',
        ...(criticalMediaError?{error:criticalMediaError}:{})
      });
      res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Content-Length':Buffer.byteLength(body),'Cache-Control':'no-store','Retry-After':criticalMediaReady?undefined:'3'});
      if(req.method==='HEAD'){res.end();return;}
      res.end(body);return;
    }
    let m=u.pathname.match(/^\/media\/(event-[12])$/);
    if(m){await serveVideo(req,res,m[1]);return;}
    m=u.pathname.match(/^\/poster\/(event-[12])$/);
    if(m){await servePoster(req,res,m[1]);return;}
    m=u.pathname.match(/^\/clip\/(work-top|work-bottom)$/);
    if(m){const {video}=await prepareClip(m[1]);await serveFileVideo(req,res,video);return;}
    if(u.pathname==='/cover/event-1'){const file=path.join(root,'assets','event1-cover-final.webp');const st=await fsp.stat(file);res.writeHead(200,{'Content-Type':'image/webp','Content-Length':st.size,'Cache-Control':'public, max-age=31536000, immutable'});if(req.method==='HEAD'){res.end();return;}fs.createReadStream(file).pipe(res);return;}
    if(u.pathname==='/hero-loop'){const {video}=await prepareHero();await serveFileVideo(req,res,video);return;}
    if(u.pathname==='/hero-poster'){const {poster}=await prepareHero();const st=await fsp.stat(poster);res.writeHead(200,{'Content-Type':'image/jpeg','Content-Length':st.size,'Cache-Control':'public, max-age=31536000, immutable'});if(req.method==='HEAD'){res.end();return;}fs.createReadStream(poster).pipe(res);return;}
    m=u.pathname.match(/^\/clip-poster\/(work-top|work-bottom)$/);
    if(m){const {poster}=await prepareClip(m[1]);const st=await fsp.stat(poster);res.writeHead(200,{'Content-Type':'image/jpeg','Content-Length':st.size,'Cache-Control':'public, max-age=31536000, immutable'});if(req.method==='HEAD'){res.end();return;}fs.createReadStream(poster).pipe(res);return;}
    await serveStatic(req,res,u.pathname);
  }catch(err){
    console.error(err);
    if(!res.headersSent) res.writeHead(500,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});
    res.end('Media temporarily unavailable');
  }
}).listen(port,'0.0.0.0',()=>{
  console.log('Event site listening on',port);
  void warmCriticalMedia();
});

async function warmCriticalMedia(){
  try{
    for(const name of Object.keys(clips)) await prepareClip(name);
    await prepareHero();
    criticalMediaReady=true;
    criticalMediaError='';
    console.log('Critical media ready');
  }catch(err){
    criticalMediaReady=false;
    criticalMediaError=err instanceof Error?err.message:String(err);
    console.error('Critical media warmup failed:',criticalMediaError);
  }
}