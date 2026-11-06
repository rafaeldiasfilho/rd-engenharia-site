// Google reviews link and rating text, and the map links of the office.

export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/RD+Engenharia+Seguran%C3%A7a+e+Meio+Ambiente/@-21.0824485,-49.2433844,1046m/data=!3m2!1e3!4b1!4m6!3m5!1s0x94bc3184084c66fb:0x9998e55c89839066!8m2!3d-21.0824485!4d-49.2433844!16s%2Fg%2F11fky31jy7";

// Company address and Google Maps links (the same Google listing used for the reviews).
export const DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=-21.0824485,-49.2433844";

export const MAP_EMBED_URL = "https://maps.google.com/maps?q=-21.0824485,-49.2433844&z=16&output=embed";

// Rating checked on the Google profile on 2026-10-20 and again on 2026-10-26. Update by hand; do not use AggregateRating markup.
export const GOOGLE_RATING = "5,0 no Google · 8 avaliações";

// Google reviews shown on the home page. Rafael authorized on 2026-10-26 publishing the texts
// and first names. Rules: text EXACTLY as it is on Google (no editing or summarizing), first name
// only, only reviews that have text. No Review/AggregateRating markup in the JSON-LD.
// Format: { nome: "First name", texto: "Text as it appears on Google", estrelas: 5 }
export const REVIEWS = [];
