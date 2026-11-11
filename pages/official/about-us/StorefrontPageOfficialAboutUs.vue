<!--
  - Copyright (c) 2023. Selldone® Business OS™
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

<!--
  Kalio — About us, design B "A letter", chosen by the owner on 5 November
  2026.

  Beside the letter: three of the shop's best sellers on a warm ground and
  the facts read from the shop itself — its sellers, its aisles, how many
  products it stocks — with the way to reach it. The letter is the shop's
  own About profile (Selldone dashboard › Shop › Profile) when it has one;
  until then a sample letter, marked as a test, with its values, a
  timeline (marked as examples) and a signature.
-->
<template>
  <!-- Tario 1.2.0 (About design A): a big-box store's brand page. A photo
       with the story on a white card, the shop's numbers on a red band
       (read from the shop), what it stands for, its sellers, and how to
       reach it. The text is the shop's own About profile (Selldone
       dashboard › Shop › Profile) when it has one; until then a sample,
       marked as such. -->
  <div class="t-about k-wrap">
    <section :style="hero ? { backgroundImage: `url(${hero})` } : null" class="t-about__hero">
      <div class="t-about__card">
        <p class="t-about__eyebrow">{{ t("about.title", "About {shop}", { shop: shopTitle }) }}</p>
        <h1>{{ missing || busy ? sample.title.replace("basket", "cart") : t("about.title", "About {shop}", { shop: shopTitle }) }}</h1>
        <p v-if="missing || busy">{{ sample.lead }}</p>
      </div>
    </section>

    <div class="t-about__nums">
      <div v-if="aisleList.length"><b>{{ formatNumber(aisleList.length) }}</b><span>{{ t("tario.seller.aislesWord", { one: "aisle", other: "aisles" }, { n: aisleList.length }) }}</span></div>
      <div v-if="sellers.length"><b>{{ formatNumber(sellers.length) }}</b><span>{{ t("tario.about.sellersWord", { one: "seller", other: "independent sellers" }, { n: sellers.length }) }}</span></div>
      <div><b>{{ formatNumber(1) }}</b><span>{{ t("footer.facts.basketOne", "cart, one checkout") }}</span></div>
      <div v-if="ways"><b>{{ formatNumber(ways) }}</b><span>{{ t("tario.about.waysWord", { one: "way to get it", other: "ways to get it" }, { n: ways }) }}</span></div>
    </div>

    <section class="t-sec">
      <div v-if="busy" aria-hidden="true" class="k-legal__loading"><span></span><span></span><span></span></div>
      <template v-else-if="missing">
        <kalio-sample-note>
          {{ t("tario.about.sampleNote", "This text is general copy written to show the page. It is not {shop}'s real story.", { shop: shopTitle }) }}
        </kalio-sample-note>
        <p class="t-about__text">{{ sample.text[0].replace("the basket", "the cart") }}</p>
        <div class="t-about__vals">
          <div v-for="(value, i) in sample.values" :key="value.title">
            <v-icon size="26">{{ ICONS[i] || "check_circle" }}</v-icon>
            <b>{{ value.title }}</b>
            <p>{{ value.text }}</p>
          </div>
        </div>
      </template>
      <div v-else class="k-story__real k-prose t-about__real" v-html="profile.body"></div>
    </section>

    <section v-if="sellers.length" class="t-sec">
      <header class="t-sec__head"><h2 class="t-sec__title">{{ t("tario.about.meet", { one: "Meet the seller", other: "Meet the sellers" }, { n: sellers.length }) }}</h2></header>
      <div class="t-about__meet">
        <router-link v-for="v in sellers" :key="v.id" :to="sellerRoute(v)" class="t-about__seller">
          <img v-if="vendorImage(v)" :src="vendorImage(v)" alt="" />
          <span>
            <b>{{ v.name }}</b>
            <small v-if="counts[v.id]">{{ t("tario.seller.productCount", { one: "{n} product", other: "{n} products" }, { n: counts[v.id] }) }}</small>
          </span>
          <em>{{ t("tario.visitShop", "Visit shop") }}</em>
        </router-link>
      </div>
    </section>

    <section id="contact" class="t-sec t-about__contact">
      <div>
        <p class="t-about__eyebrow">{{ t("tario.about.contactUs", "Contact us") }}</p>
        <h2>{{ t("tario.about.help", "We're here to help") }}</h2>
        <p>
          {{ t("tario.about.helpText", "For an order, the fastest way is the message thread on the order page: it goes straight to the seller who packed it. For anything else, write to us.") }}
        </p>
        <ul>
          <li><v-icon size="20">chat_bubble_outline</v-icon>{{ t("tario.about.orderQuestions", "Order questions: from the order page") }}</li>
          <li><v-icon size="20">mail_outline</v-icon>{{ t("tario.about.everythingElse", "Everything else: the contact form") }}</li>
        </ul>
      </div>
      <div class="t-about__acts">
        <router-link :to="{ name: window.$storefront.routes.SHOP_CONTACT_US }" class="t-btn -red">{{ t("tario.about.write", "Write to us") }}</router-link>
        <router-link :to="catalogueRoute" class="t-btn -line">{{ t("pages.startShopping", "Start shopping") }}</router-link>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import KalioSampleNote from "@app-storefront/components/kalio/pages/KalioSampleNote.vue";
