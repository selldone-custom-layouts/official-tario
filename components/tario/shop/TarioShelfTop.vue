<!--
  Tario — the top of a listing (shop page design A, 7 November 2026).

  An aisle: the crumbs, the aisle's title and description from its live
  record, then one round picture per value of the aisle's "Type" filter
  (Milk, Eggs, Butter…), each a shortcut to that filter. The picture is the
  first product of that type, read once per aisle.

  The catalogue (a search, the deals, every product): its title, how many
  products, and the aisles the results sit in, each a link to the same
  search inside that aisle.
-->
<template>
  <div class="t-top">
    <nav :aria-label="t('tario.crumbs', 'Breadcrumb')" class="t-crumbs">
      <router-link :to="{ name: window.$storefront.routes.SHOP_PAGE }">{{ $shop.title }}</router-link>
      <v-icon aria-hidden="true" size="16">chevron_right</v-icon>
      <span aria-current="page">{{ crumb }}</span>
    </nav>

    <template v-if="mode === 'aisle'">
      <h1 class="t-top__h1">{{ aisle ? aisle.title || aisle.name : "" }}</h1>
      <p v-if="aisle && aisle.description" class="t-top__lede">{{ aisle.description }}</p>
      <div v-if="types.length" class="t-types">
        <button
          v-for="ty in types"
          :key="ty.value"
          :aria-pressed="typeOn(ty.value)"
          :class="{ '-on': typeOn(ty.value) }"
          class="t-types__it"
          type="button"
          @click="$emit('pick-type', typeKey, ty.value)"
        >
          <span class="t-types__o"><img v-if="ty.image" :src="ty.image" alt="" loading="lazy" /></span>
          {{ valueLabel(ty.value) }}
        </button>
      </div>
    </template>

    <template v-else>
      <div class="t-top__q">
        <h1 class="t-top__h1">{{ title }}</h1>
        <span v-if="total !== null" class="t-top__count">{{ t("tario.seller.productCount", { one: "{n} product", other: "{n} products" }, { n: total }) }}</span>
      </div>
      <div v-if="hits.length" class="t-inaisles">
        <span class="t-inaisles__l">{{ t("tario.search.inAisles", "In aisles:") }}</span>
        <router-link v-for="h in hits" :key="h.aisle.id" :to="h.to" class="t-inaisles__a">
          <img v-if="h.image" :src="h.image" alt="" />{{ h.aisle.title || h.aisle.name }}<b v-if="h.count">{{ h.count }}</b>
        </router-link>
      </div>
    </template>
  </div>
</template>

<script>
import { aisleIndex, aisleImage, productImage } from "../../kalio/kalio-catalog";
import { valueLabel } from "./tario-filters";
import { t } from "../../kalio/i18n/kalio-i18n";

/* One picture per type, read once per aisle and kept for the visit. */
const typePictures = new Map();

export default {
  name: "TarioShelfTop",
  inject: ["$shop"],
  emits: ["pick-type"],

  props: {
    mode: { type: String, default: "aisle" }, // aisle | catalogue
    /** The aisle's record (the listing's parent). */
    aisle: { type: Object, default: null },
    categoryName: { type: String, default: null },
    filters: { type: Object, default: null },
    filter: { type: Object, default: null },
    total: { type: Number, default: null },
    /** The products the listing holds now (the catalogue's aisle links). */
    products: { type: Array, default: () => [] },
  },

  data() {
    return { window, types: [], index: null };
  },

  computed: {
    search() {
      return String(this.$route.query.search || "").trim();
    },
    deals() {
      return !!this.filter?.only_has_discount;
    },
    title() {
      if (this.search) return t("tario.search.resultsFor", "Results for “{search}”", { search: this.search });
      if (this.deals) return t("header.todaysDeals", "Today’s deals");
      return t("tario.search.allProducts", "All products");
    },
    crumb() {
      if (this.mode === "aisle") return this.aisle ? this.aisle.title || this.aisle.name : this.categoryName;
      return this.search ? t("common.search", "Search") : this.title;
    },
    typeKey() {
      if (!this.filters) return null;
      return Object.keys(this.filters).find((k) => /^type$/i.test(k)) || null;
    },
    /* The aisles the results sit in. A count only when every result is in
       hand; on a longer list the aisles are named without one. */
    hits() {
      if (!this.index || !this.products.length) return [];
      const all = this.total !== null && this.products.length >= this.total;
      const by = new Map();
      for (const p of this.products) {
        const aisle = this.index.get(p.category_id);
        if (!aisle) continue;
        if (!by.has(aisle.id)) by.set(aisle.id, { aisle, count: 0, image: aisleImage(aisle, 64) || productImage(p, true) });
        by.get(aisle.id).count++;
      }
      return [...by.values()]
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)
        .map((h) => ({
          ...h,
          count: all ? h.count : null,
          to: {
            name: window.$storefront.routes.SHOP_CATEGORY_PAGE,
            params: { category_name: h.aisle.name },
            query: this.search ? { search: this.search } : this.deals ? { filter: JSON.stringify({ only_has_discount: true }) } : {},
          },
        }));
    },
  },

  watch: {
    typeKey: { handler: "readTypes", immediate: true },
    categoryName() {
      this.types = [];
    },
  },

  mounted() {
    if (this.mode !== "aisle") aisleIndex().then((index) => (this.index = index));
  },

  methods: {
    valueLabel,
    typeOn(value) {
      return !!this.filter?.selected_spec?.[this.typeKey]?.includes(value);
    },
    async readTypes() {
      const key = this.typeKey;
      const dir = this.categoryName;
      if (this.mode !== "aisle" || !key || !dir) {
        this.types = [];
        return;
      }
      const values = (Array.isArray(this.filters[key]) ? this.filters[key] : Object.values(this.filters[key] || {}))
        .filter(Boolean)
        .slice(0, 10);
      this.types = values.map((value) => ({ value, image: typePictures.get(dir + "|" + value) || null }));
      /* One at a time: the public API answers 429 to a burst. */
      for (const t of this.types) {
        if (t.image) continue;
        try {
          const { products } = await window.$storefront.products.list(dir, 0, 1, {
            products_only: true,
            filter: JSON.stringify({ selected_spec: { [key]: [t.value] } }),
          });
          const image = productImage(products?.[0], true);
          typePictures.set(dir + "|" + t.value, image);
          if (dir !== this.categoryName) return;
          t.image = image;
        } catch {
          /* a circle without a picture still filters */
        }
      }
    },
  },
};
</script>
