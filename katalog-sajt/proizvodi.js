/* =====================================================================
   KORAK — podaci kataloga (PRIMJER PODATAKA)
   ---------------------------------------------------------------------
   Ovo su izmišljeni primjer-proizvodi. Zamijenite ih svojim proizvodima.

   Jedan PROIZVOD = jedan model. Svaka BOJA istog modela je VARIJANTA
   (svoja šifra/SKU, svoje slike, svoje dostupne veličine).

   Polja proizvoda:
     id          jedinstvena oznaka (mala slova, brojevi, crtice) — koristi se i u linku (#p-id)
     naziv       naziv modela
     marka       naziv marke / proizvođača
     kategorija  Patike | Čizme | Cipele | Sandale | Štikle | Papuče
     pol         Žensko | Muško | Unisex | Djeca
     cijena      cijena u EUR (broj); null znači "Cijena na upit"
     staraCijena (neobavezno) prikazuje sniženje
     datum       datum dodavanja (GGGG-MM-DD) — za "Najnovije" i oznaku "Novo"
     velicine    sve veličine modela (EU)
     opis, materijal, djon   tekst za stranicu proizvoda
     oblik       samo za ilustracije u primjeru: patika | cizma | cipela | sandala | stikla | papuca
     varijante   lista boja istog modela:
        sku        šifra varijante
        boja       naziv boje kako ga kupac vidi ("Maslinasta")
        porodica   grupa za filter boja: bijela crna siva bez smedja plava zelena crvena roza zuta
        hex        glavna boja (kružić boje)
        djonHex, detaljHex   samo za ilustracije u primjeru
        nema       veličine kojih trenutno nema
        slike      (neobavezno) prave fotografije, npr.
                   ["slike/runner-one/maslinasta-1.jpg", "slike/runner-one/maslinasta-2.jpg"]
                   Kad su navedene, katalog prikazuje njih umjesto ilustracije.
   ===================================================================== */

window.KORAK_PODESAVANJA = {
  imeProdavnice: "Korak",
  valuta: "€",
  primjerPodataka: true,            // false sakriva oznaku "Primjer podataka"
  prikaziCijene: false,             // true ponovo prikazuje cijene, sniženja i filter po cijeni
  kontakt: "upit@korak.example",    // adresa koja se prikazuje uz upit
  telefon: "+387 60 000 0000"
};

