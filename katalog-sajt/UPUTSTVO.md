# Korak — šablon kataloga obuće

Statičan sajt (HTML, CSS i JavaScript, bez servera i baze). Radi na bilo kom hostingu: samo se iskopira folder `katalog-sajt`.

## Fajlovi

| Fajl | Šta je |
|---|---|
| `index.html` | stranica i cijeli dizajn (boje, slova i raspored su na vrhu, u `:root`) |
| `proizvodi.js` | **svi proizvodi i podešavanja**: ovo se mijenja |
| `app.js` | logika (filteri, boje, upit, lista želja); ne treba je dirati |
| `robots.txt`, `sitemap.xml` | za pretraživače: upišite pravu domenu |

## Dodavanje proizvoda

U `proizvodi.js` svaki proizvod je jedan model, a svaka boja tog modela je jedna **varijanta**:

```js
{
  id: "runner-one", naziv: "Runner One", marka: "Nordlauf",
  kategorija: "Patike", pol: "Unisex", cijena: 119, datum: "2026-10-12",
  velicine: [36,37,38,39,40,41,42,43,44,45,46],
  opis: "…", materijal: "…", djon: "…",
  varijante: [
    { sku: "NL-R1-WHT", boja: "Bijela", porodica: "bijela", hex: "#EEF0EC", nema: [46],
      slike: ["slike/runner-one/bijela-1.jpg", "slike/runner-one/bijela-2.jpg"] },
    { sku: "NL-R1-OLV", boja: "Maslinasta", porodica: "zelena", hex: "#6F7A4E", nema: [],
      slike: ["slike/runner-one/maslinasta-1.jpg"] }
  ]
}
```

- `porodica` određuje filter boja: `bijela crna siva bez smedja plava zelena crvena roza zuta`.
- `nema` su veličine kojih trenutno nema u toj boji (precrtane na stranici).
- `cijena: null` prikazuje "Cijena na upit". `staraCijena` uključuje oznaku sniženja.
- Proizvodi mlađi od 14 dana od najnovijeg datuma dobijaju oznaku **Novo**.

## Fotografije

Dok varijanta nema `slike`, katalog crta prikaz obuće u njenim bojama (to je samo za primjer).
Kad dodate fotografije, prikazuju se one:

- stavite ih u folder `slike/` pored `index.html`,
- najbolje kvadratne, 1200×1200 px, na svijetloj neutralnoj pozadini, u JPG ili WebP formatu, do oko 200 KB,
- prva slika je glavna, a ostale su galerija (bočno, par, đon, detalj).

### Automatsko upisivanje slika

Polje `slike` ne treba pisati ručno. Fotografije se slože ovako:

```
slike/<id-proizvoda>/<boja>-1.jpg, <boja>-2.jpg, ...
slike/runner-one/bijela-1.jpg
slike/court-classic/bijela-i-zelena-1.webp
```

`<boja>` je naziv boje iz `proizvodi.js`, malim slovima, bez kvačica, a razmaci su crtice ("Šumska" → `sumska`, "Teget semiš" → `teget-semis`). Umjesto boje može i SKU (`nl-r1-wht-1.jpg`).

- **`prati-slike.cmd`** (u folderu iznad `katalog-sajt`): dvoklik, ostaviti prozor otvoren. Svaki put kad se slike dodaju, obrišu ili preimenuju, `proizvodi.js` se sam ažurira.
- **`dodaj-slike.ps1`**: isto, ali samo jednom. Sa `-Proba` samo pokazuje šta bi uradio.

Prije svake izmjene stara verzija se čuva kao `proizvodi.js.bak`. Upozorenja javljaju slike i foldere koji se ne poklapaju ni sa jednim proizvodom ili bojom (najčešće greška u imenu).

Fotografije moraju biti vaše ili od dobavljača/marke koja vam to dozvoljava.

## Podešavanja

Na vrhu `proizvodi.js`, u `KORAK_PODESAVANJA`:
- `imeProdavnice`, `valuta`, `kontakt` (e-mail za upite), `telefon`
- `primjerPodataka: false` kad ubacite prave proizvode (sakriva oznaku "Primjer podataka")
- `prikaziCijene: false` sakriva cijene, sniženja, filter i sortiranje po cijeni (cijene u proizvodima ostaju upisane; `true` ih vraća)

## Prelazak u prodavnicu (kasnije)

Podaci su već u obliku koji prodavnice koriste (proizvod → varijante sa šifrom, bojom, veličinama i cijenom):
- **WooCommerce / Shopify:** proizvod = "variable product", varijante = boja × veličina, `sku` ide u SKU.
- Dugme "Pošalji upit" se zamijeni sa "Dodaj u korpu".
- Za bolji SEO u prodavnici svaki proizvod treba svoju adresu (npr. `/patike/runner-one`). U katalogu je to `#p-runner-one`.

## SEO

- Naslov i opis stranice su u `index.html` (`<title>`, `meta description`).
- Strukturirani podaci (Product/Offer) generišu se automatski iz `proizvodi.js`.
- Upišite pravu domenu u `index.html` (`canonical`), `robots.txt` i `sitemap.xml`.
