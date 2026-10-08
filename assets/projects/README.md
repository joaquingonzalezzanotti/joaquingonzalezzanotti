## Imágenes de proyectos

Cada proyecto guarda su portada en `assets/projects/<slug>/`. Para sumar o editar una card:

1. Agregá una portada optimizada, preferentemente `cover.webp`.
2. Actualizá el proyecto en `assets/data/projects.json`.
3. Ejecutá `node scripts/render-projects.mjs` para regenerar las páginas ES/EN.

El carrusel muestra tres cards en desktop, dos en tablet y una en mobile. Las imágenes grandes de origen no deben usarse directamente en el HTML: generá primero una versión WebP optimizada.
