/* Tario in this language: the shared Kalio base and Tario's own words, one chunk. */
import base from "./base/ar";
import own from "./tario.ar";

export default { ...base, ...own } as Record<string, string>;
