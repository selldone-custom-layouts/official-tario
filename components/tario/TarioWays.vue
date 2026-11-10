<!--
  Tario — "Ways to get it" (design A).

  How an order reaches the shopper, read from the shop's own delivery
  methods (shop.transportations, the ones that are switched on): Pickup,
  Delivery, Shipping, each with its free rule — "Free", or "Free on orders
  over $200" — exactly as the merchant set it. Nothing is promised that the
  shop has not set: no time, no area, no price. A shop with no delivery
  method set shows nothing here.
-->
<template>
  <section v-if="ways.length" aria-labelledby="t-ways" class="t-sec k-wrap">
    <header class="t-sec__head">
      <h2 id="t-ways" class="t-sec__title">Ways to get it</h2>
    </header>
    <ul :class="'-n' + Math.min(ways.length, 4)" class="t-ways">
      <li v-for="way in ways" :key="way.key" class="t-way">
        <span aria-hidden="true" class="t-way__ic"><v-icon size="26">{{ way.icon }}</v-icon></span>
        <span class="t-way__text">
          <b>{{ way.word }}</b>
          <span class="t-way__line">{{ way.line }}</span>
          <em v-if="way.free">Free</em>
          <em v-else-if="way.freeOver">Free on orders over <span class="u--price">{{ money(way.freeOver, way.currency, { short: "auto" }) }}</span></em>
        </span>
      </li>
    </ul>
  </section>
</template>

<script>
import { waysOf } from "./tario-home";
import { money } from "../region-switcher/region";

export default {
  name: "TarioWays",
  inject: ["$shop"],

  computed: {
    ways() {
      return waysOf(this.$shop).slice(0, 4);
    },
  },

  methods: {
    /* The way's threshold, in the shopper's currency. */
    money,
  },
};
</script>
