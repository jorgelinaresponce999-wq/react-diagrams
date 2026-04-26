# React Diagrams

Editor visual de diagramas construido con React, Vite, TypeScript y SCSS modules.

## Incluye

- canvas interactivo con drag, pan y zoom
- biblioteca de nodos para flow, network, architecture, sequence y systems
- conexiones entre nodos con varias direcciones y estilos de linea
- panel lateral para editar propiedades visuales y semanticas
- persistencia local, importacion/exportacion JSON y exportacion SVG

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Despliegue en Vercel

El repo incluye `vercel.json` con salida en `dist`.

```bash
npx vercel --prod
```

## Notas

- En este entorno no fue posible instalar dependencias desde npm por restricciones de red.
- El codigo del proyecto quedo migrado a TypeScript y organizado por componentes, hooks, tipos y utilidades.
