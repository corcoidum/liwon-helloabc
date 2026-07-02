/**
 * Generates the PWA icons (self-made, no licensed assets) without any
 * image dependency: draws an "A" on an orange tile and encodes PNG by hand.
 */
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')
mkdirSync(outDir, { recursive: true })

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c
})

function crc32(buf) {
  let c = 0xffffffff
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const out = Buffer.alloc(8 + data.length + 4)
  out.writeUInt32BE(data.length, 0)
  out.write(type, 4, 'ascii')
  data.copy(out, 8)
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])), 8 + data.length)
  return out
}

function encodePng(width, height, rgba) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  const raw = Buffer.alloc(height * (1 + width * 4))
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0 // filter: none
    rgba.copy(raw, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4)
  }
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const lenSq = dx * dx + dy * dy
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq))
  const cx = x1 + t * dx
  const cy = y1 + t * dy
  return Math.hypot(px - cx, py - cy)
}

function drawIcon(size, { maskable }) {
  const rgba = Buffer.alloc(size * size * 4)
  const bg = [0xf9, 0x73, 0x16, 0xff] // #F97316
  const fg = [0xff, 0xff, 0xff, 0xff]
  const radius = maskable ? 0 : size * 0.2
  const scale = maskable ? 0.72 : 1 // keep glyph inside the maskable safe zone
  const cx = size / 2
  const cy = size / 2
  const segs = [
    // "A": two diagonals and a crossbar, in unit coords
    [0.3, 0.78, 0.5, 0.2],
    [0.5, 0.2, 0.7, 0.78],
    [0.38, 0.57, 0.62, 0.57],
  ].map(([x1, y1, x2, y2]) => [
    cx + (x1 - 0.5) * size * scale,
    cy + (y1 - 0.5) * size * scale,
    cx + (x2 - 0.5) * size * scale,
    cy + (y2 - 0.5) * size * scale,
  ])
  const stroke = size * 0.055 * scale

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      // rounded-rect background test
      const qx = Math.max(Math.abs(x - cx) - (size / 2 - radius), 0)
      const qy = Math.max(Math.abs(y - cy) - (size / 2 - radius), 0)
      const inside = Math.hypot(qx, qy) <= radius || radius === 0
      if (!inside) continue
      let color = bg
      for (const [x1, y1, x2, y2] of segs) {
        if (distToSegment(x, y, x1, y1, x2, y2) <= stroke) {
          color = fg
          break
        }
      }
      rgba[i] = color[0]
      rgba[i + 1] = color[1]
      rgba[i + 2] = color[2]
      rgba[i + 3] = color[3]
    }
  }
  return encodePng(size, size, rgba)
}

writeFileSync(join(outDir, 'icon-192.png'), drawIcon(192, { maskable: false }))
writeFileSync(join(outDir, 'icon-512.png'), drawIcon(512, { maskable: false }))
writeFileSync(join(outDir, 'icon-maskable-512.png'), drawIcon(512, { maskable: true }))
console.log('Icons written to', outDir)
