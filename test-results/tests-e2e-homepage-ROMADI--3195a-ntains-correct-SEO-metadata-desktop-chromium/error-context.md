# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\homepage.spec.ts >> ROMADI homepage >> contains correct SEO metadata
- Location: tests\e2e\tests\e2e\homepage.spec.ts:31:7

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('meta[property="og:image"]')
Expected: "https://romadi.lv/images/brand/romadi-search-thumbnail.png"
Received: "https://romadi.lv/images/social/romadi-share-v2.png"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('meta[property="og:image"]')
    12 × locator resolved to <meta property="og:image" content="https://romadi.lv/images/social/romadi-share-v2.png"/>
       - unexpected value "https://romadi.lv/images/social/romadi-share-v2.png"

```

```yaml
- link "Pāriet uz saturu":
  - /url: "#main-content"
- banner:
  - link "ROMADI sākumlapa":
    - /url: /
  - navigation "Galvenā navigācija":
    - link "Pakalpojumi":
      - /url: /pakalpojumi
    - link "Portfolio":
      - /url: /portfolio
    - link "Par mums":
      - /url: /par-mums
    - link "Kontakti":
      - /url: /kontakti
  - link "Pieteikt projektu":
    - /url: /kontakti
- main:
  - heading "Vairāk nekā tikai mājaslapa" [level=1]
  - paragraph:
    - strong: ROMADI
    - text: — digitālais partneris mūsdienīgu, ātru un pārdomātu tīmekļa risinājumu izstrādei.
  - link "Sākt projektu":
    - /url: /kontakti
  - link "Apskatīt darbus":
    - /url: /portfolio
  - term: Projekti
  - definition: 50+
  - term: Pieredze
  - definition: 5+ gadi
  - term: Lokācija
  - definition: Liepāja / Latvija
  - text: ROMADI / Digitālā pieredze 56.5047° N / 21.0108° E
  - region "Partneri, kas mums uzticas":
    - paragraph
    - list "ROMADI partneru logo saraksts":
      - listitem:
        - link "Atvērt RTU LJK":
          - /url: https://ljk.lv
          - text: RTU LJK
      - listitem:
        - link "Atvērt DIANA":
          - /url: https://dianahunt.lv
          - text: DIANA
      - listitem:
        - link "Atvērt LIEPAJASTELTIS":
          - /url: https://liepajasteltis.netlify.app
          - text: LIEPAJASTELTIS
  - region "Digitāli risinājumi, kas sākas ar skaidru domu un beidzas ar darbu, kas strādā.":
    - paragraph
    - heading "Digitāli risinājumi, kas sākas ar skaidru domu un beidzas ar darbu, kas strādā." [level=2]
    - paragraph: "Palīdzam uzņēmumiem izveidot, uzlabot un ilgtermiņā attīstīt digitālo klātbūtni: no mājaslapām un e-veikaliem līdz sistēmām, automatizācijai, dizainam un praktiskai izaugsmei pēc palaišanas."
    - link "01 Mājaslapu izstrāde Ātras, pārdomātas un viegli uzturamas mājaslapas uzņēmuma izaugsmei.":
      - /url: /pakalpojumi/majaslapu-izstrade
      - text: "01"
      - heading "Mājaslapu izstrāde" [level=3]
      - paragraph: Ātras, pārdomātas un viegli uzturamas mājaslapas uzņēmuma izaugsmei.
    - link "02 Interneta veikalu izstrāde E-komercijas risinājumi ar ērtu pirkšanas plūsmu un pārdomātām integrācijām.":
      - /url: /pakalpojumi/interneta-veikalu-izstrade
      - text: "02"
      - heading "Interneta veikalu izstrāde" [level=3]
      - paragraph: E-komercijas risinājumi ar ērtu pirkšanas plūsmu un pārdomātām integrācijām.
    - link "03 Digitālie produkti un sistēmas Portāli, klientu zonas, rezervācijas un iekšējie rīki sarežģītu procesu sakārtošanai.":
      - /url: /pakalpojumi/digitalo-produktu-un-sistemu-izstrade
      - text: "03"
      - heading "Digitālie produkti un sistēmas" [level=3]
      - paragraph: Portāli, klientu zonas, rezervācijas un iekšējie rīki sarežģītu procesu sakārtošanai.
    - link "04 Zīmols un UI/UX dizains Vizuālā identitāte un digitālo produktu dizains vienotai zīmola pieredzei.":
      - /url: /pakalpojumi/zimola-un-ui-ux-dizains
      - text: "04"
      - heading "Zīmols un UI/UX dizains" [level=3]
      - paragraph: Vizuālā identitāte un digitālo produktu dizains vienotai zīmola pieredzei.
    - link "05 AI un automatizācija Praktiski AI palīgi un automatizētas darbplūsmas ikdienas laika ietaupījumam.":
      - /url: /pakalpojumi/ai-un-automatizacija
      - text: "05"
      - heading "AI un automatizācija" [level=3]
      - paragraph: Praktiski AI palīgi un automatizētas darbplūsmas ikdienas laika ietaupījumam.
    - link "06 Digitālā izaugsme Analītika, SEO un konversiju uzlabojumi ilgtspējīgai digitālajai izaugsmei.":
      - /url: /pakalpojumi/digitala-izaugsme
      - text: "06"
      - heading "Digitālā izaugsme" [level=3]
      - paragraph: Analītika, SEO un konversiju uzlabojumi ilgtspējīgai digitālajai izaugsmei.
    - link "07 Pārbūve un ilgtermiņa atbalsts Esošu risinājumu audits, pārbūve, uzturēšana un tehniskais atbalsts.":
      - /url: /pakalpojumi/majaslapu-uzturesana-un-parbuve
      - text: "07"
      - heading "Pārbūve un ilgtermiņa atbalsts" [level=3]
      - paragraph: Esošu risinājumu audits, pārbūve, uzturēšana un tehniskais atbalsts.
  - region "Dizains bez “pietiekami labi”.":
    - heading "Dizains bez “pietiekami labi”." [level=2]
    - paragraph: Veidojam digitālu pieredzi, kuru gribas izpētīt — no drosmīgas idejas līdz pēdējai mikrointerakcijai.
    - article:
      - img "Novara zīmola logotipa dizaina karte"
    - tablist "Dizaina virzieni":
      - tab "Iespaidīga pieredze Drosmīgs vizuālais stāsts, kas rada sajūtu un paliek atmiņā." [selected]:
        - heading "Iespaidīga pieredze" [level=3]
        - paragraph: Drosmīgs vizuālais stāsts, kas rada sajūtu un paliek atmiņā.
      - tab "Nevainojama plūsma Skaidra struktūra, kas dabiski aizved lietotāju līdz izvēlei.":
        - heading "Nevainojama plūsma" [level=3]
        - paragraph: Skaidra struktūra, kas dabiski aizved lietotāju līdz izvēlei.
      - tab "Detaļas ar raksturu Tipogrāfija un mikrointerakcijas, kas zīmolam piešķir savu balsi.":
        - heading "Detaļas ar raksturu" [level=3]
        - paragraph: Tipogrāfija un mikrointerakcijas, kas zīmolam piešķir savu balsi.
  - region "Digitālais partneris jūsu uzņēmuma izaugsmei.":
    - paragraph
    - heading "Digitālais partneris jūsu uzņēmuma izaugsmei." [level=2]
    - paragraph: “Labs digitālais risinājums nav tikai skaists palaišanas dienā. Tam jābūt ātram, saprotamam un gatavam augt līdzi biznesam. Tāpēc skatāmies plašāk par vienu uzdevumu un palīdzam pieņemt lēmumus, kas strādā ilgtermiņā.”
    - strong: ROMADI komanda
    - text: Digitālā izstrāde un izaugsme · Liepāja
    - article:
      - heading "Tehniskā virzība un arhitektūra" [level=3]
    - article:
      - heading "Sadarbība ar jūsu komandu" [level=3]
    - article:
      - heading "Praktiski ieteikumi izaugsmei" [level=3]
    - article:
      - heading "Drošība, ātrums un kvalitāte" [level=3]
    - article:
      - heading "Padziļināta koda un UX pārbaude" [level=3]
    - article:
      - heading "Ilgtermiņa attīstība un atbalsts" [level=3]
  - region "Ko saka mūsu klienti":
    - heading "Ko saka mūsu klienti" [level=2]
    - paragraph: Atsauksmes no mūsu klientiem.
    - article:
      - blockquote: Pateicoties sadarbībai ar ROMADI, ieguvām pozitīvus rezultātus — pieauga pasūtījumu skaits un uzlabojās pozīcijas meklētājos.
      - strong: Liepājas Teltis
      - link "liepajasteltis.lv":
        - /url: https://liepajasteltis.lv
    - button "Iepriekšējā atsauksme"
    - text: 01 02
    - group "Izvēlēties atsauksmi":
      - button "Rādīt Liepājas Teltis atsauksmi"
      - button "Rādīt Diana Hunt atsauksmi"
    - button "Nākamā atsauksme"
  - region "Labs sākums bez ilgas izstrādes.":
    - paragraph
    - heading "Labs sākums bez ilgas izstrādes." [level=2]
    - paragraph: Izvēlieties gatavu dizaina pamatu. Mēs pievienosim jūsu logo, krāsas un saturu — bez individuālas dizaina izstrādes no nulles.
    - list "Piedāvājumā iekļauts":
      - listitem: Mobilā versija
      - listitem: Satura ievietošana
      - listitem: Palaišanas atbalsts
    - link "Apskatīt veidnes":
      - /url: /veidnes
    - paragraph: No 350 €
    - figure:
      - img "Gatavas vietējā pakalpojumu uzņēmuma mājaslapas dizaina piemērs"
    - figure:
      - img "Gatavas skaistumkopšanas un labsajūtas mājaslapas dizaina piemērs"
    - figure:
      - img "Gatavas viesu nama mājaslapas dizaina piemērs"
