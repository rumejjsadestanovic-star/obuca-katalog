/* KORAK — logika kataloga. Podaci dolaze iz proizvodi.js (window.KORAK_PROIZVODI). */
(function () {
  "use strict";

  const CFG = Object.assign({ imeProdavnice: "Korak", valuta: "€", primjerPodataka: false, prikaziCijene: true, kontakt: "", telefon: "" }, window.KORAK_PODESAVANJA || {});
  const CIJENE = CFG.prikaziCijene !== false;   // false: bez cijena, sniženja, filtera i sortiranja po cijeni
  const PRODUCTS = (window.KORAK_PROIZVODI || []).slice();
  const byId = new Map(PRODUCTS.map(p => [p.id, p]));
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const BASE_TITLE = document.title;

  /* ---------- pomoćne funkcije ---------- */
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = n => n == null ? "Cijena na upit" : `${Number(n).toLocaleString("sr-Latn", { maximumFractionDigits: 2 })} ${CFG.valuta}`;
  const plural = (n, one, few, many) => { const a = n % 10, b = n % 100; if (a === 1 && b !== 11) return one; if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few; return many; };
  const nModela = n => `${n} ${plural(n, "model", "modela", "modela")}`;
  const nBoja = n => `${n} ${plural(n, "boja", "boje", "boja")}`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem("korak:" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("korak:" + k, JSON.stringify(v)); } catch (e) { /* bez pamćenja */ } }
  };
  function rgb(hex) { let h = String(hex || "#888").replace("#", ""); if (h.length === 3) h = h.split("").map(c => c + c).join(""); const n = parseInt(h, 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function shade(hex, amt) {
    let [r, g, b] = rgb(hex); const t = amt < 0 ? 0 : 255, a = Math.abs(amt);
    r = Math.round(r + (t - r) * a); g = Math.round(g + (t - g) * a); b = Math.round(b + (t - b) * a);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  const luma = hex => { const [r, g, b] = rgb(hex); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
  const icon = {
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.8 3.9 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.4 0 5.7 3.3 4.5 6.7-1.7 4.7-9.2 9.3-9.2 9.3Z"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg>`
  };

  const COLOR_FAMILIES = [
    ["bijela", "Bijela", "#F2F1EC"], ["crna", "Crna", "#26262A"], ["siva", "Siva", "#8E9290"], ["bez", "Bež", "#D7C3A3"], ["smedja", "Smeđa", "#8A5A3A"],
    ["plava", "Plava", "#3D6FB0"], ["zelena", "Zelena", "#4E7D5B"], ["crvena", "Crvena", "#C2453A"], ["roza", "Roza", "#E7A1B5"], ["zuta", "Žuta", "#E9C54A"]
  ];
  const FAMILY_LABEL = Object.fromEntries(COLOR_FAMILIES.map(([k, l]) => [k, l]));
  const CATEGORY_ORDER = ["Patike", "Čizme", "Cipele", "Sandale", "Štikle", "Papuče"];
  const POL_ORDER = ["Žensko", "Muško", "Unisex", "Djeca"];
  const SIZE_TABLE = [
    [35, 2.5, 5, 3.5, 22], [36, 3.5, 6, 4.5, 22.5], [37, 4, 6.5, 5, 23], [38, 5, 7.5, 6, 24], [39, 6, 8.5, 6.5, 24.5], [40, 6.5, 9, 7, 25],
    [41, 7.5, 10, 8, 26], [42, 8, 10.5, 8.5, 26.5], [43, 9, 11.5, 9.5, 27.5], [44, 9.5, 12, 10, 28], [45, 10.5, 13, 11, 29], [46, 11, 13.5, 12, 29.5]
  ];

  const newestDate = PRODUCTS.reduce((m, p) => p.datum > m ? p.datum : m, "0000");
  const NEW_DAYS = 14;
  const newCutoff = (() => { const d = new Date(newestDate + "T00:00:00"); d.setDate(d.getDate() - NEW_DAYS); return d.toISOString().slice(0, 10); })();
  const isNew = p => p.datum >= newCutoff;
  const discount = p => CIJENE && p.staraCijena && p.cijena ? Math.round((1 - p.cijena / p.staraCijena) * 100) : 0;
  const prices = PRODUCTS.map(p => p.cijena).filter(n => n != null);
  const PRICE_MIN = Math.floor(Math.min(...prices) / 5) * 5, PRICE_MAX = Math.ceil(Math.max(...prices) / 5) * 5;
  const ALL_SIZES = Array.from(new Set(PRODUCTS.flatMap(p => p.velicine))).sort((a, b) => a - b);
  const BRANDS = Array.from(new Set(PRODUCTS.map(p => p.marka))).sort((a, b) => a.localeCompare(b, "sr"));
  const CATS = CATEGORY_ORDER.filter(c => PRODUCTS.some(p => p.kategorija === c)).concat(Array.from(new Set(PRODUCTS.map(p => p.kategorija))).filter(c => !CATEGORY_ORDER.includes(c)));
  const POLS = POL_ORDER.filter(x => PRODUCTS.some(p => p.pol === x));

  /* ---------- prikazi obuće (zamjena za fotografije dok ih nema) ---------- */
  let uid = 0;
  const SHAPES = {
    patika: k => `
      <path d="M44 210C42 230 58 236 86 236H332C358 236 368 224 364 210Z" fill="${k.d2}"/>
      <path d="M46 194 358 198C366 203 367 212 363 214H46Z" fill="${k.s}"/>
      <path d="M62 206 350 208" stroke="${k.d2}" stroke-width="1.5" opacity=".45"/>
      <path d="M54 198C52 172 55 146 64 130 72 118 90 113 110 117L146 126C158 132 168 140 182 146 214 154 262 160 300 166 334 172 356 182 362 200Z" fill="${k.u}"/>
      <path d="M54 198C52 174 55 150 62 136 76 146 84 170 88 198Z" fill="${k.d1}"/>
      <path d="M302 166C334 172 356 182 362 200H322C318 186 312 174 302 166Z" fill="${k.d1}" opacity=".55"/>
      <path d="M138 124C148 106 168 103 178 112L188 148 154 138Z" fill="${k.d1}"/>
      <path d="M98 186C150 164 236 162 324 188" stroke="${k.c3}" stroke-width="9" stroke-linecap="round" fill="none"/>
      <path d="M90 196 356 199" stroke="${k.st}" stroke-width="1.4" stroke-dasharray="3 4" opacity=".6"/>
      <path d="M70 140C80 152 86 172 88 194" stroke="${k.st}" stroke-width="1.4" stroke-dasharray="3 4" opacity=".6" fill="none"/>
      <g fill="${k.eye}"><circle cx="150" cy="131" r="3"/><circle cx="168" cy="139" r="3"/><circle cx="187" cy="147" r="3"/><circle cx="206" cy="153" r="3"/></g>
      <g stroke="${k.lace}" stroke-width="4" stroke-linecap="round"><path d="M148 133 172 137"/><path d="M166 141 190 145"/><path d="M185 149 208 152"/><path d="M152 129C140 116 130 122 140 130"/></g>
      <path d="M64 130C84 138 110 136 128 124" stroke="${k.d1}" stroke-width="7" stroke-linecap="round" fill="none"/>
      <path d="M72 132C92 124 122 126 150 136 190 150 250 160 304 168" stroke="#fff" stroke-width="3" opacity=".28" fill="none" stroke-linecap="round"/>`,
    cizma: k => `
      <path d="M58 212H360C367 220 365 234 350 234H64C55 234 52 222 58 212Z" fill="${k.d2}"/>
      <path d="M58 212H122V234H64C55 234 52 222 58 212Z" fill="${shade(k.c2, -0.38)}"/>
      <path d="M66 214 70 52C70 44 76 40 84 40H150C158 40 162 46 162 54L164 140C200 150 270 158 310 166 340 172 360 188 362 214Z" fill="${k.u}"/>
      <path d="M118 66C134 98 142 130 148 158L170 156C162 120 156 92 150 60Z" fill="${k.c3}"/>
      <path d="M118 66C134 98 142 130 148 158" stroke="${k.st}" stroke-width="1.4" stroke-dasharray="3 4" fill="none" opacity=".7"/>
      <rect x="72" y="24" width="18" height="32" rx="4" fill="${k.c3}"/>
      <path d="M66 210H360" stroke="${k.s}" stroke-width="3" stroke-dasharray="6 5"/>
      <path d="M280 160C318 166 352 180 362 212H330C326 190 304 172 280 160Z" fill="${k.d1}" opacity=".5"/>
      <path d="M76 52 80 200" stroke="#fff" stroke-width="3" opacity=".22" stroke-linecap="round"/>
      <path d="M170 146C220 156 280 162 320 170" stroke="#fff" stroke-width="3" opacity=".25" fill="none" stroke-linecap="round"/>`,
    cipela: k => `
      <path d="M54 214H360C366 222 362 232 348 232H60C52 232 50 222 54 214Z" fill="${k.d2}"/>
      <path d="M54 214H106V232H60C52 232 50 222 54 214Z" fill="${shade(k.c2, -0.38)}"/>
      <path d="M58 214C56 186 60 160 74 150 96 140 130 142 160 146 220 152 290 160 330 172 352 180 362 196 360 214Z" fill="${k.u}"/>
      <path d="M86 152C112 142 150 142 196 152 160 162 112 164 86 152Z" fill="${shade(k.c1, -0.5)}"/>
      <path d="M190 152C220 156 240 160 254 164L248 184C226 178 206 174 184 172Z" fill="${k.c3}"/>
      <path d="M216 160C262 168 302 178 334 196" stroke="${k.st}" stroke-width="1.5" stroke-dasharray="3 4" fill="none" opacity=".7"/>
      <path d="M58 214C56 190 58 170 66 158 74 170 78 196 80 214Z" fill="${k.d1}"/>
      <path d="M62 212 358 212" stroke="${k.st}" stroke-width="1.4" stroke-dasharray="3 4" opacity=".55"/>
      <path d="M120 150C170 148 240 156 300 168" stroke="#fff" stroke-width="3" opacity=".3" fill="none" stroke-linecap="round"/>`,
    sandala: k => `
      <path d="M50 210C46 228 62 232 90 232H330C356 232 366 222 362 210Z" fill="${k.d2}"/>
      <path d="M52 198 360 202C366 206 364 212 360 212H52Z" fill="${k.s}"/>
      <path d="M106 202C114 156 162 146 180 202H160C152 172 128 172 122 202Z" fill="${k.u}"/>
      <path d="M216 202C232 156 292 152 314 204H292C282 176 250 174 236 202Z" fill="${k.u}"/>
      <path d="M58 202C56 168 70 148 94 148L98 162C80 166 74 182 76 202Z" fill="${k.c3}"/>
      <circle cx="96" cy="156" r="5" fill="${k.s}"/>
      <path d="M112 196C120 166 156 160 172 194M222 196C238 166 286 164 306 198" stroke="${k.st}" stroke-width="1.4" stroke-dasharray="3 4" fill="none" opacity=".65"/>`,
    papuca: k => `
      <path d="M48 208C44 226 60 232 90 232H334C358 232 368 222 362 208Z" fill="${k.d2}"/>
      <path d="M50 196 362 198C368 202 366 210 362 210H50Z" fill="${k.s}"/>
      <path d="M164 200C172 136 292 128 342 196V202Z" fill="${k.u}"/>
      <path d="M188 186C220 150 290 148 324 186" stroke="${k.c3}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M176 196C184 160 270 146 330 194" stroke="${k.st}" stroke-width="1.4" stroke-dasharray="3 4" fill="none" opacity=".6"/>
      <path d="M200 160C230 144 280 146 310 166" stroke="#fff" stroke-width="3" opacity=".28" fill="none" stroke-linecap="round"/>`,
    stikla: k => `
      <path d="M76 136 96 140 90 236H82Z" fill="${k.d2}"/>
      <path d="M70 128C110 146 150 186 200 210 240 228 300 230 350 228 362 227 364 220 356 216 300 216 250 212 214 196 170 174 130 138 74 116Z" fill="${k.s}"/>
      <path d="M70 118C68 106 80 98 94 102 130 114 160 144 196 168 236 192 300 198 340 204 358 208 364 214 356 218 300 220 250 214 212 198 168 178 128 148 72 132Z" fill="${k.u}"/>
      <path d="M94 106C122 116 152 140 172 158 142 150 112 134 90 120Z" fill="${shade(k.c1, -0.5)}"/>
      <path d="M120 120C150 136 176 160 206 178 246 196 300 200 340 206" stroke="#fff" stroke-width="3" opacity=".3" fill="none" stroke-linecap="round"/>`
  };
  function shoeSVG(p, v, view) {
    const id = "k" + (++uid);
    const c1 = v.hex, c2 = v.djonHex || "#E8E4DA", c3 = v.detaljHex || shade(c1, -0.3);
    const dark = luma(c1) < 0.25;
    const k = {
      c1, c2, c3, u: `url(#${id}u)`, s: `url(#${id}s)`,
      d1: shade(c1, dark ? 0.12 : -0.16), d2: shade(c2, -0.22),
      st: dark ? shade(c1, 0.35) : shade(c1, -0.45), eye: shade(c1, dark ? 0.3 : -0.45), lace: luma(c2) > 0.6 ? c2 : "#F4F2EC"
    };
    const draw = SHAPES[p.oblik] || SHAPES.patika;
    const body = draw(k);
    const defs = `<defs>
      <linearGradient id="${id}u" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c1, 0.16)}"/><stop offset=".55" stop-color="${c1}"/><stop offset="1" stop-color="${shade(c1, -0.2)}"/></linearGradient>
      <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c2, 0.08)}"/><stop offset="1" stop-color="${shade(c2, -0.14)}"/></linearGradient>
      <radialGradient id="${id}g"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>`;
    const ground = `<ellipse cx="206" cy="238" rx="176" ry="12" fill="url(#${id}g)"/>`;
    let vb = "20 10 370 240", g = ground + body;
    if (view === 1) g = `<g transform="translate(410 0) scale(-1 1)">${ground}${body}</g>`;
    if (view === 2) g = `<g transform="translate(-14 -40) scale(.95)" opacity=".9">${body}</g><g transform="translate(20 8) scale(.95)">${ground}${body}</g>`;
    if (view === 3) vb = p.oblik === "stikla" ? "170 120 210 120" : "196 108 184 128";
    return `<svg viewBox="${vb}" role="img" aria-label="${esc(p.naziv)}, ${esc(v.boja)}" preserveAspectRatio="xMidYMid meet">${defs}${g}</svg>`;
  }
  const viewCount = v => (v.slike && v.slike.length) ? v.slike.length : 4;
  function media(p, v, view = 0) {
    if (v.slike && v.slike.length) {
      const src = v.slike[Math.min(view, v.slike.length - 1)];
      return `<img src="${esc(src)}" alt="${esc(p.naziv)}, ${esc(v.boja)}" loading="lazy" decoding="async">`;
    }
    return shoeSVG(p, v, view);
  }
  const tile = (p, v, view = 0, cls = "") => `<div class="tile ${cls}">${media(p, v, view)}</div>`;
  // fotografija koja ne učita dobija zamjenski natpis (stanje greške)
  document.addEventListener("error", e => {
    const img = e.target;
    if (img && img.tagName === "IMG" && img.closest(".tile")) img.replaceWith(Object.assign(document.createElement("span"), { className: "img-missing", textContent: "Fotografija nije dostupna" }));
  }, true);
  const posterVariant = p => p.varijante.reduce((best, v, i) => Math.abs(luma(v.hex) - 0.45) < Math.abs(luma(p.varijante[best].hex) - 0.45) ? i : best, 0);

  /* ---------- stanje ---------- */
  const emptyFilters = () => ({ q: "", kategorije: new Set(), pol: new Set(), marke: new Set(), boje: new Set(), velicine: new Set(), cijenaMax: PRICE_MAX, novo: false, snizenje: false });
  let F = emptyFilters();
  let sortBy = store.get("sort", "novo");
  let wishlist = store.get("wishlist", {});   // { id: sku }
  let recent = store.get("recent", []);       // [id]
  const cardVariant = new Map();

  function matches(p, skip) {
    if (skip !== "q" && F.q) {
      const hay = [p.naziv, p.marka, p.kategorija, p.pol, p.materijal, ...p.varijante.map(v => v.boja + " " + v.sku + " " + (FAMILY_LABEL[v.porodica] || ""))].join(" ").toLowerCase();
      if (!F.q.toLowerCase().split(/\s+/).filter(Boolean).every(t => hay.includes(t))) return false;
    }
    if (skip !== "kategorije" && F.kategorije.size && !F.kategorije.has(p.kategorija)) return false;
    if (skip !== "pol" && F.pol.size && !F.pol.has(p.pol)) return false;
    if (skip !== "marke" && F.marke.size && !F.marke.has(p.marka)) return false;
    const vs = (skip !== "boje" && F.boje.size) ? p.varijante.filter(v => F.boje.has(v.porodica)) : p.varijante;
    if (!vs.length) return false;
    if (skip !== "velicine" && F.velicine.size && !vs.some(v => p.velicine.some(s => F.velicine.has(s) && !(v.nema || []).includes(s)))) return false;
    if (skip !== "cijena" && F.cijenaMax < PRICE_MAX && (p.cijena == null || p.cijena > F.cijenaMax)) return false;
    if (skip !== "novo" && F.novo && !isNew(p)) return false;
    if (skip !== "snizenje" && F.snizenje && !discount(p)) return false;
    return true;
  }
  function displayVariant(p) {
    if (cardVariant.has(p.id)) return cardVariant.get(p.id);
    if (F.boje.size) { const i = p.varijante.findIndex(v => F.boje.has(v.porodica)); if (i >= 0) return i; }
    return 0;
  }
  const SORTS = {
    "novo": (a, b) => b.datum.localeCompare(a.datum),
    "cijena-asc": (a, b) => (a.cijena ?? 1e9) - (b.cijena ?? 1e9),
    "cijena-desc": (a, b) => (b.cijena ?? -1) - (a.cijena ?? -1),
    "boje": (a, b) => b.varijante.length - a.varijante.length || b.datum.localeCompare(a.datum),
    "naziv": (a, b) => a.naziv.localeCompare(b.naziv, "sr")
  };
  if (!CIJENE) { delete SORTS["cijena-asc"]; delete SORTS["cijena-desc"]; }

  /* ---------- kartica ---------- */
  function priceHTML(p) {
    if (!CIJENE) return "";
    const d = discount(p);
    return `<p class="price${d ? " is-sale" : ""}"><span>${money(p.cijena)}</span>${d ? `<s>${money(p.staraCijena)}</s>` : ""}</p>`;
  }
  function cardHTML(p) {
    const vi = displayVariant(p), v = p.varijante[vi], d = discount(p);
    const shown = p.varijante.slice(0, 5), more = p.varijante.length - shown.length;
    const fav = !!wishlist[p.id];
    return `<article class="card" data-id="${esc(p.id)}">
      <button class="card-media" type="button" data-open="${esc(p.id)}" tabindex="-1" aria-hidden="true">
        ${tile(p, v, 0)}
        <span class="badges">${isNew(p) ? `<span class="badge">Novo</span>` : ""}${d ? `<span class="badge sale">−${d}%</span>` : ""}</span>
      </button>
      <button class="fav" type="button" data-fav="${esc(p.id)}" aria-pressed="${fav}" aria-label="Lista želja: ${esc(p.naziv)}">${icon.heart}</button>
      <div class="card-body">
        <div class="swatches" role="group" aria-label="Boje za ${esc(p.naziv)}">
          ${shown.map((x, i) => `<button class="sw" type="button" data-sw="${i}" style="background:${x.hex}" aria-pressed="${i === vi}" aria-label="${esc(x.boja)}" title="${esc(x.boja)}"></button>`).join("")}
          ${more > 0 ? `<span class="sw-more">+${more}</span>` : ""}
        </div>
        <h3 class="name"><button type="button" data-open="${esc(p.id)}">${esc(p.naziv)}</button></h3>
        <p class="meta">${esc(p.marka)} · ${esc(p.kategorija)} · ${nBoja(p.varijante.length)}</p>
        ${priceHTML(p)}
      </div>
    </article>`;
  }
  function setCardVariant(card, i) {
    const p = byId.get(card.dataset.id); if (!p || !p.varijante[i]) return;
    cardVariant.set(p.id, i);
    $(".card-media .tile", card).innerHTML = media(p, p.varijante[i], 0);
    $$(".sw", card).forEach(b => b.setAttribute("aria-pressed", +b.dataset.sw === i));
  }

  /* ---------- baner-slajder ---------- */
  const maxDisc = Math.max(0, ...PRODUCTS.map(discount));
  const minBy = cat => Math.min(...PRODUCTS.filter(p => p.kategorija === cat && p.cijena != null).map(p => p.cijena));
  const SLIDES = [
    { tone: "t-forest", label: "Jesen i zima 2026", title: "Čizme za hladne dane", text: "Semiš, vuna i đonovi koji drže na ledu. Tundra High grije do −25 °C.", cta: "Pogledaj čizme", act: { kategorije: ["Čizme"] }, pid: "tundra-high", v: 3, second: "Tundra High", secondId: "tundra-high" },
    { tone: "t-ochre", label: "Trčanje i grad", title: "Pulse Racer", text: "Ploča za stabilnost i pjena visokog odraza, u četiri nove boje.", cta: "Pogledaj model", openId: "pulse-racer", pid: "pulse-racer", v: 1, second: "Sve patike", act: { kategorije: ["Patike"] } },
    { tone: "t-sky", label: "Sniženje", title: `Do −${maxDisc}%`, text: "Court Classic, Sera Slingback i Nora Block po nižoj cijeni, dok traju veličine.", cta: "Pogledaj sniženja", act: { snizenje: true }, pid: "court-classic", v: 1 }
  ].filter(s => byId.has(s.pid) && (CIJENE || !(s.act && s.act.snizenje)));
  let slideIdx = 0, slideTimer = null;
  function renderSlides() {
    $("#slides").innerHTML = SLIDES.map((s, i) => {
      const p = byId.get(s.pid), v = p.varijante[Math.min(s.v, p.varijante.length - 1)];
      const primary = s.openId ? `data-open="${s.openId}"` : `data-slide-act="${i}"`;
      const secondary = s.second ? (s.openId ? `<button class="btn outline" type="button" data-slide-act="${i}">${esc(s.second)}</button>` : `<button class="btn outline" type="button" data-open="${esc(s.secondId)}">${esc(s.second)}</button>`) : "";
      return `<div class="slide ${s.tone}${i === 0 ? " is-active" : ""}" role="group" aria-roledescription="baner" aria-label="${i + 1} od ${SLIDES.length}"${i === 0 ? "" : ' aria-hidden="true"'}>
        <div class="slide-copy"><p class="label">${esc(s.label)}</p><h2 class="display">${esc(s.title)}</h2><p>${esc(s.text)}</p>
          <div class="slide-btns"><button class="btn${s.tone === "t-forest" ? " on-dark" : ""}" type="button" ${primary}>${esc(s.cta)}</button>${secondary}</div></div>
        <div class="slide-art"><div class="art">${media(p, v, 0)}</div></div>
      </div>`;
    }).join("");
    $$(".slide").forEach((el, k) => { if (k) $$("button", el).forEach(b => b.tabIndex = -1); });
    $$(".slide .btn.outline").forEach(b => { if (b.closest(".t-forest")) b.style.cssText = "color:var(--forest-ink);border-color:var(--forest-ink)"; });
    updateHeroUI();
  }
  function updateHeroUI() {
    const s = SLIDES[slideIdx];
    $("#hero-ui").className = "wrap hero-ui-color " + s.tone;
    $("#slide-count").textContent = `${String(slideIdx + 1).padStart(2, "0")} / ${String(SLIDES.length).padStart(2, "0")}`;
    const bar = $("#progress"); bar.classList.remove("run"); void bar.offsetWidth; if (slideTimer) bar.classList.add("run");
  }
  function goSlide(i) {
    slideIdx = (i + SLIDES.length) % SLIDES.length;
    $$(".slide").forEach((el, k) => {
      const on = k === slideIdx; el.classList.toggle("is-active", on);
      on ? el.removeAttribute("aria-hidden") : el.setAttribute("aria-hidden", "true");
      $$("button", el).forEach(b => b.tabIndex = on ? 0 : -1);
    });
    updateHeroUI();
  }
  function startSlides() { if (reduceMotion || SLIDES.length < 2) return; stopSlides(); slideTimer = setInterval(() => goSlide(slideIdx + 1), 6000); updateHeroUI(); }
  function stopSlides() { clearInterval(slideTimer); slideTimer = null; $("#progress").classList.remove("run"); }

  /* ---------- početni blokovi ---------- */
  let PROMOS = [];
  function renderHomeBlocks() {
    $("#cats").innerHTML = CATS.map(c => {
      const list = PRODUCTS.filter(p => p.kategorija === c).sort(SORTS.novo), p = list[0];
      return `<button class="cat" type="button" data-cat="${esc(c)}">${tile(p, p.varijante[posterVariant(p)], 0)}<span class="cat-name">${esc(c)} <span class="num">${list.length}</span></span></button>`;
    }).join("");
    const fresh = PRODUCTS.filter(isNew).sort(SORTS.novo).slice(0, 10);
    $("#new-rail").innerHTML = (fresh.length >= 4 ? fresh : PRODUCTS.slice().sort(SORTS.novo).slice(0, 8)).map(cardHTML).join("");
    PROMOS = [
      { tone: "t-ochre", title: "Kućna udobnost", text: CIJENE ? `Papuče od kuvane vune i lagane pjene, od ${money(minBy("Papuče"))}.` : "Papuče od kuvane vune i lagane pjene.", cta: "Pogledaj papuče", act: { kategorije: ["Papuče"] }, pid: "casa-felt", v: 1 },
      { tone: "t-sky", title: "Luna Pump", text: "Salonka sa petom od 8,5 cm, od crne do smaragdne. Pet boja, isti kroj.", cta: "Pogledaj štikle", act: { kategorije: ["Štikle"] }, pid: "luna-pump", v: 4 }
    ].filter(x => byId.has(x.pid));
    $("#promos").innerHTML = PROMOS.map((x, i) => {
      const p = byId.get(x.pid), v = p.varijante[Math.min(x.v, p.varijante.length - 1)];
      return `<div class="promo ${x.tone}"><div class="art">${media(p, v, 0)}</div><div class="copy"><h3 class="display">${esc(x.title)}</h3><p>${esc(x.text)}</p><button class="btn" type="button" data-promo="${i}">${esc(x.cta)}</button></div></div>`;
    }).join("");
    $("#brands").innerHTML = BRANDS.map(b => {
      const list = PRODUCTS.filter(p => p.marka === b);
      return `<button class="brand-card" type="button" data-brand="${esc(b)}"><strong class="display">${esc(b)}</strong><span class="num">${nModela(list.length)} · ${nBoja(list.reduce((n, x) => n + x.varijante.length, 0))}</span></button>`;
    }).join("");
    $("#foot-cats").innerHTML = CATS.map(c => `<li><button type="button" data-cat="${esc(c)}">${esc(c)}</button></li>`).join("");
  }

  /* ---------- filteri ---------- */
  function renderFilterPanel() {
    const group = (title, body, open = true) => `<details class="fgroup"${open ? " open" : ""}><summary>${title}${icon.chevron}</summary><div class="fbody">${body}</div></details>`;
    const checks = (key, values) => `<div class="fopts">${values.map(v => `<label class="fopt"><input type="checkbox" data-f="${key}" value="${esc(v)}"><span>${esc(v)}</span><span class="n" data-n="${key}:${esc(v)}"></span></label>`).join("")}</div>`;
    $("#filter-groups").innerHTML =
      group("Kategorija", checks("kategorije", CATS)) +
      group("Za koga", checks("pol", POLS)) +
      group("Veličina (EU)", `<div class="size-grid">${ALL_SIZES.map(s => `<button class="sbtn" type="button" data-fs="${s}" aria-pressed="false">${s}</button>`).join("")}</div>`) +
      group("Boja", `<div class="color-grid">${COLOR_FAMILIES.filter(([k]) => PRODUCTS.some(p => p.varijante.some(v => v.porodica === k))).map(([k, l, h]) => `<button class="cbtn" type="button" data-fb="${k}" aria-pressed="false"><i style="background:${h}"></i>${l}</button>`).join("")}</div>`) +
      group("Marka", checks("marke", BRANDS), false) +
      (CIJENE ? group("Cijena", `<div class="range-row"><label for="price">Najviše: <output id="price-out" class="num"></output></label><input id="price" type="range" min="${PRICE_MIN}" max="${PRICE_MAX}" step="5" value="${PRICE_MAX}"></div>`, false) : "") +
      `<label class="toggle" for="f-novo">Samo novo<input id="f-novo" type="checkbox" role="switch"></label>` +
      (CIJENE ? `<label class="toggle" for="f-sale">Samo sniženo<input id="f-sale" type="checkbox" role="switch"></label>` : "");
  }
  function syncFilterPanel() {
    $$("input[data-f]").forEach(el => { el.checked = F[el.dataset.f].has(el.value); });
    $$("[data-n]").forEach(el => {
      const [key, val] = el.dataset.n.split(":");
      const field = key === "kategorije" ? "kategorija" : key === "marke" ? "marka" : "pol";
      const n = PRODUCTS.filter(p => p[field] === val && matches(p, key)).length;
      el.textContent = n;
      el.closest(".fopt").classList.toggle("dim", !n && !F[key].has(val));
    });
    $$("[data-fb]").forEach(el => el.setAttribute("aria-pressed", F.boje.has(el.dataset.fb)));
    $$("[data-fs]").forEach(el => el.setAttribute("aria-pressed", F.velicine.has(+el.dataset.fs)));
    if (CIJENE) {
      $("#price").value = F.cijenaMax;
      $("#price-out").textContent = F.cijenaMax >= PRICE_MAX ? "bez ograničenja" : money(F.cijenaMax);
      $("#f-sale").checked = F.snizenje;
    }
    $("#f-novo").checked = F.novo;
    if (document.activeElement !== $("#q")) $("#q").value = F.q;
  }
  function activeChips() {
    const c = [];
    if (F.q) c.push(["q", "", `„${F.q}“`]);
    F.kategorije.forEach(v => c.push(["kategorije", v, v]));
    F.pol.forEach(v => c.push(["pol", v, v]));
    F.boje.forEach(v => c.push(["boje", v, FAMILY_LABEL[v]]));
    F.velicine.forEach(v => c.push(["velicine", v, "EU " + v]));
    F.marke.forEach(v => c.push(["marke", v, v]));
    if (F.cijenaMax < PRICE_MAX) c.push(["cijena", "", "do " + money(F.cijenaMax)]);
    if (F.novo) c.push(["novo", "", "Novo"]);
    if (F.snizenje) c.push(["snizenje", "", "Sniženo"]);
    return c;
  }

  /* ---------- katalog ---------- */
  function renderCatalog() {
    const list = PRODUCTS.filter(p => matches(p)).sort(SORTS[sortBy] || SORTS.novo);
    const colors = list.reduce((n, p) => n + (F.boje.size ? p.varijante.filter(v => F.boje.has(v.porodica)).length : p.varijante.length), 0);
    $("#count").innerHTML = `${nModela(list.length)} <span>· ${nBoja(colors)}</span>`;
    const chips = activeChips();
    $("#chips").innerHTML = chips.map(([k, v, l]) => `<button class="chip" type="button" data-rm="${k}" data-rmv="${esc(v)}" aria-label="Ukloni filter ${esc(l)}">${esc(l)}${icon.x}</button>`).join("") + (chips.length ? `<button class="chip clear" type="button" data-clear>Očisti sve</button>` : "");
    $("#filter-n").textContent = chips.length ? `(${chips.length})` : "";
    $("#grid").innerHTML = list.length ? list.map(cardHTML).join("") :
      `<div class="empty" style="grid-column:1/-1"><h3 class="display">Nema modela za ovaj izbor</h3><p>Uklonite neki filter ili izaberite drugu veličinu ili boju.</p><button class="btn" type="button" data-clear>Očisti filtere</button></div>`;
    syncFilterPanel();
  }
  function renderRecent() {
    const items = recent.map(id => byId.get(id)).filter(Boolean);
    $("#recent-sec").hidden = items.length < 2;
    $("#recent-rail").innerHTML = items.map(cardHTML).join("");
  }
  function refreshFavButtons() {
    $$("[data-fav]").forEach(b => b.setAttribute("aria-pressed", !!wishlist[b.dataset.fav]));
    const n = Object.keys(wishlist).length;
    $("#wl-count").hidden = !n; $("#wl-count").textContent = n;
    $("#wl-open").setAttribute("aria-label", n ? `Lista želja, ${n} ${plural(n, "model", "modela", "modela")}` : "Lista želja");
  }
  function applyPreset(act, scroll = true) {
    F = emptyFilters();
    Object.entries(act || {}).forEach(([k, v]) => { if (F[k] instanceof Set) v.forEach(x => F[k].add(x)); else F[k] = v; });
    cardVariant.clear(); renderCatalog();
    if (scroll) $("#katalog").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }
  const NAV = { novo: { novo: true }, zene: { pol: ["Žensko", "Unisex"] }, muskarci: { pol: ["Muško", "Unisex"] }, djeca: { pol: ["Djeca"] }, snizenje: { snizenje: true }, sve: {} };

  /* ---------- ladice (lista želja, filteri na telefonu): fokus ostaje unutra ---------- */
  let drawerReturn = null, inerted = [];
  function setInert(keep) {
    inerted = [];
    let el = keep;
    while (el && el.parentElement) {
      Array.from(el.parentElement.children).forEach(sib => {
        if (sib !== el && !sib.inert && !["SCRIPT", "STYLE", "DIALOG"].includes(sib.tagName) && !sib.classList.contains("scrim") && !sib.classList.contains("filters-apply")) { sib.inert = true; inerted.push(sib); }
      });
      el = el.parentElement; if (el === document.body) break;
    }
  }
  function openDrawer(el, focusEl) {
    drawerReturn = document.activeElement;
    el.classList.add("is-open"); el.setAttribute("aria-hidden", "false");
    $("#scrim").classList.add("is-on"); setInert(el);
    (focusEl || el).focus();
  }
  function closeDrawers() {
    const wasOpen = $$(".drawer.is-open, .filters.is-open").length;
    $$(".drawer, .filters").forEach(el => el.classList.remove("is-open"));
    $("#wl").setAttribute("aria-hidden", "true"); $("#scrim").classList.remove("is-on");
    inerted.forEach(el => el.inert = false); inerted = [];
    if (wasOpen && drawerReturn && document.contains(drawerReturn)) drawerReturn.focus();
    drawerReturn = null;
  }

  /* ---------- prozor proizvoda ---------- */
  const pd = $("#pd");
  let cur = null;
  function openProduct(id, vi = 0, fromHash = false) {
    const p = byId.get(id); if (!p) return;
    cur = { p, vi: Math.max(0, Math.min(vi, p.varijante.length - 1)), view: 0, size: null, inquiry: false, sizeWarn: false };
    renderPD(true);
    if (!pd.open) { try { pd.showModal(); } catch (e) { pd.setAttribute("open", ""); } }
    document.title = `${p.naziv} – ${p.marka} | ${CFG.imeProdavnice}`;
    recent = [id, ...recent.filter(x => x !== id)].slice(0, 10); store.set("recent", recent);
    if (!fromHash) { try { history.pushState({ pd: id }, "", "#p-" + id); } catch (e) { /* bez historije */ } }
    stopSlides();
  }
  function closeProduct() { if (pd.open) pd.close(); }
  pd.addEventListener("close", () => {
    cur = null; document.title = BASE_TITLE; renderRecent(); startSlides();
    if (location.hash.startsWith("#p-")) { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* ignoriši */ } }
  });
  pd.addEventListener("click", e => { if (e.target === pd) closeProduct(); });

  function sizeTableHTML(p) {
    const rows = SIZE_TABLE.filter(r => p.velicine.includes(r[0]));
    if (!rows.length) return `<p>Za ove veličine tabela nije dostupna. U upitu napišite dužinu stopala u centimetrima.</p>`;
    return `<div class="size-table-wrap"><table class="size-table"><thead><tr><th scope="col">EU</th><th scope="col">UK</th><th scope="col">US ženski</th><th scope="col">US muški</th><th scope="col">Stopalo (cm)</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join("")}</tbody></table></div><p>Mjere su orijentacione. Ako ste između dva broja, uzmite veći.</p>`;
  }
  function inquiryText() {
    const { p, vi, size } = cur, v = p.varijante[vi];
    return `Zdravo, zanima me ${p.naziv} (${p.marka}), boja ${v.boja}, veličina EU ${size}, šifra ${v.sku}. Da li je dostupno i koliko košta sa dostavom?`;
  }
  function renderPD(resetScroll) {
    const { p, vi, view, size } = cur, v = p.varijante[vi];
    const inner = $(".pd-inner", pd), scroll = inner && !resetScroll ? inner.scrollTop : 0;
    const focusKey = document.activeElement && pd.contains(document.activeElement) ? ["data-pv", "data-size", "data-view", "data-pdfav", "data-inquiry"].find(a => document.activeElement.hasAttribute(a)) : null;
    const focusVal = focusKey ? document.activeElement.getAttribute(focusKey) : null;
    const nema = new Set(v.nema || []), d = discount(p), fav = !!wishlist[p.id];
    const related = PRODUCTS.filter(x => x.id !== p.id && (x.kategorija === p.kategorija || x.marka === p.marka))
      .sort((a, b) => (b.kategorija === p.kategorija) - (a.kategorija === p.kategorija) || b.datum.localeCompare(a.datum)).slice(0, 8);
    pd.innerHTML = `
      <button class="pd-close" type="button" data-close aria-label="Zatvori">${icon.close}</button>
      <div class="pd-inner">
        <div class="pd-gallery">
          ${tile(p, v, view, "pd-main")}
          <div class="pd-thumbs">${Array.from({ length: viewCount(v) }, (_, i) => `<button type="button" data-view="${i}" aria-label="Prikaz ${i + 1} od ${viewCount(v)}" aria-current="${i === view}">${tile(p, v, i)}</button>`).join("")}</div>
        </div>
        <div class="pd-info">
          <div><p class="pd-brand">${esc(p.marka)} · ${esc(p.kategorija)} · ${esc(p.pol)}</p><h2 class="display" id="pd-title">${esc(p.naziv)}</h2></div>
          <div style="display:flex;gap:10px;align-items:baseline;flex-wrap:wrap">${priceHTML(p)}${d ? `<span class="badge sale" style="padding:0">−${d}%</span>` : ""}${isNew(p) ? `<span class="badge" style="padding:0;background:none">Novo</span>` : ""}</div>
          <div>
            <p class="pd-label">Boja: ${esc(v.boja)} <span>${nBoja(p.varijante.length)}</span></p>
            <div class="pd-colors" role="group" aria-label="Izaberi boju">${p.varijante.map((x, i) => `<button class="pd-color" type="button" data-pv="${i}" aria-pressed="${i === vi}" aria-label="${esc(x.boja)}" title="${esc(x.boja)}">${tile(p, x, 0)}</button>`).join("")}</div>
          </div>
          <div>
            <p class="pd-label">Veličina (EU) <button class="text-link" type="button" data-sizechart style="font-weight:500">Tabela veličina</button></p>
            <div class="pd-sizes" role="group" aria-label="Izaberi veličinu">${p.velicine.map(s => `<button class="pd-size" type="button" data-size="${s}" aria-pressed="${s === size}"${nema.has(s) ? ` disabled aria-label="${s}, trenutno nema"` : ""}>${s}</button>`).join("")}</div>
            <p class="hint${cur.sizeWarn ? " warn" : ""}" id="size-hint" role="${cur.sizeWarn ? "alert" : "status"}">${size ? `Izabrano: EU ${size}` : cur.sizeWarn ? "Izaberite veličinu da bismo popunili upit." : nema.size ? `Precrtanih veličina trenutno nema u boji ${esc(v.boja.toLowerCase())}.` : "Sve veličine su dostupne u ovoj boji."}</p>
          </div>
          <div class="pd-actions">
            <button class="btn" type="button" data-inquiry>Pošalji upit</button>
            <button class="btn pd-fav" type="button" data-pdfav aria-pressed="${fav}" aria-label="Lista želja: ${esc(p.naziv)}">${icon.heart}</button>
          </div>
          ${cur.inquiry && size ? `<div class="inquiry" id="inq">
            <label class="pd-label" for="inq-text" style="margin:0">Vaša poruka</label>
            <textarea id="inq-text">${esc(inquiryText())}</textarea>
            <div class="row"><span>Pošaljite na ${CFG.kontakt ? `<code>${esc(CFG.kontakt)}</code>` : ""}${CFG.kontakt && CFG.telefon ? " ili " : ""}${CFG.telefon ? `<code>${esc(CFG.telefon)}</code>` : ""}</span><button class="btn outline" type="button" data-copy="#inq-text">Kopiraj poruku</button></div>
          </div>` : ""}
          <div class="acc">
            <details open><summary>Opis${icon.chevron}</summary><div class="acc-body"><p>${esc(p.opis || "")}</p></div></details>
            <details><summary>Materijal i đon${icon.chevron}</summary><div class="acc-body"><dl class="specs"><dt>Gornjište</dt><dd>${esc(p.materijal || "—")}</dd><dt>Đon</dt><dd>${esc(p.djon || "—")}</dd><dt>Šifra</dt><dd>${esc(v.sku)}</dd><dt>Veličine</dt><dd>EU ${p.velicine[0]}–${p.velicine[p.velicine.length - 1]}</dd></dl></div></details>
            <details id="acc-size"><summary>Tabela veličina${icon.chevron}</summary><div class="acc-body">${sizeTableHTML(p)}</div></details>
          </div>
        </div>
        ${related.length ? `<div class="pd-related"><h3 class="display">Slični modeli</h3><div class="rail">${related.map(cardHTML).join("")}</div></div>` : ""}
      </div>`;
    $(".pd-inner", pd).scrollTop = scroll;
    if (focusKey) { const el = pd.querySelector(`[${focusKey}${focusVal ? `="${focusVal}"` : ""}]`); el && el.focus({ preventScroll: true }); }
    else if (resetScroll) $(".pd-close", pd).focus({ preventScroll: true });
  }

  /* ---------- lista želja ---------- */
  function toggleWish(id, sku) {
    const p = byId.get(id); if (!p) return;
    if (wishlist[id]) { delete wishlist[id]; toast(`${p.naziv} je uklonjen sa liste želja`); }
    else { wishlist[id] = sku || p.varijante[displayVariant(p)].sku; toast(`${p.naziv} je na listi želja`); }
    store.set("wishlist", wishlist); refreshFavButtons(); renderWishlist();
    if (cur) renderPD(false);
  }
  function renderWishlist() {
    const items = Object.entries(wishlist).map(([id, sku]) => { const p = byId.get(id); if (!p) return null; const vi = Math.max(0, p.varijante.findIndex(v => v.sku === sku)); return { p, vi, v: p.varijante[vi] }; }).filter(Boolean);
    $("#wl-list").innerHTML = items.length ? items.map(({ p, vi, v }) => `<div class="wl-item">${tile(p, v, 0)}<div><button class="open" type="button" data-open="${esc(p.id)}" data-openv="${vi}">${esc(p.naziv)}</button><small>${esc(p.marka)} · ${esc(v.boja)}</small>${CIJENE ? `<small class="num">${money(p.cijena)}</small>` : ""}</div><button class="rm" type="button" data-fav="${esc(p.id)}">Ukloni</button></div>`).join("")
      : `<div class="empty"><h3 class="display">Lista je prazna</h3><p>Dodirnite srce na modelu da ga sačuvate ovdje.</p></div>`;
    $("#wl-foot").innerHTML = items.length ? `<textarea id="wl-text" class="visually-hidden" aria-hidden="true" tabindex="-1">${esc("Zdravo, zanimaju me ovi modeli:\n" + items.map(({ p, v }) => `- ${p.naziv} (${p.marka}), boja ${v.boja}, šifra ${v.sku}`).join("\n"))}</textarea><button class="btn" type="button" data-copy="#wl-text">Kopiraj listu za upit</button>${CFG.kontakt ? `<p class="hint" style="margin:0">Pošaljite je na <code style="font-family:inherit;font-weight:700;user-select:all">${esc(CFG.kontakt)}</code></p>` : ""}` : "";
  }

  /* ---------- poruke i kopiranje ---------- */
  let toastT;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-on"), 2400); }
  function copyFrom(sel) {
    const el = $(sel); if (!el) return;
    const fallback = () => { el.classList.remove("visually-hidden"); el.removeAttribute("aria-hidden"); el.focus(); el.select(); toast("Tekst je označen. Kopirajte ga sa Ctrl+C."); };
    try { navigator.clipboard.writeText(el.value).then(() => toast("Poruka je kopirana"), fallback); } catch (e) { fallback(); }
  }

  /* ---------- strukturirani podaci za pretraživače (Product + Offer) ---------- */
  function injectJsonLd() {
    const data = {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "Organization", "name": CFG.imeProdavnice, "email": CFG.kontakt || undefined, "telephone": CFG.telefon || undefined },
        { "@type": "ItemList", "name": `${CFG.imeProdavnice} katalog obuće`, "itemListElement": PRODUCTS.map((p, i) => ({
          "@type": "ListItem", "position": i + 1,
          "item": { "@type": "ProductGroup", "name": p.naziv, "brand": { "@type": "Brand", "name": p.marka }, "category": p.kategorija, "description": p.opis, "productGroupID": p.id, "variesBy": ["https://schema.org/color", "https://schema.org/size"],
            "hasVariant": p.varijante.map(v => ({ "@type": "Product", "name": `${p.naziv} ${v.boja}`, "sku": v.sku, "color": v.boja,
              "offers": !CIJENE || p.cijena == null ? undefined : { "@type": "Offer", "price": p.cijena, "priceCurrency": "EUR", "availability": (v.nema || []).length >= p.velicine.length ? "https://schema.org/OutOfStock" : "https://schema.org/InStock" } })) }
        })) }
      ]
    };
    const s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(data); document.head.appendChild(s);
  }

  /* ---------- događaji ---------- */
  document.addEventListener("click", e => {
    const t = e.target.closest("button, [data-open]"); if (!t) return;
    const ds = t.dataset;
    if (ds.sw != null) { setCardVariant(t.closest(".card"), +ds.sw); return; }
    if (ds.fav) { const card = t.closest(".card"); const p = byId.get(ds.fav); toggleWish(ds.fav, card ? p.varijante[displayVariant(p)].sku : null); return; }
    if (ds.open) { const card = t.closest(".card"); const p = byId.get(ds.open); closeDrawers(); openProduct(ds.open, ds.openv != null ? +ds.openv : (card ? displayVariant(p) : 0)); return; }
    if (ds.nav) { if (ds.nav === "novo") { sortBy = "novo"; $("#sort").value = "novo"; } applyPreset(NAV[ds.nav]); return; }
    if (ds.cat) { applyPreset({ kategorije: [ds.cat] }); return; }
    if (ds.brand) { applyPreset({ marke: [ds.brand] }); return; }
    if (ds.slideAct != null) { applyPreset(SLIDES[+ds.slideAct].act); return; }
    if (ds.promo != null) { applyPreset(PROMOS[+ds.promo].act); return; }
    if (ds.fb) { F.boje.has(ds.fb) ? F.boje.delete(ds.fb) : F.boje.add(ds.fb); cardVariant.clear(); renderCatalog(); return; }
    if (ds.fs) { const s = +ds.fs; F.velicine.has(s) ? F.velicine.delete(s) : F.velicine.add(s); renderCatalog(); return; }
    if (ds.rm) { const k = ds.rm, v = ds.rmv; if (k === "q") { F.q = ""; $("#q").value = ""; } else if (k === "cijena") F.cijenaMax = PRICE_MAX; else if (k === "novo" || k === "snizenje") F[k] = false; else F[k].delete(k === "velicine" ? +v : v); cardVariant.clear(); renderCatalog(); return; }
    if (ds.clear != null) { F = emptyFilters(); $("#q").value = ""; cardVariant.clear(); renderCatalog(); return; }
    if (ds.copy) { copyFrom(ds.copy); return; }
    if (!cur) return;
    if (ds.close != null) { closeProduct(); return; }
    if (ds.pv != null) { cur.vi = +ds.pv; cur.view = 0; if (cur.size && (cur.p.varijante[cur.vi].nema || []).includes(cur.size)) { cur.size = null; cur.inquiry = false; } renderPD(false); return; }
    if (ds.view != null) { cur.view = +ds.view; renderPD(false); return; }
    if (ds.size) { cur.size = +ds.size; cur.sizeWarn = false; renderPD(false); return; }
    if (ds.sizechart != null) { const d = $("#acc-size", pd); d.open = true; d.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }); return; }
    if (ds.inquiry != null) { if (!cur.size) { cur.sizeWarn = true; renderPD(false); return; } cur.inquiry = true; renderPD(false); const ta = $("#inq-text", pd); if (ta) { ta.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }); } return; }
    if (ds.pdfav != null) { toggleWish(cur.p.id, cur.p.varijante[cur.vi].sku); return; }
  });
  const previewSwatch = e => { const b = e.target.closest && e.target.closest(".card .sw"); if (b) setCardVariant(b.closest(".card"), +b.dataset.sw); };
  document.addEventListener("pointerover", e => { if (e.pointerType === "mouse") previewSwatch(e); });
  document.addEventListener("focusin", previewSwatch);

  $("#filter-groups").addEventListener("change", e => {
    const el = e.target;
    if (el.dataset.f) { el.checked ? F[el.dataset.f].add(el.value) : F[el.dataset.f].delete(el.value); }
    else if (el.id === "f-novo") F.novo = el.checked;
    else if (el.id === "f-sale") F.snizenje = el.checked;
    else return;
    renderCatalog();
  });
  $("#filter-groups").addEventListener("input", e => { if (e.target.id === "price") { F.cijenaMax = +e.target.value; renderCatalog(); } });
  $("#sort").addEventListener("change", e => { sortBy = e.target.value; store.set("sort", sortBy); renderCatalog(); });
  let qT;
  $("#q").addEventListener("input", e => { clearTimeout(qT); qT = setTimeout(() => { F.q = e.target.value.trim(); renderCatalog(); }, 160); });
  $("#search-form").addEventListener("submit", e => { e.preventDefault(); F.q = $("#q").value.trim(); renderCatalog(); $("#katalog").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); });

  $("#filters-open").addEventListener("click", () => openDrawer($("#filters"), $("#filters-close")));
  $("#filters-close").addEventListener("click", closeDrawers);
  $("#filters-apply").addEventListener("click", () => { closeDrawers(); $("#katalog").scrollIntoView({ behavior: "auto" }); });
  $("#wl-open").addEventListener("click", () => { renderWishlist(); openDrawer($("#wl"), $("#wl-close")); });
  $("#wl-close").addEventListener("click", closeDrawers);
  $("#scrim").addEventListener("click", closeDrawers);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !pd.open) closeDrawers(); });
  window.matchMedia("(min-width: 981px)").addEventListener("change", e => { if (e.matches && $("#filters").classList.contains("is-open")) closeDrawers(); });

  $("#prev").addEventListener("click", () => { goSlide(slideIdx - 1); startSlides(); });
  $("#next").addEventListener("click", () => { goSlide(slideIdx + 1); startSlides(); });
  $("#slider").addEventListener("pointerenter", e => { if (e.pointerType === "mouse") stopSlides(); });
  $("#slider").addEventListener("pointerleave", e => { if (e.pointerType === "mouse") startSlides(); });
  $("#slider").addEventListener("focusin", stopSlides);
  let touchX = null;
  $("#slider").addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
  $("#slider").addEventListener("touchend", e => { if (touchX == null) return; const dx = e.changedTouches[0].clientX - touchX; if (Math.abs(dx) > 40) { goSlide(slideIdx + (dx < 0 ? 1 : -1)); startSlides(); } touchX = null; });

  $("#nl-form").addEventListener("submit", e => {
    e.preventDefault();
    const el = $("#nl-email"), ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
    el.setAttribute("aria-invalid", !ok);
    $("#nl-note").textContent = !ok ? "Upišite ispravnu e-mail adresu, npr. ime@domena.com." :
      CFG.primjerPodataka ? "Adresa je ispravna. U šablonu se prijava još ne šalje nigdje: povežite formu sa servisom za newsletter." : "Hvala, prijavljeni ste.";
    if (ok) el.value = "";
  });

  function routeFromHash() {
    const m = location.hash.match(/^#p-([\w.~-]+)$/);
    if (m && byId.has(m[1])) { if (!cur || cur.p.id !== m[1]) openProduct(m[1], 0, true); }
    else if (pd.open) closeProduct();
  }
  window.addEventListener("popstate", routeFromHash);
  window.addEventListener("hashchange", routeFromHash);

  /* ---------- traka sa obavještenjima ---------- */
  const MSGS = ["Novi modeli svake sedmice", "Upit za bilo koju boju i veličinu", "Tabela veličina uz svaki model"];
  let msgI = 0;
  if (!reduceMotion) setInterval(() => { const el = $("#announce-msg"); el.style.opacity = 0; setTimeout(() => { msgI = (msgI + 1) % MSGS.length; el.textContent = MSGS[msgI]; el.style.opacity = 1; }, 300); }, 4500);

  /* ---------- start ---------- */
  $("#store-name").textContent = CFG.imeProdavnice;
  $("#demo-badge").hidden = !CFG.primjerPodataka;
  $("#foot-mail").textContent = CFG.kontakt || "";
  $("#foot-tel").textContent = CFG.telefon || "";
  $("#foot-copy").textContent = `© ${new Date().getFullYear()} ${CFG.imeProdavnice}`;
  if (!CIJENE) {
    $$('#sort option[value^="cijena"]').forEach(o => o.remove());
    $$('[data-nav="snizenje"]').forEach(b => (b.closest("li") || b).remove());
    $(".footer-bottom span:last-child").textContent = "Dostupnost i cijenu potvrđujemo na upit.";
  }
  $("#sort").value = SORTS[sortBy] ? sortBy : "novo";
  renderSlides(); startSlides();
  renderHomeBlocks();
  renderFilterPanel();
  renderCatalog();
  renderRecent();
  renderWishlist();
  refreshFavButtons();
  injectJsonLd();
  routeFromHash();
})();
