# Agro Uruguay

MVP estático de un portal agropecuario uruguayo. Objetivo: validar demanda orgánica, recurrencia, contactos e interés comercial con infraestructura gratuita o casi gratuita. No hay backend, base de datos ni CMS.

## Ejecutar localmente
Requiere Node.js 22.12+ (se probó con Node 24) y npm.

```powershell
npm install
npm run dev
```

Abrir http://localhost:4321. Para revisar exactamente el sitio compilado: `npm run build` y `npm run preview`. Para detener dev usar Ctrl+C. En la versión instalada de Astro el preview puede ejecutarse en segundo plano: detener con npx astro preview stop y consultar npx astro preview status.

```powershell
npm run check
npm run build
npm test
```

El lockfile fija las versiones instaladas. En CI se utiliza `npm ci`. No se envía JavaScript al navegador salvo que actives GA4. Fuentes del sistema e ilustraciones SVG propias evitan peticiones a proveedores visuales.

## Arquitectura
- `src/content/articles/`: ocho guías Markdown iniciales, marcadas como demostración.
- `src/content.config.ts`: Content Collection, esquema y validación editorial.
- `src/config/categories.ts`: categorías ampliables por configuración.
- `src/config/sponsors.ts`: todos los formatos comerciales, vacíos inicialmente.
- `src/config/site.ts`: identidad y canales de contacto/newsletter.
- `src/lib/content.ts`: publicaciones visibles, fechas y rutas con base.
- `src/components/`: ArticleCard, FeaturedArticle, CategorySection, NewsletterCTA, SponsorBanner, SponsorCard y SponsoredArticle.
- `src/layouts/Base.astro`: navegación, metadata, JSON-LD y pie.
- `src/pages/`: home, artículos, categorías, tags, RSS, robots, legales y 404.
- `public/images/`: ilustraciones editoriales y portadas PNG para redes.
- `scripts/content/`: contrato y creador de borradores.
- `scripts/verify-build.mjs`: enlaces, recursos, metadata, feeds y borradores.
- `.github/workflows/deploy.yml`: validación en PR y publicación desde main.

