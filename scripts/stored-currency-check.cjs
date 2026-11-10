// stored-currency-check.cjs: the region switcher's "reload with a stored currency" pass (10 Nov 2026).
// A shopper who picked DKK and reloads: Selldone's key is set before the first load, the page waits 14 s
// (the shop's rates come with the full shop record, seconds after the first paint), and every amount on the
// home must be in the stored currency, with no "$" amount left. Run it beside components/region-switcher/tools/
// currency-check.cjs (which picks through the pill and the sheet).
// Usage: SHOP=molino node scripts/stored-currency-check.cjs <base-url> <CODE> [widths, default 1440,390]
//   NORATES=1 strips the shop's rates from its record (the 429 case): the strip must keep its general line;
//   product prices then show honestly in their own currency, so only the "own currency" count is relaxed.
// Prints one line per width and "TOTAL n". Deliver at 0.
const { chromium } = require("D:/Kalio Sample Shop Claude/kalio-marketplace/node_modules/playwright");
const [base, code = "DKK", widths = "1440,390"] = process.argv.slice(2);
const SHOP = process.env.SHOP || "molino";
(async () => {
  const b = await chromium.launch();
  let total = 0;
  for (const w of widths.split(",").map(Number)) {
    const mob = w < 768;
    const ctx = await b.newContext({ viewport: { width: w, height: mob ? 844 : 900 }, isMobile: mob, hasTouch: mob });
    await ctx.addInitScript((c) => { try { localStorage.setItem(`shop/@${c[1]}/user-currency`, c[0]); } catch (e) {} }, [code, SHOP]);
    if (process.env.NORATES) await ctx.route(new RegExp(`/shops/@${SHOP}/info`), async (route) => {
      const r = await route.fetch(); let body = await r.text();
      try { const j = JSON.parse(body); const strip = (o) => { if (o && typeof o === "object") { delete o.shop_exchange_rates; for (const k of Object.keys(o)) strip(o[k]); } }; strip(j); body = JSON.stringify(j); } catch (e) {}
      await route.fulfill({ response: r, body });
    });
    const p = await ctx.newPage();
    await p.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 120000 });
    await p.waitForSelector(".k-header", { timeout: 120000 });
    await p.waitForTimeout(14000);
    const r = await p.evaluate((c) => {
      const app = [...document.querySelectorAll("*")].find((e) => e.__vue_app__).__vue_app__.config.globalProperties;
      const shop = app.$store.getters.getShop;
      const text = document.body.innerText;
      const dollars = (text.match(/(?<![A-Z]|[A-Z]\$)\$\s?\d[\d,.]*/g) || []);
      const own = (text.match(/(?:[A-Z]{3}|Kr|kr|€|₹|A\$|HK\$)\.?\s?\d[\d,.]*/g) || []).filter((x) => x.startsWith(c) || !/^[A-Z]{3}/.test(x));
      return {
        sf: window.$storefront?.currency?.code, rates: (shop?.shop_exchange_rates || []).length,
        promo: document.querySelector(".t-promo__text")?.innerText, pill: document.querySelector(".rs-pick__btn")?.innerText?.trim(),
        dollars: dollars.slice(0, 6), own: own.slice(0, 4), ownCount: own.length,
        cards: [...document.querySelectorAll(".t-card__now")].slice(0, 3).map((e) => e.innerText),
      };
    }, code);
    const bad = r.dollars.length + (r.ownCount || process.env.NORATES ? 0 : 1);
    total += bad;
    console.log(`${w} stored ${code}: ${bad ? "FAIL" : "ok"} ${JSON.stringify(r)}`);
    await ctx.close();
  }
  await b.close();
  console.log("TOTAL", total);
})();
