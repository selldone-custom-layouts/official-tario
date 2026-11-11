<!--
  Kalio — Seller offers on a product.

  The marketplace choice on a product page: every seller that offers this
  product (for the chosen size), each as a card with their mark, their name,
  their price and a link to their shop. Picking a card picks the seller the
  basket line will come from.

  The behaviour is Selldone's SSmartSelectVendor, inherited whole through
  `extends`: the same v-model and change events, the same price rule
  (CalcPriceProductCurrentCurrency in the shopper's currency), the same
  pickup address when the marketplace offers pickup. Only the markup is
  Kalio's: a radio group of offer cards instead of a list of
  "View store of …" rows.
-->
<template>
  <section v-if="items_show.length" :aria-labelledby="headingId" class="k-offers">
    <header class="k-offers__head">
      <!-- Tario 1.2.0 (product page B): a table of the sellers. -->
      <h2 :id="headingId" class="k-offers__title">
        {{ items_show.length > 1 ? t("tario.offers.compare", "Compare sellers") : t("offers.soldBy", "Sold by") }}
      </h2>
    </header>
    <div v-if="items_show.length > 1" aria-hidden="true" class="k-offers__cols">
      <span>{{ t("seller.label", "Seller") }}</span><span>{{ t("compare.listing.price", "Price") }}</span><span>{{ t("tario.offers.choose", "Choose") }}</span>
    </div>

    <div :aria-labelledby="headingId" class="k-offers__list" role="radiogroup">
      <div
        v-for="offer in items_show"
        :key="offer.id"
        :aria-checked="offer.id === modelValue"
        :class="{ '-on': offer.id === modelValue, '-disabled': disabled }"
        :tabindex="offer.id === modelValue || (!modelValue && offer === items_show[0]) ? 0 : -1"
        class="k-offer"
        role="radio"
        @click="pick(offer)"
        @keydown.enter.prevent="pick(offer)"
        @keydown.space.prevent="pick(offer)"
      >
        <span aria-hidden="true" class="k-offer__dot"></span>
        <span class="k-offer__mark">
          <img v-if="offer.vendor.icon" :src="getShopImagePath(offer.vendor.icon, 128)" alt="" height="40" width="40" />
          <v-icon v-else size="20">storefront</v-icon>
        </span>
        <span class="k-offer__body">
          <span class="k-offer__name">{{ offer.vendor.name }}</span>
          <a
            :href="getVendorLink(offer.vendor)"
            class="k-offer__link"
            @click.stop
          >
            {{ t("offers.visitShop", "Visit shop") }}
          </a>
          <span
            v-if="pickup_transportation_for_vendors_exists && offer.vendor.warehouse"
            class="k-offer__pickup"
          >
            <v-icon size="14">place</v-icon>
            {{ $t("global.commons.pickup") }} · {{ getVendorAddress(offer.vendor) }}
          </span>
        </span>
        <span class="k-offer__price">
          <u-price :amount="calcVendorPrice(offer)" :currency="GetUserSelectedCurrency()"></u-price>
        </span>
      </div>
    </div>
  </section>
</template>

<script>
import SSmartSelectVendor from "@selldone/components-vue/storefront/vendor/selector/SSmartSelectVendor.vue";

let offersCount = 0;

export default {
  name: "KalioSellerOffers",
  extends: SSmartSelectVendor,

  data() {
    return {
      headingId: `k-offers-${++offersCount}`,
    };
  },

  methods: {
    /* Same events as SSmartSelectVendor's own click handler, in its
       force-show-all form: a click always selects that seller. */
    pick(offer) {
      if (this.disabled) return;
      this.$emit("update:modelValue", offer.id);
      this.$emit("change", offer.id);
    },
  },
};
</script>
