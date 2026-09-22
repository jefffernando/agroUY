import { mkdir, writeFile } from 'node:fs/promises';
const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Uso: npm run content:new -- titulo-en-kebab-case');
await mkdir('src/content/articles', {recursive:true});
await writeFile('src/content/articles/'+slug+'.md', `---
title: "Título pendiente de revisión"
description: "Descripción editorial pendiente: explicar la pregunta concreta que responderá esta guía."
date: ${new Date().toISOString().slice(0,10)}
category: guias
tags: [fuentes]
author: "Redacción Agro Uruguay"
image: "/images/recursos.svg"
draft: true
featured: false
sponsored: false
demo: true
sources:
  - title: "Fuente inicial por revisar"
    url: "https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/"
---

## Pregunta del lector

Pendiente de investigación y revisión humana.

## Fuentes verificadas

Registrar afirmaciones, fuentes, fechas y límites antes de publicar.
`, {flag:'wx'});
console.log('Borrador creado; no se publicará hasta revisión humana y draft: false.');
