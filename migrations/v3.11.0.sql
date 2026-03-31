-- v3.11.0: Double-faced card support — store back face image URI

ALTER TABLE scryfall_card_cache
  ADD COLUMN back_image_uri TEXT DEFAULT NULL AFTER image_uri;
