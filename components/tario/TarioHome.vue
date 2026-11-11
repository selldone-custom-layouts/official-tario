<!--
  Tario — Home (design A, approved by the owner on 7 November 2026).

  The owner: "when I say like Target, I mean the home page's sections like
  Target's, not Molino with the colour turned red." So the home is built
  from a big-box store's sections, top to bottom:

    the split hero that turns (deals, new, the fresh aisle)
    Shop by category — every aisle as a circle
    Top deals — a row of cards with a red "Add to cart"
    Deals for every aisle — promo tiles
    Ways to get it — the shop's own delivery methods
    New arrivals
    Fresh finds — three tall editorial tiles
    Trending in <aisle> — the first featured aisles
    Shop our sellers
    Trending in <aisle> — every other aisle, as it scrolls into view

  The red promo strip and the white header with its Categories menu are
  the Layout's (KalioHeader). Everything is read live; a section with
  nothing to show is not drawn. It is shown on the bare shop page only:
  any query (a search, a filter, "All products") shows Selldone's listing.
-->
<template>
  <div class="t-home">
    <tario-hero />

    <tario-circles :aisles="ordered" />

    <tario-row
      :key="has_deals === false ? 'popular' : 'deals'"
      :filter="has_deals === false ? null : { only_has_discount: true }"
      :more-to="has_deals === false ? bestRoute : dealsRoute"
      :title="has_deals === false ? t('tario.home.popular', 'Popular this week') : t('tario.home.topDeals', 'Top deals')"
      sort="bestselling"
      spread
      @loaded="onDeals"
    />

    <tario-tiles :after="leadAisles" :aisles="ordered" />

    <tario-ways />

    <tario-row :more-to="newRoute" :title="t('tario.header.new', 'New arrivals')" lazy sort="newest" />

    <tario-finds :aisles="ordered" />

    <tario-row
      v-for="aisle in leadAisles"
      :key="aisle.id"
      :dir="aisle.name"
      :more-to="aisleRoute(aisle)"
      :title="t('tario.home.trending', 'Trending in {aisle}', { aisle: aisle.title || aisle.name })"
      lazy
      sort="bestselling"
    />

    <tario-sellers />

    <tario-row
      v-for="aisle in laterAisles"
      :key="aisle.id"
      :dir="aisle.name"
      :more-to="aisleRoute(aisle)"
      :title="t('tario.home.trending', 'Trending in {aisle}', { aisle: aisle.title || aisle.name })"
      lazy
      sort="bestselling"
    />

    <div v-if="ordered.length" class="t-home__end k-wrap">
      <router-link :to="catalogueRoute" class="t-btn -outline">
        {{ t("tario.home.browseEvery", "Browse every product") }}<v-icon class="k-flip" size="20">chevron_right</v-icon>
      </router-link>
    </div>
  </div>
</template>

<script>
import TarioHero from "./TarioHero.vue";
import TarioCircles from "./TarioCircles.vue";
import TarioRow from "./TarioRow.vue";
import TarioTiles from "./TarioTiles.vue";
import TarioWays from "./TarioWays.vue";
import TarioFinds from "./TarioFinds.vue";
import TarioSellers from "./TarioSellers.vue";
import { aisleRoute, aisles, catalogueRoute, dealsRoute, featured } from "../kalio/kalio-catalog";

const LEAD_ROWS = 2;

export default {
  name: "TarioHome",
  components: { TarioHero, TarioCircles, TarioRow, TarioTiles, TarioWays, TarioFinds, TarioSellers },

  data() {
    return {
      ordered: [],
      /* null until the deals row has been read. */
      has_deals: null,
    };
  },

  computed: {
    leadAisles() {
      return this.ordered.slice(0, LEAD_ROWS);
    },
    laterAisles() {
      return this.ordered.slice(LEAD_ROWS);
    },
    dealsRoute() {
      return dealsRoute();
    },
    newRoute() {
      return catalogueRoute({ sort: "newest" });
    },
    bestRoute() {
      return catalogueRoute({ sort: "bestselling" });
    },
    catalogueRoute() {
      return catalogueRoute();
    },
  },

  mounted() {
    aisles().then((list) => (this.ordered = featured(list)));
  },

  methods: {
    aisleRoute,
    onDeals(products) {
      if (this.has_deals === null) this.has_deals = products.length > 0;
    },
  },
};
</script>
