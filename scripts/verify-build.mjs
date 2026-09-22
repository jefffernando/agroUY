import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve('dist');
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = (process.env.BASE_PATH || '/').replace(/\/$/,'');
const origin = new URL(site).origin;
const walk = async dir => (await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?walk(join(dir,e.name)):join(dir,e.name)))).flat();
const files=await walk(root), html=files.filter(f=>f.endsWith('.html'));
const exists=async(path)=>{try{await access(path);return true;}catch{return false;}};
let links=0;
for(const file of html){
 const source=await readFile(file,'utf8');
 const rel=file.slice(root.length).replaceAll('\\','/');
 const page=new URL(base+(rel==='/index.html'?'/':rel.replace(/index.html$/,'')),origin);
 assert.match(source, /<html lang="es-UY"/,file);
 assert.match(source, /<title>.+<\/title>/,file);
 assert.match(source, /name="description" content="[^"]+"/,file);
 assert.equal((source.match(/<h1(?:\s|>)/g)||[]).length,1,'Debe existir un h1: '+file);
 const canonical=source.match(/rel="canonical" href="([^"]+)"/)?.[1];
 assert.ok(canonical?.startsWith('http'), 'Canonical: '+file);
 assert.ok(source.includes('property="og:image"'),file);
 assert.ok(source.includes('name="twitter:card"'),file);
 for(const block of source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(block[1]);
 for(const match of source.matchAll(/(?:href|src)="([^"]+)"/g)){
  const raw=match[1].replaceAll('&amp;','&');
  if(raw.startsWith('mailto:') || raw.startsWith('data:'))continue;
  const target=new URL(raw,page);
  if(target.origin!==origin)continue;
  assert.ok(target.pathname===base || target.pathname.startsWith(base+'/'),'Enlace fuera de BASE_PATH: '+raw+' en '+file);
  let local=decodeURIComponent(target.pathname.slice(base.length));
  let destination=join(root,local);
  if(!extname(destination)) destination=join(destination,'index.html');
  assert.ok(await exists(destination),'Enlace inexistente: '+raw+' en '+file);
  if(target.hash && destination.endsWith('.html')){
   const content=await readFile(destination,'utf8');
   assert.ok(content.includes('id="'+decodeURIComponent(target.hash.slice(1))+'"'),'Ancla inexistente: '+raw);
  }
  links++;
 }
}
const rss=await readFile(join(root,'rss.xml'),'utf8');
assert.match(rss,/<rss/); assert.match(rss,/<item>/);
assert.ok(rss.includes(origin+base+'/articulos/'),'RSS no respeta site/base');
const sitemapIndex=await readFile(join(root,'sitemap-index.xml'),'utf8');
assert.ok(sitemapIndex.includes(origin+base+'/sitemap-0.xml'));
const sitemap=await readFile(join(root,'sitemap-0.xml'),'utf8');
assert.ok(sitemap.includes(origin+base+'/articulos/'));
assert.ok(!sitemap.includes('/404'), '404 no debe aparecer en sitemap');
const robots=await readFile(join(root,'robots.txt'),'utf8');
assert.ok(robots.includes(origin+base+'/sitemap-index.xml'));
const articles=await readdir('src/content/articles');
for(const name of articles.filter(n=>n.endsWith('.md'))){
 const source=await readFile(join('src/content/articles',name),'utf8');
 if(/^draft: true$/m.test(source)) assert.ok(!await exists(join(root,'articulos',name.slice(0,-3),'index.html')),'Borrador publicado');
}
console.log('OK: '+html.length+' páginas, '+links+' enlaces y recursos locales; metadata, JSON-LD, sitemap, RSS, robots y borradores.');

const aliases=await readFile(join(root,'sitemap.xml'),'utf8');
assert.ok(aliases.includes(origin+base+'/sitemap-0.xml'));
assert.ok(!sitemap.includes('/tags/'),'Los tags noindex no deben aparecer en sitemap');
assert.ok(await exists(join(root,'mercados','index.html')),'Falta la página de Mercados');
const markets=await readFile(join(root,'mercados','index.html'),'utf8');
assert.ok(markets.includes('Instituto Nacional de Carnes (INAC)'),'Falta atribución de INAC');
for(const file of html){
 const source=await readFile(file,'utf8');
 const social=source.match(/property="og:image" content="([^"]+)"/)?.[1];
 assert.ok(social && !social.endsWith('.svg'),'Open Graph requiere formato raster');
 const target=new URL(social);
 if(target.origin===origin)assert.ok(await exists(join(root,decodeURIComponent(target.pathname.slice(base.length)))),'Imagen social faltante: '+social);
 if(!process.env.PUBLIC_GA_ID)assert.ok(!source.includes('googletagmanager.com'),'Analytics no debe cargar sin configuración');
}

