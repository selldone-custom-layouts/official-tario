<!--
  Tario — "Shop our sellers" (design A).

  The marketplace's sellers, two cards to a row: the seller's mark, name
  and own description, "Visit shop", and four packshots from their shelf —
  the ones only they sell first. Read live (kalio-catalog's vendors() and
  offers()); a shop with no sellers shows nothing.
-->
<template>
  <section v-if="cards.length" aria-labelledby="t-sellers" class="t-sec k-wrap">
    <header class="t-sec__head">
      <h2 id="t-sellers" class="t-sec__title">{{ t("tario.home.ourSellers", "Shop our sellers") }}</h2>
    </header>
    <div class="t-sellers">
      <router-link v-for="card in cards" :key="card.vendor.id" :to="card.to" class="t-seller">
        <span class="t-seller__mark">
          <img v-if="card.mark" :src="card.mark" alt="" height="56" loading="lazy" width="56" />
          <template v-else>{{ (card.vendor.name || "?").charAt(0) }}</template>
        </span>
        <span class="t-seller__text">
          <b>{{ card.vendor.name }}</b>
          <span>{{ card.vendor.description || (card.count ? t("tario.sellers.products", { one: "{n} product on {shop}", other: "{n} products on {shop}" }, { n: card.count, shop: shopTitle }) : t("tario.sellers.aSeller", "A seller on {shop}", { shop: shopTitle })) }}</span>
          <u>{{ t("tario.visitShop", "Visit shop") }}</u>
        </span>
        <span aria-hidden="true" class="t-seller__pics">
          <img v-for="product in card.pics" :key="product.id" :src="picture(product)" alt="" loading="lazy" />
        </span>
      </router-link>
    </div>
  </section>
</template>

<script>
import { offers, productImage, sellerRoute, vendorImage, vendors } from "../kalio/kalio-catalog";

export default {
  name: "TarioSellers",

  data() {
    return {
      cards: [],
    };
  },

  computed: {
    shopTitle() {
      return this.$store.getters.getShop?.title || "Tario";
    },
  },

  mounted() {
    Promise.all([vendors(), offers()]).then(([list, { sellersOf, shelfOf }]) => {
      this.cards = list.map((vendor) => {
        const shelf = (shelfOf.get(vendor.id) || []).filter((product) => product.icon);
        const own = shelf.filter((product) => (sellersOf.get(product.id) || []).length === 1);
        const shared = shelf.filter((product) => !own.includes(product));
        const count = shelf.length;
        return {
          vendor,
          mark: vendorImage(vendor, true),
          to: sellerRoute(vendor),
          count,
          pics: [...own, ...shared].slice(0, 4),
        };
      });
    });
  },

  methods: {
    picture(product) {
      return productImage(product, true);
    },
  },
};
</script>
