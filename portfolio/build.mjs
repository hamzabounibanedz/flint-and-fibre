import { cp, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const output = join(process.cwd(), 'dist');
const media = 'https://medusa-public-images.s3.eu-west-1.amazonaws.com';
const products = [
  { slug: 'ink-tee', name: 'Everyday tee', colour: 'Ink', family: 'Tops', asset: 'tee-black', price: 32, detail: 'A short-sleeved crewneck with a straight hem. Shown in ink black.' },
  { slug: 'vintage-crew', name: 'Studio crew', colour: 'Washed olive', family: 'Tops', asset: 'sweatshirt-vintage', price: 68, detail: 'A long-sleeved crewneck sweatshirt with ribbed cuffs and a relaxed silhouette.' },
  { slug: 'grey-sweatpant', name: 'Rest day trouser', colour: 'Heather grey', family: 'Bottoms', asset: 'sweatpants-gray', price: 62, detail: 'An easy pull-on sweatpant with a tapered leg and cuffed ankles.' },
  { slug: 'vintage-short', name: 'Field short', colour: 'Washed olive', family: 'Bottoms', asset: 'shorts-vintage', price: 48, detail: 'A casual short with an elastic waist and an easy fit through the leg.' }
];

const css = `
*{box-sizing:border-box}html{background:#f6f4eb;color:#22251c;font-family:"Work Sans",Arial,sans-serif}body{margin:0}a{color:inherit;text-underline-offset:4px}a:focus-visible{outline:3px solid #984b24;outline-offset:5px}header,main,footer{max-width:1300px;margin:auto;padding:0 clamp(20px,5vw,76px)}header{height:78px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #c7c6b7}.brand{display:inline-flex;align-items:center;gap:10px;text-decoration:none;font-weight:750;font-size:20px}.brand img{width:32px;height:32px}.notice{background:#424a34;color:#fff;padding:8px 16px;text-align:center;font-size:13px;letter-spacing:.02em}.intro{padding:clamp(50px,8vw,112px) 0 38px}.intro h1,.detail h1{font-family:Georgia,serif;font-weight:400;font-size:clamp(52px,7vw,99px);letter-spacing:-.065em;line-height:.95;margin:0 0 18px}.intro p,.detail p{line-height:1.55;max-width:54ch}.filters{display:flex;gap:22px;align-items:center;padding:14px 0;border-top:1px solid #c7c6b7;border-bottom:1px solid #c7c6b7}.filters a{color:#535a46;text-decoration:none}.filters a[aria-current=page]{color:#20261a;text-decoration:underline}.grid{list-style:none;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(12px,2vw,26px)}.card{text-decoration:none;display:block}.photo{background:#e8e6dc;aspect-ratio:4/5;overflow:hidden;display:grid;place-items:center}.photo img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}.card:hover h2{text-decoration:underline}.nameprice{display:flex;align-items:baseline;justify-content:space-between;gap:6px;margin-top:14px}h2{margin:0;font-size:clamp(16px,1.5vw,22px);font-weight:600}.tone{display:block;margin:5px 0 16px;color:#525749;font-size:14px}footer{margin-top:55px;padding-top:20px;padding-bottom:26px;display:flex;justify-content:space-between;gap:16px;border-top:1px solid #c7c6b7;color:#565b4d;font-size:13px}.back{display:inline-block;margin:28px 0}.detail{display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(24px,6vw,90px);align-items:start}.detail h1{font-size:clamp(46px,5vw,78px);margin-top:20px}.detailspec{border-top:1px solid #c7c6b7;padding:14px 0;display:flex;justify-content:space-between}.angles{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.angles figure{margin:0}.angles figcaption{font-size:13px;color:#525749;margin-top:6px}@media(max-width:800px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.detail{grid-template-columns:1fr}}@media(max-width:420px){header{height:65px}.brand{font-size:17px}.filters{gap:17px}.nameprice{align-items:flex-start;flex-direction:column}.intro h1{font-size:52px}footer{flex-wrap:wrap}}@media(prefers-reduced-motion:no-preference){.card img{transition:transform .25s}.card:hover img{transform:scale(1.035)}}
`;
const productLink = p => '/us/products/' + p.slug + '/';
const catalog = '/us/store/';
const picture = (p, side) => `<div class="photo"><img src="/images/${p.asset}-${side}.png" alt="${p.name} in ${p.colour}, ${side} view" width="600" height="750"></div>`;
function frame(title, content) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Flint &amp; Fibre</title><link rel="icon" href="/brand-mark.svg"><link rel="stylesheet" href="/style.css"></head><body><div class="notice">Portfolio demo · Sample products · Checkout disabled</div><header><a href="/" class="brand"><img src="/brand-mark.svg" alt="">Flint &amp; Fibre</a><a href="${catalog}">Collection</a></header><main>${content}</main><footer><span>Flint &amp; Fibre</span><a href="https://github.com/hamzabounibanedz/flint-and-fibre">View project on GitHub</a></footer></body></html>`;
}
function collection(filter = 'All') {
  const chosen = products.filter(p => filter === 'All' || p.family === filter);
  const nav = ['All','Tops','Bottoms'].map(label => `<a href="${label === 'All' ? catalog : catalog + label.toLowerCase() + '/'}"${label === filter ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const cards = chosen.map(p => `<li><a class="card" href="${productLink(p)}">${picture(p,'front')}<div class="nameprice"><h2>${p.name}</h2><span>$${p.price}</span></div><span class="tone">${p.colour}</span></a></li>`).join('');
  return frame('The collection', `<section class="intro"><h1>The everyday collection</h1><p>Four wardrobe staples in ink, grey and washed olive.</p></section><nav aria-label="Filter collection" class="filters">${nav}</nav><ul class="grid">${cards}</ul>`);
}
function detail(p) {
  return frame(p.name, `<a class="back" href="${catalog}">← All products</a><article class="detail"><div class="angles">${['front','back'].map(side=>`<figure>${picture(p,side)}<figcaption>${side === 'front' ? 'Front' : 'Back'}</figcaption></figure>`).join('')}</div><div><span>${p.family}</span><h1>${p.name}</h1><p>${p.detail}</p><div class="detailspec"><span>Colour</span><strong>${p.colour}</strong></div><div class="detailspec"><span>Sample price</span><strong>$${p.price} USD</strong></div></div></article>`);
}
async function page(folder, html) {
  const target = join(output, folder);
  await mkdir(target, { recursive: true });
  await writeFile(join(target, 'index.html'), html);
}
await mkdir(join(output, 'images'), {recursive:true});
await cp('public/brand-mark.svg',join(output,'brand-mark.svg'));
await writeFile(join(output,'style.css'),css);
for (const p of products) {
  for (const side of ['front', 'back']) {
    const filename = p.asset + '-' + side + '.png';
    const response = await fetch(media + '/' + filename, {signal: AbortSignal.timeout(30000)});
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw Error('Could not load catalog photograph ' + filename);
    await writeFile(join(output,'images',filename),Buffer.from(await response.arrayBuffer()));
  }
  await page('us/products/'+p.slug,detail(p));
}
for (const folder of ['', 'us', 'us/store']) await page(folder,collection());
for (const kind of ['Tops','Bottoms']) await page('us/store/'+kind.toLowerCase(),collection(kind));
await writeFile(join(output,'404.html'),frame('Page unavailable','<section class="intro"><h1>Page unavailable</h1><p><a href="/us/store/">Return to the collection</a></p></section>'));
