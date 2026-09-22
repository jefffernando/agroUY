import { readFile, writeFile } from 'node:fs/promises';

const source = 'https://sitiodelganadero.inac.uy';
const homeUrl = source + '/com.inacsitioganadero.publico.sitio.home?CardId=0';
const dataPath = new URL('../../src/data/markets.json', import.meta.url);
const definitions = [
  { id: 'novillo-4ta-balanza', chartId: 57, title: 'Precio Novillo 4ta. Balanza', unit: 'USD/kg' },
  { id: 'faena-semanal-bovinos', chartId: 29, title: 'Faena Semanal de Bovinos', unit: 'cabezas' },
];
const fetchText = async (url) => {
  const response = await fetch(url, { headers: { accept: 'application/json, text/html' }, signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`INAC respondió ${response.status} para ${url}`);
  return response.text();
};
const text = (html, className) => {
  const match = html.match(new RegExp(`<span class="${className}">\\s*([^<]+?)\\s*<\\/span>`, 'i'));
  if (!match) throw new Error(`No se encontró ${className} en la respuesta de INAC`);
  return match[1].replaceAll('&nbsp;', ' ').trim();
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const home = await fetchText(homeUrl);
const sourceUpdatedLabel = home.match(/Última actualización:\s*<b>\s*(\d{2}\/\d{2}\/\d{2})\s*<\/b>/i)?.[1];
if (!sourceUpdatedLabel) throw new Error('No se encontró la fecha de actualización de INAC');
const indicators = await Promise.all(definitions.map(async (definition) => {
  const payload = JSON.parse(await fetchText(`${source}/API/Layout/GetCard?Chartid=${definition.chartId}`));
  if (typeof payload.HTML !== 'string') throw new Error(`Respuesta inválida para ${definition.title}`);
  const title = text(payload.HTML, 'titulo');
  const value = text(payload.HTML, 'valor');
  const period = text(payload.HTML, 'subtitulo');
  if (title !== definition.title || !/^[\d.,]+$/.test(value) || !/^\d{2}\/\d{2}\/\d{4} al \d{2}\/\d{2}\/\d{4}$/.test(period)) throw new Error(`Datos no válidos de INAC para ${definition.title}`);
  return { id: definition.id, title, value, unit: definition.unit, period };
}));
const next = { source: { name: 'Instituto Nacional de Carnes (INAC) · Sitio del Ganadero', url: homeUrl, updatedAt: new Date().toISOString().slice(0, 10), sourceUpdatedLabel }, indicators };
const current = JSON.parse(await readFile(dataPath, 'utf8'));
if (same({ ...current, source: { ...current.source, updatedAt: next.source.updatedAt } }, next)) console.log('INAC no publicó cambios en los indicadores seleccionados.');
else { await writeFile(dataPath, JSON.stringify(next, null, 2) + '\n'); console.log(`Mercados actualizados con INAC (${sourceUpdatedLabel}).`); }
