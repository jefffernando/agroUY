# Actualización automática de mercados

La página `/mercados/` muestra dos referencias oficiales del **Sitio del Ganadero de INAC**:

- Precio de novillo en cuarta balanza, expresado en USD/kg.
- Faena semanal de bovinos, expresada en cabezas.

Cada dato conserva su período y enlace de origen. Son indicadores semanales, no cotizaciones en tiempo real ni recomendaciones de compra o venta.

## Funcionamiento

El workflow `Update official market indicators` se ejecuta todos los días a las 09:00 de Uruguay (12:00 UTC), aunque GitHub puede demorarlo. Consulta únicamente dos endpoints públicos de INAC. Antes de modificar el sitio valida el título, el formato del valor y el rango de fechas.

Si INAC no publicó cambios, no crea commits ni despliegues. Si hay un cambio válido, actualiza `src/data/markets.json`, ejecuta las validaciones del sitio, registra un commit del bot y despliega la nueva versión de Pages. Si la fuente no responde o cambia su formato, el workflow falla y conserva el último dato publicado.

## Operación

Se puede ejecutar manualmente desde GitHub: **Actions → Update official market indicators → Run workflow**. Revisar cada tanto que el workflow tenga permisos de lectura y escritura en **Settings → Actions → General → Workflow permissions**.

No agregar ACG ni otros proveedores al actualizador sin revisar expresamente sus condiciones de reutilización y atribución. El sitio debe mostrar siempre fuente, período y frecuencia; no convertir una referencia semanal en una cifra diaria.
