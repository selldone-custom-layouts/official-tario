/* Tario in this language: the shared Kalio base and Tario's own words, one chunk. */
import base from "./base/fr";
import own from "./tario.fr";

export default { ...base, ...own } as Record<string, string>;
