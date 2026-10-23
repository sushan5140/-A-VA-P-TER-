# L4.P2 — Private Rooms (backend foundation)

## Implemented
- Server-side-only in-memory room lifecycle: create, join by six-character invite, choose role, toggle ready, host-only start, leave and host handoff.
- Room cap of eight players and two-hour expiry, duplicate join protection.
- Cryptographically strong invite-code generation using Node crypto.
- Seven dependency-free regression tests.

## Critical limitations and next steps
- **NOT CONNECTED TO THE BROWSER.** This is a testable server-side domain model, not hosted multiplayer.
- In-memory data is single-process and lost on restart. Needs authoritative persistent per-room runtime (e.g., Durable Objects) before production use.
- A player ID is currently a supplied string, **not authenticated identity**. A server must bind actions to authenticated sessions or secure capabilities and rate-limit joins. The invite code grants discovery access only and is not authorization to impersonate players.
- Room codes must never be leaked in public telemetry; avoid logging them.
- Clients must not write scores, position or winner status.
- Need network endpoints, connection lifecycle, expiry enforcement, per-room message quotas, two-device acceptance and cost audit.
- No GitHub Pages deployment. Follow user's phase-by-phase branch / level-by-level release policy.
