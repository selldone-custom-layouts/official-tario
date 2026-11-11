/* Tario in this language: the shared Kalio base and Tario's own words, one chunk. */
import base from "./base/da";
import own from "./tario.da";

export default { ...base, ...own } as Record<string, string>;
