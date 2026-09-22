import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('.qa',{recursive:true});
const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
const base=(process.env.BASE_PATH||'/').replace(/\/$/,'');
const origin=(process.env.PREVIEW_URL||'http://127.0.0.1:4322')+base;
const results=[];
try{
 for(const width of [360,768,1440]){
  const context=await browser.newContext({viewport:{width,height:1000},javaScriptEnabled:false,deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+': '+r.url());});
  for(const [name,path] of [['home','/'],['article','/articulos/elegir-potencia-tractor/'],['category','/categorias/maquinaria/'],['privacy','/privacidad/']]){
   await page.goto(origin+path,{waitUntil:'networkidle'});
   await page.screenshot({path:'.qa/'+name+'-'+width+'.png',fullPage:true});
   assert.equal(await page.locator('h1').count(),1);
   const dimensions=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0)}));
   assert.ok(dimensions.width<=dimensions.viewport,'Overflow '+name+' '+width+': '+JSON.stringify(dimensions));
   assert.ok(dimensions.images,'Imagen rota en '+name);
   results.push({name,width,status:'OK'});
  }
  await page.goto(origin+'/');
  await page.getByRole('link',{name:'Leer la guía',exact:false}).click();
  assert.ok(page.url().includes('/articulos/elegir-potencia-tractor/'));
  await page.getByRole('link',{name:'Ir al contenido'}).focus();
  assert.ok(await page.getByRole('link',{name:'Ir al contenido'}).isVisible());
  assert.deepEqual(errors,[]);
  await context.close();
 }
 console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
