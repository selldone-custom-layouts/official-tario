<!--
  Tario — "Fresh finds" (design A): three tall editorial tiles.

  A big-box home breaks its rows of products with a few large pictures of
  food on the table: here, the fresh aisle ("Picked this week"), the drinks
  aisle ("Your morning, brewed") and dinner ("Weeknight dinners"), each
  leading to its aisle. An aisle the shop does not have loses its tile; with
  fewer than two the section is not shown. The picture is the bundled photo
  or a still life of the aisle's best sellers. On a phone the tiles scroll
  sideways.
-->
<template>
  <section v-if="tiles.length >= 2" aria-labelledby="t-finds" class="t-sec k-wrap">
    <header class="t-sec__head">
      <h2 id="t-finds" class="t-sec__title">{{ t("tario.finds.title", "Fresh finds") }}</h2>
    </header>
    <div class="t-finds">
      <router-link v-for="tile in tiles" :key="tile.key" :to="tile.to" class="t-tile -tall">
        <tario-photo :alt="tile.alt" :ground="tile.ground" :products="tile.products" :src="tile.photo" shape="tall" />
        <span class="t-tile__cap">
          <small>{{ tile.eyebrow }}</small>
          <b>{{ tile.kind.title }}</b>
          <u>{{ t("tario.shopAisle", "Shop {aisle}", { aisle: tile.eyebrow.toLowerCase() }) }}</u>
        </span>
      </router-link>
    </div>
  </section>
</template>

<script>
import TarioPhoto from "./TarioPhoto.vue";
import { aisleRoute, tintFor } from "../kalio/kalio-catalog";
import { FINDS, findAisle, listProducts, photo } from "./tario-home";

export default {
  name: "TarioFinds",
  components: { TarioPhoto },

  props: {
    aisles: { type: Array, default: () => [] },
  },

  data() {
    return {
      tiles: [],
    };
  },

  watch: {
    aisles: {
      handler() {
        this.build();
      },
      immediate: true,
    },
  },

  methods: {
    async build() {
      const used = new Set();
      const picks = [];
      for (const kind of FINDS) {
        const aisle = findAisle(this.aisles, kind.pattern, used);
        if (!aisle) continue;
        used.add(aisle.id);
        picks.push({ aisle, kind });
      }
      if (picks.length < 2) {
        this.tiles = [];
        return;
      }
      const reads = await Promise.all(picks.map(({ aisle }) => listProducts(aisle.name, 3, { sort: "bestselling" })));
      this.tiles = picks
        .map(({ aisle, kind }, i) => ({
          key: aisle.id,
          to: aisleRoute(aisle),
          eyebrow: aisle.title || aisle.name,
          kind,
          photo: photo(kind.photo),
          alt: aisle.title || aisle.name,
          products: reads[i],
          ground: tintFor(aisle),
        }))
        .filter((tile) => tile.photo || tile.products.length);
    },
  },
};
</script>
