import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple CRC32 implementation for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type);
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const typeAndData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([lenBuf, typeAndData, crcBuf]);
}

function generatePng(width, height) {
  // Signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8 bits per channel
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // Deflate
  ihdr.writeUInt8(0, 11); // Filter method
  ihdr.writeUInt8(0, 12); // No interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // Scanlines with filter byte 0
  const rowBytes = width * 4;
  const rawData = Buffer.alloc(height * (1 + rowBytes));

  const radius = Math.floor(width * 0.22); // Rounded corner radius

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + rowBytes);
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      // Check rounded rect corner clipping
      let inside = true;
      const cornerX = x < radius ? radius - x : x >= width - radius ? x - (width - 1 - radius) : 0;
      const cornerY = y < radius ? radius - y : y >= height - radius ? y - (height - 1 - radius) : 0;
      if (cornerX > 0 && cornerY > 0) {
        if (cornerX * cornerX + cornerY * cornerY > radius * radius) {
          inside = false;
        }
      }

      if (!inside) {
        rawData[pixelOffset + 0] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0; // transparent
        continue;
      }

      // Vertical Gradient from Blue-700 (#1d4ed8: 29, 78, 216) to Blue-500 (#3b82f6: 59, 130, 246)
      const t = y / height;
      let r = Math.round(29 * (1 - t) + 59 * t);
      let g = Math.round(78 * (1 - t) + 130 * t);
      let b = Math.round(216 * (1 - t) + 246 * t);
      let a = 255;

      // Draw stylized white letter 'A' and 'B' in center
      // Normalize coordinate: nx in [0, 1], ny in [0, 1]
      const nx = x / width;
      const ny = y / height;

      // Central white icon area: Monogram 'AB' stylized glyphs
      // Letter 'A' on left (nx: 0.22 - 0.48), Letter 'B' on right (nx: 0.52 - 0.78), ny in [0.28, 0.72]
      let isGlyph = false;

      // Glyph 'A'
      if (ny >= 0.28 && ny <= 0.72 && nx >= 0.20 && nx <= 0.48) {
        const ax = (nx - 0.20) / 0.28; // 0 to 1
        const ay = (ny - 0.28) / 0.44; // 0 to 1
        const leftLeg = Math.abs(ax - (0.5 - 0.4 * ay)) < 0.08;
        const rightLeg = Math.abs(ax - (0.5 + 0.4 * ay)) < 0.08;
        const bar = ay >= 0.58 && ay <= 0.68 && ax >= 0.22 && ax <= 0.78;
        if (leftLeg || rightLeg || bar) isGlyph = true;
      }

      // Glyph 'B'
      if (ny >= 0.28 && ny <= 0.72 && nx >= 0.52 && nx <= 0.80) {
        const bx = (nx - 0.52) / 0.28; // 0 to 1
        const by = (ny - 0.28) / 0.44; // 0 to 1
        const spine = bx >= 0.1 && bx <= 0.26;
        const topBar = by >= 0.0 && by <= 0.15 && bx <= 0.75;
        const midBar = by >= 0.43 && by <= 0.57 && bx <= 0.75;
        const botBar = by >= 0.85 && by <= 1.0 && bx <= 0.75;
        const topLoop = bx >= 0.65 && bx <= 0.85 && by >= 0.05 && by <= 0.5;
        const botLoop = bx >= 0.65 && bx <= 0.88 && by >= 0.48 && by <= 0.95;
        if (spine || topBar || midBar || botBar || topLoop || botLoop) isGlyph = true;
      }

      // Bottom badge / underline: vibrant emerald / amber dot for rupee / billing
      if (ny >= 0.77 && ny <= 0.82 && nx >= 0.25 && nx <= 0.75) {
        r = 16; g = 185; b = 129; // emerald-500
      }

      if (isGlyph) {
        r = 255;
        g = 255;
        b = 255;
      }

      rawData[pixelOffset + 0] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // IDAT
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), generatePng(192, 192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), generatePng(512, 512));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180));
console.log('PNG icons generated successfully in public/');
