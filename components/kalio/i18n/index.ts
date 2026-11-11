/*
 * Tario's words, per language: the shared Kalio base (base/<lang>.ts, a
 * copy of new-shop-kits/i18n/kalio-base) plus Tario's own (tario.<lang>.ts,
 * which also holds Tario's English where its copy of a base file words it
 * differently, "cart" for "basket"). English is bundled; every other
 * language is its own small chunk, fetched only when a visitor picks it
 * (lang-<code>.ts merges its two files). A language the owner enables
 * later: copy base/<code>.ts, write tario.<code>.ts, add lang-<code>.ts and
 * one line below.
 */
import baseEn from "./base/en";
import tarioEn from "./tario.en";

export const EN: Record<string, string> = { ...baseEn, ...tarioEn };

export const LOADERS: Record<string, () => Promise<any>> = {
  ar: () => import("./lang-ar"),
  pa: () => import("./lang-pa"),
  es: () => import("./lang-es"),
  da: () => import("./lang-da"),
  fr: () => import("./lang-fr"),
};
