/*
 * Tario — the home page's shared pieces (design A, 7 November 2026).
 *
 * The owner rejected the first Tario ("Molino with the colour turned red")
 * and approved design A: a big-box store's home — a red promo strip, a split
 * hero carousel, round categories, deal rows with a red "Add to cart",
 * promo tiles per aisle, "Ways to get it", editorial tiles, more rows and
 * the sellers. This module holds what several of those sections share:
 *
 *  - the lifestyle photos, bundled from assets/tario/ (the owner has them
 *    made from kalio-design/tario-options/image-prompts-A.md). A photo that
 *    is not there yet is simply absent, and the section draws a collage of
 *    the aisle's own packshots instead, so the page is finished either way;
 *  - which aisle each tile or slide belongs to, matched on the aisle's
 *    title, never on an id, so another shop's "Bakery" finds its tile too;
 *  - the delivery methods, as "Pickup / Delivery / Shipping", read from the
 *    shop's own transportations with their free-shipping rule.
 *
 * Nothing here names a product, a price or a seller.
 */
import { baseCurrency, convert, currentCurrency, money, type MoneyShort } from "../region-switcher/region";
import { t } from "../kalio/i18n/kalio-i18n";

declare const window: any;

/* ━━━━━━━━━━━━ Photos ━━━━━━━━━━━━
   import.meta.glob lists only the files that exist when the Layout is
   built, so a missing photo costs nothing and breaks nothing. */
const FILES = import.meta.glob("../../assets/tario/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const BY_NAME = new Map<string, string>(
  Object.entries(FILES).map(([path, url]) => [path.split("/").pop()!.replace(/\.\w+$/, ""), url]),
);

/** The bundled photo with this base name (no extension), or null. */
export function photo(name: string | null | undefined): string | null {
  return (name && BY_NAME.get(name)) || null;
}

/* ━━━━━━━━━━━━ Aisle matching ━━━━━━━━━━━━ */

export const label = (aisle: any) => `${aisle?.title || ""} ${aisle?.name || ""}`;

/** The first aisle whose title matches, skipping the ones already used. */
export function findAisle(list: any[], pattern: RegExp, used: Set<number> = new Set()): any | null {
  return list.find((aisle) => !used.has(aisle.id) && pattern.test(label(aisle))) || null;
}

/* The promo tiles of "Deals for every aisle", in the order of design A.
   `deal` is the caption when the aisle has products on offer, `plain` when
   it has none. "{off}" is the best saving, "{from}" the lowest price. */
export const TILES = [
  {
    pattern: /breakfast|cereal/i,
    photo: "tario-tile-breakfast",
    get deal() {
      return t("tario.tiles.breakfast.deal", "Up to {off}% off breakfast favourites");
    },
    get plain() {
      return t("tario.tiles.breakfast.plain", "Breakfast, sorted");
    },
  },
  {
    pattern: /snack|sweet|candy/i,
    photo: "tario-tile-snacks",
    get deal() {
      return t("tario.tiles.snacks.deal", "Snack-time savings");
    },
    get plain() {
      return t("tario.tiles.snacks.plain", "The snack drawer");
    },
  },
  {
    pattern: /bread|bakery/i,
    photo: "tario-tile-bakery",
    get deal() {
      return t("tario.tiles.bakery.deal", "Fresh-baked, up to {off}% off");
    },
    get plain() {
      return t("tario.tiles.bakery.plain", "Fresh-baked, from {from}");
    },
  },
  {
    pattern: /household|clean|laundry/i,
    photo: "tario-tile-household",
    get deal() {
      return t("tario.tiles.household.deal", "Stock up the home for less");
    },
    get plain() {
      return t("tario.tiles.household.plain", "Stock up the home");
    },
  },
  {
    pattern: /meat|seafood|fish|poultry/i,
    photo: "tario-tile-meat",
    get deal() {
      return t("tario.tiles.meat.deal", "Dinner, sorted — up to {off}% off");
    },
    get plain() {
      return t("tario.tiles.meat.plain", "Dinner, sorted");
    },
  },
];

