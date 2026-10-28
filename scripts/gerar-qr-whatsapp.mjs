// Gera public/marca/qr-whatsapp.svg (QR code que abre a conversa no WhatsApp). Rodar de novo só se o
// número ou a mensagem mudarem: `node scripts/gerar-qr-whatsapp.mjs`. Sem dependências: codificador QR
// próprio (modo byte, correção M), adaptado do algoritmo de referência qrcodegen:
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
import { zap } from "../src/contato.js";

const ECC_POR_BLOCO_M = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28];
const BLOCOS_M = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49];
const FORMATO_M = 0;

const bit = (x, i) => ((x >>> i) & 1) !== 0;

function mul(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

export function divisorRS(grau) {
  const r = new Array(grau).fill(0);
  r[grau - 1] = 1;
  let raiz = 1;
  for (let i = 0; i < grau; i++) {
    for (let j = 0; j < r.length; j++) {
      r[j] = mul(r[j], raiz);
      if (j + 1 < r.length) r[j] ^= r[j + 1];
    }
    raiz = mul(raiz, 0x02);
  }
  return r;
}

export function restoRS(dados, divisor) {
  const r = divisor.map(() => 0);
  for (const b of dados) {
    const fator = b ^ r.shift();
    r.push(0);
    divisor.forEach((c, i) => (r[i] ^= mul(c, fator)));
  }
  return r;
}

function modulosBrutos(v) {
  let r = (16 * v + 128) * v + 64;
  if (v >= 2) {
    const n = Math.floor(v / 7) + 2;
    r -= (25 * n - 10) * n - 55;
    if (v >= 7) r -= 36;
  }
  return r;
}

const palavrasDeDados = (v) => Math.floor(modulosBrutos(v) / 8) - ECC_POR_BLOCO_M[v] * BLOCOS_M[v];

function posicoesAlinhamento(v) {
  if (v === 1) return [];
  const n = Math.floor(v / 7) + 2;
  const passo = Math.floor((v * 8 + n * 3 + 5) / (n * 4 - 4)) * 2;
  const r = [6];
  for (let p = v * 4 + 17 - 7; r.length < n; p -= passo) r.splice(1, 0, p);
  return r;
}

export function bitsDeFormato(mascara) {
  const dado = (FORMATO_M << 3) | mascara;
  let rem = dado;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  return ((dado << 10) | rem) ^ 0x5412;
}

export function codificar(texto) {
  const bytes = [...new TextEncoder().encode(texto)];
  let v = 1;
  for (; v <= 40; v++) {
    const bitsContagem = v <= 9 ? 8 : 16;
    if (4 + bitsContagem + bytes.length * 8 <= palavrasDeDados(v) * 8) break;
  }
  if (v > 40) throw new Error("texto longo demais");
  const capacidade = palavrasDeDados(v) * 8;

  const bits = [];
  const poe = (valor, n) => {
    for (let i = n - 1; i >= 0; i--) bits.push((valor >>> i) & 1);
  };
  poe(0b0100, 4);
  poe(bytes.length, v <= 9 ? 8 : 16);
  bytes.forEach((b) => poe(b, 8));
  poe(0, Math.min(4, capacidade - bits.length));
  poe(0, (8 - (bits.length % 8)) % 8);
  for (let p = 0xec; bits.length < capacidade; p ^= 0xec ^ 0x11) poe(p, 8);
  const dados = [];
  for (let i = 0; i < bits.length; i += 8) dados.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));

  // blocos com correção de erro, intercalados
  const nBlocos = BLOCOS_M[v];
  const lenEcc = ECC_POR_BLOCO_M[v];
  const brutas = Math.floor(modulosBrutos(v) / 8);
  const curtos = nBlocos - (brutas % nBlocos);
  const lenCurto = Math.floor(brutas / nBlocos);
  const div = divisorRS(lenEcc);
  const blocos = [];
  for (let i = 0, k = 0; i < nBlocos; i++) {
    const d = dados.slice(k, k + lenCurto - lenEcc + (i < curtos ? 0 : 1));
    k += d.length;
    const ecc = restoRS(d, div);
    if (i < curtos) d.push(0);
    blocos.push(d.concat(ecc));
  }
  const palavras = [];
  for (let i = 0; i < blocos[0].length; i++) {
    blocos.forEach((b, j) => {
      if (i !== lenCurto - lenEcc || j >= curtos) palavras.push(b[i]);
    });
  }

  const n = v * 4 + 17;
  const mod = Array.from({ length: n }, () => new Array(n).fill(false));
  const fun = Array.from({ length: n }, () => new Array(n).fill(false));
  const fixa = (x, y, escuro) => {
    mod[y][x] = escuro;
    fun[y][x] = true;
  };

  for (let i = 0; i < n; i++) {
    fixa(6, i, i % 2 === 0);
    fixa(i, 6, i % 2 === 0);
  }
  for (const [cx, cy] of [[3, 3], [n - 4, 3], [3, n - 4]]) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < n && y >= 0 && y < n) fixa(x, y, d !== 2 && d !== 4);
      }
    }
  }
  const al = posicoesAlinhamento(v);
  al.forEach((ax, i) =>
    al.forEach((ay, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === al.length - 1) || (i === al.length - 1 && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) fixa(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    })
  );
  const formato = (mascara) => {
    const b = bitsDeFormato(mascara);
    for (let i = 0; i <= 5; i++) fixa(8, i, bit(b, i));
    fixa(8, 7, bit(b, 6));
    fixa(8, 8, bit(b, 7));
    fixa(7, 8, bit(b, 8));
    for (let i = 9; i < 15; i++) fixa(14 - i, 8, bit(b, i));
    for (let i = 0; i < 8; i++) fixa(n - 1 - i, 8, bit(b, i));
    for (let i = 8; i < 15; i++) fixa(8, n - 15 + i, bit(b, i));
    fixa(8, n - 8, true);
  };
  formato(0);
  if (v >= 7) {
    let rem = v;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const b = (v << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const a = n - 11 + (i % 3);
      const c = Math.floor(i / 3);
      fixa(a, c, bit(b, i));
      fixa(c, a, bit(b, i));
    }
  }

  // dados em zigue-zague, de baixo para cima, colunas de duas em duas
  let k = 0;
  for (let dir = n - 1; dir >= 1; dir -= 2) {
    if (dir === 6) dir = 5;
    for (let vert = 0; vert < n; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = dir - j;
        const sobe = ((dir + 1) & 2) === 0;
        const y = sobe ? n - 1 - vert : vert;
        if (!fun[y][x] && k < palavras.length * 8) {
          mod[y][x] = bit(palavras[k >>> 3], 7 - (k & 7));
          k++;
        }
      }
    }
  }

  const inverte = (m, x, y) =>
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
  const mascarar = (m) => {
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!fun[y][x] && inverte(m, x, y)) mod[y][x] = !mod[y][x];
  };
  const penalidade = () => {
    let p = 0;
    const linha = (get) => {
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
    linha((a, b) => mod[a][b]);
    linha((a, b) => mod[b][a]);
    for (let y = 0; y < n - 1; y++)
      for (let x = 0; x < n - 1; x++) {
        const c = mod[y][x];
        if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) p += 3;
      }
    const escuros = mod.flat().filter(Boolean).length;
    p += (Math.ceil(Math.abs(escuros * 20 - n * n * 10) / (n * n)) - 1) * 10;
    return p;
  };
  let melhor = 0;
  let menor = Infinity;
  for (let m = 0; m < 8; m++) {
    mascarar(m);
    formato(m);
    const p = penalidade();
    if (p < menor) {
      menor = p;
      melhor = m;
    }
    mascarar(m);
  }
  mascarar(melhor);
  formato(melhor);
  return { versao: v, mascara: melhor, modulos: mod, dados, palavras };
}

export function svg(modulos, borda = 4) {
  const n = modulos.length;
  const lado = n + borda * 2;
  let d = "";
  modulos.forEach((linha, y) =>
    linha.forEach((escuro, x) => {
      if (escuro) d += `M${x + borda},${y + borda}h1v1h-1z`;
    })
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" shape-rendering="crispEdges"><rect width="${lado}" height="${lado}" fill="#fff"/><path fill="#17211b" d="${d}"/></svg>\n`;
}

// Executado direto (não importado pelo teste): grava o arquivo.
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const link = zap("Olá! Gostaria de solicitar um orçamento.");
  const qr = codificar(link);
  writeFileSync(new URL("../public/marca/qr-whatsapp.svg", import.meta.url), svg(qr.modulos));
  console.log(`QR versão ${qr.versao}, máscara ${qr.mascara}, ${link.length} caracteres: ${link}`);
}
