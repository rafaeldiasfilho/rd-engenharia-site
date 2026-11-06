# PRD: RD Engenharia website

Reverse-engineered from the code on 2026-11-06 (branch `grade-e-ingles`, commit 5deaa66). No code was changed to write it.
Items marked *(to confirm)* are AI readings of the code that the owner has not confirmed yet.

## 1. Overview

- **Goal:** bring work to RD Engenharia Segurança e Meio Ambiente (Ibirá/SP) by explaining its services in plain Portuguese and turning visitors into WhatsApp conversations. Production: https://rdibiraengenharia.com.br.
- **Areas:** Segurança do Trabalho, Corpo de Bombeiros (AVCB/CLCB), Engenharia Civil e Regularização, Meio Ambiente/Topografia/Imóvel Rural.
- **Users:**
  - *Visitors:* business owners, property owners and rural landowners in Ibirá and region who need a technical document and often do not know its name. Most come on a phone.
  - *RD team:* signed-in staff using `/admin` to track clients, services and expiry dates.
  - *Search engines and AI assistants:* read the prerendered HTML, `sitemap.xml`, JSON-LD and `llms.txt`.

### Features
| Feature | Where | What it does |
|---|---|---|
| Home page | `/` | Sections, document search, request builder, examples, FAQ, contact, office hours |
| Area pages | `/seguranca-do-trabalho`, `/corpo-de-bombeiros`, `/engenharia-civil`, `/meio-ambiente-topografia` | Services with anchors, situations, 3D scene, sample sheets, project photos |
| Guides | `/guias`, `/guias/<slug>` | Short plain-language articles |
| Wizard "O que preciso?" | `/o-que-preciso` | Profile → yes/no situations → list of likely documents → WhatsApp message |
| Expiry reminder | `/lembrete-de-vencimento` | Visitor leaves name, WhatsApp, document and month; saved to Supabase |
| Where we work | `/onde-atendemos` | City list (old `/cidades/*` URLs redirect here) |
| Legal and credits | `/privacidade`, `/termos-de-uso`, `/creditos` | Privacy notice, terms, photo credits |
| Print view | `/imprimir/<area>` | Printable summary of an area |
| Internal area | `/admin` | Login; expiry dashboard; clients; services; reminders sent from the site; CSV export |

## 2. Business rules (mandatory)

1. **WhatsApp is the only contact channel.** Forms only build a message and open `wa.me`. No phone line, contact e-mail or "track your case" feature. Exception: the reminder form saves a request to the database.
2. **No prices and no fixed deadlines** in any text. Standards are cited as of 2026, always with the note that the team confirms each case.
3. **Nothing invented:** no made-up company facts, clients, testimonials, numbers, photos or reviews. The Google rating is shown as text only, with no reviewer names and no AggregateRating markup.
4. **Example projects are anonymised** (no address, name or registration number) and watermarked "RD Engenharia – exemplo".
5. **Photos** are CC0 or public domain, listed in `src/photos.js` and credited on `/creditos`.
6. **Visitor-facing text is pt-BR** with correct accents and Brazilian date and number formats. **Code is English only.**
7. **Reminder consent:** a reminder row is accepted only with `consentimento = true` (enforced by RLS). The team sends WhatsApp reminders only to clients with `aceita_lembretes = true`; otherwise the dashboard button asks for permission first.
8. **Admin access** only for e-mails listed in the `equipe` table (`eh_equipe()` in RLS). Public sign-up is closed.
9. **Accessibility:** respects `prefers-reduced-motion` and forced colours; 44 px touch targets; keyboard use for search, wizard and photo viewer; meaning never carried by colour alone.
10. **Every page** has `title`, `description`, `h1` and an entry in `PAGES`, so the prerender can generate its HTML and its sitemap entry.

## 3. Unhappy paths and error handling

One line per failure: condition → behaviour (as the code does today).

### Public site
- JavaScript disabled or slow → the prerendered HTML already shows the full content and the links.
- Unknown URL → `404.html` with the "page not found" screen (`NotFound`).
- Search with no match, or fewer than 2 letters → no results; the last option is always "Perguntar no WhatsApp" with the typed text.
- Wizard with every answer "no" → the result screen offers a WhatsApp message saying nothing matched.
- Office-hours check fails (`Intl` time zone unsupported) → treated as "outside hours"; the prerendered HTML shows only the hours.
- WebGL unavailable or `prefers-reduced-motion` → the 3D scene shows a static frame instead of the animation.
- Analytics (`@vercel/analytics`) blocked or failing → ignored; WhatsApp links still work.
- Map embed → loaded only when the visitor asks for it.

### Reminder form (`/lembrete-de-vencimento`)
- Honeypot field `site` filled (bot) → silently does nothing.
- WhatsApp number with other than 10–13 digits (after adding 55 to 10–11 digits) → message "Confira o número do WhatsApp…", nothing sent.
- Name shorter than 2 characters → "Informe o seu nome."
- Consent box not ticked → "Marque a autorização…".
- Month or year missing → expiry sent as `null` (the month is optional).
- Supabase refuses the row (RLS, constraint, 4xx) or is down (5xx) or there is no network → the form stays filled, shows "Não foi possível enviar agora. Tente de novo ou chame a RD pelo WhatsApp." No retry. No alert to the team *(to confirm: is an alert wanted?)*.
- Success → "Pedido recebido" screen; the row waits in `/admin` as not handled (`tratado = false`).

### Internal area (`/admin`)
- No Supabase URL or key → "O banco de dados ainda não foi ligado…" screen.
- Wrong e-mail or password → "E-mail ou senha incorretos."
- Signed in but e-mail not in `equipe` → RLS returns no rows *(to confirm: there is no explicit "not authorised" message)*.
- Any list, save or delete fails → the Supabase error message is shown at the top; data is reloaded after each successful action.
- Deleting a client → its services are deleted too (`on delete cascade`; the demo mode does the same).
- Client without WhatsApp or phone → no WhatsApp link is built.
- Demo mode (`VITE_DEMO=1`, dev only) → data lives in `localStorage` (`rd_demo_*`); never active on the published site.

### Build and deploy
- A page missing `title`/`description`/`h1`, or a data key renamed → page prerenders wrong or goes blank on load. Guarded by `tests/pagesData.test.js`.
- Prerender error → `npm run build` fails and Vercel keeps the previous deployment *(to confirm on Vercel)*.
