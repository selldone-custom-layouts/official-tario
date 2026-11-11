/* Tario in this language: the shared Kalio base and Tario's own words, one chunk. */
import base from "./base/pa";
import own from "./tario.pa";

export default { ...base, ...own } as Record<string, string>;