Se usa la API actual de [Content Collections](https://docs.astro.build/en/guides/content-collections/) con glob loader. Markdown cubre el MVP; no se agrega MDX para evitar código ejecutable y dependencias innecesarias.

## Crear un artículo
```powershell
npm run content:new -- una-pregunta-del-productor
```

El archivo se crea con draft: true y no aparece públicamente. Completar título, descripción, categoría, etiquetas, autor, imagen y fuentes; escribir la guía; revisar; cambiar draft a false mediante PR humano. Contrato detallado en [scripts/content/CONTRACT.md](scripts/content/CONTRACT.md). Las fechas futuras también quedan fuera del sitio hasta un nuevo build posterior a la fecha.

Para contenido original, omitir canonical. Para una republicación autorizada, indicar el original y evitar duplicar contenido innecesariamente. No cambiar slugs publicados sin una estrategia de redirección. Los enlaces dentro del Markdown deben ser relativos (por ejemplo `../otro-articulo/`) para funcionar tanto en raíz como en un repositorio.

Los artículos iniciales son introductorios y demostrativos; se identifican en el sitio. Requieren revisión técnica antes de presentarlos como contenido editorial definitivo. No contienen noticias ni cotizaciones actuales.

## Agregar una categoría
Agregar un objeto `{slug, name, description}` a `src/config/categories.ts` y usar ese slug en los artículos. Navegación, home, validación y páginas se actualizan sin editar componentes. Usar slugs ASCII, únicos, en kebab-case.

## Agregar un sponsor
Editar `src/config/sponsors.ts`. Cada sponsor incluye name, description y url HTTPS; opcionalmente label. Ejemplo conceptual:

```ts
generalSponsor: {
  name: 'Nombre real de la empresa',
  description: 'Descripción del acuerdo aprobado.',
  url: 'https://empresa.example'
}
```

Opciones: generalSponsor, categorySponsors (clave = slug), bannerSponsors, featuredCompanies, newsletterSponsor y articleSponsors. Un artículo patrocinado debe tener sponsored: true y sponsor: clave configurada en articleSponsors. El build rechaza un sponsor faltante. Los enlaces comerciales incluyen rel=sponsored. Los espacios sin configuración no se renderizan. No hay métricas de audiencia inventadas, cobros ni anunciantes ficticios.

## Newsletter y contactos
Sin configuración se muestra “Boletín próximamente” y un enlace RSS; no hay formulario que simule un alta. Configurar `PUBLIC_NEWSLETTER_URL` con una página HTTPS de suscripción de Buttondown, Brevo, Mailchimp, ConvertKit o un servicio propio. Este enlace desacopla el portal del proveedor; allí se procesa el alta y la baja. Para capturar leads comerciales, configurar `PUBLIC_CONTACT_EMAIL`; aparece el contacto en Publicidad y Privacidad.

La captura está preparada, pero requiere configurar un canal real. Antes de activarla, completar responsable, política de privacidad y condiciones del proveedor. No poner claves API ni secretos en variables PUBLIC_*.

## Analytics y Search Console
Variables opcionales (en .env local o GitHub Settings → Secrets and variables → Actions → Variables):
- PUBLIC_GA_ID: ID de medición G-...; vacío = no carga scripts.
- PUBLIC_SEARCH_CONSOLE_VERIFICATION: contenido de la etiqueta de verificación URL-prefix.
- PUBLIC_NEWSLETTER_URL: página de suscripción HTTPS.
- PUBLIC_CONTACT_EMAIL: correo de contacto real.

En GA4 revisar páginas/pantallas, página de destino y adquisición de tráfico filtrada por Organic Search. En Search Console revisar consultas, páginas, país Uruguay, impresiones, clics, CTR y posición; enviar el sitemap completo. Search Console requiere verificación y datos reales; GA4 no informa las consultas individuales de Google. La política muestra si Analytics está activo. Evaluar requisitos de privacidad/consentimiento de la operación antes de activarlo; el MVP no incluye una plataforma de consentimiento.

## GitHub Pages: primer despliegue
1. Crear un repositorio GitHub (público para usar Pages sin un plan de pago) y subir este proyecto a main. Este entorno no tiene remote configurado; la creación y vinculación quedan pendientes.
2. En Settings → Pages → Build and deployment elegir GitHub Actions.
3. El workflow infiere `https://USUARIO.github.io` y `/REPOSITORIO` de GitHub. Un repositorio `USUARIO.github.io` usa raíz.
4. Opcionalmente definir SITE_URL (solo origen, sin path) y BASE_PATH en las variables de Actions para reemplazar esa inferencia.
5. Un push/merge a main compila, valida y despliega. Los PR solo validan y no reciben permisos de deploy.
6. Proteger main: PR obligatorio, aprobación humana y check build. No dar permiso de bypass a la futura automatización.

Configuración basada en la [guía oficial de Astro para GitHub Pages](https://docs.astro.build/en/guides/deploy/github/). El workflow y permisos están preparados, pero no se ha realizado despliegue remoto desde este entorno.

### Probar el prefijo en Windows
```powershell
$env:SITE_URL='https://usuario.github.io'
$env:BASE_PATH='/repositorio'
npm run build
npm test
npm run preview
```

Abrir http://localhost:4321/repositorio/. Restablecer con `Remove-Item Env:SITE_URL, Env:BASE_PATH` y recompilar. SITE_URL y BASE_PATH se leen del entorno del proceso: .env no se carga automáticamente en astro.config.mjs. PUBLIC_* sí usa el mecanismo .env de Astro.

### Dominio propio
Configurar DNS y Custom domain en GitHub Pages según el proveedor. Establecer SITE_URL=https://dominio.com y BASE_PATH=/ en variables de Actions. Agregar `public/CNAME` con el dominio si corresponde a la configuración del repositorio. Reejecutar el workflow, activar HTTPS y volver a enviar el sitemap. Enlaces, canonical, RSS e imágenes se reconstruyen con la nueva base.

## SEO y rendimiento
Sitemap index en /sitemap.xml y /sitemap-index.xml (referenciado por robots.txt), RSS en /rss.xml, canonical por página, Open Graph, Twitter cards, Organization, Article y BreadcrumbList. Tags son noindex,follow y se excluyen del sitemap para evitar archivos temáticos escasos compitiendo con las categorías. 404 también se excluye. Se publican artículos completos solo en su propia URL; listados y RSS incluyen extractos.

Sin fuentes remotas, frameworks de cliente ni anuncios vacíos; imágenes con dimensiones explícitas, carga diferida en tarjetas y prioridad alta en la portada. Medir Core Web Vitals en producción: las verificaciones locales no garantizan métricas de campo.

## Automatización futura
Ver [AUTOMATION_ROADMAP.md](docs/AUTOMATION_ROADMAP.md) y [CONTENT_STRATEGY.md](docs/CONTENT_STRATEGY.md). El pipeline propuesto genera borradores y PR, nunca publica ni fusiona por sí solo. La infraestructura actual no llama a modelos ni busca tendencias automáticamente.

## Validación visual opcional
Playwright es solo una dependencia de desarrollo. `node scripts/check-browser.mjs` revisa el preview local a 360, 768 y 1440 px, sin JavaScript, y guarda capturas en .qa/. Usa Edge instalado en Windows; en otros sistemas instalar Chromium de Playwright con `npx playwright install chromium`. BASE_PATH debe coincidir con la compilación. PREVIEW_URL permite indicar el origen del preview; por defecto usa http://127.0.0.1:4322.

## Antes del lanzamiento
- Crear/conectar el repositorio y activar Pages.
- Revisar las guías y sustituir demo: true solo después de la aprobación editorial.
- Completar contacto, responsable y privacidad; conectar la suscripción.
- Verificar Search Console, enviar sitemap y activar GA4 si corresponde.
- Proteger main; asignar una persona responsable de fuentes y actualizaciones.

En un proyecto alojado bajo /repositorio/, el robots.txt queda bajo ese prefijo. Los buscadores consultan robots.txt en la raíz del dominio; enviá el sitemap explícitamente en Search Console o configurá el sitio raíz si lo administrás. Con dominio propio, robots.txt queda en la ubicación estándar.
