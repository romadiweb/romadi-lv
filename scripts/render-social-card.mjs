import sharp from 'sharp';
import { Buffer } from 'node:buffer';

const width = 1200;
const height = 630;

const background = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="wine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#650b24"/>
        <stop offset="0.48" stop-color="#180609"/>
        <stop offset="1" stop-color="#050505"/>
      </linearGradient>
      <radialGradient id="glow" cx="16%" cy="12%" r="76%">
        <stop offset="0" stop-color="#e0234e" stop-opacity=".32"/>
        <stop offset="1" stop-color="#e0234e" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#wine)"/>
    <rect width="1200" height="630" fill="url(#glow)"/>
    <path d="M0 1h1200M0 629h1200" stroke="#fff" stroke-opacity=".08"/>
    <text x="72" y="226" fill="#b5b5bb" font-family="Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="2">MĀJASLAPU VEIDNES</text>
    <text x="72" y="314" fill="#fff" font-family="Arial, sans-serif" font-size="64" font-weight="500" letter-spacing="-2">
      <tspan x="72">Labs sākums.</tspan>
      <tspan x="72" dy="70">Jūsu zīmola</tspan>
      <tspan x="72" dy="70">turpinājums.</tspan>
    </text>
    <text x="72" y="568" fill="#b5b5bb" font-family="Arial, sans-serif" font-size="18">romadi.lv</text>
  </svg>
`);

const defaultBackground = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="wine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#650b24"/>
        <stop offset="0.52" stop-color="#180609"/>
        <stop offset="1" stop-color="#050505"/>
      </linearGradient>
      <radialGradient id="glow" cx="78%" cy="38%" r="58%">
        <stop offset="0" stop-color="#e41648" stop-opacity=".36"/>
        <stop offset="1" stop-color="#e41648" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#wine)"/>
    <rect width="1200" height="630" fill="url(#glow)"/>
    <path d="M0 1h1200M0 629h1200" stroke="#fff" stroke-opacity=".08"/>
    <g fill="none" stroke-linecap="round">
      <path d="M700 532C790 420 738 250 846 151c74-68 176-71 292-31" stroke="#e0234e" stroke-width="58" stroke-opacity=".78"/>
      <path d="M746 573c92-101 62-252 165-339 66-56 148-59 246-30" stroke="#fff" stroke-width="2" stroke-opacity=".26"/>
      <path d="M658 493c69-115 16-231 113-342 61-70 151-102 273-94" stroke="#f75f7f" stroke-width="13" stroke-opacity=".42"/>
    </g>
    <text x="72" y="282" fill="#fff" font-family="Arial, sans-serif" font-size="64" font-weight="500" letter-spacing="-2">
      <tspan x="72">Digitāli risinājumi</tspan>
      <tspan x="72" dy="70">uzņēmuma</tspan>
      <tspan x="72" dy="70">izaugsmei.</tspan>
    </text>
    <text x="72" y="568" fill="#b5b5bb" font-family="Arial, sans-serif" font-size="18">Dizains · Izstrāde · Digitālā izaugsme</text>
  </svg>
`);

async function photoCard(path, cardWidth, cardHeight, rotation) {
  const mask = Buffer.from(
    `<svg width="${cardWidth}" height="${cardHeight}"><rect width="${cardWidth}" height="${cardHeight}" rx="18" fill="#fff"/></svg>`,
  );
  const cropped = await sharp(path)
    .resize(cardWidth, cardHeight, { fit: 'cover' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  return sharp(cropped)
    .rotate(rotation, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer({ resolveWithObject: true });
}

const [logo, atelier, miera, ezera] = await Promise.all([
  sharp('public/images/brand/romadi-logo-white.svg').resize({ width: 124 }).png().toBuffer(),
  photoCard('public/images/templates/atelier-majas/atelier-hero.webp', 256, 486, -7),
  photoCard('public/images/templates/miera-spa/miera-hero.webp', 256, 452, 0),
  photoCard('public/images/templates/ezera-nams/ezera-hero.webp', 256, 418, 7),
]);

await Promise.all([
  sharp(defaultBackground)
    .composite([{ input: logo, left: 72, top: 66 }])
    .png({ compressionLevel: 9, palette: true })
    .toFile('public/images/social/romadi-share-v2.png'),
  sharp(background)
    .composite([
      { input: logo, left: 72, top: 66 },
      { input: atelier.data, left: 664, top: 48 },
      { input: miera.data, left: 822, top: 92 },
      { input: ezera.data, left: 958, top: 126 },
    ])
    .png({ compressionLevel: 9, palette: true })
    .toFile('public/images/social/romadi-veidnes-share-v2.png'),
  sharp('public/images/templates/atelier-majas/atelier-hero.webp')
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile('public/images/social/atelier-majas-share-v2.jpg'),
  sharp('public/images/templates/miera-spa/miera-hero.webp')
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile('public/images/social/miera-spa-share-v2.jpg'),
  sharp('public/images/templates/ezera-nams/ezera-hero.webp')
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile('public/images/social/ezera-nams-share-v2.jpg'),
]);
