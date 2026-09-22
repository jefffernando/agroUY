import type { APIContext } from 'astro';
import { url } from '../lib/content';
export function GET({site}:APIContext){
 const location=new URL(url('sitemap-0.xml'),site).href.replaceAll('&','&amp;');
 return new Response('<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>'+location+'</loc></sitemap></sitemapindex>',{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
