/**
 * Codec for the `?ctx=` game handoff the game manager passes to Rules Guru.
 *
 * `btoa` only accepts code points up to U+00FF and throws `InvalidCharacterError`
 * on anything above it. The context carries free text — player names, deck names,
 * commander names — so a curly apostrophe (U+2019, what iOS smart punctuation
 * produces for `'`) or an em dash was enough to make the encode throw and the
 * chat button do nothing. The payload is therefore encoded as UTF-8 bytes first.
 *
 * ASCII payloads encode byte-for-byte as plain `btoa(JSON.stringify(ctx))` did,
 * so the two apps deploy in either order without breaking an in-flight link.
 */

/** JSON-encode a context and base64 it, URL-component escaped, UTF-8 safe. */
export function encodeGameContextParam(ctx: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(ctx));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return encodeURIComponent(btoa(binary));
}

/** Reverse of `encodeGameContextParam`. Throws on a malformed param. */
export function decodeGameContextParam(param: string): unknown {
  const binary = atob(decodeURIComponent(param));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}
