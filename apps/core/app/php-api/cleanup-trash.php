<?php
declare(strict_types=1);

/**
 * CleanupTrash — hard-purges soft-deleted decks and lists after 30 days.
 *
 * Two invocation modes:
 *   HTTP  — require_once this file, then call CleanupTrash::maybeRun().
 *           Checks last_cleanup_at (rate-limited to once per 24 h). If due,
 *           schedules the actual DELETE block via register_shutdown_function()
 *           so the calling request is not blocked.
 *   CLI   — php cleanup-trash.php [--force]
 *           Runs synchronously. --force skips the 24 h rate limit.
 *
 * Peers rule: decks and lists are independent. Purging expired decks never
 * touches lists, and vice versa. Cascading FK deletes handle child rows
 * (deck_cards, game_results for decks; list_cards for lists).
 *
 * system_state schema (v4.8.0):
 *   k VARCHAR(64) PRIMARY KEY, v TEXT NULL,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 */
class CleanupTrash {
    private const INTERVAL_HOURS  = 24;
    public  const RETENTION_DAYS  = 30;
    private const STATE_KEY       = 'last_cleanup_at';

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * HTTP entry point. Call from any endpoint that wants to piggyback cleanup.
     * Checks the rate limit synchronously; schedules the heavy work on shutdown
     * so the HTTP response is not delayed.
     */
    public static function maybeRun(): void {
        try {
            $pdo = getDB();
        } catch (\Throwable $e) {
            error_log('[CleanupTrash] DB connection failed: ' . $e->getMessage());
            return;
        }

        try {
            $pdo->beginTransaction();

            if (!self::shouldRun($pdo)) {
                $pdo->rollBack();
                return;
            }

            // Mark the run *before* the actual work so concurrent requests
            // that also call maybeRun() see the updated timestamp and bail out.
            self::recordRun($pdo);
            $pdo->commit();
        } catch (\Throwable $e) {
            // Safe to rollback even if the transaction was already committed.
            try { $pdo->rollBack(); } catch (\Throwable) {}
            error_log('[CleanupTrash] Failed to acquire cleanup lock: ' . $e->getMessage());
            return;
        }

        // Schedule actual DELETEs after the HTTP response is sent.
        register_shutdown_function(static function () use ($pdo): void {
            try {
                $result = self::performCleanup($pdo);
                error_log(sprintf(
                    '[CleanupTrash] Shutdown purge complete: %d decks, %d lists purged.',
                    $result['decks_purged'],
                    $result['lists_purged']
                ));
            } catch (\Throwable $e) {
                error_log('[CleanupTrash] Shutdown purge failed: ' . $e->getMessage());
            }
        });
    }

    /**
     * CLI / synchronous entry point. Always runs (skips rate limit by default).
     * Pass $force = true to make this explicit; it always ignores last_cleanup_at.
     *
     * @return array{decks_purged: int, lists_purged: int}
     */
    public static function runNow(bool $force = true): array {
        $pdo = getDB();

        if (!$force) {
            $pdo->beginTransaction();
            if (!self::shouldRun($pdo)) {
                $next = self::nextRunTime($pdo);
                $pdo->rollBack();
                echo "Cleanup ran recently, skipping. Next run at: {$next}.\n";
                return ['decks_purged' => 0, 'lists_purged' => 0];
            }
            self::recordRun($pdo);
            $pdo->commit();
        }

        $result = self::performCleanup($pdo);

        // After cleanup, record the run timestamp (force path skips the pre-lock above).
        if ($force) {
            self::recordRun($pdo);
        }

        return $result;
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Returns true if enough time has elapsed since last_cleanup_at.
     * MUST be called inside an open transaction (uses SELECT ... FOR UPDATE
     * to prevent two simultaneous callers both deciding they should run).
     */
    private static function shouldRun(PDO $pdo): bool {
        $stmt = $pdo->prepare(
            'SELECT v FROM system_state WHERE k = ? FOR UPDATE'
        );
        $stmt->execute([self::STATE_KEY]);
        $row = $stmt->fetch();

        if ($row === false || $row['v'] === null) {
            // Never run — treat as epoch 0.
            return true;
        }

        $lastRun   = new \DateTimeImmutable($row['v'], new \DateTimeZone('UTC'));
        $threshold = $lastRun->modify('+' . self::INTERVAL_HOURS . ' hours');
        $now       = new \DateTimeImmutable('now', new \DateTimeZone('UTC'));

        return $now >= $threshold;
    }

    /**
     * Returns a human-readable string for the next eligible run time.
     * Must be called while the SELECT FOR UPDATE row is still visible (inside tx).
     */
    private static function nextRunTime(PDO $pdo): string {
        $stmt = $pdo->prepare('SELECT v FROM system_state WHERE k = ?');
        $stmt->execute([self::STATE_KEY]);
        $row = $stmt->fetch();

        if ($row === false || $row['v'] === null) {
            return 'now';
        }

        $lastRun   = new \DateTimeImmutable($row['v'], new \DateTimeZone('UTC'));
        $threshold = $lastRun->modify('+' . self::INTERVAL_HOURS . ' hours');
        return $threshold->format('Y-m-d H:i:s') . ' UTC';
    }

    /**
     * Purges expired rows from decks and lists independently (peers rule).
     * Cascading FK deletes handle deck_cards / game_results / list_cards.
     *
     * @return array{decks_purged: int, lists_purged: int}
     */
    private static function performCleanup(PDO $pdo): array {
        $retentionSql = 'NOW() - INTERVAL ' . self::RETENTION_DAYS . ' DAY';

        // Purge decks — peers rule: independent of lists.
        $stmtDecks = $pdo->prepare(
            "DELETE FROM decks
             WHERE deleted_at IS NOT NULL
               AND deleted_at < {$retentionSql}"
        );
        $stmtDecks->execute();
        $decksPurged = $stmtDecks->rowCount();

        // Purge lists — peers rule: independent of decks.
        $stmtLists = $pdo->prepare(
            "DELETE FROM lists
             WHERE deleted_at IS NOT NULL
               AND deleted_at < {$retentionSql}"
        );
        $stmtLists->execute();
        $listsPurged = $stmtLists->rowCount();

        return [
            'decks_purged' => $decksPurged,
            'lists_purged' => $listsPurged,
        ];
    }

    /**
     * Upserts last_cleanup_at = NOW() into system_state.
     * Safe to call outside a transaction (short atomic upsert).
     */
    private static function recordRun(PDO $pdo): void {
        $stmt = $pdo->prepare(
            'INSERT INTO system_state (k, v)
             VALUES (?, UTC_TIMESTAMP())
             ON DUPLICATE KEY UPDATE v = VALUES(v)'
        );
        $stmt->execute([self::STATE_KEY]);
    }
}

// ── CLI entrypoint ────────────────────────────────────────────────────────────
if (PHP_SAPI === 'cli' && realpath($_SERVER['argv'][0] ?? '') === __FILE__) {
    require_once __DIR__ . '/config.php';

    $force = in_array('--force', $argv ?? [], true);

    if ($force) {
        echo "Running cleanup (--force: rate limit bypassed).\n";
    }

    try {
        $result = CleanupTrash::runNow($force);
        echo "Purged {$result['decks_purged']} decks and {$result['lists_purged']} lists older than "
            . CleanupTrash::RETENTION_DAYS . " days.\n";
    } catch (\Throwable $e) {
        fwrite(STDERR, '[CleanupTrash] Fatal error: ' . $e->getMessage() . "\n");
        exit(1);
    }
}
