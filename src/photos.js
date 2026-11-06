// Image path helpers for the site photos (files in public/fotos/otim/).

export const photoPath = (f) => `/fotos/otim/${f.file}.webp`;

// Smaller versions (480 and 960 px wide, generated next to the original at public/fotos/otim/<file>-<w>.webp)
// so the browser downloads only the size it will show. Use together with a "sizes" that states the displayed width.
export const srcset = (f) =>
  [...[480, 960].filter((w) => w < f.w).map((w) => `/fotos/otim/${f.file}-${w}.webp ${w}w`), `${photoPath(f)} ${f.w}w`].join(", ");

// Short caption with the correct license of each photo; the full sentence ("não são trabalhos da RD", not RD's work) appears once on the home page and on /creditos.
export const photoNotice = (f) => `Imagem ilustrativa (${f.license}).`;
