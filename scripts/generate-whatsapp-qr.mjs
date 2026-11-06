// Generates public/marca/qr-whatsapp.svg (QR code that opens the WhatsApp chat). Run it again only if the
// number or the message changes: `node scripts/generate-whatsapp-qr.mjs`. No dependencies: in-house QR
// encoder (byte mode, error correction M), adapted from the qrcodegen reference algorithm:
//
//   QR Code generator library. Copyright (c) Project Nayuki. (MIT License)
//   https://www.nayuki.io/page/qr-code-generator-library
//   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
//   associated documentation files (the "Software"), to deal in the Software without restriction, including
//   without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//   copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
//   following conditions: The above copyright notice and this permission notice shall be included in all
//   copies or substantial portions of the Software. The Software is provided "as is", without warranty of any
//   kind, express or implied, including but not limited to the warranties of merchantability, fitness for a
//   particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for
//   any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from,
//   out of or in connection with the Software or the use or other dealings in the Software.
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { whatsappLink } from "../src/contact.js";

const ECC_PER_BLOCK_M = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28];
const BLOCKS_M = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49];
const FORMAT_M = 0;

const bit = (x, i) => ((x >>> i) & 1) !== 0;

function mul(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

export function divisorRS(degree) {
  const r = new Array(degree).fill(0);
  r[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < r.length; j++) {
      r[j] = mul(r[j], root);
      if (j + 1 < r.length) r[j] ^= r[j + 1];
    }
    root = mul(root, 0x02);
  }
  return r;
}

export function restoRS(data, divisor) {
  const r = divisor.map(() => 0);
  for (const b of data) {
    const factor = b ^ r.shift();
    r.push(0);
    divisor.forEach((c, i) => (r[i] ^= mul(c, factor)));
  }
  return r;
}

function rawModules(v) {
  let r = (16 * v + 128) * v + 64;
  if (v >= 2) {
    const n = Math.floor(v / 7) + 2;
    r -= (25 * n - 10) * n - 55;
    if (v >= 7) r -= 36;
  }
  return r;
}

const dataCodewords = (v) => Math.floor(rawModules(v) / 8) - ECC_PER_BLOCK_M[v] * BLOCKS_M[v];

function alignmentPositions(v) {
  if (v === 1) return [];
  const n = Math.floor(v / 7) + 2;
  const step = Math.floor((v * 8 + n * 3 + 5) / (n * 4 - 4)) * 2;
  const r = [6];
  for (let p = v * 4 + 17 - 7; r.length < n; p -= step) r.splice(1, 0, p);
  return r;
}

export function bitsDeFormato(mask) {
  const value = (FORMAT_M << 3) | mask;
  let rem = value;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  return ((value << 10) | rem) ^ 0x5412;
}

