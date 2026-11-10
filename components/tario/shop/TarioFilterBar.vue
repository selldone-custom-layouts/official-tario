<!--
  Tario — the filter chip bar (shop page design A, 7 November 2026).

  One row under the aisle title instead of a filter column: "Filter & sort"
  opens every filter in one panel (a side panel on a computer, a sheet from
  the bottom on a phone), Deals switches the offers on and off, Price and
  each of the aisle's own filter groups open a small menu of their own, and
  the sort sits at the end of the row. The groups are the aisle's live
  Selldone filters (tario-filters.ts), never a fixed list.

  The bar only says what the shopper picked: the page hands every change to
  the listing (SProductsListing.setFilter / sort), which fetches and writes
  the address as it always has.
-->
<template>
  <div class="t-fbar" role="toolbar" aria-label="Filter and sort">
    <div class="t-fbar__row">
      <button :class="{ '-on': on_count }" class="t-chip -all" type="button" @click="openPanel">
        <v-icon size="18">tune</v-icon>
        Filter &amp; sort<b v-if="on_count" class="t-chip__n">{{ on_count }}</b>
      </button>
      <span aria-hidden="true" class="t-fbar__sep"></span>

      <button
        v-if="!ignore.includes('discount')"
        :aria-pressed="!!value.only_has_discount"
        :class="{ '-on': value.only_has_discount }"
        class="t-chip"
        type="button"
        @click="toggleDeals"
      >
        <v-icon size="17">local_offer</v-icon>
        Deals
      </button>

      <!-- Price -->
      <v-menu
        v-if="has_price"
        v-model="menus.price"
        :close-on-content-click="false"
        location="bottom start"
        offset="8"
      >
        <template v-slot:activator="{ props }">
          <button :class="{ '-on': price_on, '-open': menus.price }" class="t-chip" type="button" v-bind="props">
            Price<v-icon size="18">{{ menus.price ? "expand_less" : "expand_more" }}</v-icon>
          </button>
        </template>
        <div class="t-dd">
          <h5>Price</h5>
          <v-range-slider
            v-model="price_draft"
            :max="price_max"
            :min="price_min"
            :step="price_step"
            class="t-dd__slider"
            color="#1f1f1f"
            hide-details
          ></v-range-slider>
          <div class="t-dd__prices">
            <span><u-price :amount="price_draft[0]" /></span>–<span><u-price :amount="price_draft[1]" /></span>
          </div>
          <div class="t-dd__ft">
            <button class="t-btn -line" type="button" @click="clearPrice">Clear</button>
            <button class="t-btn -red" type="button" @click="applyPrice">Apply</button>
          </div>
        </div>
      </v-menu>

      <!-- The aisle's own groups -->
      <v-menu
        v-for="group in chip_groups"
        :key="group.kind + group.key"
        v-model="menus[group.kind + group.key]"
        :close-on-content-click="false"
        location="bottom start"
        offset="8"
      >
        <template v-slot:activator="{ props }">
          <button
            :class="{ '-on': picked(group).length, '-open': menus[group.kind + group.key] }"
            class="t-chip"
            type="button"
            v-bind="props"
            @click="startDraft(group)"
          >
            {{ group.label }}<b v-if="picked(group).length" class="t-chip__n">{{ picked(group).length }}</b>
            <v-icon size="18">{{ menus[group.kind + group.key] ? "expand_less" : "expand_more" }}</v-icon>
          </button>
        </template>
        <div class="t-dd">
          <h5>{{ group.label }}</h5>
          <div class="t-dd__list">
            <label v-for="v in group.values" :key="v" class="t-check">
              <input v-model="draft" :value="v" type="checkbox" />
              <span class="t-check__box"><v-icon size="16">check</v-icon></span>
              {{ valueLabel(v) }}
            </label>
          </div>
          <div class="t-dd__ft">
            <button class="t-btn -line" type="button" @click="applyGroup(group, [])">Clear</button>
            <button class="t-btn -red" type="button" @click="applyGroup(group, draft)">Apply</button>
          </div>
        </div>
      </v-menu>

      <button v-if="more_groups.length" :class="{ '-on': more_on }" class="t-chip" type="button" @click="openPanel">
        More<b v-if="more_on" class="t-chip__n">{{ more_on }}</b><v-icon size="18">expand_more</v-icon>
      </button>

      <!-- Scope menus for the catalogue (search, deals, every product) -->
      <slot name="extra"></slot>

      <v-menu v-model="menus.sort" location="bottom end" offset="8">
        <template v-slot:activator="{ props }">
          <button class="t-fbar__sort" type="button" v-bind="props">
            Sort: <b>{{ sortName(sort, sortFallback) }}</b>
            <v-icon size="18">{{ menus.sort ? "expand_less" : "expand_more" }}</v-icon>
          </button>
        </template>
        <div class="t-dd -sort">
          <button
            v-for="s in SORTS"
            :key="s.val"
            :class="{ '-on': s.val === sort }"
            class="t-dd__opt"
            type="button"
            @click="$emit('update:sort', s.val)"
          >
            {{ s.name }}<v-icon v-if="s.val === sort" size="18">check</v-icon>
          </button>
        </div>
      </v-menu>
    </div>

    <!-- ▆▆▆▆ Every filter in one panel ▆▆▆▆ -->
    <!-- A panel of Tario's own (Vuetify's dialog sits inside a blurred
         overlay that pushed a fixed sheet off a phone's screen). -->
    <teleport to="body">
      <transition name="t-fade">
        <div v-if="panel" aria-hidden="true" class="t-fscrim" @click="panel = false"></div>
      </transition>
      <transition :name="phone ? 't-up' : 't-left'">
        <div v-if="panel" aria-label="Filter and sort" aria-modal="true" class="t-fpanel" role="dialog" @keydown.esc="panel = false">
      <div class="t-fpanel__in">
            <header class="t-fpanel__h">
              Filter &amp; sort
              <button aria-label="Close" class="t-fpanel__x" type="button" @click="panel = false">
                <v-icon size="24">close</v-icon>
              </button>
            </header>
            <div class="t-fpanel__b">
              <section class="t-fgrp">
                <h5>Sort by</h5>
                <label v-for="s in SORTS" :key="s.val" class="t-radio">
                  <input v-model="panel_sort" :value="s.val" name="t-sort" type="radio" />
                  <span class="t-radio__dot"></span>{{ s.name }}
                </label>
              </section>
              <section v-if="!ignore.includes('discount')" class="t-fgrp">
                <label class="t-switch">
                  <span>On sale only</span>
                  <input v-model="panel_value.only_has_discount" type="checkbox" />
                  <i></i>
                </label>
              </section>
              <section v-if="has_price" class="t-fgrp">
                <h5>Price</h5>
                <v-range-slider
                  v-model="panel_price"
                  :max="price_max"
                  :min="price_min"
                  :step="price_step"
                  class="t-dd__slider"
                  color="#1f1f1f"
                  hide-details
                ></v-range-slider>
                <div class="t-dd__prices">
                  <span><u-price :amount="panel_price[0]" /></span>–<span><u-price :amount="panel_price[1]" /></span>
                </div>
              </section>
              <section v-for="group in groups" :key="'p' + group.kind + group.key" class="t-fgrp">
                <h5>{{ group.label }}</h5>
                <div class="t-fgrp__opts">
                  <button
                    v-for="v in group.values"
                    :key="v"
                    :aria-pressed="panelPicked(group).includes(v)"
                    :class="{ '-on': panelPicked(group).includes(v) }"
                    class="t-opt"
                    type="button"
                    @click="panelToggle(group, v)"
                  >
                    {{ valueLabel(v) }}
                  </button>
                </div>
              </section>
            </div>
            <footer class="t-fpanel__f">
              <button class="t-btn -line" type="button" @click="panelClear">Clear all</button>
              <button class="t-btn -red" type="button" @click="panelApply">Show results</button>
            </footer>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
