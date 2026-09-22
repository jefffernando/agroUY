import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { categories } from './config/categories';
import { sponsors } from './config/sponsors';
const articles = defineCollection({
 loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
 schema: z.object({
 title: z.string().min(10).max(120), description: z.string().min(40).max(200),
 date: z.coerce.date(), updatedDate: z.coerce.date().optional(),
 category: z.string().refine(v => categories.some(c => c.slug === v), 'Categoría desconocida'),
 tags: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).min(1),
 author: z.string().min(1), image: z.string().regex(/^\/images\/[a-z0-9-]+\.(svg|webp|jpg|png)$/),
 draft: z.boolean().default(true), featured: z.boolean().default(false),
 sponsored: z.boolean().default(false), sponsor: z.string().optional(),
 canonical: z.url({ protocol: /^https?$/ }).optional(), demo: z.boolean().default(false),
 sources: z.array(z.object({ title: z.string(), url: z.url({ protocol: /^https$/ }) })).min(1),
 }).superRefine((v, ctx) => {
 if (v.updatedDate && v.updatedDate < v.date) ctx.addIssue({ code: 'custom', message: 'updatedDate no puede ser anterior a date' });
 if (v.sponsored && (!v.sponsor || !sponsors.articleSponsors[v.sponsor])) ctx.addIssue({ code:'custom', message:'Artículo patrocinado requiere sponsor configurado' });
 })
});
export const collections = { articles };
