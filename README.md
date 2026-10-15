# Katalog obuće

Statičan sajt-katalog obuće (HTML, CSS i JavaScript, bez servera i baze) i skripte za ubacivanje fotografija.

## Sadržaj

| Putanja | Šta je |
|---|---|
| `katalog-sajt/` | ceo sajt; detaljno uputstvo je u [`katalog-sajt/UPUTSTVO.md`](katalog-sajt/UPUTSTVO.md) |
| `katalog-sajt/proizvodi.js` | svi proizvodi i podešavanja (jedino što se redovno menja) |
| `dodaj-slike.ps1` | upisuje fotografije iz `katalog-sajt/slike/` u `proizvodi.js` |
| `prati-slike.ps1`, `prati-slike.cmd` | prate folder sa slikama i sami pokreću `dodaj-slike.ps1` |
| `posalji-na-github.cmd` | ažurira `proizvodi.js` i šalje izmene i nove slike na GitHub |

## Dodavanje sopstvenih fotografija (vlasnik)

1. Slikaj proizvod: za svaku boju bočno (glavna), par, đon i detalj, na svetloj pozadini.
2. Iskopiraj slike u `katalog-sajt/slike/<id-proizvoda>/` (`id` je iz `proizvodi.js`).
3. Označi sve slike jedne boje (glavnu prvu), pritisni F2 i upiši naziv boje, npr. `crna`.
4. Dvoklik na `posalji-na-github.cmd` i potvrdi sa `d`.

## Pokretanje

Sajt radi i bez servera: otvori `katalog-sajt/index.html` u pregledaču. Za objavu se kopira ceo folder `katalog-sajt` na bilo koji hosting.

## Zadatak

1. **Uneti prave proizvode** u `katalog-sajt/proizvodi.js` umesto primer-proizvoda (spisak proizvoda dostavlja vlasnik) i postaviti `primjerPodataka: false`.
2. **Ubaciti fotografije** koje dostavi vlasnik:
   - raspored: `katalog-sajt/slike/<id-proizvoda>/<boja>-1.jpg`, `<boja>-2.jpg`… (prva je glavna),
   - kvadratne, oko 1200×1200 px, JPG ili WebP, do oko 200 KB,
   - zatim pokrenuti `dodaj-slike.ps1` (ili `prati-slike.cmd`), koji sam popunjava polje `slike`.
3. **Pregledati sajt** na telefonu i računaru (svi proizvodi, boje, galerije i upit rade).
4. **Upisati pravu domenu** u `index.html` (`canonical`), `robots.txt` i `sitemap.xml`.

Cene su trenutno sakrivene (`prikaziCijene: false` u `proizvodi.js`). Ostaviti tako dok vlasnik ne kaže drugačije.

## Pravila za fotografije

Koriste se **isključivo fotografije koje dostavi vlasnik** (njegove ili od dobavljača sa dozvolom).
Ne preuzimati fotografije sa drugih sajtova i ne koristiti tuđe robne marke i logotipe.

Vlasnikove fotografije su u `katalog-sajt/slike/`.
