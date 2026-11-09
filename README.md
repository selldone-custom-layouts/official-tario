<p align="center">
  <img src="docs/screenshots/cover.jpg" alt="Tario Market — a red, big-box style storefront Layout for Selldone, on desktop and phone" width="100%">
</p>

<h1 align="center">Tario Market</h1>

<p align="center">
  <b>A bright red, big-box style storefront for a Selldone grocery marketplace.</b><br>
  A custom Selldone Layout built on the official <a href="https://github.com/selldone/storefront">selldone/storefront</a>.
</p>

<p align="center">
  <a href="https://tario.selldone.shop"><img src="https://img.shields.io/badge/live%20shop-tario.selldone.shop-CC0000?style=flat-square" alt="Live shop"></a>
  <a href="https://github.com/selldone-custom-layouts/official-tario/wiki"><img src="https://img.shields.io/badge/docs-wiki-6C3DF4?style=flat-square" alt="Wiki"></a>
  <a href="https://github.com/selldone-custom-layouts/official-tario/wiki/Install-with-AI"><img src="https://img.shields.io/badge/set%20up-with%20AI-f39f37?style=flat-square" alt="Set up with AI"></a>
  <img src="https://img.shields.io/badge/Selldone-Layout-2B2F7A?style=flat-square" alt="Selldone Layout">
  <img src="https://img.shields.io/badge/Vue-3-1fc8a9?style=flat-square&logo=vuedotjs&logoColor=white" alt="Vue 3">
</p>

<p align="center">
  <a href="https://tario.selldone.shop"><b>Open the live shop</b></a> ·
  <a href="https://github.com/selldone-custom-layouts/official-tario/wiki/Install-with-AI">Set it up with AI</a> ·
  <a href="https://github.com/selldone-custom-layouts/official-tario/wiki/Manual-Setup">Manual setup</a> ·
  <a href="https://github.com/selldone-custom-layouts/official-tario/wiki/Shop-Requirements">What your shop needs</a> ·
  <a href="https://github.com/selldone-custom-layouts">All Selldone custom layouts</a>
</p>

---

## What it is

**Tario Market** dresses a grocery marketplace like a big-box store:
- red for every action and every saving;
- near-black headings in a heavy sans;
- a big-box home: a hero that turns, round categories, rows of cards with a red **Add to cart**, promo tiles and lifestyle photos;
- white cards on light-grey wells;
- aisle and search pages with a chip bar of filters, a product page with a framed buy box, and a cart page with a free-shipping meter.

