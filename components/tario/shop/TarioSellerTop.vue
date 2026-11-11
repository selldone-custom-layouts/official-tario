<!--
  Tario — the top of a seller's page (seller page design A, 7 November 2026).

  A banner with a photo of what the seller sells most, their round mark,
  their name and a line built from their own aisles ("breads, dairy and
  the pantry"), and three live numbers: products, aisles, on sale. Tabs
  under it narrow the listing below (Shop, Deals, New) or jump to About.
  Then the seller's aisles as tiles with how many products each holds, and
  a row of the seller's deals. The page's listing (every product of this
  seller, with Tario's filter bar) follows under "All of Mason's products".

  Selldone's seller record has a name, a mark and a description; the
  numbers and aisles come from the seller's own product list.
-->
<template>
  <div class="t-sellerpage">
    <nav :aria-label="t('tario.crumbs', 'Breadcrumb')" class="t-crumbs">
      <router-link :to="{ name: window.$storefront.routes.SHOP_PAGE }">{{ $shop.title }}</router-link>
      <v-icon aria-hidden="true" size="16">chevron_right</v-icon>
      <span>{{ t("footer.sellers", "Sellers") }}</span>
      <v-icon aria-hidden="true" size="16">chevron_right</v-icon>
      <span aria-current="page">{{ vendor ? vendor.name : t("tario.seller.seller", "Seller") }}</span>
    </nav>

    <section class="t-sban">
      <div :style="cover ? { backgroundImage: `url(${cover})` } : null" aria-hidden="true" class="t-sban__cover"></div>
      <div class="t-sban__body">
        <span class="t-sban__mark">
          <img v-if="mark" :src="mark" alt="" />
          <v-icon v-else size="40">storefront</v-icon>
        </span>
        <div class="t-sban__who">
          <h1>{{ vendor ? vendor.name : "" }}</h1>
          <p>{{ t("tario.seller.independent", "An independent seller on {shop}", { shop: $shop.title }) }}<template v-if="sells_line"> · {{ sells_line }}</template></p>
        </div>
        <div class="t-sban__facts">
          <div v-if="total !== null"><b>{{ formatNumber(total) }}</b><span>{{ t("tario.seller.productsWord", { one: "product", other: "products" }, { n: total }) }}</span></div>
          <div v-if="aisleTiles.length"><b>{{ formatNumber(aisleTiles.length) }}</b><span>{{ t("tario.seller.aislesWord", { one: "aisle", other: "aisles" }, { n: aisleTiles.length }) }}</span></div>
          <div v-if="on_sale !== null"><b>{{ formatNumber(on_sale) }}</b><span>{{ t("tario.seller.onSale", "on sale") }}</span></div>
        </div>
      </div>
    </section>

    <nav :aria-label="t('tario.seller.sections', 'Seller sections')" class="t-stabs">
      <button :class="{ '-on': tab === 'shop' }" type="button" @click="$emit('tab', 'shop')">{{ t("tario.seller.tabShop", "Shop") }}</button>
      <button v-if="on_sale" :class="{ '-on': tab === 'deals' }" type="button" @click="$emit('tab', 'deals')">
        {{ t("tario.seller.tabDeals", "Deals ({n})", { n: on_sale }) }}
      </button>
      <button :class="{ '-on': tab === 'new' }" type="button" @click="$emit('tab', 'new')">{{ t("tario.seller.tabNew", "New") }}</button>
      <button type="button" @click="toAbout">{{ t("tario.seller.about", "About {name}", { name: vendor ? vendor.name : "" }) }}</button>
    </nav>

    <section v-if="aisleTiles.length" class="t-sec">
      <header class="t-sec__head">
        <h2 class="t-sec__title">{{ vendor ? t("tario.seller.aisles", "{name}’s aisles", { name: vendor.name }) : t("tario.seller.theAisles", "The aisles") }}</h2>
      </header>
      <div class="t-saisles">
        <router-link v-for="a in aisleTiles" :key="a.aisle.id" :to="a.to" class="t-saisle">
          <img v-if="a.image" :src="a.image" alt="" loading="lazy" />
          {{ a.aisle.title || a.aisle.name }}
          <span>{{ t("tario.seller.productCount", { one: "{n} product", other: "{n} products" }, { n: a.count }) }}</span>
        </router-link>
      </div>
    </section>

    <tario-row
      v-if="on_sale"
      :key="'deals-' + vendorId"
      :filter="{ only_has_discount: true }"
      :limit="12"
      :title="vendor ? t('tario.seller.dealsFrom', 'Deals from {name}', { name: vendor.name }) : t('tario.seller.dealsFromThis', 'Deals from this seller')"
      :vendor="vendorId"
      sort="bestselling"
    />

    <section id="t-seller-about" class="t-sabout">
      <h2 class="t-sec__title">{{ vendor ? t("tario.seller.about", "About {name}", { name: vendor.name }) : t("tario.seller.aboutThis", "About this seller") }}</h2>
      <p v-if="vendor && vendor.description">{{ vendor.description }}</p>
      <p v-else>
        {{
          sells_line
            ? t("tario.seller.blurbWith", "{name} is one of the independent sellers on {shop}, with {aisles}. Everything they sell joins the same cart as the other sellers' products, with one checkout.", { name: vendor ? vendor.name : t("tario.seller.thisSeller", "This seller"), shop: $shop.title, aisles: sells_line })
            : t("tario.seller.blurb", "{name} is one of the independent sellers on {shop}. Everything they sell joins the same cart as the other sellers' products, with one checkout.", { name: vendor ? vendor.name : t("tario.seller.thisSeller", "This seller"), shop: $shop.title })
        }}
      </p>
    </section>

    <h2 class="t-sall">
      {{ vendor ? t("tario.seller.allOf", "All of {name}’s products", { name: vendor.name }) : t("tario.seller.allOfThe", "All of the products") }}
      <span v-if="total !== null">{{ formatNumber(total) }}</span>
    </h2>
  </div>
</template>

<script>
import TarioRow from "../TarioRow.vue";
import { t } from "../../kalio/i18n/kalio-i18n";
import { photo } from "../tario-home";
import { aisleImage, aisleRoute, aisles, countProducts, featured, offers, vendorImage, vendors } from "../../kalio/kalio-catalog";

/* The banner's photo, from the seller's first aisle. */
const COVERS = [
  [/bread|bakery/i, "tario-tile-bakery"],
  [/breakfast|cereal/i, "tario-tile-breakfast"],
  [/produce|fruit|veg/i, "tario-finds-produce"],
  [/meat|seafood|fish/i, "tario-tile-meat"],
  [/snack/i, "tario-tile-snacks"],
  [/household|clean/i, "tario-tile-household"],
  [/coffee|beverage|drink/i, "tario-finds-coffee"],
];

export default {
  name: "TarioSellerTop",
  components: { TarioRow },
  inject: ["$shop"],
  emits: ["tab"],

  props: {
    vendorId: { type: [Number, String], required: true },
    /** Which tab the listing shows: shop, deals or new. */
    tab: { type: String, default: "shop" },
  },

  data() {
    return {
      window,
      vendor: null,
      total: null,
      on_sale: null,
      aisleTiles: [],
      seller_count: 0,
    };
  },

  computed: {
    mark() {
      return vendorImage(this.vendor);
    },
    sells_line() {
      const names = this.aisleTiles.slice(0, 3).map((a) => String(a.aisle.title || a.aisle.name).toLowerCase().replace(/&amp;/g, "&"));
      if (!names.length) return "";
      if (names.length === 1) return names[0];
      return t("tario.seller.list", "{first} and {last}", { first: names.slice(0, -1).join(", "), last: names[names.length - 1] });
    },
    cover() {
      const first = this.aisleTiles[0]?.aisle;
      const label = first ? `${first.title || ""} ${first.name || ""}` : "";
      const hit = COVERS.find(([re]) => re.test(label));
      return photo(hit ? hit[1] : "tario-hero-1-weekly") || photo("tario-hero-1-weekly");
    },
  },

  watch: {
    vendorId: { handler: "fetch", immediate: true },
  },

  methods: {
    fetch() {
      const id = this.vendorId;
      const mine = () => String(id) === String(this.vendorId);
      this.vendor = null;
      this.total = null;
      this.on_sale = null;
      this.aisleTiles = [];
      window.$storefront.vendor
        .getVendor(id)
        .then(({ vendor }) => mine() && (this.vendor = vendor || null))
        .catch(() => null);
      countProducts(null, { vendor_id: id }).then((n) => mine() && (this.total = n));
      countProducts(null, { vendor_id: id, filter: JSON.stringify({ only_has_discount: true }) }).then((n) => mine() && (this.on_sale = n));
      vendors().then((list) => (this.seller_count = list.length));
      Promise.all([offers(), aisles()]).then(([{ shelfOf }, list]) => {
        if (!mine()) return;
        const shelf = shelfOf.get(Number(id)) || shelfOf.get(id) || [];
        const counts = new Map();
        for (const p of shelf) counts.set(p.category_id, (counts.get(p.category_id) || 0) + 1);
        this.aisleTiles = featured(list.filter((a) => counts.has(a.id))).map((aisle) => ({
          aisle,
          count: counts.get(aisle.id),
          image: aisle.icon ? aisleImage(aisle, 128) : null,
          to: aisleRoute(aisle),
        }));
      });
    },
    toAbout() {
      document.getElementById("t-seller-about")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
};
</script>
