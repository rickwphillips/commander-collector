# Commander Collector — Feature / Backlog List

Features and enhancements that are deferred but worth revisiting.

---

## Open

### 1. Soft-delete restore for Lists
- **Where:** `lists/detail/page.tsx` — Restore button exists but is a stub
- **What:** `api.restoreList` is not implemented. The PHP endpoint `POST /lists?action=restore` already exists. Just needs the API function wired and the stub replaced with the actual call.
- **Why deferred:** Low usage; restore can be done manually in DB for now