/* "Fresh finds": three tall editorial tiles. */
export const FINDS = [
  {
    pattern: /produce|fruit|veg/i,
    photo: "tario-finds-produce",
    get title() {
      return t("tario.finds.produce", "Picked this week");
    },
  },
  {
    pattern: /beverage|drink|coffee|tea/i,
    photo: "tario-finds-coffee",
    get title() {
      return t("tario.finds.coffee", "Your morning, brewed");
    },
  },
  {
    pattern: /meat|seafood|fish|poultry|deli|prepared/i,
    photo: "tario-finds-dinner",
    get title() {
      return t("tario.finds.dinner", "Weeknight dinners");
    },
  },
];

/* A headline for an aisle that has no tile of its own. */
const HEADLINES: [RegExp, () => string][] = [
  [/produce|fruit|veg/i, () => t("tario.headline.produce", "Picked for the week")],
  [/dairy|egg|milk/i, () => t("tario.headline.dairy", "Fridge, restocked")],
  [/bread|bakery/i, () => t("tario.headline.bakery", "Fresh from the oven")],
  [/meat|seafood|fish/i, () => t("tario.headline.meat", "From the butcher’s counter")],
  [/breakfast|cereal/i, () => t("tario.tiles.breakfast.plain", "Breakfast, sorted")],
  [/snack/i, () => t("tario.tiles.snacks.plain", "The snack drawer")],
  [/pantry/i, () => t("tario.headline.pantry", "Stock the cupboard")],
  [/beverage|drink/i, () => t("tario.headline.drinks", "Something to sip")],
  [/frozen/i, () => t("tario.headline.frozen", "Ready when you are")],
  [/household|clean/i, () => t("tario.tiles.household.plain", "Stock up the home")],
];

/** An aisle's headline, in the visitor's language: call it when drawing. */
export function headline(aisle: any): string {
  const hit = HEADLINES.find(([pattern]) => pattern.test(label(aisle)));
  return hit ? hit[1]() : aisle?.title || aisle?.name || "";
}

/* ━━━━━━━━━━━━ Products ━━━━━━━━━━━━ */

/** Products of an aisle (or the whole shop) that have a picture. */
export function listProducts(dir: string | null, limit: number, options: Record<string, any> = {}): Promise<any[]> {
  return window.$storefront.products
    .list(dir, 0, limit, { products_only: true, available: true, ...options })
    .then(({ products }: any) => products || [])
    .catch(() => []);
}

export const DEALS_FILTER = JSON.stringify({ only_has_discount: true });

/* ━━━━━━━━━━━━ Ways to get it ━━━━━━━━━━━━
   Selldone's transportation types, grouped as a shopper says them. A type
   not listed here is shown under its own title, as "Delivery". */
/* `word` and `line` are getters: they follow the visitor's language. `id`
   is the stable key (ways are matched and sorted by it, never by a word). */
const WAYS: { id: string; types: string[]; word: string; icon: string; line: string }[] = [
  {
    id: "pickup",
    types: ["Pickup"],
    icon: "storefront",
    get word() {
      return t("tario.ways.pickup", "Pickup");
    },
    get line() {
      return t("tario.ways.pickupLine", "Order online, collect at the shop");
    },
  },
  {
    id: "delivery",
    types: ["Motorbike", "Bicycle"],
    icon: "two_wheeler",
    get word() {
      return t("tario.ways.delivery", "Delivery");
    },
    get line() {
      return t("tario.ways.deliveryLine", "A courier brings it to your door");
    },
  },
  {
    id: "shipping",
    types: ["CargoSmall", "Cargo", "Truck"],
    icon: "local_shipping",
    get word() {
      return t("tario.ways.shipping", "Shipping");
    },
    get line() {
      return t("tario.ways.shippingLine", "Shipped to your address");
    },
  },
  {
    id: "post",
    types: ["Post", "PostFast"],
    icon: "local_post_office",
    get word() {
      return t("tario.ways.post", "By post");
    },
    get line() {
      return t("tario.ways.postLine", "Sent to your address by post");
    },
  },
  {
    id: "worldwide",
    types: ["Airplane", "Global"],
    icon: "public",
    get word() {
      return t("tario.ways.worldwide", "Worldwide");
    },
    get line() {
      return t("tario.ways.worldwideLine", "Shipped wherever you are");
    },
  },
];

