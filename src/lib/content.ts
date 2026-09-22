import { getCollection } from 'astro:content';
export const publishedArticles = async () => (await getCollection('articles', ({data}) => !data.draft && data.date <= new Date())).sort((a,b) => b.data.date.getTime()-a.data.date.getTime() || a.id.localeCompare(b.id));
export const url = (path = '') => import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
export const dateLabel = (date: Date) => new Intl.DateTimeFormat('es-UY', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(date);
