<!--
  Tario — "Shop by category" (design A): every aisle as a round picture.

  The aisle's own category picture on its pale tint, its name under it:
  eight to a row on a computer (two rows for molino's sixteen aisles), six
  on a tablet, four on a phone. The aisles are the shop's, in the order the
  home page features them; a new aisle in the dashboard gets a circle, a
  removed one loses it. The hero's "Browse aisles" scrolls here.
-->
<template>
  <section v-if="list.length" aria-labelledby="t-aisles" class="t-sec k-wrap">
    <header class="t-sec__head">
      <h2 id="t-aisles" class="t-sec__title">{{ t("tario.home.byCategory", "Shop by category") }}</h2>
      <router-link :to="catalogueRoute" class="t-sec__more">
        {{ t("header.everyProduct", "Every product") }}<v-icon class="k-flip" size="20">chevron_right</v-icon>
      </router-link>
    </header>
    <nav :aria-label="t('tario.header.categories', 'Categories')" class="t-circles">
      <router-link v-for="aisle in list" :key="aisle.id" :to="aisleRoute(aisle)" class="t-circle">
        <span :style="{ background: tint(aisle) }" class="t-circle__o">
          <img v-if="aisle.icon" :src="aisleImage(aisle, 256)" alt="" height="128" loading="lazy" width="128" />
        </span>
        <span class="t-circle__name">{{ aisle.title || aisle.name }}</span>
      </router-link>
    </nav>
  </section>
</template>

<script>
import { aisleImage, aisleRoute, catalogueRoute, tintFor } from "../kalio/kalio-catalog";

const MAX = 24;

export default {
  name: "TarioCircles",

  props: {
    /** The aisles, in the order the home page features them. */
    aisles: { type: Array, default: () => [] },
  },

  computed: {
    list() {
      return this.aisles.slice(0, MAX);
    },
    catalogueRoute() {
      return catalogueRoute();
    },
  },

  methods: {
    aisleRoute,
    aisleImage,
    tint: tintFor,
  },
};
</script>
