const http=require('http');
const fs=require('fs');
const path=require('path');
const {Readable}=require('stream');
const {URL}=require('url');

const root=__dirname;
const port=Number(process.env.PORT||3000);
const sources={
  'event-1':'https://disk.yandex.ru/i/iIj6z28I2z0d3w',
  'event-2':'https://disk.yandex.ru/i/CGJbZxDuh1ORXw'
};
const resolved=new Map();
const TTL=5*60*1000;

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

async function resolveYandex(id,force=false){
  const pub=sources[id];
  if(!pub) return null;
  const cached=resolved.get(id);
  if(!force&&cached&&Date.now()-cached.time<TTL) return cached.href;
  const api='https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key='+encodeURIComponent(pub);
  const r=await fetch(api,{headers:{'User-Agent':'EventProduction/1.0'}});
  if(!r.ok) throw new Error('Yandex API '+r.status);
  const data=await r.json();
  if(!data.href) throw new Error('No Yandex href');
  resolved.set(id,{href:data.href,time:Date.now()});
  return data.href;
}

async function proxyMedia(req,res,id){
  let href=await resolveYandex(id);
  if(!href){res.writeHead(404);res.end('Not found');return;}
  const headers={'User-Agent':'Mozilla/5.0'};
  if(req.headers.range) headers.Range=req.headers.range;
  let upstream=await fetch(href,{headers,redirect:'follow'});
  if(upstream.status===403||upstream.status===404){
    href=await resolveYandex(id,true);
    upstream=await fetch(href,{headers,redirect:'follow'});
  }
  if(!upstream.ok&&upstream.status!==206){
    res.writeHead(502,{'Content-Type':'text/plain; charset=utf-8'});
    res.end('Video source unavailable');
    return;
  }
  const out={};
  for(const h of ['content-type','content-length','content-range','accept-ranges','etag','last-modified']){
    const v=upstream.headers.get(h);
    if(v) out[h]=v;
  }
  out['cache-control']='public, max-age=300';
  res.writeHead(upstream.status,out);
  if(req.method==='HEAD'||!upstream.body){res.end();return;}
  Readable.fromWeb(upstream.body).pipe(res);
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
    const match=u.pathname.match(/^\/media\/(event-[12])$/);
    if(match){await proxyMedia(req,res,match[1]);return;}
    serveStatic(req,res,u.pathname);
  }catch(err){
    console.error(err);
    if(!res.headersSent) res.writeHead(500,{'Content-Type':'text/plain; charset=utf-8'});
    res.end('Server error');
  }
}).listen(port,'0.0.0.0',()=>console.log('Event site listening on',port));