import { currentCurrency } from "../../region-switcher/region";
import UPrice from "@selldone/components-vue/ui/price/UPrice.vue";
import CurrencyMixin from "@selldone/components-vue/mixin/currency/CurrencyMixin.ts";
import { PriceHelper } from "@selldone/core-js/helper";
import { SORTS, clone, countOn, groupsOf, picked, sortName, valueLabel, withGroup } from "./tario-filters";

/* How many groups get a chip of their own before "More". */
const CHIPS = 4;

export default {
  name: "TarioFilterBar",
  components: { UPrice },
  mixins: [CurrencyMixin],
  inject: ["$shop"],
  emits: ["update:modelValue", "update:sort"],

  props: {
    /** Selldone's filter record for this listing (parent.filters or shop.filters). */
    filters: { type: Object, default: null },
    /** The filter the listing has now. */
    modelValue: { type: Object, default: null },
    sort: { type: String, default: null },
    sortFallback: { type: String, default: "Featured" },
  },

  data() {
    return {
      SORTS,
      menus: {},
      draft: [],
      price_draft: [0, 0],
      panel: false,
      panel_value: clone(null),
      panel_price: [0, 0],
      panel_sort: null,
      phone: false,
    };
  },

  computed: {
    value() {
      return clone(this.modelValue);
    },
    ignore() {
      return this.filters?.ignore || [];
    },
    groups() {
      return groupsOf(this.filters);
    },
    chip_groups() {
      return this.groups.slice(0, CHIPS);
    },
    more_groups() {
      return this.groups.slice(CHIPS);
    },
    more_on() {
      return this.more_groups.reduce((n, g) => n + this.picked(g).length, 0);
    },
    on_count() {
      return countOn(this.modelValue);
    },
    currency() {
      return currentCurrency(); // the shopper's, reactive: redraws at once on a pick
    },
    /* Selldone's price record, in the shopper's currency (as SCategoryFilter). */
    price_rows() {
      return (this.filters?.prices || []).filter((row) => this.rate(row.currency, true));
    },
    has_price() {
      return !this.ignore.includes("price") && this.price_rows.length && this.price_max > this.price_min;
    },
    price_min() {
      const values = this.price_rows.map((row) => row.min * this.rate(row.currency, true));
      return values.length ? Math.floor(Math.min(...values)) : 0;
    },
    price_max() {
      const values = this.price_rows.map((row) => row.max * this.rate(row.currency, true));
      return values.length ? Math.ceil(Math.max(...values)) : 0;
    },
    price_step() {
      const span = this.price_max - this.price_min;
      return span > 200 ? 5 : span > 40 ? 1 : 0.5;
    },
    price_on() {
      return !!(this.modelValue?.prices && Object.keys(this.modelValue.prices).length);
    },
  },

  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
    if (this.panel) document.documentElement.style.overflow = "";
  },

  methods: {
    sortName,
    valueLabel,
    picked(group) {
      return picked(this.modelValue, group);
    },
    onResize() {
      this.phone = window.innerWidth <= 760;
    },
    /* to the shopper's currency (toUser) or back to the record's. */
    rate(currency, toUser) {
      return toUser
        ? PriceHelper.getExchangeRateValue(this.$shop, currency, this.currency, null)
        : PriceHelper.getExchangeRateValue(this.$shop, this.currency, currency, null);
    },
    pricesFor([lo, hi]) {
      if (lo <= this.price_min && hi >= this.price_max) return null;
      const out = {};
      for (const row of this.price_rows) {
        const r = this.rate(row.currency, false) || 1;
        out[row.currency] = [lo * r, hi * r];
      }
      return out;
    },
    rangeOf(filter) {
      const row = this.price_rows[0];
      const set = row && filter?.prices?.[row.currency];
      if (!set) return [this.price_min, this.price_max];
      const r = this.rate(row.currency, true) || 1;
      return [Math.max(this.price_min, set[0] * r), Math.min(this.price_max, set[1] * r)];
    },
    emit(next) {
      this.$emit("update:modelValue", next);
    },

    toggleDeals() {
      const next = clone(this.modelValue);
      next.only_has_discount = !next.only_has_discount;
      this.emit(next);
    },
    startDraft(group) {
      this.draft = [...this.picked(group)];
    },
    applyGroup(group, values) {
      this.menus[group.kind + group.key] = false;
      this.emit(withGroup(this.modelValue, group, values));
    },
    clearPrice() {
      this.menus.price = false;
      const next = clone(this.modelValue);
      next.prices = null;
      this.emit(next);
    },
    applyPrice() {
      this.menus.price = false;
      const next = clone(this.modelValue);
      next.prices = this.pricesFor(this.price_draft);
      this.emit(next);
    },

    openPanel() {
      this.panel_value = clone(this.modelValue);
      this.panel_price = this.rangeOf(this.modelValue);
      this.panel_sort = this.sort;
      this.panel = true;
    },
    panelPicked(group) {
      return picked(this.panel_value, group);
    },
    panelToggle(group, v) {
      const now = this.panelPicked(group);
      this.panel_value = withGroup(this.panel_value, group, now.includes(v) ? now.filter((x) => x !== v) : [...now, v]);
    },
    panelClear() {
      this.panel_value = clone(null);
      this.panel_price = [this.price_min, this.price_max];
    },
    panelApply() {
      const next = clone(this.panel_value);
      next.prices = this.has_price ? this.pricesFor(this.panel_price) : null;
      this.panel = false;
      if (this.panel_sort && this.panel_sort !== this.sort) this.$emit("update:sort", this.panel_sort);
      this.emit(next);
    },
  },

  watch: {
    panel(open) {
      document.documentElement.style.overflow = open ? "hidden" : "";
      if (open) this.$nextTick(() => document.querySelector(".t-fpanel__x")?.focus());
    },
    "menus.price"(open) {
      if (open) this.price_draft = this.rangeOf(this.modelValue);
    },
  },
};
</script>