- contentinfo:
  - region "Lieliskas idejas. Pārdomāti risinājumi.":
    - heading "Lieliskas idejas. Pārdomāti risinājumi." [level=2]
    - paragraph: Pastāstiet par savu ieceri. Palīdzēsim tai kļūt par skaidru, mūsdienīgu un vērtīgu digitālo risinājumu.
    - link "Pieteikt projektu":
      - /url: /kontakti
  - region "Vēlaties sazināties?":
    - heading "Vēlaties sazināties?" [level=2]
    - paragraph: Pastāstiet par savu ideju, ieceri vai jautājumu. Atbildēsim un palīdzēsim atrast labāko nākamo soli.
    - link "info@romadi.lv":
      - /url: mailto:info@romadi.lv
  - navigation "Uzņēmums":
    - paragraph: UZŅĒMUMS
    - link "Par mums":
      - /url: /par-mums
    - link "Portfolio":
      - /url: /portfolio
    - link "Veidnes":
      - /url: /veidnes
    - link "Kontakti":
      - /url: /kontakti
    - link "Sākums":
      - /url: /
  - navigation "Pakalpojumi":
    - paragraph: PAKALPOJUMI
    - link "Mājaslapas":
      - /url: /pakalpojumi/majaslapu-izstrade
    - link "E-komercija":
      - /url: /pakalpojumi/interneta-veikalu-izstrade
    - link "Digitālie produkti":
      - /url: /pakalpojumi/digitalo-produktu-un-sistemu-izstrade
    - link "Zīmols un dizains":
      - /url: /pakalpojumi/zimola-un-ui-ux-dizains
  - navigation "Kontakti":
    - paragraph: SAZINĀTIES
    - link "info@romadi.lv":
      - /url: mailto:info@romadi.lv
    - link "+371 26 625 125":
      - /url: tel:+37126625125
    - link "+371 26 084 851":
      - /url: tel:+37126084851
    - text: Liepāja, Latvija
  - navigation "Sociālie tīkli":
    - paragraph: SOCIĀLIE TĪKLI
    - link "Instagram":
      - /url: https://www.instagram.com/romadi.lv
    - link "Facebook":
      - /url: https://www.facebook.com/people/Sia-Romadi/61594766196559
    - text: LinkedIn
    - link "TikTok":
      - /url: https://www.tiktok.com/@romadilv
  - paragraph:
    - text: © 2026 ROMADI. VISAS TIESĪBAS AIZSARGĀTAS.
    - link "SĪKDATŅU POLITIKA":
      - /url: /sikdatnu-politika
    - button "SĪKDATŅU IESTATĪJUMI"
  - paragraph: DIGITĀLI RISINĀJUMI UZŅĒMUMA IZAUGSMEI / BUILT BY ROMADI