export interface Way {
  key: string;
  word: string;
  icon: string;
  line: string;
  /** Free, at any basket size. */
  free: boolean;
  /** Free from this basket total (in `currency`). */
  freeOver: number | null;
  currency: string | null;
}

/** The shop's enabled delivery methods, one card per kind. */
export function waysOf(shop: any): Way[] {
  const out: Way[] = [];
  for (const tr of (shop?.transportations || []).filter((tr: any) => tr && tr.enable)) {
    const kind = WAYS.find((w) => w.types.includes(tr.type));
    const key = kind ? kind.id : tr.type;
    const free = !!tr.free_shipping && !(Number(tr.free_shipping_limit) > 0);
    const freeOver = tr.free_shipping && Number(tr.free_shipping_limit) > 0 ? Number(tr.free_shipping_limit) : null;
    const known = out.find((w) => w.key === key);
    if (known) {
      /* Two methods of one kind: the more generous free rule wins. */
      known.free = known.free || free;
      if (freeOver != null && (known.freeOver == null || freeOver < known.freeOver)) {
        known.freeOver = freeOver;
        known.currency = tr.currency || null;
      }
      continue;
    }
    out.push({
      key,
      word: tr.title || (kind ? kind.word : t("tario.ways.delivery", "Delivery")),
      icon: kind ? kind.icon : "local_shipping",
      line: kind ? kind.line : t("tario.ways.broughtLine", "Brought to your address"),
      free,
      freeOver,
      currency: tr.currency || null, // the way's own; null = the shop's base currency
    });
  }
  /* In the order shoppers expect: pickup, delivery, shipping, post. */
  const rank = (way: Way) => {
    const at = WAYS.findIndex((w) => w.id === way.key);
    return at === -1 ? WAYS.length : at;
  };
  return out.sort((a, b) => rank(a) - rank(b));
}

/** The lowest basket total that ships for free, for the promo strip. A
 *  method that is free at any size is pickup-like and not promoted. */
export function freeShippingFrom(shop: any): { amount: number; currency: string } | null {
  const paid = (shop?.transportations || []).filter(
    (tr: any) => tr && tr.enable && tr.type !== "Pickup" && tr.free_shipping && Number(tr.free_shipping_limit) > 0,
  );
  if (!paid.length) return null;
  const best = paid.reduce((a: any, b: any) => (Number(b.free_shipping_limit) < Number(a.free_shipping_limit) ? b : a));
  return { amount: Number(best.free_shipping_limit), currency: best.currency || null };
}

/** An amount (in `from`, or the shop's base currency) in the shopper's
 *  currency, or null while it cannot be converted: the shop's rates arrive
 *  with the full shop record, seconds after the first paint (later under
 *  Selldone's 429s), and a reload with DKK stored must not show "$200" in
 *  the meantime. Reactive: the rates come through the store, so the line
 *  appears the moment they do. */
export function moneyIfKnown(amount: number, from?: string | null, options: { short?: MoneyShort } = {}): string | null {
  const f = from || baseCurrency();
  if (f !== currentCurrency() && convert(amount, f) == null) return null;
  return money(amount, f, options);
}

/** A shop amount converted into another currency (a cart's), or null while
 *  the rate is not known: a meter must not subtract one currency from another. */
export function convertIfKnown(amount: number, from: string | null | undefined, to: string): number | null {
  const f = from || baseCurrency();
  if (f === to) return Number(amount);
  return convert(amount, f, to);
}
