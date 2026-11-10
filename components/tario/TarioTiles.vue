<!--
  Tario — "Deals for every aisle" (design A): a grid of promo tiles.

  One large tile and up to four smaller ones, each an aisle: breakfast,
  snacks, bakery, household, meat — the aisles a big-box grocer promotes —
  when the shop has them, and otherwise its next featured aisles. A tile
  says what the aisle has on offer ("Up to 20% off breakfast
  favourites") when it has discounted products, and a plain line ("Fresh-
  baked, from $3.92") when it has none; both are read live. Its picture is
  the bundled photo for that aisle (tario-home.ts) or a still life of the
  aisle's best sellers. The section waits until it is about to be seen.
  Fewer than three aisles, and it is not shown.
-->
<template>
  <section v-if="tiles.length >= 3 || busy" ref="root" aria-labelledby="t-tiles" class="t-sec k-wrap">
    <header class="t-sec__head">
      <h2 id="t-tiles" class="t-sec__title">Deals for every aisle</h2>
      <router-link :to="dealsRoute" class="t-sec__more">
        All deals<v-icon class="k-flip" size="20">chevron_right</v-icon>
      </router-link>
    </header>
    <div :class="'-n' + Math.max(3, tiles.length)" class="t-tiles">
      <template v-if="busy">
        <div v-for="n in 5" :key="'s' + n" aria-hidden="true" class="t-tile -skeleton"></div>
      </template>
      <router-link v-for="tile in tiles" v-else :key="tile.key" :to="tile.to" class="t-tile">
        <tario-photo
          :alt="tile.alt"
          :ground="tile.ground"
          :products="tile.products"
          :src="tile.photo"
          :shape="tile.big ? 'square' : 'tile'"
        />
        <span class="t-tile__cap">
          <small>{{ tile.eyebrow }}</small>
          <b>{{ tile.pre }}<u-price v-if="tile.from != null" :amount="tile.from" :currency="currency" />{{ tile.post }}</b>
          <u>Shop now</u>
        </span>
      </router-link>
    </div>
  </section>
</template>

<script>
import { currentCurrency } from "../region-switcher/region";
import CurrencyMixin from "@selldone/components-vue/mixin/currency/CurrencyMixin.ts";
import TarioPhoto from "./TarioPhoto.vue";
import { aisleRoute, dealsRoute, percentOff, priceOf, tintFor } from "../kalio/kalio-catalog";
import { DEALS_FILTER, TILES, findAisle, listProducts, photo } from "./tario-home";

const MAX = 5;

export default {
  name: "TarioTiles",
  components: { TarioPhoto },
  mixins: [CurrencyMixin],

  props: {
    /** The aisles, in the order the home page features them. */
    aisles: { type: Array, default: () => [] },
    /** Aisles shown elsewhere above, tried last. */
    after: { type: Array, default: () => [] },
  },

  data() {
    return {
      tiles: [],
      busy: true,
      seen: false,
    };
  },

  computed: {
    shop() {
      return this.$store.getters.getShop;
    },
    currency() {
      return currentCurrency(); // the shopper's, reactive: redraws at once on a pick
    },
    dealsRoute() {
      return dealsRoute();
    },
  },

  watch: {
    aisles() {
      if (this.seen) this.build();
    },
  },

  mounted() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.observer.disconnect();
            this.seen = true;
            this.build();
          }
        },
        { rootMargin: "500px 0px" },
      );
      this.observer.observe(this.$refs.root);
    } else {
      this.seen = true;
      this.build();
    }
  },

  beforeUnmount() {
    this.observer?.disconnect();
  },

  methods: {
    /** Which aisle each tile is: the promoted ones first, then the rest. */
    picks() {
      const used = new Set();
      const out = [];
      for (const kind of TILES) {
        const aisle = findAisle(this.aisles, kind.pattern, used);
        if (aisle) {
          used.add(aisle.id);
          out.push({ aisle, kind });
        }
      }
      const rest = [...this.aisles.filter((a) => !this.after.includes(a)), ...this.after];
      for (const aisle of rest) {
        if (out.length >= MAX) break;
        if (used.has(aisle.id)) continue;
        used.add(aisle.id);
        out.push({ aisle, kind: null });
      }
      return out.slice(0, MAX);
    },

    async build() {
      const picks = this.picks();
      if (!picks.length) {
        if (this.aisles.length) this.busy = false;
        return;
      }
      const reads = await Promise.all(
        picks.map(({ aisle }) =>
          Promise.all([
            listProducts(aisle.name, 4, { filter: DEALS_FILTER, sort: "bestselling" }),
            listProducts(aisle.name, 4, { sort: "bestselling" }),
          ]),
        ),
      );
      const tiles = [];
      picks.forEach(({ aisle, kind }, i) => {
        const [deals, popular] = reads[i];
        const products = [...deals, ...popular.filter((p) => !deals.some((d) => d.id === p.id))];
        if (!products.length) return;
        const title = aisle.title || aisle.name;
        const off = Math.max(0, ...deals.map((product) => percentOff(this.shop, product)));
        const prices = products.map((product) => priceOf(this.shop, product, this.currency).now).filter((n) => n > 0);
        const from = prices.length ? Math.min(...prices) : null;
        let line;
        if (kind) line = off > 0 ? kind.deal : kind.plain;
        else line = off > 0 ? `Up to {off}% off ${title.toLowerCase()}` : `Shop ${title.toLowerCase()}`;
        if (line.includes("{from}") && from == null) line = `Shop ${title.toLowerCase()}`;
        line = line.replace("{off}", off);
        const [pre, post] = line.includes("{from}") ? line.split("{from}") : [line, ""];
        tiles.push({
          key: aisle.id,
          to: aisleRoute(aisle),
          eyebrow: title,
          title: line.replace("{from}", ""),
          pre,
          post,
          from: line.includes("{from}") ? from : null,
          photo: kind ? photo(kind.photo) : null,
          alt: title,
          products,
          ground: tintFor(aisle),
          big: tiles.length === 0,
        });
      });
      this.tiles = tiles;
      this.busy = false;
    },
  },
};
</script>