- complementary "Sīkdatņu izvēle":
  - heading "Sīkdatņu izvēle" [level=2]
  - paragraph:
    - text: Mēs izmantojam sīkdatnes, lai nodrošinātu vietnes darbību un anonīmi analizētu apmeklējumu.
    - link "Uzzināt vairāk":
      - /url: /sikdatnu-politika
  - button "Noraidīt"
  - button "Piekrist"
```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test';
  2   | 
  3   | test.describe('ROMADI homepage', () => {
  4   |   test('displays the main homepage content', async ({ page }) => {
  5   |     await page.goto('/');
  6   | 
  7   |     await expect(page).toHaveTitle(/ROMADI — mājaslapu izstrāde un digitālā izaugsme/i);
  8   | 
  9   |     await expect(
  10  |       page.getByRole('heading', {
  11  |         level: 1,
  12  |         name: /vairāk nekā tikai mājaslapa/i,
  13  |       }),
  14  |     ).toBeVisible();
  15  | 
  16  |     await expect(
  17  |       page
  18  |         .getByRole('link', {
  19  |           name: /pieteikt projektu/i,
  20  |         })
  21  |         .last(),
  22  |     ).toBeVisible();
  23  | 
  24  |     await expect(
  25  |       page.getByRole('link', {
  26  |         name: /apskatīt darbus/i,
  27  |       }),
  28  |     ).toBeVisible();
  29  |   });
  30  | 
  31  |   test('contains correct SEO metadata', async ({ page }) => {
  32  |     await page.goto('/');
  33  | 
  34  |     await expect(page.locator('meta[name="description"]')).toHaveAttribute(
  35  |       'content',
  36  |       /ROMADI izstrādā mūsdienīgas mājaslapas/i,
  37  |     );
  38  | 
  39  |     await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
  40  |       'href',
  41  |       'https://romadi.lv/',
  42  |     );
  43  | 
  44  |     await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
  45  |       'content',
  46  |       'ROMADI',
  47  |     );
  48  | 
> 49  |     await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      |                                                             ^ Error: expect(locator).toHaveAttribute(expected) failed
  50  |       'content',
  51  |       'https://romadi.lv/images/brand/romadi-search-thumbnail.png',
  52  |     );
  53  |     await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute(
  54  |       'content',
  55  |       'image/png',
  56  |     );
  57  |     await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary');
  58  | 
  59  |     const structuredData = await page
  60  |       .locator('script[type="application/ld+json"]')
  61  |       .evaluate((script) => JSON.parse(script.textContent ?? '{}'));
  62  |     expect(structuredData['@graph']).toEqual(
  63  |       expect.arrayContaining([
  64  |         expect.objectContaining({
  65  |           '@type': 'WebPage',
  66  |           primaryImageOfPage: expect.objectContaining({
  67  |             contentUrl: 'https://romadi.lv/images/brand/romadi-search-thumbnail.png',
  68  |             width: 1200,
  69  |             height: 1200,
  70  |           }),
  71  |         }),
  72  |         expect.objectContaining({
  73  |           '@type': 'Organization',
  74  |           logo: expect.objectContaining({
  75  |             url: 'https://romadi.lv/images/brand/romadi-search-thumbnail.png',
  76  |           }),
  77  |         }),
  78  |       ]),
  79  |     );
  80  | 
  81  |     await expect(page.locator('html')).toHaveAttribute('lang', 'lv');
  82  |   });
  83  | 
  84  |   test('primary navigation links have valid destinations', async ({ page }) => {
  85  |     await page.goto('/');
  86  | 
  87  |     await expect(
  88  |       page
  89  |         .getByRole('link', {
  90  |           name: /pieteikt projektu/i,
  91  |         })
  92  |         .last(),
  93  |     ).toHaveAttribute('href', '/kontakti');
  94  | 
  95  |     await expect(
  96  |       page.getByRole('link', {
  97  |         name: /apskatīt darbus/i,
  98  |       }),
  99  |     ).toHaveAttribute('href', '/portfolio');
  100 |   });
  101 | 
  102 |   test('homepage works on mobile', async ({ page }) => {
  103 |     await page.setViewportSize({
  104 |       width: 390,
  105 |       height: 844,
  106 |     });
  107 | 
  108 |     await page.goto('/');
  109 | 
  110 |     await expect(
  111 |       page.getByRole('heading', {
  112 |         level: 1,
  113 |         name: /vairāk nekā tikai mājaslapa/i,
  114 |       }),
  115 |     ).toBeVisible();
  116 | 
  117 |     await expect(
  118 |       page.getByRole('link', {
  119 |         name: /pieteikt projektu/i,
  120 |       }),
  121 |     ).toBeVisible();
  122 |   });
  123 | 
  124 |   test('mobile navigation opens with a real transition', async ({ page }) => {
  125 |     await page.setViewportSize({ width: 390, height: 844 });
  126 |     await page.addInitScript(() => {
  127 |       localStorage.setItem(
  128 |         'romadi_cookie_consent_v1',
  129 |         JSON.stringify({ choice: 'denied', updatedAt: Date.now() }),
  130 |       );
  131 |     });
  132 |     await page.goto('/');
  133 | 
  134 |     const menu = page.locator('.site-header__mobile-menu');
  135 |     const trigger = menu.locator('summary');
  136 |     const panel = menu.locator('.site-header__mobile-panel');
  137 | 
  138 |     await expect(menu).not.toHaveAttribute('open', '');
  139 |     await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  140 |     await panel.evaluate((element) => {
  141 |       const testWindow = window as Window & { __romadiMenuTransitionRan?: boolean };
  142 |       testWindow.__romadiMenuTransitionRan = false;
  143 |       element.addEventListener('transitionrun', (event) => {
  144 |         if ((event as TransitionEvent).propertyName === 'transform') {
  145 |           testWindow.__romadiMenuTransitionRan = true;
  146 |         }
  147 |       });
  148 |     });
  149 |     await trigger.click();
```