It runs on **[tario.selldone.shop](https://tario.selldone.shop)**, a second address of the same Selldone shop, molino. The shop's main address keeps its own Layout, [Molino Market Hall](https://github.com/selldone-custom-layouts/official-molino). Selldone lets each domain of a shop carry its own Layout.

Selldone's own basket, checkout, payments, vendor offers and orders keep working underneath. Nothing about the shop is hard-coded: the name, logo, aisles, sellers and prices all come from the shop that runs it.

## Highlights

- **Header:** a red promo strip with the shop's own free-shipping rule, then the wordmark with its round red dot, **Categories**, Deals, New arrivals and **Sellers** menus, a wide search pill with a round red button, Sign in and the cart with its count.
- **Home:**
  - a split hero that turns: the week's deals ("up to N% off", read live), what is new, and the fresh aisle;
  - "Shop by category" as rows of round pictures;
  - **Top deals** and **New arrivals** rows;
  - "Deals for every aisle": promo tiles that say what each aisle has on offer;
  - "Ways to get it": pickup, delivery and shipping with their free rules, from the shop's settings;
  - "Fresh finds": three tall editorial tiles;
  - "Trending in" every aisle, and the sellers.

  Eleven lifestyle photos ship in [`assets/tario/`](assets/tario/); a missing one is replaced by the aisle's own packshots. Empty sections fold away.
- **Cards:** the price first and large (red on offer, "reg $x" and "Sale" beside it), the name, "★★★★☆ 4.2 (19)" once rated, who sells it, and a square red **Add to cart** that turns into "− 1 in cart +" in place; products with sizes say "Choose options".
- **Aisle, search, Deals and All products:** the title, the aisle's types as round shortcuts (Milk, Eggs, Butter…), and one row of filter chips over a four-across grid: **Filter & sort** opens every filter in a panel (a sheet on a phone), Deals switches the offers on, and Price, Size, Type and the aisle's other filters each open a small menu. The filters are the aisle's own Selldone filters. A search also shows the aisles its results sit in.
- **Product page:**
  - pictures with thumbnails under them and the product's highlights;
  - a framed buy box: **Pickup | Delivery | Shipping** from the shop's own delivery methods, the price with the saving, the sizes, a **Compare sellers** table, and Add to cart;
  - "Goes well with": the product and two partners from neighbouring aisles, added with one button;
  - folding Specifications, Shipping & delivery and Ratings & reviews.
- **Cart page:** "Cart · 4 items · 2 sellers, one checkout", a free-shipping meter from the shop's own rule, a card per seller with Visit shop and Remove, "How do you want it?" tiles, Deliver to (a map-first address sheet) and Your receipt goes to, and an order summary whose red button leads to whatever is still missing.
- **Cart drawer:** the meter, the lines under each seller, three products often added, and View cart / Check out.
- **Seller page:** a banner with the seller's mark and live numbers, tabs (Shop, Deals, New, About), the seller's aisles, their deals and every product with the same chip bar.
- **Sign-in, About, journal, 404:** a sign-in card with the shop's own ways in; About with a photo, the shop's numbers on a red band and its sellers; a journal with a featured story and a grid; a 404 with a search and the aisles.
- **Orders and account:** the order page with a package per seller, chat and the receipt, and the buyer account with its side menu.
- **Everywhere:** no "Added to cart" pop-ups and no phone bottom bar.

## Use it on your shop

| You want to… | Read |
| --- | --- |
| Let an AI agent (Claude Code, Codex…) set it up for your shop | [Install with AI](https://github.com/selldone-custom-layouts/official-tario/wiki/Install-with-AI) |
| Do it yourself, step by step | [Manual Setup](https://github.com/selldone-custom-layouts/official-tario/wiki/Manual-Setup) |
| Know what data your shop needs for the design to look right | [Shop Requirements](https://github.com/selldone-custom-layouts/official-tario/wiki/Shop-Requirements) |
| Build, upload and verify a release | [Build and Upload](https://github.com/selldone-custom-layouts/official-tario/wiki/Build-and-Upload) |
| Put the Layout live on your shop, or on one domain of it | [Go Live](https://github.com/selldone-custom-layouts/official-tario/wiki/Go-Live) |
| Change colours, fonts, sections or pages | [Customize](https://github.com/selldone-custom-layouts/official-tario/wiki/Customize) |
| Fix a blank page, a rejected upload or an old version showing | [Troubleshooting](https://github.com/selldone-custom-layouts/official-tario/wiki/Troubleshooting) |

The wiki's source is also in [`docs/wiki/`](docs/wiki/).

<!-- THEME:START -->
### Theme and colours

Choose Tario's colours in one file, `components/tario/tario-theme.settings.ts`:

- `palette`: red, blue, green, violet, teal;
- or `brandColor`: any `#RRGGBB`, made readable automatically (`textOnBrand: "auto"` keeps a light brand such as yellow, with dark words);
- `mode`: light or dark;
- `themeSwitcher`: showcase, on or off.

You can also tell your AI agent "use the yellow theme" or "make it dark": `AGENTS.md` (section "Theme") tells it what to change. Then build and upload. See the wiki page [Theme and colours](https://github.com/selldone-custom-layouts/official-tario/wiki/Theme-and-colours).

The header's Theme button (palettes, Custom colour, Light / Dark) is a showcase feature. It shows only on Tario's own showcase shop (molino, Selldone shop 15645), so when you import Tario into your shop, your shoppers see Tario in its designed colours, with no Theme button. The Layout looks exactly as it does without the switcher, and any stored choice is ignored. To offer the switcher to your shoppers, set `themeSwitcher: "on"` in `components/tario/tario-theme.settings.ts`, then build and upload. `themeSwitcher: "off"` hides it everywhere.
<!-- THEME:END -->

## Quick start (developers)

```bash
git clone --recurse-submodules https://github.com/selldone-custom-layouts/official-tario.git
cd official-tario
npm install --force
npm run serve            # dev server on http://localhost:9124
```

Releases: `bash scripts/release.sh <new-version> desk`. See [Build and Upload](https://github.com/selldone-custom-layouts/official-tario/wiki/Build-and-Upload).

## Where things are

| Area | Files |
| --- | --- |
| The home page (design A) and its photos | [`components/tario/`](components/tario/), [`style/tario-home.scss`](style/tario-home.scss), [`assets/tario/`](assets/tario/) |
| Tario's dress: header, footer, wells, checkout steps | [`style/tario-skin.scss`](style/tario-skin.scss), [`style/tario-home.scss`](style/tario-home.scss) |
| Tokens: red, near-black, Inter, corners | [`style/kalio-tokens.scss`](style/kalio-tokens.scss) |
| What Tario changed from Molino, and why | [`TARIO.md`](TARIO.md) |
| The components and every behaviour (shared with Molino) | [`components/kalio/`](components/kalio/), [`KALIO.md`](KALIO.md) |
| Release tooling | [`scripts/`](scripts/) |
| Selldone storefront's original README | [`README.selldone.md`](README.selldone.md) |

The code shares its components with [Molino Market Hall](https://github.com/selldone-custom-layouts/official-molino): the class names start with `k-` and the files with `kalio-`. Tario's own pieces start with `t-` / `tario-`.

## Credits and license

Built on the official [Selldone Storefront](https://github.com/selldone/storefront) (MIT License, © Selldone); see [`LICENSE.md`](LICENSE.md). Part of **[Selldone Custom Layouts](https://github.com/selldone-custom-layouts)**.
