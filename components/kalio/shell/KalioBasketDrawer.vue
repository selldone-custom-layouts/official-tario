<!--
  Kalio — the basket drawer (the header's Basket).

  A receipt first: the subtotal large, what the shopper saves, and
  Checkout right there. Then the basket in compact rows (picture, name,
  size and seller, a quantity stepper, the line's price), and under it
  three products often added, each with its own "+" (KalioOftenAdded). Design C of three
  drawn on 4 November 2026 (../kalio-design/basket-drawer-options/).

  It replaces Selldone's BasketTopMenu ("YOUR CART", a black "Count"
  dropdown, "Hour" and a black Checkout). The basket, its bill and the
  steppers are the storefront's own (getBaskets, kalio-basket.ts); the
  stepper changes the count as it is tapped and the bill follows. A
  basket of another type (a file or a service) gets its own receipt.
-->
<template>
  <!-- Tario 1.2.0 (drawer design A): how far from free shipping, the lines
       under each seller, three often added, and the totals with View cart
       and Check out at the foot. -->
  <div class="k-bdrawer t-bdrawer">
    <div class="t-bdrawer__body">
      <section v-for="group in groups" :key="group.type" class="k-bdrawer__group">
        <p v-if="groups.length > 1" class="t-bdrawer__type">{{ typeName(group.type) }}</p>
        <div v-if="free_from && group.type === 'PHYSICAL' && freeLimit(group) != null" class="t-meter2">
          <template v-if="freeLeft(group) > 0">
            <template v-for="(part, i) in t('tario.meter.addMore', 'Add {amount} more for free shipping').split('{amount}')" :key="i"><b v-if="i"><span class="u--price">{{ money(freeLeft(group), group.currency) }}</span></b>{{ part }}</template>
          </template>
          <template v-else><b>{{ t("tario.meter.free", "Free shipping") }}</b> {{ t("tario.meter.onThisOrder", "on this order") }}</template>
          <div class="t-meter__bar"><i :style="{ width: freePct(group) + '%' }"></i></div>
        </div>
        <template v-for="sg in bySeller(group)" :key="sg.key">
          <p class="t-bdrawer__seller">
            <img v-if="sg.logo" :src="sg.logo" alt="" height="22" width="22" />
            {{ t("tario.drawer.soldBy", "Sold by {name}", { name: sg.name }) }}
          </p>
          <ul class="k-bdrawer__rows">
            <li v-for="item in sg.items" :key="item.id" class="k-bdrawer__row">
              <router-link :to="productRoute(item.product_id)" class="k-bdrawer__pic" @click="$emit('close')">
                <img v-if="image(item.product)" :src="image(item.product)" alt="" height="36" loading="lazy" width="36" />
              </router-link>
              <div class="t-bdrawer__mid">
                <router-link :to="productRoute(item.product_id)" class="k-bdrawer__name" @click="$emit('close')">
                  <span>{{ item.product?.title }}</span>
                  <small v-if="size(item)">{{ size(item) }}</small>
                </router-link>
                <div
                  :aria-label="item.product?.title ? t('cart.qty.of', 'Quantity of {name}', { name: item.product.title }) : t('cart.qty.ofThis', 'Quantity of this item')"
                  :class="{ '-busy': settling(item.product, item) }"
                  class="k-bdrawer__qty"
                  role="group"
                >
                  <button :aria-label="shown(item) > 1 ? t('cart.qty.fewer', 'One fewer') : t('cart.qty.remove', 'Remove from cart')" type="button" @click="step(item, -1)">
                    <v-icon size="16">{{ shown(item) > 1 ? "remove" : "delete_outline" }}</v-icon>
                  </button>
                  <output aria-live="polite">{{ shown(item) }}</output>
                  <button :disabled="shown(item) >= max(item)" :aria-label="t('cart.qty.more', 'One more')" type="button" @click="step(item, 1)">
                    <v-icon size="16">add</v-icon>
                  </button>
                </div>
              </div>
              <span class="t-bdrawer__prices">
                <span :class="{ '-sale': item.dis > 0 }" class="u--price k-bdrawer__price">{{ money(item.price * shown(item), item.currency || group.currency) }}</span>
                <s v-if="item.dis > 0"><span class="u--price">{{ money((item.price + item.dis) * shown(item), item.currency || group.currency) }}</span></s>
              </span>
            </li>
          </ul>
        </template>
      </section>
      <kalio-often-added :count="3" class="k-bdrawer__often" @navigate="$emit('close')" />
    </div>

    <footer v-for="group in groups.slice(0, 1)" :key="'f' + group.type" :class="{ '-settling': group.settling }" class="t-bdrawer__foot">
      <p class="t-bdrawer__row">
        <span>{{ t("tario.drawer.items", "Items ({n})", { n: group.units }) }}</span><span class="u--price">{{ money(group.total + group.saved, group.currency) }}</span>
      </p>
      <p v-if="group.saved >= 0.01" class="t-bdrawer__row -save">
        <span>{{ t("basket.receipt.youSave", "You save") }}</span><span class="k-signed">−<span class="u--price">{{ money(group.saved, group.currency) }}</span></span>
      </p>
      <p class="t-bdrawer__row -tot">
        <span>{{ t("tario.drawer.subtotal", "Subtotal") }}</span><span class="u--price">{{ money(group.total, group.currency) }}</span>
      </p>
      <div class="t-bdrawer__btns">
        <router-link :to="checkoutRoute(group.type)" class="t-btn -line" @click="$emit('close')">{{ t("tario.drawer.viewCart", "View cart") }}</router-link>
        <router-link :to="checkoutRoute(group.type)" class="t-btn -red" @click="$emit('close')">{{ t("tario.drawer.checkOut", "Check out") }}</router-link>
      </div>
    </footer>
  </div>
</template>

<script>
import { ProductType } from "@selldone/core-js/enums/product/ProductType";
import { settling, shownCount, stepTo } from "../kalio-basket";
import { productImage, vendorImage, vendors } from "../kalio-catalog";
import { convertIfKnown, freeShippingFrom } from "../../tario/tario-home";
import { currentCurrency, money } from "../../region-switcher/region";
import KalioOftenAdded from "../KalioOftenAdded.vue";

/* The size of a variant in words: its volume, weight, pack, colour or style. */
function sizeOf(variant) {
  if (!variant) return null;
  return variant.volume || variant.weight || variant.pack || variant.type || variant.style || null;
}

export default {
  name: "KalioBasketDrawer",
  components: { KalioOftenAdded },

  emits: ["close"],

  data() {
    return {
      sellerNames: new Map(),
      sellerList: [],
    };
  },

  computed: {
    free_from() {
      return freeShippingFrom(this.$shop || this.getShop?.());
    },
    /* One receipt per basket with something in it: usually the one basket
       of groceries. Rows taken to zero leave at once; the bill follows. */
    groups() {
      return this.getBaskets()
        .filter((basket) => basket?.items?.length)
        .map((basket) => {
          const bill = basket.bill || {};
          const items = basket.items.filter((item) => shownCount(item.product || { id: item.product_id }, item) > 0);
          return {
            type: basket.type,
            items,
            units: basket.items.reduce((sum, item) => sum + (item.count || 0), 0),
            total: typeof bill.price === "number" ? bill.price : basket.price,
            /* From the lines, not the bill: a basket read on page load
               comes without one. */
            saved: basket.items.reduce(
              (sum, item) => sum + (item.dis || 0) * (item.count || 0) + (item.offer_amount || 0),
              0,
            ),
            currency: bill.currency || basket.currency,
            settling: basket.items.some((item) => settling(item.product || { id: item.product_id }, item)),
          };
        })
        .filter((group) => group.items.length);
    },
  },

  created() {
    vendors().then((list) => {
      this.sellerNames = new Map(list.map((vendor) => [vendor.id, vendor.name]));
      this.sellerList = list;
    });
  },

  methods: {
    money,
    settling,

    image(product) {
      return productImage(product, true);
    },

    size(item) {
      return sizeOf(item.variant);
    },

    /* The lines under each seller, in the order they were first added. */
    bySeller(group) {
      const out = new Map();
      for (const item of group.items) {
        const key = item.vendor_id || 0;
        if (!out.has(key)) {
          const vendor = this.sellerList.find((v) => v.id === key);
          out.set(key, {
            key,
            name: this.sellerNames.get(key) || this.$shop?.title || "molino",
            logo: vendor ? vendorImage(vendor, true) : null,
            items: [],
          });
        }
        out.get(key).items.push(item);
      }
      return [...out.values()];
    },

    /* The shop's threshold in this basket's currency (the way's own
       currency may differ), so the meter subtracts like from like. */
    freeLimit(group) {
      if (!this.free_from) return null;
      return convertIfKnown(this.free_from.amount, this.free_from.currency, group.currency || currentCurrency());
    },

    freeLeft(group) {
      const limit = this.freeLimit(group);
      return limit != null ? Math.max(0, limit - group.total) : 0;
    },

    freePct(group) {
      const limit = this.freeLimit(group);
      return limit ? Math.min(100, Math.round((group.total / limit) * 100)) : 0;
    },

    meta(item) {
      const seller = this.sellerNames.get(item.vendor_id);
      return [sizeOf(item.variant), seller].filter(Boolean).join(" · ");
    },

    typeName(type) {
      return this.$t(ProductType[type]?.name || type);
    },

    shown(item) {
      return shownCount(item.product || { id: item.product_id }, item);
    },

    max(item) {
      return item.vendor_product?.quantity ?? item.variant?.quantity ?? item.product?.quantity ?? 99;
    },

    step(item, delta) {
      const product = { id: item.product_id, type: item.product?.type };
      stepTo(this, product, item, this.shown(item) + delta);
    },

    productRoute(id) {
      return { name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: id } };
    },

    checkoutRoute(type) {
      return { name: window.$storefront.routes.BASKET_PAGE, params: { type } };
    },
  },
};
</script>
