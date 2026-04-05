-- v4.4.0: Codebase Optimization & Test Coverage

INSERT INTO changelog_releases (version, date, title, sort_order)
VALUES ('4.4.0', '2026-04-05', 'Codebase Optimization & Test Coverage', 84)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '4.4.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (release_id, type, text, sort_order) VALUES
  (@rid, 'added',    'Shared ColorPicker component with exclusive colorless toggle and filter mode support', 0),
  (@rid, 'added',    'Shared useApiQuery hook for standardized data fetching across all pages', 1),
  (@rid, 'added',    'Shared ConfirmDeleteDialog component with loading state and error retry', 2),
  (@rid, 'added',    'Shared PHP SQL helper functions for consistent stat calculations', 3),
  (@rid, 'improved', 'Deck scanner page split into 7 focused components for better maintainability', 4),
  (@rid, 'improved', 'Color presence stats reduced from 40 lines of repeated SQL to a 4-line loop', 5),
  (@rid, 'improved', 'Color name constants consolidated into shared utilities', 6),
  (@rid, 'improved', 'Removed duplicate deck management app (~9,300 lines of dead code)', 7),
  (@rid, 'improved', 'Test coverage expanded from 190 to 407 tests across all major components', 8);
