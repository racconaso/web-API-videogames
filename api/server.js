const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const IMAGES_DIR = path.join(__dirname, 'images');
const characters = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'characters.json'), 'utf8')
);

// Colores de la portada generada para cada franquicia
const THEMES = {
  FNAF: ['#2b0a3d', '#8e44ad'],
  Crash: ['#ff7a00', '#1e90ff'],
  GTA: ['#1b5e20', '#f9a825'],
  BENDY: ['#ffffff', '#000000'],
  MARIO: ['#ff0000', '#00ff15'],
  UNDERTALE: ['#ff0000', '#ffd900'],
  HIGHONLIFE: ['#5e98f0', '#f5ad5b'],
  MAXI_LORE: ['#000000', '#000000'],
  BOTTALES: ['#0004e4', '#ff2ca7'],
  RACCON_ADVENTURE: ['#01440f', '#929292']
};

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];
const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function send(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data, null, 2));
}

// Añade la URL de la imagen a cada personaje
function withImage(c) {
  return { ...c, image: `/images/${c.id}` };
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Portada SVG generada cuando no existe una imagen propia
function buildSvg(c) {
  const [from, to] = THEMES[c.franchise] || ['#333333', '#999999'];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <circle cx="200" cy="170" r="110" fill="rgba(255,255,255,0.15)"/>
  <text x="200" y="205" font-family="Arial, sans-serif" font-size="110" font-weight="bold" fill="#ffffff" text-anchor="middle">${escapeXml(c.initials)}</text>
  <text x="200" y="350" font-family="Arial, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle">${escapeXml(c.name)}</text>
</svg>`;
}

// Busca una imagen propia en /images/<id>.png|jpg|jpeg|webp
function findCustomImage(id) {
  for (const ext of IMAGE_EXTENSIONS) {
    const file = path.join(IMAGES_DIR, `${id}${ext}`);
    if (fs.existsSync(file)) return file;
  }
  return null;
}

function listCharacters(params) {
  let result = characters;

  const game = params.get('game');
  if (game) {
    const g = game.toLowerCase();
    result = result.filter(
      (c) => c.game.toLowerCase().includes(g) || c.franchise.toLowerCase() === g
    );
  }

  const q = params.get('q');
  if (q) {
    const term = q.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.tags.some((t) => t.includes(term))
    );
  }

  const page = Math.max(parseInt(params.get('page')) || 1, 1);
  const limit = Math.min(Math.max(parseInt(params.get('limit')) || 10, 1), 50);
  const start = (page - 1) * limit;

  return {
    total: result.length,
    page,
    limit,
    data: result.slice(start, start + limit).map(withImage),
  };
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET') {
    return send(res, 405, { error: 'Método no permitido. Usa GET.' });
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const parts = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean);

  // GET /
  if (parts.length === 0) {
    return send(res, 200, {
      name: 'API de imágenes de personajes de videojuegos',
      endpoints: [
        'GET /api/characters',
        'GET /api/characters/random',
        'GET /api/characters/:id',
        'GET /api/games',
        'GET /images/:id',
      ],
    });
  }

  // GET /images/:id  (imagen propia o portada generada)
  if (parts[0] === 'images' && parts.length === 2) {
    const id = parseInt(parts[1]);
    const character = characters.find((c) => c.id === id);
    if (!character) {
      return send(res, 404, { error: `No existe un personaje con id ${parts[1]}` });
    }

    const custom = findCustomImage(id);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');

    if (custom) {
      const ext = path.extname(custom).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] });
      return fs.createReadStream(custom).pipe(res);
    }

    res.writeHead(200, { 'Content-Type': MIME['.svg'] });
    return res.end(buildSvg(character));
  }

  if (parts[0] !== 'api') {
    return send(res, 404, { error: 'Ruta no encontrada' });
  }

  // GET /api/characters
  if (parts[1] === 'characters' && parts.length === 2) {
    return send(res, 200, listCharacters(url.searchParams));
  }

  // GET /api/characters/random
  if (parts[1] === 'characters' && parts[2] === 'random' && parts.length === 3) {
    const pick = characters[Math.floor(Math.random() * characters.length)];
    return send(res, 200, withImage(pick));
  }

  // GET /api/characters/:id
  if (parts[1] === 'characters' && parts.length === 3) {
    const id = parseInt(parts[2]);
    const character = characters.find((c) => c.id === id);
    if (!character) {
      return send(res, 404, { error: `No existe un personaje con id ${parts[2]}` });
    }
    return send(res, 200, withImage(character));
  }

  // GET /api/games
  if (parts[1] === 'games' && parts.length === 2) {
    const games = [...new Set(characters.map((c) => c.game))];
    return send(res, 200, { total: games.length, data: games });
  }

  return send(res, 404, { error: 'Ruta no encontrada' });
});

server.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
