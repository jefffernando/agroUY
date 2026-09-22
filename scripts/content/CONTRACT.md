# Contrato editorial de Markdown

Formato admitido: UTF-8, un archivo `src/content/articles/slug-en-kebab-case.md`, frontmatter YAML delimitado por `---`. No usar MDX ni HTML de terceros; el pipeline futuro debe tratar el texto generado como entrada no confiable. Astro valida el esquema en `src/content.config.ts`.

| Campo | Contrato |
| --- | --- |
| title | Texto de 10–120 caracteres; intención explícita |
| description | Resumen original de 40–200 caracteres |
| date | Fecha ISO YYYY-MM-DD, fecha de publicación prevista |
| updatedDate | Opcional; no anterior a date; solo para cambios sustanciales |
| category | Slug existente en categories.ts |
| tags | Al menos un slug ASCII en kebab-case |
| author | Responsable editorial, no autor inventado |
| image | Ruta /images/nombre.svg, webp, jpg o png existente |
| draft | true por defecto; solo una persona puede habilitar publicación |
| featured | Booleano; destacar pocas piezas |
| sponsored | Booleano; true exige sponsor configurado |
| sponsor | Clave de articleSponsors cuando sponsored es true |
| canonical | URL absoluta opcional; omitir para contenido original |
| demo | true identifica material demostrativo |
| sources | Lista no vacía de title y url HTTPS verificadas |

Los borradores y publicaciones con fecha futura quedan fuera de todas las rutas, listados y RSS. Una fecha futura requiere un nuevo build cuando llegue el día: no hay cron de publicación.

Los enlaces entre artículos deben escribirse como `../otro-slug/`; desde un artículo a una categoría: `../../categorias/slug/`. Evitar enlaces absolutos desde raíz en el cuerpo: romperían el prefijo de GitHub Pages. Las imágenes editoriales se configuran en frontmatter.

## Validaciones y revisión
1. Buscar contenido existente y preferir actualizarlo si responde la misma intención.
2. Investigar fuentes primarias y registrar fecha de consulta en el expediente del PR.
3. Generar con draft: true. Sin HTML ejecutable, scripts, iframes ni eventos.
4. Ejecutar npm run check, npm run build y npm test.
5. La validación de esquema no garantiza exactitud. Revisar cada afirmación, fuente, fecha, unidad y enlace externo.
6. Una persona aprueba y cambia draft a false; proteger main con PR y aprobación obligatoria.
7. La automatización puede crear ramas y PR, nunca aprobarlos ni fusionarlos.
8. El merge a main ejecuta el despliegue. No usar pull_request_target para ejecutar contenido generado.

`npm run content:new -- mi-articulo` crea un borrador sin sobrescribir archivos existentes. El pipeline futuro debe usar escritura exclusiva y limitar rutas al directorio de artículos.
