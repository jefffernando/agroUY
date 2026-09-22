import rss from '@astrojs/rss';
import { publishedArticles, url } from '../lib/content';
import type { APIContext } from 'astro';
export async function GET(context: APIContext) {
 return rss({title:'Agro Uruguay',description:'Guías y recursos para el agro uruguayo.',site:context.site!,
 items:(await publishedArticles()).map(a=>({title:a.data.title,description:a.data.description,pubDate:a.data.date,link:url('articulos/'+a.id+'/')})),customData:'<language>es-UY</language>'});
}
