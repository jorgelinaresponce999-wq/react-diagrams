# React Diagrams

Editor visual para crear diagramas de red, flujo y arquitectura con una estetica premium blanca.

## Incluye

- plantillas base para `network`, `flow` y `architecture`
- nodos arrastrables
- conexiones visuales entre nodos
- panel lateral para editar propiedades
- interfaz limpia tipo white premium workspace

## Como verlo en tu PC

### Opcion 1: servidor rapido con Python

```bash
git clone https://github.com/jorgelinaresponce999-wq/react-diagrams.git
cd react-diagrams
python -m http.server 4173
```

Luego abre:

```bash
http://localhost:4173
```

### Opcion 2: con Node

```bash
git clone https://github.com/jorgelinaresponce999-wq/react-diagrams.git
cd react-diagrams
npx serve .
```

## Nota tecnica

Este proyecto usa React por modulos ESM desde CDN para evitar depender de instalacion local de paquetes. Para abrirlo bien, debes servirlo con un servidor local y no abrir `index.html` directo con doble clic.
