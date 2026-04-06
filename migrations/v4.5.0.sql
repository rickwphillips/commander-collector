-- v4.5.0: Card Import, Image Fix & Architecture Docs

INSERT INTO changelog_releases (version, date, title, sort_order)
VALUES ('4.5.0', '2026-04-05', 'Card Import, Image Fix & Architecture Docs', 85)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '4.5.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (release_id, type, text, sort_order) VALUES
  (@rid, 'added',    'Card list import (paste or file upload) now available on deck edit and list edit pages', 0),
  (@rid, 'added',    'Architecture diagrams — overview, shared UI, deck system, game system, stats system, plus 6 sequence diagrams', 1),
  (@rid, 'fixed',    'Card image previews no longer fail permanently when initial load is interrupted', 2),
  (@rid, 'improved', 'Card image requests are now throttled to prevent server overload on large card lists', 3),
  (@rid, 'improved', 'Card list import parser extracted as reusable component across all deck and list pages', 4);
