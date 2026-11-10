<!--
  Tario — the top of a product page (design B, chosen 7 November 2026).

  The picture with its thumbnails underneath and, under them on a computer,
  the product's highlights. Beside it the brand, the name, the rating, then
  one framed buy box: how the shopper wants it (Pickup | Delivery |
  Shipping, from the shop's own delivery methods, with what each costs),
  the price with the saving, the size, the sellers side by side, and the
  red Add to cart that turns into − n + once the product is in the cart.
  Under the box, who sells it. Then "Goes well with": this product and two
  from neighbouring aisles, with one button that adds the ticked ones.

  Every behaviour is Kalio's overview, which is Selldone's SProductOverview
  (extends, twice): variants, the seller choice, the basket line, the buy
  button, coupons, extra pricing. This file supplies the markup only.
-->
<template>
  <div :style="{ '--k-tint': tint }" class="k-pdp t-pdp">
    <div class="t-pdp__grid">
      <!-- ▆▆▆▆ Pictures and highlights ▆▆▆▆ -->
      <section v-if="showCover" aria-label="Product images" class="t-pdp__media k-pdp__media">
        <div class="k-pdp__stage t-pdp__stage">
          <s-shop-product-slide-show :current-variant="current_variant" :vertical="false" />
        </div>
        <div v-if="highlights.length" class="t-hl">
          <h4>Highlights</h4>
          <ul>
            <li v-for="h in highlights" :key="h.key">
              <v-icon aria-hidden="true" size="20">check_circle</v-icon>
              <span><b>{{ h.key }}:</b> {{ h.value }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- ▆▆▆▆ Name and the buy box ▆▆▆▆ -->
      <section class="t-pdp__info k-pdp__buy">
        <router-link v-if="$product.brand" :to="brandRoute" class="t-pdp__brand">{{ $product.brand }}</router-link>
        <router-link v-else-if="aisle" :to="aisleRoute" class="t-pdp__brand">{{ aisle.title || aisle.name }}</router-link>
        <h1 class="t-pdp__title">{{ $product.title }}</h1>
        <div class="t-pdp__rate">
          <span :style="{ '--k-rate': $product.rate_count ? $product.rate : 0 }" class="k-stars"></span>
          <template v-if="$product.rate_count && $product.rate">
            <b>{{ numeralFormat($product.rate, "0.0") }}</b>
            <a class="t-pdp__ratelink" href="#k-reviews" @click.prevent="toReviews">
              {{ numeralFormat($product.rate_count, "0,0") }} {{ $product.rate_count === 1 ? "rating" : "ratings" }}
            </a>
          </template>
          <span v-else class="t-pdp__norate">No ratings yet</span>
        </div>
        <p v-if="!has_original_warranty" class="k-pdp__warn">
          <v-icon size="16">error_outline</v-icon>
          {{ $t("product_info.fake") }}
        </p>

        <div class="t-buybox">
          <!-- How do you want it? -->
          <template v-if="ways.length">
            <div :class="'-n' + ways.length" aria-label="How do you want it?" class="t-seg" role="radiogroup">
              <button
                v-for="w in ways"
                :key="w.key"
                :aria-checked="w.key === way_key"
                :class="{ '-on': w.key === way_key }"
                class="t-seg__b"
                role="radio"
                type="button"
                @click="way_key = w.key"
              >
                <v-icon size="18">{{ w.icon }}</v-icon>{{ w.word }}
              </button>
            </div>
            <p v-if="way" class="t-seg__note">
              <v-icon size="18">info_outline</v-icon>
              <span>
                {{ wayNote(way) }}
                <template v-if="way.free"> Free.</template>
                <template v-else-if="way.freeOver">
                  Free on orders over <span class="u--price">{{ money(way.freeOver, way.currency, { short: "auto" }) }}</span>.</template
                >
              </span>
            </p>
          </template>

          <!-- Price -->
          <div class="k-pdp__price t-buybox__price">
            <s-subscription-price-select
              v-if="isSubscription"
              v-model="selected_subscription_price"
              :class="{ pen: !!corresponding_basket_item?.subscription_price_id || !!membership_subscribed_plan }"
              :disabled="!$product.quantity"
              :subscription-prices="subscription_prices"
              return-object
            ></s-subscription-price-select>
            <s-product-section-price
              v-else
              :preferences="preferences"
              :selected-vendor-product="selected_vendor_product"
            ></s-product-section-price>
            <s-product-section-tax></s-product-section-tax>
            <s-product-section-cashback :amount="0" :currency="GetUserSelectedCurrency()?.code"></s-product-section-cashback>
          </div>

          <!-- Size and options -->
          <div class="k-pdp__options t-buybox__options">
            <s-product-section-variants
              v-model:current-variant="current_variant"
              v-model:filter="filter"
              v-model:selection-values="selection_values"
            ></s-product-section-variants>
            <s-product-section-service v-model:preferences="preferences"></s-product-section-service>
            <s-product-section-valuation
              v-if="preferences && preferences.valuation"
              :correspondingBasketItem="corresponding_basket_item"
              :current-variant="current_variant"
              :preferences="preferences"
            ></s-product-section-valuation>
          </div>

          <!-- Compare sellers -->
          <kalio-seller-offers
            v-if="vendor_products && vendor_products.length"
            v-model="selected_vendor_product_id"
            :vendor-products="vendor_products"
            force-show-all
            @change="changeVendor"
          ></kalio-seller-offers>

          <s-product-section-extra-pricings
            :current-variant="current_variant"
            :preferences="preferences"
            :quantity="corresponding_basket_item?.count"
            :selected-vendor-product="selected_vendor_product"
            @select="(val) => $refs.buy_section?.triggerBuyButton(val.min)"
          ></s-product-section-extra-pricings>
          <s-storefront-coupons-list
            :product-id="$product.id"
            :variant-id="current_variant ? current_variant.id : undefined"
          ></s-storefront-coupons-list>

          <kalio-basket-line
            v-if="canBuy && corresponding_basket_item"
            :line="corresponding_basket_item"
            :product="$product"
            :stock="selected_vendor_product ? selected_vendor_product.quantity : current_variant ? current_variant.quantity : $product.quantity"
            :vendor-product="selected_vendor_product"
            class="k-pdp__basket"
          />
          <s-product-section-buy-button
            v-else
            ref="buy_section"
            :can-buy="canBuy"
            :current-variant="current_variant"
            :hss-sticky-but-button="hssStickyButButton"
            :preferences="preferences"
            :quick-buy-mode="quickBuyMode"
            :selected-subscription-price="selected_subscription_price"
            :selected-vendor-product="selected_vendor_product"
            class="k-pdp__basket"
          ></s-product-section-buy-button>
          <s-product-section-incentivise
            :variant="current_variant"
            :vendorProduct="selected_vendor_product"
          ></s-product-section-incentivise>
          <u-payment-stripe-split
            :basket="corresponding_basket_item ? basket : null"
            :country-code="basket?.receiver_info?.country"
            :preferences="preferences"
            :selected-subscription-price="selected_subscription_price"
            :selected-vendor-product="selected_vendor_product"
            :variant="current_variant"
            :vendor-product="selected_vendor_product"
          ></u-payment-stripe-split>
        </div>

        <p v-if="seller_name" class="t-pdp__sold">
          <v-icon size="18">verified</v-icon>
          Sold by {{ seller_name }}, an independent seller on {{ shop?.title }}
        </p>

        <div class="k-pdp__actions t-pdp__actions">
          <s-product-section-extra-buttons :current-variant="current_variant"></s-product-section-extra-buttons>
          <v-menu :close-on-content-click="false" location="bottom end" max-width="360">
            <template v-slot:activator="{ props }">
              <button class="k-pdp__share" type="button" v-bind="props">
                <v-icon size="18">ios_share</v-icon>
                {{ $t("global.commons.share") }}
              </button>
            </template>
            <div class="k-pdp__share-sheet">
              <p class="k-eyebrow">{{ $t("global.commons.share") }}</p>
              <u-button-share-group
                :description="$product.title_en"
                :media="getShopImagePath($product.icon)"
                :title="$product.title"
                :url="ShopURLs.GetProductLink(shop, $product.id, $product.slug)"
                small
              ></u-button-share-group>
            </div>
          </v-menu>
        </div>
        <s-product-section-badges class="k-pdp__assurances"></s-product-section-badges>
      </section>
    </div>

    <!-- ▆▆▆▆ Goes well with ▆▆▆▆ -->
    <section v-if="pairs.length" aria-labelledby="t-fbt" class="t-fbt">
      <h2 id="t-fbt" class="t-fbt__h">Goes well with</h2>
      <div class="t-fbt__box">
        <template v-for="(item, i) in fbt_items" :key="item.id">
          <span v-if="i" aria-hidden="true" class="t-fbt__plus">+</span>
          <div class="t-fbt__it">
            <label class="t-fbt__im">
              <input v-model="ticked" :value="item.id" type="checkbox" :aria-label="'Include ' + item.title" />
              <span class="t-fbt__cbx"><v-icon size="16">check</v-icon></span>
              <img v-if="item.image" :src="item.image" :srcset="item.srcset" alt="" loading="lazy" sizes="(max-width: 760px) 72px, 150px" @error="dropSrcset" />
            </label>
            <div>
              <u-price :amount="item.price" :class="{ '-sale': item.sale }" :currency="currency" class="t-fbt__price" />
              <router-link v-if="i" :to="productTo(item)" class="t-fbt__name">{{ item.title }}</router-link>
              <span v-else class="t-fbt__name"><b>This item:</b> {{ item.title }}</span>
            </div>
          </div>
        </template>
        <div class="t-fbt__tot">
          <span class="t-fbt__lbl">Total for {{ ticked.length }} {{ ticked.length === 1 ? "item" : "items" }}</span>
          <u-price :amount="fbt_total" :currency="currency" class="t-fbt__sum" />
          <button :disabled="!ticked.length || adding_all" class="t-btn -red -wide" type="button" @click="addAll">
            <v-progress-circular v-if="adding_all" indeterminate size="18" width="2" />
            <template v-else>{{ ticked.length > 1 ? `Add all ${ticked.length} to cart` : "Add to cart" }}</template>
          </button>
          <span class="t-fbt__small">Each joins your cart as its own line, with its own seller.</span>
        </div>
      </div>
    </section>

    <basket-item-user-message-form
      v-if="basket"
      :basket="basket"
      :product="$product"
      :variant-id="current_variant ? current_variant.id : null"
      class="k-pdp__note"
    ></basket-item-user-message-form>
    <product-discount-countdown></product-discount-countdown>
    <kalio-quick-buy v-model="pair_sheet" :product="pair_pick" />
  </div>
</template>

<script>
import KalioProductOverview from "../../kalio/product/KalioProductOverview.vue";
import KalioQuickBuy from "../../kalio/KalioQuickBuy.vue";
import { waysOf } from "../tario-home";
import { currentCurrency, money } from "../../region-switcher/region";
import { aisles, dropSrcset, priceOf, productImage, productSrcset } from "../../kalio/kalio-catalog";
import { basketLine, hasSizes, quickAdd } from "../../kalio/kalio-basket";

/* The aisles that go with an aisle, as a grocer would pair them. Matched on
   the aisle's title; an aisle not listed borrows the fresh aisles. */
const PAIRS = [
  [/dairy|egg|milk/i, [/breakfast|cereal/i, /bread|bakery/i]],
  [/bread|bakery/i, [/dairy|egg/i, /breakfast|cereal/i]],
  [/breakfast|cereal/i, [/dairy|egg/i, /produce|fruit/i]],
  [/produce|fruit|veg/i, [/dairy|egg/i, /bread|bakery/i]],
  [/meat|seafood|fish/i, [/produce|veg/i, /pantry/i]],
  [/snack/i, [/beverage|drink/i, /produce|fruit/i]],
  [/beverage|drink/i, [/snack/i, /produce|fruit/i]],
  [/pantry/i, [/produce|veg/i, /dairy|egg/i]],
  [/frozen/i, [/beverage|drink/i, /snack/i]],
  [/deli|prepared/i, [/bread|bakery/i, /beverage|drink/i]],
];
const FALLBACK = [/produce|fruit/i, /dairy|egg/i, /bread|bakery/i];

const NOTES = {
  Pickup: "Collect it at the shop.",
  Delivery: "A courier brings it to your door. The cost shows once you add your address.",
  Shipping: "Shipped to your address. The cost shows at checkout.",
  "By post": "Sent to your address by post. The cost shows at checkout.",
  Worldwide: "Shipped wherever you are. The cost shows at checkout.",
};

export default {
  name: "TarioProductOverview",
  extends: KalioProductOverview,
  components: { KalioQuickBuy },

  data() {
    return {
      way_key: null,
      pairs: [],
      ticked: [],
      adding_all: false,
      pair_sheet: false,
      pair_pick: null,
    };
  },

  computed: {
    ways() {
      return waysOf(this.shop || this.$shop).slice(0, 3);
    },
    way() {
      return this.ways.find((w) => w.key === this.way_key) || null;
    },
    brandRoute() {
      return { name: window.$storefront.routes.SHOP_PAGE, query: { search: this.$product.brand } };
    },
    seller_name() {
      return this.selected_vendor_product?.vendor?.name || null;
    },
    currency() {
      return currentCurrency(); // the shopper's, reactive: redraws at once on a pick
    },
    /* The merchant's highlights (pros) when there are any, else the first
       group of the product's spec ("At a Glance"). */
    highlights() {
      const raw = this.$product?.pros;
      const pros = raw && typeof raw === "object" ? Object.entries(raw).filter(([k, v]) => k && v != null) : [];
      if (pros.length) return pros.slice(0, 6).map(([key, value]) => ({ key, value: String(value) }));
      const spec = this.$product?.spec;
      if (!spec || typeof spec !== "object") return [];
      const order = Array.isArray(spec.spec_order) && spec.spec_order.length ? spec.spec_order : Object.keys(spec);
      const out = [];
      let groups = 0;
      for (const key of order) {
        if (key === "spec_order") continue;
        const value = spec[key];
        if (value === "group") {
          if (++groups > 1) break;
          continue;
        }
        if (value === null || value === undefined || value === "") continue;
        out.push({ key, value: Array.isArray(value) ? value.join(", ") : String(value) });
        if (out.length >= 6) break;
      }
      return out;
    },
    fbt_items() {
      const self = this.$product;
      const now = this.selfPrice();
      return [
        { id: self.id, title: self.title, image: productImage(self), srcset: productSrcset(self), price: now.now, sale: !!now.was, self: true },
        ...this.pairs,
      ];
    },
    fbt_total() {
      return this.fbt_items.filter((i) => this.ticked.includes(i.id)).reduce((sum, i) => sum + (i.price || 0), 0);
    },
  },

  watch: {
    ways: {
      handler(list) {
        if (!list.some((w) => w.key === this.way_key)) {
          this.way_key = (list.find((w) => w.key === "Delivery") || list[0] || {}).key || null;
        }
      },
      immediate: true,
    },
    "$product.id": {
      handler() {
        this.readPairs();
      },
      immediate: true,
    },
  },

  methods: {
    money,
    dropSrcset,
    wayNote(way) {
      return NOTES[way.key] || way.line + ".";
    },
    productTo(item) {
      return { name: window.$storefront.routes.PRODUCT_PAGE, params: { product_id: item.id } };
    },
    /* This product's price as the buy box shows it: the chosen seller's
       offer when there is one, else the product's own. */
    selfPrice() {
      const vp = this.selected_vendor_product;
      const base = vp ? { ...this.$product, price: vp.price, discount: vp.discount, currency: vp.currency } : this.$product;
      try {
        return priceOf(this.shop, base, this.currency);
      } catch {
        return { now: 0, was: null };
      }
    },
    async readPairs() {
      const id = this.$product?.id;
      this.pairs = [];
      this.ticked = id ? [id] : [];
      if (!id) return;
      const list = await aisles().catch(() => []);
      const mine = list.find((a) => a.id === this.$product.category_id);
      const label = mine ? `${mine.title || ""} ${mine.name || ""}` : "";
      const wanted = (PAIRS.find(([re]) => re.test(label)) || [null, FALLBACK])[1];
      const picks = [];
      for (const re of wanted.concat(FALLBACK)) {
        if (picks.length >= 2) break;
        const aisle = list.find((a) => a.id !== this.$product.category_id && !picks.some((p) => p.aisle === a.id) && re.test(`${a.title || ""} ${a.name || ""}`));
        if (!aisle) continue;
        try {
          const { products } = await window.$storefront.products.list(aisle.name, 0, 8, {
            products_only: true,
            sort: "bestselling",
            available: true,
          });
          /* One without sizes, so one tap can add it; the pick moves with
             the product, so two products do not show the same pair. */
          const ok = (products || []).filter((p) => !hasSizes(p) && p.id !== id);
          const p = ok.length ? ok[id % ok.length] : null;
          if (p) picks.push({ aisle: aisle.id, product: p });
        } catch {
          /* fewer pairs */
        }
      }
      if (this.$product?.id !== id) return;
      this.pairs = picks.map(({ product }) => {
        const price = priceOf(this.shop, product, this.currency);
        return { id: product.id, title: product.title, image: productImage(product), srcset: productSrcset(product), price: price.now, sale: !!price.was, product };
      });
      this.ticked = [id, ...this.pairs.map((p) => p.id)];
    },
    async addAll() {
      this.adding_all = true;
      try {
        for (const item of this.fbt_items) {
          if (!this.ticked.includes(item.id)) continue;
          if (item.self) {
            if (!this.corresponding_basket_item) this.buy();
            continue;
          }
          if (basketLine(this, item.product)) continue;
          await quickAdd(this, item.product, (picked) => {
            this.pair_pick = picked;
            this.pair_sheet = true;
          }).catch(() => null);
        }
      } finally {
        this.adding_all = false;
      }
    },
  },
};
</script>
