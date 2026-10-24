# L4.P5 — Integration & QA

Implemented a transport-independent server-side coordinator that connects existing room creation, join/ready/start, authoritative player intent, ticking, disconnect and reconnect. Integration tests cover joining two teams, host-only launch, monotonic input sequencing, server-derived movement, expired reconnects and invalid rooms.

## Security and shipping blockers
This is **not yet operational multiplayer**. There is no deployed WebSocket transport, session authentication, cryptographically bound resume token, persistent authoritative room service, actual map collision, server-side score/events, rate limiting, or real two-device trial. The coordinator caller must resolve user IDs from secure authenticated connections. Do NOT expose it directly to untrusted browser calls.

The room store currently contains in-memory state only; restarting the process loses rooms and match progress. Production should put one authenticated room instance on a durable backend, confirm provider pricing and free quota, enforce message size and send rates, and profile multiplayer under 2–8 concurrent players. Never place server secrets in the Vite bundle.

## Acceptance
1. CI must pass the full Node tests, JS syntax and Vite build.
2. Backend integration tests must pass.
3. Separate real-network/2-device validation is **not possible yet**, remains a blocker.
4. Do not merge into main or deploy GitHub Pages until the user requests the level release. GitHub Pages is static and cannot host the multiplayer authority.

## Suggested L4.P6
Select/connect an actual backend provider; implement authenticated WebSocket room sessions and server-authoritative scoring/collisions, reconnect capabilities, abuse controls and production acceptance tests before publicly exposing multiplayer.