import { aboutSample, plainText } from "@app-storefront/components/kalio/pages/kalio-sample-pages";
import { aisles, catalogueRoute, countProducts, offers, productImage, sellerRoute, vendorImage, vendors } from "@app-storefront/components/kalio/kalio-catalog";
import { photo, waysOf } from "@app-storefront/components/tario/tario-home";
import { t } from "@app-storefront/components/kalio/i18n/kalio-i18n";

export default {
  name: "StorefrontPageOfficialAboutUs",
  components: { KalioSampleNote },
  inject: ["$shop"],

  data: () => ({
    profile: null,
    missing: false,
    busy: true,
    packs: [],
    sellers: [],
    aisleList: [],
    productCount: null,
    counts: {},
    ICONS: ["sell", "storefront", "eco", "chat_bubble_outline"],
  }),

  computed: {
    shopTitle() {
      return this.$shop?.title || t("sample.thisShop", "This shop");
    },
    hero() {
      return photo("tario-hero-1-weekly");
    },
    ways() {
      return waysOf(this.$shop).length;
    },
    sample() {
      return aboutSample(this.shopTitle);
    },
    catalogueRoute() {
      return catalogueRoute();
    },
    aisleLine() {
      const names = this.aisleList.map((it) => it.title || it.name);
      if (names.length <= 3) return names.join(", ");
      const shown = names.slice(0, 3).join(", ");
      return t("about.facts.aisleLine", { one: "{count}: {names} and {n} more", other: "{count}: {names} and {n} more" }, { count: names.length, names: shown, n: names.length - 3 });
    },
  },

  created() {
    this.setPageTitle?.(t("about.pageTitle", "About us"));

    window.axios
      .get(window.XAPI.GET_SHOP_PROFILE(this.$shop.name, "about-us"))
      .then(({ data }) => {
        this.profile = data?.error ? null : data?.profile || null;
        this.missing = !plainText(this.profile?.body);
      })
      .catch(() => (this.missing = true))
      .finally(() => (this.busy = false));

    window.$storefront.products
      .list(null, 0, 8, { products_only: true, available: true, sort: "bestselling" })
      .then(({ products }) => (this.packs = (products || []).filter((it) => it.icon).slice(0, 3)))
      .catch(() => {});
    vendors().then((list) => (this.sellers = list.filter((it) => it && it.name)));
    aisles().then((list) => (this.aisleList = list));
    countProducts(null).then((count) => (this.productCount = count));
    offers().then(({ shelfOf }) => {
      const out = {};
      for (const [id, list] of shelfOf) out[id] = list.length;
      this.counts = out;
    });
  },

  methods: {
    vendorImage(v) {
      return vendorImage(v, true);
    },
    sellerRoute,
    picture(product) {
      return productImage(product);
    },
  },
};
</script>
