# Tario — Selldone Layout

**Tario Market** (package `tario-market`) is the second Layout of the Selldone shop **molino** (shop 15645). It started on 7 November 2026 as a copy of Molino Market Hall (`kalio-market-hall`, layout 23, release 0.2.30) and was re-dressed in a red, big-box style. The owner asked for "a new one like Target's site, with the same red theme… checkout built right", named tario, on `tario.selldone.shop`.

Every behaviour of Molino is kept, because the owner asked for each of them:

- "Add to basket" turns into "− n in basket +" in place, and "See options" shows for products with sizes;
- no "Added to basket" pop-up and no phone bottom bar;
- the two-step, map-first address sheet, with suggestions while typing;
- the receipt that follows Selldone's bill, and Pay leading to whatever is missing;
- the reviews (design A), the buyer account (design A, "desk") and the content pages.

[`KALIO.md`](KALIO.md) explains every one of them and every Selldone workaround. Read it before changing anything.

## What makes it Tario

| Area | Molino | Tario |
| --- | --- | --- |
| Action colour | deep green `#155b42` | red `#cc0000` (the token is still called `--k-green`) |
| Savings | coral | the same red |
| Type | Fraunces headings, DM Sans | Inter for everything; headings 800, tight |
| Corners | 20 px cards | 12 px cards, 8 px small |
| Header | white, aisle words in grey | a **red promo strip** that scrolls away (the shop's free-shipping rule); a white bar with the wordmark and its round red dot, **Categories ▾, Deals, New arrivals, Sellers ▾**, a grey search pill with a round red button, Sign in and a cart icon with its count; no aisle strip |
| Product pictures | each aisle's pastel tint | one light-grey well (`--k-well`); aisle rings and the mosaic keep their colours |
| Footer | deep green, with a band above it | light `#fafafa` under a 4 px red rule, ink headings, no band |
| Stars | amber | near-black |
| Home page | deals counter, aisle ribbon, rails, mosaic, shelf | a big-box home (design A), see below |
| Cards | Selldone's card, pill "Add to basket" | Tario's own card on the home (price first, red on offer, "reg $x", "Sale"); a square red **"Add to cart"** on every card, "Choose options" for sizes, "− n in cart +" |
| Checkout | "Your details" eyebrow | numbered steps: **1 Review your items**, **2 Delivery & contact**, **3 Order summary** (white card, red Place button, grey when something is missing) |

- The token values are in `style/kalio-tokens.scss`.
- The structural differences are in `style/tario-skin.scss`, loaded last.
- The step headings are in `pages/basket/cart/StorefrontPageBasketCart.vue` (`.t-step`).
- Every green literal of Molino's stylesheets was mapped to a red or a grey.

## The home page (design A, 1.1.0)

The owner rejected 1.0.0's home ("like Target means the home page's sections like Target's, not Molino with the colour turned red"), asked for two mockups per page, and approved **A** (`kalio-design/tario-options/home-a.html`). It is `components/tario/`, styled by `style/tario-home.scss` (loaded after `tario-skin.scss`):

| Section | Component | Read from |
| --- | --- | --- |
| Hero that turns: deals, new, the fresh aisle | `TarioHero.vue` | discounted best sellers (best saving by Selldone's rule), newest, the produce aisle or the first featured one; turns every 7 s, stops on hover or focus, swipes on a phone, never moves with reduced motion |
| Shop by category | `TarioCircles.vue` | every aisle, its picture on its tint |
| Top deals (or Popular this week) | `TarioRow.vue` + `TarioCard.vue` | discounted best sellers, spread by aisle |
| Deals for every aisle | `TarioTiles.vue` | breakfast, snacks, bakery, household, meat when the shop has them, else the next aisles; "Up to N% off" only when the aisle has offers |
| Ways to get it | `TarioWays.vue` | `shop.transportations` that are on, with their free rule |
| New arrivals | `TarioRow.vue` | newest |
| Fresh finds | `TarioFinds.vue` | produce, drinks, dinner aisles |
| Trending in &lt;aisle&gt; | `TarioRow.vue` | every aisle, lazily |
| Shop our sellers | `TarioSellers.vue` | the marketplace's sellers and their shelves |

- **Photos:** eleven lifestyle photos in `assets/tario/` (made with Codex from `kalio-design/tario-options/image-prompts-A.md`), picked up at build time by `import.meta.glob` in `tario-home.ts`. A missing photo is not an error: its slot shows a still life of that aisle's own packshots (`TarioPhoto.vue`). Selldone's CDN converts each one to WebP on its first request, so the very first visit after a release is slow to show them.
- **Words:** shopper-facing "basket" became "cart" in the cards, the header, the drawer, the footer and the sign-in sheet.
- **Spacing:** Selldone's 20vh under every page is 24 px (`StorefrontLayout.vue`); the footer has its own margin. The sticky receipt, order summary and product pictures sit 92 px down (the bar alone; the promo strip scrolls away).
- **The other pages:** rebuilt in 1.2.0 from the owner's choices; see the next section.

## Every other page (1.2.0)

The owner chose from two mockups per page (`kalio-design/tario-options/index.html`, 7 November 2026): **product page B** and **A for everything else**. The B designs went to Walio. Styles are in `style/tario-pages.scss`, loaded after `tario-home.scss`.

| Page | Design | Where |
| --- | --- | --- |
| Aisle, search, Deals, All products | A: title, the aisle's "Type" values as round shortcuts, a chip bar of filters, a 4-across grid, "Keep shopping" | `pages/products/StorefrontPageProducts.vue`, `components/tario/shop/TarioShelfTop.vue`, `TarioFilterBar.vue`, `tario-filters.ts` |
| Product | B: pictures with thumbnails under them and Highlights; a framed buy box (Pickup / Delivery / Shipping, price, size, "Compare sellers" table, Add to cart); "Goes well with"; folding Specifications, Shipping & delivery, Ratings & reviews; "More in &lt;aisle&gt;" | `components/tario/product/TarioProductOverview.vue`, `pages/product/StorefrontPageProduct.vue`, `components/kalio/product/KalioSellerOffers.vue` |
| Cart | A: "Cart · n items · 2 sellers, one checkout", the free-shipping meter, a card per seller with Visit shop and Remove, "How do you want it?" on the page, Deliver to and Your receipt goes to, the summary with a red button to what is missing, Often added | `pages/basket/cart/StorefrontPageBasketCart.vue`, `components/kalio/checkout/KalioCartLines.vue` |
| Cart drawer | A: the meter, lines under "Sold by …", three Often added, Items / You save / Subtotal with View cart and Check out | `components/kalio/shell/KalioBasketDrawer.vue` |
| Sign-in | A: one card in the middle (a sheet on a phone), the shop's own ways in, four reasons, the terms | `components/kalio/shell/KalioSignIn.vue` |
| Seller | A: a banner with a photo, the mark, three live numbers, tabs (Shop, Deals, New, About), the seller's aisles, their deals, then every product with the chip bar | `components/tario/shop/TarioSellerTop.vue` |
| Order | A: Molino's order page already had A's parts (thanks card, progress line, a package per seller, chat, receipt); 1.2.0 adds "Forgot something?" | `pages/basket/order/physical/dashbaord/…` |
| Account, Orders | A: Molino's side-rail account (the desk build) | unchanged |
| About | A: a photo with the story on a card, the shop's numbers on a red band, four values, the sellers, the contact block | `pages/official/about-us/StorefrontPageOfficialAboutUs.vue` |
| Terms and Privacy | A: contents beside the text (Molino's) | unchanged |
| Journal | A: a featured story, a grid, "Shop the season" | `pages/blog/list/StorefrontPageBlogsList.vue` |
| Article | A: one centred column (Molino's) | unchanged |
| 404 | A: "This shelf is empty", a search, the way home and to the deals, the aisles as circles | `pages/errors/404/StorefrontPageError404.vue` |

- **Filters:** the chip bar reads the aisle's own Selldone filter record (`parent.filters`; `shop.filters` on the catalogue): Size (volumes), Weight, Pack and the other variant groups first, then the merchant's spec keys, then brands; four get a chip, the rest are under More and in the "Filter & sort" panel. The bar hands every change to the listing (`SProductsListing.setFilter` and `sort`), which fetches and writes the address as before; Selldone's own filter column and toolbar are switched off (`has-filter` false).
- **Filter & sort panel:** Tario's own fixed panel (teleported to the body), not a `v-dialog`: Kalio blurs every Vuetify overlay with `backdrop-filter`, which makes the overlay the containing block of anything fixed inside it and pushed the phone sheet below the screen.
- **"Goes well with":** Selldone gives a storefront no "bought together" data, so the two partners come from the neighbouring aisles (dairy with breakfast and bakery, and so on), best sellers without sizes so one tap adds them. The merchant's own cross-sells still show above, as Selldone's.
- **"How do you want it?" before an address:** Selldone lists and prices a cart's delivery options only once it has the address, so until then the shop's own ways are shown as tiles that open the address sheet.
- **Words:** Selldone's "Add to basket" and "Basket is empty" are "Add to cart" and "Your cart is empty" in `modules/translate` (kept in `patches/modules-translate.kalio.patch`).

## The same shop, two Layouts

- molino's **default** Layout stays Molino Market Hall (23) on `molino.selldone.shop`, `molino.myselldone.com` and every domain that inherits.
- **`tario.selldone.shop` alone** carries Tario: its domain Layout is set to `mode: private` with Tario's layout id and exact version (`api.shops.domains.layout.set`), **not inherit**.
- When releasing Tario, never pin the shop default: that would put Tario on molino's own address.
- Check both addresses after every release: each `window.sdShopLayout` "saved" block must name its own package.
- The shop's name and logo come from its data, so Tario's header says "molino". Nothing is hard-coded.
- Guest baskets and sign-ins are per domain.

## Releases

- **1.2.13 (9 November 2026):** The buyer test after the sync (the owner: "Yes, after sync"): on the live site, search, an aisle with filters, the product page, another option, Compare, the cart, the Theme panel (opens, Esc closes), at 1440 and 390, light and dark, and a custom #ffff00 in dark mode; nothing the theme broke. The row and hero arrows stay white discs with a dark arrow in dark mode (the arrow had turned light on its white disc). In dark mode the empty cart's line drawing (Selldone's baskets.svg, dark lines) was lost on the dark page: it is drawn light. The 404 page's aisle grid keeps equal columns on a phone (a one-word name such as "Beverages" widened its column and its circle). Deploy 459, pinned on tario.selldone.shop.
- **1.2.12 (9 November 2026):** the last shared fixes of the sync, so every molino Layout carries the same code (deploy 457, pinned on tario.selldone.shop). No line under any word inside a link or a button (an em, a span, a title); only links in an article's own text keep theirs. The theme switcher's stylesheet from the kit (Selldone's red notes take the theme's error colour; the cart total no longer fades while it recalculates). The hero, the journal's head and the footer keep the palette's deep shade in both modes, and the © line is a little stronger; the home mosaic's pastel tiles and the yellow offer tag stay light islands in dark mode, and the Add strip under the yellow tag takes the deep shade. On the live site 1.2.11 printed 0 for contrast in every palette and the custom colour, light and dark, the ring sweep, the header check in four themes and the non-showcase checks.
- **1.2.11 (9 November 2026):** the same as Digito, Besti, Dino and Molino, on every molino Layout (the owner: "these must be on every Layout, they must be identical"). A **Theme** action in the header, just before the cart (a palette icon and "Theme"; the icon alone on a phone), opens a small panel: five tested palettes (Tario red, Ocean blue, Green, Violet, Teal), a free **Custom colour** made readable automatically, and Light / Dark. One click changes the whole site at once, the choice is kept in the browser and painted before the first paint; it shows only on molino (the showcase shop), and a merchant who imports Tario sets the theme in `components/tario/tario-theme.settings.ts` (AGENTS.md "Theme", README, wiki "Theme and colours"). Dark mode: Vuetify's dark theme, Digito's dark surfaces, every fixed colour given a dark value at build time; words in the action colour go through a link colour that lightens in dark mode; boxes that hold no photo turn dark while packshot wells stay light; a saving stays red in every palette. Words on the action colour follow an on-brand token. Rings inside their own box. The gallery shows one row of whole thumbnails. Compare: no coloured ground on differing rows, a fixed red under the saving's white words. Empty states keep one rhythm (56px icon disc, 14 / 8 / 20px gaps). Readability fixes: breadcrumb and step icons and empty stars are 3:1, Selldone's red notes and free-shipping green deeper, the footer's credit at full opacity. No deal timer (no molino deal has an end date in Selldone). The domain's loading screen shows the Tario tag and name on red. Tested on the dev server: contrast-audit (red and custom yellow, light and dark), ring-sweep (light and dark): 0.
- **1.2.10 (8 November 2026):** a guest who has just ordered sees the order. A guest's order is bound to the device's guest code at the moment of buying, and Selldone's payment window saves that code for the order so the order page can open it after the code rotates; it saved the cart's own code, which Selldone no longer sends with a guest's cart, so nothing was saved and the guest landed on "We can't open this order" (the owner's buyer test with sign-in optional, 8 November 2026: a guest order placed with cash on delivery). The cart page now hands the payment window the device's guest code when the cart has none; checked with a placed test order whose page then opened. The order page's Messages show the Layout's mark, not the shop record's old "KA" icon.
- **1.2.9 (8 November 2026):** the quick-buy sheet no longer shows "SellerPriceChoose" over its sellers: those column words head the sellers only on the product page, whose rows match them; the sheet lists the sellers as cards (found in the owner's buyer test of Valero, which shares the code).
- **1.2.8 (8 November 2026):** the compare page Dino got in 1.0.7 (design 1 of the two mockups), in this Layout's own dress (the owner: "build it for them, but it must suit each site's own design, so change it a little"). The picks stay pinned at the top with their price, price per unit and the Layout's Add button ("− n +" in place), an empty column adds one more (the shop's search and three from the same aisle, up to four), the details come in the shop's own groups with differing rows marked and same values merged, "Only differences" hides the rest, then pros, reviews and a link to share. The Compare pill opens it instead of Selldone's full-screen table; ?list= keeps Selldone's format. Tario's dress: Inter 800, 12px cards and 8px corners, grey wells, red only for actions and savings; the details read as a spec sheet (grey group heads, banded rows, a differing value in bold behind a red rule); near-black stars; a plain bordered share card. The page is `components/kalio/compare/` (the same in every molino Layout but Dino) with this Layout's words in `compare-skin.ts` and its look in `style/kalio-compare.scss`.
- **1.2.7 (8 November 2026):** no line under words or icons anywhere (the owner, after a line showed under "Compare" and its box icon: "never put these lines under text or icons"). Links, buttons, menus, tabs and chips carry no underline at rest, on hover, focus or press; the line under a product card's "Compare" came from the card being a link, whose hover underline reached every word inside it. The hover underline on filled buttons (a tester's colour-blind request of 7 November) is gone too; those buttons deepen in colour. Only links inside an article's own text keep their line, and struck-through old prices are untouched.
- **1.0.0 (7 November 2026):** the first Tario. It was checked on the dev server with:
  - `cardcheck.cjs` on phone, tablet and computer (everything passed except the old test's expectation that Compare is green);
  - `reviewscheck.cjs` on phone, tablet and computer;
  - `buyer2.cjs` on computer (the phone run of that older script stops at the address form, which is now behind the map step; `cardcheck.cjs` covers the two steps);
  - `qasweep.cjs`.
- **1.2.6 (8 November 2026):** the cart's "How do you want it?" card is laid out again: the radio is hidden in Tario's tiles, but the card kept four columns, so the icon overlapped the name and the name wrapped a word a line (found on Valero, which shares this code). Now the icon, then the name with the price under it. Also a delivery way's line no longer starts with "·" when the way has no message of its own ("· Pay on delivery"); and the Compare pill changes colour on hover and nothing else: no underline under the word and its icon, and not Selldone's widget-hover lift (a 50px shadow easing in over half a second) (the owner: "the hover animation is not good, remove the lines").
- **1.2.5 (7 November 2026):** product cards show the product big: on the home's cards, the catalogue's and aisles', and "Frequently bought together", the pack fills about 84% of its grey box instead of 52–55%; every product photo frames its pack at 70%, centred (all 160 measured), so the photo is now drawn at 120% of its box and cropped by it. The owner asked for this after Walio's cards (Walio 1.1.5).
- **1.2.4 (7 November 2026):** the browser tab of the first page reads "Tario" too (the server writes the shop's own title, "molino", into the first page's head; kalio-brand.ts now renames it as the shop is read).
- **1.2.3 (7 November 2026):** Tario's own name and logo: the shop's title reads "Tario" in this Layout only (kalio-brand.ts sets it as the shop is read; Selldone's record, emails and the SEO page for crawlers keep "molino"); the Layout's own logo (assets/brand/, kalio-brand.ts) before the wordmark in the header, menu and footer and as the tab icon; "Compare" moved off the picture to a quiet "☐ Compare" line at the foot of the card ("☑ Comparing" once picked), as big shops place it; the journal leaves Selldone's sample posts out once the shop has its own (four grocery articles were published on 7 November 2026). Also fixes the home rows' photos (a missing method in TarioCard).
- **1.2.2 (7 November 2026):** a tester's feedback, as in Molino 0.2.31: product photos at the size they are shown (Selldone's 128 thumbnail and 256–768 from the kalio Worker's `/img` resizer, the full photo as fallback), a "☐ Compare / ☑ Comparing" pill on cards and a "⇄ Compare n" pill at the foot instead of rings that looked like loading, no sound when signing in, "Saved" everywhere instead of Favorites and Wishlist, and states that do not rely on colour alone (focus ring, underlined hover, a ticked chosen size).
- **1.2.1 (7 November 2026):** the cart page no longer stops when it opens before Selldone has sent the bill (the free-shipping meter read the bill too early); "per each" is just "each".
- **1.2.0 (7 November 2026):** every page after the home from the chosen mockups (product B, the rest A): the aisle and search pages with a chip bar of filters, the product page with a framed buy box, the cart page and drawer, the sign-in card, the seller page, About, the journal and the 404.
- **1.1.0 (7 November 2026):** the big-box home (design A), the new header and footer, square red "Add to cart" everywhere, "cart" for "basket", and the eleven photos. 374 files; the upload took 35 s. Checked on the dev server with `kalio-design/review/tariohome.cjs` (computer, tablet and phone: every section, add to cart and take it out, no errors, no sideways scroll) and `tariopages.cjs` (category, product, cart and drawer under the new header), then live with `tariolive.cjs`. Pinned on domain 1232 only; molino stays 0.2.30 and walio 1.0.0.
