const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');
const source = html.toLowerCase();
const banned = [
  'индивидуальный подход', 'команда профессионалов', 'высокое качество',
  'каждый проект уникален', 'создаём истории', 'создаем истории',
  'незабываемые эмоции', 'под ключ', 'лучший', 'идеальный'
];
const errors = [];
for (const phrase of banned) {
  if (source.includes(phrase)) errors.push('Banned cliché: ' + phrase);
}
if (html.includes('—')) errors.push('Long dash is not allowed in public copy');
const manifesto = [...html.matchAll(/<h1[^>]*data-headline="manifesto"[^>]*>([\s\S]*?)<\/h1>/g)];
if (manifesto.length !== 1) errors.push('Exactly one manifesto headline is required');
const sections = (html.match(/data-headline="section"/g) || []).length;
const operational = (html.match(/data-headline="operational"/g) || []).length;
if (sections < 6) errors.push('At least 6 section headlines are required');
if (operational < 6) errors.push('At least 6 operational labels are required');
const strip = value => value.replace(/<br\s*\/?\s*>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
if (manifesto[0] && strip(manifesto[0][1]).length > 72) errors.push('Manifesto headline too long');
for (const id of ['projects', 'studio', 'services', 'contact']) {
  if (!html.includes(`id="${id}"`)) errors.push(`Missing conversion navigation anchor: #${id}`);
}
if (!html.includes('id="project-brief"')) errors.push('Contact form is missing');
if (errors.length) { console.error('VECTA COPY GUARD FAILED\n' + errors.join('\n')); process.exit(1); }
console.log(`VECTA COPY GUARD: PASS (${sections} section / ${operational} operational)`);