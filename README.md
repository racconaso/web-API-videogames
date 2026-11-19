# Personajes de videojuegos: API de imágenes + web

Proyecto con dos partes, inspirado en la estructura de `crypto-app`:

- **`api/`**: API REST en Node.js (sin dependencias) que sirve personajes y sus imágenes.
- **`web/`**: aplicación React + Vite con lista, filtros, detalle, "Acerca de" y página 404.

## 1. Levantar la API

```bash
cd api
node server.js
```

Corre en `http://localhost:3000`.

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/characters` | Lista de personajes. Parámetros: `game`, `q`, `page`, `limit` (1-50, por defecto 10) |
| GET | `/api/characters/random` | Un personaje al azar |
| GET | `/api/characters/:id` | Detalle de un personaje |
| GET | `/api/games` | Juegos disponibles |
| GET | `/images/:id` | Imagen del personaje (SVG generado o imagen propia) |

Cada personaje incluye un campo `image` con la ruta relativa a su imagen, por ejemplo `"image": "/images/1"`.

### Imágenes propias

Si quieres usar tus propias imágenes, colócalas en `api/images/` con el id del personaje como nombre:

```
api/images/1.png     -> Freddy Fazbear
api/images/9.jpg     -> Carl "CJ" Johnson
```

Formatos aceptados: `.png`, `.jpg`, `.jpeg`, `.webp`. Si no hay imagen propia, la API genera una portada SVG con los colores de la franquicia.

## 2. Levantar la web

Necesitas Node.js 20 o superior.

```bash
cd web
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173`).

Si la API corre en otra dirección, crea `web/.env`:

```
VITE_API_URL=http://localhost:3000
```

Para producción:

```bash
npm run build
npm run preview
```

## Ejemplos con curl

```bash
curl "http://localhost:3000/api/characters?game=crash&limit=2"
curl "http://localhost:3000/api/characters?q=villain"
curl http://localhost:3000/api/characters/9
curl -o cj.svg http://localhost:3000/images/9
```

## Estructura

```
api/
  server.js          Servidor HTTP, rutas e imágenes
  characters.json    Datos de los personajes
  images/            Imágenes propias opcionales (<id>.png, etc.)
  package.json
web/
  src/
    App.jsx          Rutas y estado (filtros, límite, juego)
    main.jsx
    config.js        URL de la API
    components/      Header, CharacterCard, FilterInput
    pages/           home, character-details, about, not-found
  index.html
  vite.config.js
  package.json
```

## Nota sobre las imágenes

Las portadas generadas son ilustraciones propias y no contienen arte oficial de los juegos. Si quieres usar imágenes de los personajes, asegúrate de tener los derechos de uso correspondientes.
