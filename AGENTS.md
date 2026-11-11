# AI Agent Entry Point

Detailed AI instructions and reusable custom Storefront Layout material live
in the dedicated [`.ai-agent/`](.ai-agent/) directory so they stay separate
from application source.

For tasks that customize, redesign, audit, package, or publish this Storefront
as a custom Selldone Layout, read these files completely:

1. [`.ai-agent/AGENTS.md`](.ai-agent/AGENTS.md)
2. [`.ai-agent/SKILL.md`](.ai-agent/SKILL.md)
3. [`.ai-agent/AI_WORKFLOW.md`](.ai-agent/AI_WORKFLOW.md) when GitHub setup,
   dependency synchronization, packaging, authentication, or deployment is in
   scope

The official Vue 3/Vite Storefront is the implementation baseline. This kit
does not authorize a framework replacement or a parallel storefront app; the
visual design may change completely while the platform and commerce contracts
remain intact. Do not change the official repository's Git remote model or run
release commands merely because this shim exists. Apply publication rules in
the owner's controlled clone, fork, or release branch.

<!-- THEME:START -->
## Language and currency (money and words)

The visitor's currency and language come from Selldone; the switcher is `components/region-switcher/` (a shared package: do not edit the copy; its guide is `new-shop-kits/region-switcher/PORTING.md`). Desktop: a pill beside the account in the header; phone: a "Language & currency" row at the foot of the menu with a bottom sheet.

- **Every amount** goes through `money(amount, currency)` from `components/region-switcher/region`: `amount` is in `currency` (a product's `currency`, a delivery way's `currency`, the basket's `currency`; omit it for the shop's base currency) and is shown in the visitor's currency, converted with the shop's rates. Never format with `$shop.currency` (it does not exist) or a fixed "USD". A threshold compared with a cart total is first converted into the cart's currency (`convert()`).
- **Product prices** use `priceOf(shop, product, currentCurrency())` (`components/kalio/kalio-catalog.ts`).
- **Words** (the shop's languages: ar, en, pa, es, da, fr): every word the Layout writes is `t("key", "English")` (counts: `t(key, { one: …, other: … }, { n })`), the runtime `components/kalio/i18n/kalio-i18n.ts` (a global in templates). The shared Kalio base is `components/kalio/i18n/base/<lang>.ts` (a copy of `new-shop-kits/i18n/kalio-base`); Tario's own words, and Tario's English where it words a base key differently ("cart" for "basket"), are `components/kalio/i18n/tario.<lang>.ts`. After wrapping new words: `node new-shop-kits/i18n/tools/i18n-extract.cjs` (see `new-shop-kits/i18n/README.md`), translate `tario.<lang>.ts` for every language, and run `i18n-lint.cjs` until it prints OK. Never compare a translated word; never build words at import time (use getters or compute when drawing). Right to left (ar): logical CSS only (`inset-inline-*`, `margin-inline-*`, `text-align: start`); chevrons take `k-flip`.
- **i18n check:** `MSYS_NO_PATHCONV=1 I18N=components/kalio/i18n MENU='.k-header__row > button.k-header__icon:first-child' CART='.k-header__basket' SIGNIN='.k-header__link.-signin' SIGNIN_PHONE='.k-header__icon.-me' CATEGORY='@a.t-circle' IGNORE='Home|Shop|Privacy|Terms of Use|Blog|About Us|Share|Type|Brand|/ each$/' node new-shop-kits/i18n/tools/i18n-check.cjs <site> ".k-footer"` must print `TOTAL 0` (IGNORE: the shop's own footer menu, Selldone's Share, product spec keys and the unit "each").
- **Check:** `SHOP=molino MENU='[aria-label="Menu"]' MEGA=".k-header__aisles" CART=".k-header__basket" CATEGORY="@a.t-circle" DEALS='/?filter={"only_has_discount":true}' node components/region-switcher/tools/currency-check.cjs <site> ".k-footer"` must print `TOTAL 0`. Then the reload pass, a shopper who reloads with a currency stored: `SHOP=molino node scripts/stored-currency-check.cjs <site> DKK` (1440 and 390), `TOTAL 0`. An amount that cannot be converted yet (the rates arrive seconds after the first paint) is not shown in another currency: use `moneyIfKnown()` / `convertIfKnown()` from `components/tario/tario-home.ts`.

## Theme (palette, brand colour, light or dark, the visitor switcher)

When a merchant asks for a theme ("use the yellow theme", "my brand colour is #F5C400", "make it dark"), edit **one file only**: `components/tario/tario-theme.settings.ts`. Nothing else needs to change, and the colours are made readable automatically (buttons, links, header, dark mode).

| Setting | Allowed values |
| --- | --- |
| `palette` | `"red"` (Tario red, the default), `"blue"`, `"green"`, `"violet"`, `"teal"` |
| `brandColor` | any `"#RRGGBB"`; when set it replaces `palette` |
| `mode` | `"light"` or `"dark"` |
| `themeSwitcher` | `"showcase"` (the visitor switcher shows only on Tario's own showcase shop, molino, Selldone shop 15645; the default), `"on"` (the merchant's visitors get a Theme row in the footer, just above the © line), `"off"` |
| `textOnBrand` | only with `brandColor`: `"auto"` (a light brand such as yellow keeps its colour, with dark words on it) or `"white"` (white words; a light colour is darkened) |

Worked examples (change only these lines; leave the rest of the file as it is):

- **"Use the yellow theme"**: there is no tested yellow palette, so use a brand colour: `brandColor: "#F5C400", textOnBrand: "auto"`.
- **"My brand colour is #F5C400"**: `brandColor: "#F5C400", textOnBrand: "auto"`. Use `textOnBrand: "white"` instead if they want white words; the colour is then darkened.
- **"Make it dark"**: `mode: "dark"`.
- **"Let visitors switch themes"**: `themeSwitcher: "on"`.
- **"Remove the switcher"**: `themeSwitcher: "off"`. On a merchant's own shop it is already hidden with `"showcase"`.
- **"Go back to the original colours"**: remove `brandColor` and set `palette: "red", mode: "light"`.

Then release and check:

1. Build and upload: `LAYOUT_ID=<your Layout id> SELLDONE_CLI_SRC=<cli clone> bash scripts/release.sh <new version> desk`; see the wiki page Build and Upload. Put the version live as in Go Live.
2. Check the contrast on the live shop. It must print `TOTAL 0`:
   ```sh
   PAGES="home=/,category=/<a category>,product=/product/<id>" node components/theme-switcher/tools/contrast-audit.cjs https://<your shop> ".k-header"
   ```
   For a theme chosen in the settings, no `STORAGE` is needed: the settings are the default.
3. If the visitor switcher is on, also run `ring-sweep.cjs` from the kit for rings, and click each swatch of the footer's Theme row (palettes, Custom colour, Light / Dark) to see the whole site repaint. (`header-check.cjs` is for the old header button, which Tario no longer has.)

More: the wiki page **Theme and colours** (`docs/wiki/Theme-and-colours.md`).
<!-- THEME:END -->
