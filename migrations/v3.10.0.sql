-- v3.10.0: DB-backed changelog

CREATE TABLE IF NOT EXISTS changelog_releases (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  version    VARCHAR(20) NOT NULL UNIQUE,
  date       DATE NOT NULL,
  title      VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS changelog_changes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  release_id INT NOT NULL,
  type       ENUM('added','changed','fixed','improved') NOT NULL,
  text       TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_changelog_release FOREIGN KEY (release_id) REFERENCES changelog_releases(id) ON DELETE CASCADE
);

CREATE INDEX idx_changelog_releases_sort ON changelog_releases (sort_order DESC);
CREATE INDEX idx_changelog_changes_release ON changelog_changes (release_id, sort_order);