export function codificar(text) {
  const bytes = [...new TextEncoder().encode(text)];
  let v = 1;
  for (; v <= 40; v++) {
    const countBits = v <= 9 ? 8 : 16;
    if (4 + countBits + bytes.length * 8 <= dataCodewords(v) * 8) break;
  }
  if (v > 40) throw new Error("texto longo demais");
  const capacity = dataCodewords(v) * 8;

  const bits = [];
  const put = (value, n) => {
    for (let i = n - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  put(0b0100, 4);
  put(bytes.length, v <= 9 ? 8 : 16);
  bytes.forEach((b) => put(b, 8));
  put(0, Math.min(4, capacity - bits.length));
  put(0, (8 - (bits.length % 8)) % 8);
  for (let p = 0xec; bits.length < capacity; p ^= 0xec ^ 0x11) put(p, 8);
  const data = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));

  // error-corrected blocks, interleaved
  const numBlocks = BLOCKS_M[v];
  const eccLen = ECC_PER_BLOCK_M[v];
  const rawCodewords = Math.floor(rawModules(v) / 8);
  const numShort = numBlocks - (rawCodewords % numBlocks);
  const shortLen = Math.floor(rawCodewords / numBlocks);
  const div = divisorRS(eccLen);
  const blocks = [];
  for (let i = 0, k = 0; i < numBlocks; i++) {
    const d = data.slice(k, k + shortLen - eccLen + (i < numShort ? 0 : 1));
    k += d.length;
    const ecc = restoRS(d, div);
    if (i < numShort) d.push(0);
    blocks.push(d.concat(ecc));
  }
  const codewords = [];
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((b, j) => {
      if (i !== shortLen - eccLen || j >= numShort) codewords.push(b[i]);
    });
  }

  const n = v * 4 + 17;
  const mod = Array.from({ length: n }, () => new Array(n).fill(false));
  const fun = Array.from({ length: n }, () => new Array(n).fill(false));
  const setFunction = (x, y, dark) => {
    mod[y][x] = dark;
    fun[y][x] = true;
  };

  for (let i = 0; i < n; i++) {
    setFunction(6, i, i % 2 === 0);
    setFunction(i, 6, i % 2 === 0);
  }
  for (const [cx, cy] of [[3, 3], [n - 4, 3], [3, n - 4]]) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < n && y >= 0 && y < n) setFunction(x, y, d !== 2 && d !== 4);
      }
    }
  }
  const al = alignmentPositions(v);
  al.forEach((ax, i) =>
    al.forEach((ay, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === al.length - 1) || (i === al.length - 1 && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setFunction(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    })
  );
  const drawFormat = (mask) => {
    const b = bitsDeFormato(mask);
    for (let i = 0; i <= 5; i++) setFunction(8, i, bit(b, i));
    setFunction(8, 7, bit(b, 6));
    setFunction(8, 8, bit(b, 7));
    setFunction(7, 8, bit(b, 8));
    for (let i = 9; i < 15; i++) setFunction(14 - i, 8, bit(b, i));
    for (let i = 0; i < 8; i++) setFunction(n - 1 - i, 8, bit(b, i));
    for (let i = 8; i < 15; i++) setFunction(8, n - 15 + i, bit(b, i));
    setFunction(8, n - 8, true);
  };
  drawFormat(0);
  if (v >= 7) {
    let rem = v;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const b = (v << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const a = n - 11 + (i % 3);
      const c = Math.floor(i / 3);
      setFunction(a, c, bit(b, i));
      setFunction(c, a, bit(b, i));
    }
  }

  // data in zigzag, bottom to top, two columns at a time
  let k = 0;
  for (let dir = n - 1; dir >= 1; dir -= 2) {
    if (dir === 6) dir = 5;
    for (let vert = 0; vert < n; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = dir - j;
        const upward = ((dir + 1) & 2) === 0;
        const y = upward ? n - 1 - vert : vert;
        if (!fun[y][x] && k < codewords.length * 8) {
          mod[y][x] = bit(codewords[k >>> 3], 7 - (k & 7));
          k++;
        }
      }
    }
  }

  const maskBit = (m, x, y) =>
    [
      (x + y) % 2 === 0,
      y % 2 === 0,
      x % 3 === 0,
      (x + y) % 3 === 0,
      (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
      ((x * y) % 2) + ((x * y) % 3) === 0,
      (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
      (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
    ][m];
  const applyMask = (m) => {
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!fun[y][x] && maskBit(m, x, y)) mod[y][x] = !mod[y][x];
  };
  const penalty = () => {
    let p = 0;
    const scanLines = (get) => {
      for (let a = 0; a < n; a++) {
        let run = 1;
        for (let b = 1; b <= n; b++) {
          if (b < n && get(a, b) === get(a, b - 1)) run++;
          else {
            if (run >= 5) p += 3 + run - 5;
            run = 1;
          }
        }
        for (let b = 0; b + 11 <= n; b++) {
          const s = Array.from({ length: 11 }, (_, i) => (get(a, b + i) ? 1 : 0)).join("");
          if (s === "10111010000" || s === "00001011101") p += 40;
        }
      }
    };
    scanLines((a, b) => mod[a][b]);
    scanLines((a, b) => mod[b][a]);
    for (let y = 0; y < n - 1; y++)
      for (let x = 0; x < n - 1; x++) {
        const c = mod[y][x];
        if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) p += 3;
      }
    const darkCount = mod.flat().filter(Boolean).length;
    p += (Math.ceil(Math.abs(darkCount * 20 - n * n * 10) / (n * n)) - 1) * 10;
    return p;
  };
  let best = 0;
  let lowest = Infinity;
  for (let m = 0; m < 8; m++) {
    applyMask(m);
    drawFormat(m);
    const p = penalty();
    if (p < lowest) {
      lowest = p;
      best = m;
    }
    applyMask(m);
  }
  applyMask(best);
  drawFormat(best);
  return { version: v, mask: best, modules: mod, data, codewords };
}

export function svg(modules, border = 4) {
  const n = modules.length;
  const side = n + border * 2;
  let d = "";
  modules.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (dark) d += `M${x + border},${y + border}h1v1h-1z`;
    })
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}" shape-rendering="crispEdges"><rect width="${side}" height="${side}" fill="#fff"/><path fill="#17211b" d="${d}"/></svg>\n`;
}

// Run directly (not imported by the test): writes the file.
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const link = whatsappLink("Olá! Gostaria de solicitar um orçamento.");
  const qr = codificar(link);
  writeFileSync(new URL("../public/marca/qr-whatsapp.svg", import.meta.url), svg(qr.modules));
  console.log(`QR version ${qr.version}, mask ${qr.mask}, ${link.length} characters: ${link}`);
}
