const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const source=html.toLowerCase();

const banned=[
  'индивидуальный подход',
  'команда профессионалов',
  'высокое качество',
  'каждый проект уникален',
  'создаём истории',
  'создаем истории',
  'незабываемые эмоции',
  'под ключ',
  'лучший',
  'идеальный'
];

const errors=[];
for(const phrase of banned){
  if(source.includes(phrase))errors.push('Banned cliché: '+phrase);
}
if(html.includes('—'))errors.push('Long dash is not allowed in public site copy');

const manifesto=[...html.matchAll(/<h1[^>]*data-headline="manifesto"[^>]*>([\s\S]*?)<\/h1>/g)];
if(manifesto.length!==1)errors.push('Exactly one manifesto headline is required');
const sectionCount=(html.match(/data-headline="section"/g)||[]).length;
const operationalCount=(html.match(/data-headline="operational"/g)||[]).length;
if(sectionCount<7)errors.push('Headline system: expected at least 7 section headlines');
if(operationalCount<8)errors.push('Headline system: expected at least 8 operational headlines');

const strip=value=>value.replace(/<br\s*\/?\s*>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
if(manifesto[0]&&strip(manifesto[0][1]).length>72)errors.push('Manifesto headline is too long');

if(errors.length){
  console.error('\nVECTA COPY GUARD FAILED');
  errors.forEach(error=>console.error('- '+error));
  process.exit(1);
}
console.log('VECTA COPY GUARD: PASS');
console.log('Headline contract:',sectionCount+' section / '+operationalCount+' operational');
