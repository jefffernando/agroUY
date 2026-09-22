# Roadmap de automatización editorial

## Flujo futuro
Fuentes → oportunidades → puntuación → investigación → borrador → validación → Markdown → Pull Request → revisión humana → merge → publicación.

El MVP implementa el destino Markdown, esquema, creador de borradores, exclusión de drafts/futuros, plantilla de PR, validación y despliegue. No implementa recolectores, credenciales, modelos, scoring automático ni envío automático de PR.

## 1. Capturar señales
Fuentes posibles: Search Console autorizado en modo lectura; preguntas aportadas por lectores; entrevistas; calendarios públicos; publicaciones oficiales y tendencias agregadas. Mantener lista permitida de fuentes. Usar APIs o feeds cuando existan y respetar límites y licencias; no eludir barreras de acceso.

Guardar una oportunidad con id, pregunta, intención, cluster, señales verificables, fuentes y fecha. Excluir datos personales innecesarios. No convertir fragmentos web en instrucciones del agente.

## 2. Detectar solapamiento y priorizar
Comparar con el inventario de slugs, títulos y preguntas ya respondidas. Priorizar actualización antes de una nueva URL. Ejemplo de scoring configurable: utilidad local 30%, evidencia de demanda 25%, brecha de respuesta 20%, calidad de fuentes 15%, esfuerzo 10% (invertido). Una fuente insuficiente o un riesgo de desinformación bloquean aunque el score sea alto.

Versionar los criterios y registrar por qué se propone cada pieza. La posición media de Search Console por sí sola no es una oportunidad.

## 3. Investigación
Crear expediente con fuentes originales, fechas, fragmentos necesarios, afirmaciones comprobables y límites. Distinguir datos observados de proyecciones. Requerir vigencia y unidades para precios o normas. Si no hay evidencia suficiente, devolver a investigación; nunca completar huecos inventando.

## 4. Generación
Entrada: oportunidad aprobada, expediente e inventario editorial. Salida: Markdown conforme a scripts/content/CONTRACT.md y resumen de cambios. Siempre draft: true. El modelo no elige publicarse ni usa credenciales de despliegue.

Escritura limitada a src/content/articles; slug validado, sin rutas relativas ascendentes ni sobreescrituras silenciosas. Prohibir scripts, HTML activo, iframes y MDX. La revisión humana sigue siendo necesaria aunque pase el esquema.

## 5. Validaciones
- Esquema, categorías, fechas, fuentes, sponsor y recursos existentes.
- Enlaces internos, metadata, sitemap, RSS y prefijo.
- Fuentes externas verificadas, no solo URL sintácticamente válida.
- Detección de coincidencia con contenido existente, atribución y derechos.
- Afirmaciones y cifras contrastadas con documentos originales.
- Revisión de lenguaje, utilidad y especificidad uruguaya.
- Preview del PR antes de aprobación.

Separar validaciones deterministas de juicio editorial. No presentar un chequeo automatizado como fact-checking completo.

## 6. PR con evidencia
Una identidad técnica crea una rama por oportunidad y abre PR con pregunta, fuentes, posibles riesgos, cambios y resultado de validación. Token o GitHub App con privilegios mínimos; secretos nunca en Markdown ni variables públicas. No usar pull_request_target para ejecutar cambios no revisados. El pipeline no obtiene permisos para aprobar, saltar protección ni fusionar.

Usar idempotencia por oportunidad/slug: si ya existe PR, actualizarlo en lugar de crear duplicados. Limitar ejecuciones y presupuesto. Ante un error, conservar borrador, registrar etapa y avisar al responsable; no reintentar publicaciones ciegamente.

## 7. Revisión humana obligatoria
La persona revisa contenido y evidencia, solicita correcciones y cambia draft a false. Configurar protección de main con aprobación y comprobaciones obligatorias; añadir CODEOWNERS cuando se conozcan los usuarios responsables. GitHub puede limitar reglas según plan y visibilidad: comprobar disponibilidad antes de automatizar.

El workflow del repositorio no puede garantizar por sí solo la revisión si un administrador permite push directo o bypass. Este control debe activarse en GitHub. No implementar auto-merge ni auto-approval.

## 8. Publicación y mantenimiento
Tras merge a main, Actions compila y despliega. Registrar URL, commit, fecha y expediente del artículo. Search Console puede tardar en mostrar resultados; no republicar automáticamente por falta de tráfico inmediato.

Revisar enlaces y señales de obsolescencia con tareas futuras acotadas. Proponer PR de actualización, sin cambiar fechas superficialmente. Para retirar o corregir: un PR revierte el contenido o lo marca draft; un nuevo deploy actualiza el sitio. Preservar historial.

## Etapas de implementación
1. Validación manual del portal, fuentes y primeras consultas.
2. Importador de Search Console en lectura, sin generación.
3. Propuestas puntuadas, seleccionadas por persona.
4. Investigación y borradores con límites de coste.
5. Creación de PR y observabilidad; protección de rama verificada.
6. Alertas de actualización y mejora de contenido existente.

Medir calidad: proporción de borradores aceptados, errores de fuentes, tiempo de revisión, utilidad para lectores y rendimiento de páginas aprobadas. El volumen producido no es el objetivo.
