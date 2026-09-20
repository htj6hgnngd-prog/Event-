const http=require('http');
const fs=require('fs');
const fsp=fs.promises;
const path=require('path');
const {Readable}=require('stream');
const {pipeline}=require('stream/promises');
const {execFile}=require('child_process');
const {promisify}=require('util');
const {URL}=require('url');
const ffmpeg=require('ffmpeg-static');

const execFileAsync=promisify(execFile);
const root=__dirname;
const port=Number(process.env.PORT||3000);
const mediaRoot=path.join('/tmp','event-production-media');
const sources={
  'event-1':{url:'https://disk.yandex.ru/i/iIj6z28I2z0d3w',poster:'54.0'},
  'event-2':{url:'https://disk.yandex.ru/i/CGJbZxDuh1ORXw',poster:'28.0'}
};
const jobs=new Map();
const clips={
  'work-top':{source:'event-1',start:'49.2',duration:'4.8',poster:'50.2'},
  'work-bottom':{source:'event-2',start:'43.8',duration:'4.8',poster:'45.0'}
};
const clipJobs=new Map();

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
  '.mp4':'video/mp4'
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

async function prepareMedia(id){
  if(jobs.has(id)) return jobs.get(id);
  const job=(async()=>{
    await fsp.mkdir(mediaRoot,{recursive:true});
    const source=path.join(mediaRoot,id+'.mov');
    const video=path.join(mediaRoot,id+'.mp4');
    const poster=path.join(mediaRoot,id+'.jpg');
    if(await exists(video) && await exists(poster)) return {video,poster};

    console.log('Preparing media:',id);
    if(!(await exists(source))) await download(id,source);

    if(!(await exists(poster))){
      await execFileAsync(ffmpeg,['-y','-v','error','-ss',sources[id].poster,'-i',source,'-frames:v','1','-q:v','2',poster],{maxBuffer:1024*1024*4});
    }

    if(!(await exists(video))){
      await execFileAsync(ffmpeg,[
        '-y','-v','error','-i',source,
        '-map','0:v:0','-map','0:a:0?',
        '-c:v','copy','-c:a','aac','-b:a','160k',
        '-movflags','+faststart',
        video
      ],{maxBuffer:1024*1024*8});
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

    const source=path.join(mediaRoot,cfg.source+'.mov');
    if(!(await exists(source))) await download(cfg.source,source);

    if(!(await exists(out))){
      await execFileAsync(ffmpeg,[
        '-y','-v','error','-ss',cfg.start,'-i',source,'-t',cfg.duration,
        '-an','-vf','scale=1600:-2:flags=lanczos,format=yuv420p',
        '-c:v','libx264','-preset','veryfast','-crf','22',
        '-movflags','+faststart',out
      ],{maxBuffer:1024*1024*8});
    }
    if(!(await exists(poster))){
      await execFileAsync(ffmpeg,['-y','-v','error','-ss',cfg.poster,'-i',source,'-frames:v','1','-vf','scale=1600:-2:flags=lanczos','-q:v','2',poster],{maxBuffer:1024*1024*4});
    }
    console.log('Clip ready:',name);
    return {video:out,poster};
  })().catch(err=>{clipJobs.delete(name);throw err});
  clipJobs.set(name,job);
  return job;
}

async function serveFileVideo(req,res,file){
  const st=await fsp.stat(file);
  const range=req.headers.range;
  const common={'Content-Type':'video/mp4','Accept-Ranges':'bytes','Cache-Control':'public, max-age=86400'};
  if(range){
    const m=/bytes=(\d*)-(\d*)/.exec(range);
    const start=m&&m[1]?Number(m[1]):0;
    const end=m&&m[2]?Number(m[2]):st.size-1;
    if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end>=st.size||start>end){res.writeHead(416,{'Content-Range':'bytes */'+st.size});res.end();return;}
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
  res.writeHead(200,{'Content-Type':'image/jpeg','Content-Length':st.size,'Cache-Control':'public, max-age=86400'});
  if(req.method==='HEAD'){res.end();return;}
  fs.createReadStream(poster).pipe(res);
}

function serveStatic(req,res,pathname){
  let rel=pathname==='/'?'index.html':pathname.replace(/^\/+/, '');
  rel=decodeURIComponent(rel);
  const file=path.resolve(root,rel);
  if(!file.startsWith(root)){res.writeHead(403);res.end();return;}
  fs.stat(file,(err,st)=>{
    if(err||!st.isFile()){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':path.basename(file)==='index.html'?'no-cache':'public, max-age=300'});
    if(req.method==='HEAD'){res.end();return;}
    fs.createReadStream(file).pipe(res);
  });
}

http.createServer(async(req,res)=>{
  try{
    const u=new URL(req.url,'http://localhost');
    let m=u.pathname.match(/^\/media\/(event-[12])$/);
    if(m){await serveVideo(req,res,m[1]);return;}
    m=u.pathname.match(/^\/poster\/(event-[12])$/);
    if(m){await servePoster(req,res,m[1]);return;}
    m=u.pathname.match(/^\/clip\/(work-top|work-bottom)$/);
    if(m){const {video}=await prepareClip(m[1]);await serveFileVideo(req,res,video);return;}
    m=u.pathname.match(/^\/clip-poster\/(work-top|work-bottom)$/);
    if(m){const {poster}=await prepareClip(m[1]);const st=await fsp.stat(poster);res.writeHead(200,{'Content-Type':'image/jpeg','Content-Length':st.size,'Cache-Control':'public, max-age=86400'});if(req.method==='HEAD'){res.end();return;}fs.createReadStream(poster).pipe(res);return;}
    serveStatic(req,res,u.pathname);
  }catch(err){
    console.error(err);
    if(!res.headersSent) res.writeHead(500,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});
    res.end('Media temporarily unavailable');
  }
}).listen(port,'0.0.0.0',()=>{
  console.log('Event site listening on',port);
  (async()=>{
    for(const id of Object.keys(sources)){
      try{await prepareMedia(id)}
      catch(err){console.error('Preload failed:',id,err.message)}
    }
    for(const name of Object.keys(clips)){
      try{await prepareClip(name)}
      catch(err){console.error('Clip preload failed:',name,err.message)}
    }
  })();
});