window.KORAK_PROIZVODI = [
  {
    id: "runner-one", naziv: "Runner One", marka: "Nordlauf", kategorija: "Patike", pol: "Unisex",
    cijena: 119, datum: "2026-10-12", oblik: "patika",
    velicine: [36,37,38,39,40,41,42,43,44,45,46],
    opis: "Lagana patika za svaki dan, sa mekanim pjenastim đonom i prozračnim gornjištem od mreže.",
    materijal: "Tekstilna mreža, sintetika", djon: "EVA pjena, guma na peti i prstima",
    varijante: [
      { sku: "NL-R1-WHT", boja: "Bijela", porodica: "bijela", hex: "#EEF0EC", djonHex: "#D9DCD6", detaljHex: "#2F6B5E", nema: [46] },
      { sku: "NL-R1-OLV", boja: "Maslinasta", porodica: "zelena", hex: "#6F7A4E", djonHex: "#EDE6D6", detaljHex: "#E9A06B", nema: [] },
      { sku: "NL-R1-NVY", boja: "Teget", porodica: "plava", hex: "#26365A", djonHex: "#F1F1EC", detaljHex: "#8FB8E8", nema: [36, 37] },
      { sku: "NL-R1-CRL", boja: "Koral", porodica: "crvena", hex: "#E0705A", djonHex: "#F4EDE4", detaljHex: "#FFFFFF", nema: [44, 45, 46] }
    ]
  },
  {
    id: "pulse-racer", naziv: "Pulse Racer", marka: "Nordlauf", kategorija: "Patike", pol: "Žensko",
    cijena: 135, datum: "2026-10-14", oblik: "patika",
    velicine: [36,37,38,39,40,41,42],
    opis: "Patika za trčanje sa pločom za stabilnost i visokim prednjim đonom za brz odraz.",
    materijal: "Inženjerska mreža", djon: "Pjena visokog odraza",
    varijante: [
      { sku: "NL-PR-LIM", boja: "Limeta", porodica: "zelena", hex: "#C9DB5A", djonHex: "#F4F4EE", detaljHex: "#2C4A3E", nema: [] },
      { sku: "NL-PR-ORC", boja: "Orhideja", porodica: "roza", hex: "#C77DBA", djonHex: "#F4F0F4", detaljHex: "#3E2A52", nema: [42] },
      { sku: "NL-PR-ICE", boja: "Led", porodica: "plava", hex: "#BFD9E8", djonHex: "#FFFFFF", detaljHex: "#E2603F", nema: [] },
      { sku: "NL-PR-SUN", boja: "Zalazak", porodica: "crvena", hex: "#EE7B4E", djonHex: "#FBF2E8", detaljHex: "#5B2F86", nema: [36] }
    ]
  },
  {
    id: "trail-ridge", naziv: "Trail Ridge GTX", marka: "Nordlauf", kategorija: "Patike", pol: "Muško",
    cijena: 159, datum: "2026-10-08", oblik: "patika",
    velicine: [40,41,42,43,44,45,46],
    opis: "Planinarska patika sa vodootpornom membranom i dubokim šarama đona za mokre staze.",
    materijal: "Nubuk koža, vodootporna membrana", djon: "Guma sa šarama od 5 mm",
    varijante: [
      { sku: "NL-TR-STN", boja: "Kamen", porodica: "siva", hex: "#8C8B84", djonHex: "#3B3A36", detaljHex: "#D88A3D", nema: [] },
      { sku: "NL-TR-FRS", boja: "Šumska", porodica: "zelena", hex: "#2F4A3A", djonHex: "#2A2925", detaljHex: "#C7D36F", nema: [40] },
      { sku: "NL-TR-CLY", boja: "Glina", porodica: "smedja", hex: "#9A6A4C", djonHex: "#3A2F28", detaljHex: "#F2E2C4", nema: [45, 46] }
    ]
  },
  {
    id: "court-classic", naziv: "Court Classic", marka: "Atelier Mira", kategorija: "Patike", pol: "Žensko",
    cijena: 98, staraCijena: 125, datum: "2026-09-29", oblik: "patika",
    velicine: [36,37,38,39,40,41],
    opis: "Čiste linije teniske patike iz sedamdesetih, od kože punog lica.",
    materijal: "Koža punog lica", djon: "Vulkanizirana guma",
    varijante: [
      { sku: "AM-CC-WGR", boja: "Bijela i zelena", porodica: "bijela", hex: "#F3F1EA", djonHex: "#E7E1D2", detaljHex: "#2E6A4F", nema: [] },
      { sku: "AM-CC-WBL", boja: "Bijela i plava", porodica: "bijela", hex: "#F3F1EA", djonHex: "#E7E1D2", detaljHex: "#2D4F9A", nema: [41] },
      { sku: "AM-CC-PNK", boja: "Puder roza", porodica: "roza", hex: "#E9C4C0", djonHex: "#F4EEE6", detaljHex: "#B65E66", nema: [36] }
    ]
  },
  {
    id: "drift-knit", naziv: "Drift Knit", marka: "Vela", kategorija: "Patike", pol: "Žensko",
    cijena: 89, datum: "2026-10-10", oblik: "patika",
    velicine: [36,37,38,39,40,41],
    opis: "Pletena patika bez pertli koja se navlači kao čarapa. Peta ima ojačanje za stabilnost.",
    materijal: "Reciklirani pleteni poliester", djon: "Lagana pjena",
    varijante: [
      { sku: "VE-DK-SND", boja: "Pijesak", porodica: "bez", hex: "#D8C6A6", djonHex: "#F5F1E8", detaljHex: "#A0754B", nema: [] },
      { sku: "VE-DK-LIL", boja: "Lila", porodica: "roza", hex: "#B9A6D3", djonHex: "#F5F1F8", detaljHex: "#6A4E9A", nema: [40, 41] },
      { sku: "VE-DK-SKY", boja: "Nebo", porodica: "plava", hex: "#9CC3DF", djonHex: "#F2F6F8", detaljHex: "#2D5E86", nema: [] },
      { sku: "VE-DK-GRF", boja: "Grafit", porodica: "siva", hex: "#4D5257", djonHex: "#E8E8E6", detaljHex: "#E6B85C", nema: [36] },
      { sku: "VE-DK-MNT", boja: "Menta", porodica: "zelena", hex: "#A9D8C2", djonHex: "#F4F8F5", detaljHex: "#2E7D63", nema: [37] }
    ]
  },
  {
    id: "studio-low", naziv: "Studio Low", marka: "Sava", kategorija: "Patike", pol: "Muško",
    cijena: 75, datum: "2026-08-21", oblik: "patika",
    velicine: [40,41,42,43,44,45],
    opis: "Niska platnena patika za grad, sa ojačanim prstima i debelim gumenim đonom.",
    materijal: "Pamučno platno", djon: "Prirodna guma",
    varijante: [
      { sku: "SV-SL-ECR", boja: "Ekri", porodica: "bez", hex: "#EDE3CF", djonHex: "#E2D3B5", detaljHex: "#7B5A3A", nema: [] },
      { sku: "SV-SL-BLK", boja: "Crna", porodica: "crna", hex: "#2A2B2D", djonHex: "#EEE9DF", detaljHex: "#EEE9DF", nema: [45] },
      { sku: "SV-SL-RST", boja: "Rđa", porodica: "crvena", hex: "#B5553B", djonHex: "#EDE3CF", detaljHex: "#EDE3CF", nema: [40] }
    ]
  },
  {
    id: "kid-hopper", naziv: "Hopper Kids", marka: "Vela", kategorija: "Patike", pol: "Djeca",
    cijena: 49, datum: "2026-10-03", oblik: "patika",
    velicine: [28,29,30,31,32,33,34,35],
    opis: "Dječija patika na čičak, sa ojačanim prstima i mekanom petom.",
    materijal: "Sintetika, mreža", djon: "Guma",
    varijante: [
      { sku: "VE-KH-YEL", boja: "Limun", porodica: "zuta", hex: "#F0D24A", djonHex: "#F4F1E6", detaljHex: "#2F6FB0", nema: [] },
      { sku: "VE-KH-AQA", boja: "Akva", porodica: "plava", hex: "#5CC0C7", djonHex: "#F4F1E6", detaljHex: "#F08A5D", nema: [28] },
      { sku: "VE-KH-PNK", boja: "Jagoda", porodica: "roza", hex: "#EE8AA6", djonHex: "#F4F1E6", detaljHex: "#7A4FB0", nema: [] }
    ]
  },
  {
    id: "harbor-chelsea", naziv: "Harbor Chelsea", marka: "Sava", kategorija: "Čizme", pol: "Muško",
    cijena: 179, datum: "2026-10-05", oblik: "cizma",
    velicine: [40,41,42,43,44,45,46],
    opis: "Chelsea čizma od mekog semiša sa elastičnim umecima i omčom na peti.",
    materijal: "Semiš (antilop)", djon: "Guma, ušivena po obodu",
    varijante: [
      { sku: "SV-HC-TBC", boja: "Duvan", porodica: "smedja", hex: "#7A5134", djonHex: "#2E241D", detaljHex: "#3C3027", nema: [] },
      { sku: "SV-HC-SND", boja: "Pijesak", porodica: "bez", hex: "#C2A47E", djonHex: "#3A2E24", detaljHex: "#6D5A44", nema: [46] },
      { sku: "SV-HC-BLK", boja: "Crna", porodica: "crna", hex: "#2B2A29", djonHex: "#1D1C1B", detaljHex: "#4A4846", nema: [40, 41] }
    ]
  },
  {
    id: "alpa-lace", naziv: "Alpa Lace-Up", marka: "Nordlauf", kategorija: "Čizme", pol: "Žensko",
    cijena: 165, datum: "2026-09-18", oblik: "cizma",
    velicine: [36,37,38,39,40,41],
    opis: "Gležnjača na vezanje sa toplom vunenom postavom i laganim đonom za zimu.",
    materijal: "Koža, vunena postava", djon: "Guma otporna na klizanje",
    varijante: [
      { sku: "NL-AL-HNY", boja: "Med", porodica: "zuta", hex: "#C98A3E", djonHex: "#3C2E22", detaljHex: "#EDE0C8", nema: [] },
      { sku: "NL-AL-BRG", boja: "Bordo", porodica: "crvena", hex: "#6E2734", djonHex: "#2B2023", detaljHex: "#E6CFC4", nema: [36] },
      { sku: "NL-AL-OLV", boja: "Maslinasta", porodica: "zelena", hex: "#5B6343", djonHex: "#2C2B24", detaljHex: "#E2DCC4", nema: [41] }
    ]
  },
  {
    id: "mira-sock-boot", naziv: "Mira Sock Boot", marka: "Atelier Mira", kategorija: "Čizme", pol: "Žensko",
    cijena: 149, datum: "2026-10-01", oblik: "cizma",
    velicine: [36,37,38,39,40,41],
    opis: "Uska čizma do gležnja od rastegljivog pletiva, na blok peti od 6 cm.",
    materijal: "Rastegljivo pletivo, koža na peti", djon: "Guma, peta 6 cm",
    varijante: [
      { sku: "AM-SB-CML", boja: "Kamel", porodica: "smedja", hex: "#B58553", djonHex: "#3B2C20", detaljHex: "#8D6236", nema: [] },
      { sku: "AM-SB-BLK", boja: "Crna", porodica: "crna", hex: "#262527", djonHex: "#19181A", detaljHex: "#444247", nema: [] },
      { sku: "AM-SB-CRM", boja: "Krem", porodica: "bez", hex: "#E7DCC7", djonHex: "#3B3129", detaljHex: "#C9B79A", nema: [39] }
    ]
  },
  {
    id: "tundra-high", naziv: "Tundra High", marka: "Nordlauf", kategorija: "Čizme", pol: "Unisex",
    cijena: 199, datum: "2026-10-07", oblik: "cizma",
    velicine: [36,37,38,39,40,41,42,43,44,45],
    opis: "Zimska čizma sa postavom koja grije do −25 °C i đonom koji ne kliže po ledu.",
    materijal: "Vodootporni najlon, koža", djon: "Guma za led",
    varijante: [
      { sku: "NL-TH-SNW", boja: "Snijeg", porodica: "bijela", hex: "#E9EAE6", djonHex: "#4A4C4F", detaljHex: "#C2553A", nema: [] },
      { sku: "NL-TH-PTR", boja: "Petrolej", porodica: "plava", hex: "#1F4E5A", djonHex: "#2B2E30", detaljHex: "#E2B24E", nema: [36] },
      { sku: "NL-TH-CHR", boja: "Ugalj", porodica: "crna", hex: "#303235", djonHex: "#1E1F21", detaljHex: "#9ACD7E", nema: [] },
      { sku: "NL-TH-CML", boja: "Kamel", porodica: "smedja", hex: "#A87A4E", djonHex: "#3A2D22", detaljHex: "#EDE2CC", nema: [44, 45] }
    ]
  },
  {
    id: "field-worker", naziv: "Field Worker", marka: "Sava", kategorija: "Čizme", pol: "Unisex",
    cijena: 189, datum: "2026-07-30", oblik: "cizma",
    velicine: [37,38,39,40,41,42,43,44,45],
    opis: "Radna čizma po uzoru na stare modele, od masne kože i sa ušivenim rubom.",
    materijal: "Masna koža", djon: "Guma sa šarama, Goodyear šivenje",
    varijante: [
      { sku: "SV-FW-WHS", boja: "Viski", porodica: "smedja", hex: "#94592E", djonHex: "#2D241C", detaljHex: "#D7B98D", nema: [] },
      { sku: "SV-FW-SLT", boja: "Škriljac", porodica: "siva", hex: "#5C6168", djonHex: "#24252A", detaljHex: "#B9BEC4", nema: [37, 38] }
    ]
  },
  {
    id: "riva-loafer", naziv: "Riva Loafer", marka: "Atelier Mira", kategorija: "Cipele", pol: "Žensko",
    cijena: 129, datum: "2026-10-11", oblik: "cipela",
    velicine: [36,37,38,39,40,41],
    opis: "Mokasina sa metalnim detaljem na ristu i blago povišenim đonom od 3 cm.",
    materijal: "Lakovana koža", djon: "Guma, 3 cm",
    varijante: [
      { sku: "AM-RL-BLK", boja: "Crni lak", porodica: "crna", hex: "#1F1E22", djonHex: "#141316", detaljHex: "#C9A961", nema: [] },
      { sku: "AM-RL-WIN", boja: "Vinska", porodica: "crvena", hex: "#6A2230", djonHex: "#251A1D", detaljHex: "#C9A961", nema: [41] },
      { sku: "AM-RL-CRM", boja: "Krem", porodica: "bez", hex: "#E9DFCB", djonHex: "#4B3F33", detaljHex: "#B89B5E", nema: [] },
      { sku: "AM-RL-EMR", boja: "Smaragd", porodica: "zelena", hex: "#1F4D3E", djonHex: "#1A2420", detaljHex: "#C9A961", nema: [36, 37] }
    ]
  },
  {
    id: "porto-penny", naziv: "Porto Penny", marka: "Sava", kategorija: "Cipele", pol: "Muško",
    cijena: 139, datum: "2026-09-12", oblik: "cipela",
    velicine: [40,41,42,43,44,45],
    opis: "Klasična penny mokasina, ručno šivena, sa kožnim đonom i gumenom petom.",
    materijal: "Teleća koža", djon: "Koža, guma na peti",
    varijante: [
      { sku: "SV-PP-CGN", boja: "Konjak", porodica: "smedja", hex: "#8A4E2A", djonHex: "#3A2618", detaljHex: "#6E3D20", nema: [] },
      { sku: "SV-PP-DBR", boja: "Tamnosmeđa", porodica: "smedja", hex: "#4A3022", djonHex: "#2A1C14", detaljHex: "#3A251A", nema: [44] },
      { sku: "SV-PP-NVY", boja: "Teget semiš", porodica: "plava", hex: "#2A3550", djonHex: "#2A1C14", detaljHex: "#1E2740", nema: [] }
    ]
  },
  {
    id: "metro-derby", naziv: "Metro Derby", marka: "Sava", kategorija: "Cipele", pol: "Muško",
    cijena: 155, datum: "2026-10-06", oblik: "cipela",
    velicine: [40,41,42,43,44,45,46],
    opis: "Derby cipela na vezanje sa laganim gumenim đonom, za posao i za vikend.",
    materijal: "Brušena koža", djon: "Lagana guma",
    varijante: [
      { sku: "SV-MD-BLK", boja: "Crna", porodica: "crna", hex: "#26252A", djonHex: "#E8E2D6", detaljHex: "#3A383E", nema: [] },
      { sku: "SV-MD-CHS", boja: "Kesten", porodica: "smedja", hex: "#6B3F27", djonHex: "#E8E2D6", detaljHex: "#55311E", nema: [46] }
    ]
  },
  {
    id: "lago-driver", naziv: "Lago Driver", marka: "Vela", kategorija: "Cipele", pol: "Muško",
    cijena: 109, datum: "2026-08-28", oblik: "cipela",
    velicine: [40,41,42,43,44,45],
    opis: "Mekana mokasina za vožnju sa gumenim čepovima na đonu.",
    materijal: "Semiš", djon: "Gumeni čepovi",
    varijante: [
      { sku: "VE-LD-BLU", boja: "Plava", porodica: "plava", hex: "#4D7AA8", djonHex: "#2C3A47", detaljHex: "#E9E3D3", nema: [] },
      { sku: "VE-LD-TAN", boja: "Tan", porodica: "bez", hex: "#C69C6D", djonHex: "#4A3828", detaljHex: "#E9E3D3", nema: [40] },
      { sku: "VE-LD-SAG", boja: "Žalfija", porodica: "zelena", hex: "#8FA388", djonHex: "#39432F", detaljHex: "#F0EDE3", nema: [45] }
    ]
  },
  {
    id: "costa-slide", naziv: "Costa Slide", marka: "Vela", kategorija: "Papuče", pol: "Unisex",
    cijena: 39, datum: "2026-09-25", oblik: "papuca",
    velicine: [36,37,38,39,40,41,42,43,44,45],
    opis: "Lagana papuča iz jednog komada pjene, za plažu, bazen i kuću.",
    materijal: "EVA pjena", djon: "EVA pjena sa teksturom",
    varijante: [
      { sku: "VE-CS-SND", boja: "Pijesak", porodica: "bez", hex: "#D9C6A3", djonHex: "#CDB892", detaljHex: "#B7A07A", nema: [] },
      { sku: "VE-CS-SEA", boja: "More", porodica: "plava", hex: "#3D7D95", djonHex: "#2F6A80", detaljHex: "#2B5D70", nema: [36] },
      { sku: "VE-CS-SUN", boja: "Sunce", porodica: "zuta", hex: "#EBC24F", djonHex: "#D9AE38", detaljHex: "#C99F2F", nema: [] },
      { sku: "VE-CS-PCH", boja: "Breskva", porodica: "roza", hex: "#EFA996", djonHex: "#E19480", detaljHex: "#D58A76", nema: [44, 45] },
      { sku: "VE-CS-BLK", boja: "Ugalj", porodica: "crna", hex: "#35363A", djonHex: "#2A2B2E", detaljHex: "#232427", nema: [] }
    ]
  },
  {
    id: "casa-felt", naziv: "Casa Felt", marka: "Sava", kategorija: "Papuče", pol: "Unisex",
    cijena: 45, datum: "2026-10-09", oblik: "papuca",
    velicine: [36,37,38,39,40,41,42,43,44,45],
    opis: "Kućna papuča od kuvane vune, sa kožnim uloškom i tankim gumenim đonom.",
    materijal: "Kuvana vuna, koža", djon: "Tanka guma",
    varijante: [
      { sku: "SV-CF-GRY", boja: "Melanž siva", porodica: "siva", hex: "#9A9993", djonHex: "#4A4844", detaljHex: "#C7A77E", nema: [] },
      { sku: "SV-CF-MOS", boja: "Mahovina", porodica: "zelena", hex: "#56653F", djonHex: "#3C3B33", detaljHex: "#C7A77E", nema: [36] },
      { sku: "SV-CF-RUS", boja: "Rđa", porodica: "crvena", hex: "#A24A2F", djonHex: "#3B2C25", detaljHex: "#E2C79D", nema: [] }
    ]
  },
  {
    id: "dune-mule", naziv: "Dune Mule", marka: "Vela", kategorija: "Papuče", pol: "Žensko",
    cijena: 69, datum: "2026-08-04", oblik: "papuca",
    velicine: [36,37,38,39,40,41],
    opis: "Kožna natikača sa mekim uloškom i blagom petom od 2 cm.",
    materijal: "Koža", djon: "Guma, 2 cm",
    varijante: [
      { sku: "VE-DM-TAN", boja: "Tan", porodica: "smedja", hex: "#B9875A", djonHex: "#5A3E28", detaljHex: "#9C6E45", nema: [] },
      { sku: "VE-DM-MLK", boja: "Mliječna", porodica: "bijela", hex: "#F0EADF", djonHex: "#7A6650", detaljHex: "#DDD3C2", nema: [41] },
      { sku: "VE-DM-OLV", boja: "Maslinasta", porodica: "zelena", hex: "#6C7346", djonHex: "#3B3D27", detaljHex: "#585E39", nema: [] }
    ]
  },
  {
    id: "isola-sandal", naziv: "Isola", marka: "Atelier Mira", kategorija: "Sandale", pol: "Žensko",
    cijena: 85, datum: "2026-07-14", oblik: "sandala",
    velicine: [36,37,38,39,40,41],
    opis: "Ravna sandala sa dvije široke trake i anatomskim uloškom od plute.",
    materijal: "Koža, pluta", djon: "Guma",
    varijante: [
      { sku: "AM-IS-NAT", boja: "Prirodna", porodica: "bez", hex: "#C9A57A", djonHex: "#B48C5E", detaljHex: "#E7D2B2", nema: [] },
      { sku: "AM-IS-TER", boja: "Terakota", porodica: "crvena", hex: "#B9583A", djonHex: "#B48C5E", detaljHex: "#E7D2B2", nema: [41] },
      { sku: "AM-IS-WHT", boja: "Bijela", porodica: "bijela", hex: "#F1EEE7", djonHex: "#B48C5E", detaljHex: "#E7D2B2", nema: [] }
    ]
  },
  {
    id: "terra-trek", naziv: "Terra Trek", marka: "Nordlauf", kategorija: "Sandale", pol: "Muško",
    cijena: 95, datum: "2026-06-30", oblik: "sandala",
    velicine: [40,41,42,43,44,45,46],
    opis: "Sandala za planinu sa tri trake na čičak i gumenim đonom sa šarama.",
    materijal: "Reciklirane trake, neopren", djon: "Guma sa šarama",
    varijante: [
      { sku: "NL-TT-OLV", boja: "Maslinasta", porodica: "zelena", hex: "#5F6B3E", djonHex: "#33352B", detaljHex: "#E2A548", nema: [] },
      { sku: "NL-TT-SLT", boja: "Škriljac", porodica: "siva", hex: "#4E5660", djonHex: "#2C2F33", detaljHex: "#7FC0C9", nema: [46] }
    ]
  },
  {
    id: "luna-pump", naziv: "Luna Pump", marka: "Atelier Mira", kategorija: "Štikle", pol: "Žensko",
    cijena: 145, datum: "2026-10-13", oblik: "stikla",
    velicine: [35,36,37,38,39,40,41],
    opis: "Klasična salonka sa špicastim prstima i tankom petom od 8,5 cm.",
    materijal: "Semiš", djon: "Koža, peta 8,5 cm",
    varijante: [
      { sku: "AM-LP-BLK", boja: "Crna", porodica: "crna", hex: "#232226", djonHex: "#141316", detaljHex: "#3C3A40", nema: [] },
      { sku: "AM-LP-NUD", boja: "Nude", porodica: "bez", hex: "#D8B39A", djonHex: "#7A5946", detaljHex: "#C49C80", nema: [35] },
      { sku: "AM-LP-RED", boja: "Trešnja", porodica: "crvena", hex: "#A51F2E", djonHex: "#3E1218", detaljHex: "#7D1621", nema: [] },
      { sku: "AM-LP-COB", boja: "Kobalt", porodica: "plava", hex: "#2546A0", djonHex: "#14244F", detaljHex: "#1A3478", nema: [41] },
      { sku: "AM-LP-EMR", boja: "Smaragd", porodica: "zelena", hex: "#1E6B53", djonHex: "#0F3A2C", detaljHex: "#165340", nema: [35, 36] }
    ]
  },
  {
    id: "sera-slingback", naziv: "Sera Slingback", marka: "Vela", kategorija: "Štikle", pol: "Žensko",
    cijena: 119, staraCijena: 139, datum: "2026-09-08", oblik: "stikla",
    velicine: [36,37,38,39,40,41],
    opis: "Slingback sa niskom kitten petom od 4,5 cm i trakom sa kopčom.",
    materijal: "Koža", djon: "Koža, peta 4,5 cm",
    varijante: [
      { sku: "VE-SS-BTR", boja: "Puter", porodica: "zuta", hex: "#EED9A0", djonHex: "#8A6E3E", detaljHex: "#C7A75D", nema: [] },
      { sku: "VE-SS-BLK", boja: "Crna", porodica: "crna", hex: "#262428", djonHex: "#151417", detaljHex: "#C7A75D", nema: [40] },
      { sku: "VE-SS-ROS", boja: "Ruža", porodica: "roza", hex: "#D99AA6", djonHex: "#7B4A55", detaljHex: "#C7A75D", nema: [] }
    ]
  },
  {
    id: "nora-block", naziv: "Nora Block", marka: "Sava", kategorija: "Štikle", pol: "Žensko",
    cijena: 109, staraCijena: 129, datum: "2026-08-17", oblik: "stikla",
    velicine: [36,37,38,39,40,41],
    opis: "Udobna salonka na blok peti od 7 cm, za cijeli dan na nogama.",
    materijal: "Semiš", djon: "Guma, peta 7 cm",
    varijante: [
      { sku: "SV-NB-CML", boja: "Kamel", porodica: "smedja", hex: "#B07D4C", djonHex: "#4A3424", detaljHex: "#94653A", nema: [] },
      { sku: "SV-NB-SAG", boja: "Žalfija", porodica: "zelena", hex: "#94A68E", djonHex: "#3F4A3A", detaljHex: "#7A8D74", nema: [36] }
    ]
  }
];
