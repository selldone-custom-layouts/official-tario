<!--
  - Copyright (c) 2024. Selldone® Business OS™
  -
  - Author: M.Pajuhaan
  - Web: https://selldone.com
  - ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -
  - All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
  - From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
  - Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
  - Our journey is not just about reaching a destination, but about creating a masterpiece.
  - Tread carefully, for you're treading on dreams.
  -->
<template>
  <!-- Tario 1.2.0 (404 design A): "This shelf is empty", a search, the way
       home and to the deals, and the aisles as round shortcuts. -->
  <div class="t-404 k-wrap">
    <section class="t-404__top">
      <span aria-hidden="true" class="t-404__bag"><v-icon size="56">shopping_basket</v-icon></span>
      <p class="t-404__code">{{ t("notfound.eyebrow", "Page not found · 404") }}</p>
      <h1>{{ t("tario.notfound.title", "This shelf is empty") }}</h1>
      <p class="t-404__lede">{{ t("tario.notfound.lede", "The page you were looking for has moved or no longer exists.") }}</p>
      <form class="t-404__search" role="search" @submit.prevent="search">
        <input v-model.trim="q" :aria-label="t('tario.notfound.searchShop', 'Search the shop')" :placeholder="t('header.searchPill', 'Search milk, bread, berries…')" type="search" />
        <button :aria-label="t('common.search', 'Search')" type="submit"><v-icon size="20">search</v-icon></button>
      </form>
      <div class="t-404__acts">
        <router-link :to="{ path: '/' }" class="t-btn -red">{{ t("tario.notfound.home", "Go to the home page") }}</router-link>
        <router-link :to="deals" class="t-btn -line">{{ t("tario.shopDeals", "Shop deals") }}</router-link>
      </div>
    </section>
    <section v-if="list.length" class="t-sec">
      <header class="t-sec__head"><h2 class="t-sec__title">{{ t("cart.empty.aisles", "Or start with an aisle") }}</h2></header>
      <div class="t-404__aisles">
        <router-link v-for="a in list.slice(0, 8)" :key="a.id" :to="aisleRoute(a)">
          <span :style="{ background: tint(a) }"><img v-if="a.icon" :src="aisleImage(a, 128)" alt="" loading="lazy" /></span>
          <bdi>{{ a.title || a.name }}</bdi>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { aisleImage, aisleRoute, aisles, dealsRoute, featured, tintFor } from "../../../components/kalio/kalio-catalog";

export default defineComponent({
  name: "StorefrontPageError404",
  data: () => ({ q: "", list: [] as any[] }),
  computed: {
    shop() {
      return this.getShop();
    },
    deals() {
      return dealsRoute();
    },
  },
  mounted() {
    aisles().then((list: any[]) => (this.list = featured(list)));
  },
  methods: {
    aisleImage,
    aisleRoute,
    tint(aisle: any) {
      return tintFor(aisle) || "#f2f2f2";
    },
    search() {
      if (!this.q) return;
      this.$router.push({ name: window.$storefront.routes.SHOP_PAGE, query: { search: this.q } });
    },
  },
});
</script>
<style scoped lang="scss"></style>
