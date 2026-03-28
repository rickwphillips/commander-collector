-- v2.3.0: Card image caching (base64) + per-card version picker support

ALTER TABLE scryfall_card_cache
  ADD COLUMN image_b64 MEDIUMTEXT NULL AFTER image_uri;
