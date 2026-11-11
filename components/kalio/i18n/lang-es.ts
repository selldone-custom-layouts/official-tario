/* Tario in this language: the shared Kalio base and Tario's own words, one chunk. */
import base from "./base/es";
import own from "./tario.es";

export default { ...base, ...own } as Record<string, string>;
