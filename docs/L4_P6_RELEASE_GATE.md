# L4.P6 Multiplayer Release Readiness

## Implemented in this gate
- Bounded raw message size and strict movement envelope parser.
- Per-session rate limit to restrict noisy senders.
- Unit tests for malformed and oversized packets, replay-like bursts and cleanup.
- Existing room/lobby, simulation and recovery integration inherited from P1–P5.

## Production blocking issues
1. **No hosted authoritative server**, authenticated WebSocket routes or real session ownership. Static GitHub Pages alone cannot run multiplayer.
2. Session identities are still caller-provided strings. Require authenticated binding and cryptographically strong, rotated reconnect tokens; validate all messages at network boundary. Do not deploy the existing coordinator directly to untrusted users.
3. Room state is in-memory; require durable room persistence, cleanup, room quotas and bounded message fanout.
4. World physics currently uses rectangular bounds, **not the game's actual building collision model**. Mission scoring and events are not server-authoritative.
5. Rate limiter is server-side utility only and has not been installed in a real message handler. Limit map entries and external denial-of-service abuse before internet exposure.
6. No real two-device latency/reconnect tests, measured free-tier provider costs, live browser UI integration or security penetration testing.
7. Reconnection grace alone is not secure authorization; a secure resume capability remains required.

## Release verdict
**NO-GO for live multiplayer.** The backend domain modules and CI can be accepted as research/development foundations, but the full Level 4 acceptance milestone remains blocked. Never describe the game as online multiplayer or use PR CI as evidence of live network correctness.

## Next execution
Choose and connect a server provider and authenticated deployment, implement network handlers with trusted session mapping and rate guards, simulate server-owned collisions/objectives/results, then perform two-device acceptance and cost validation.

## Repo policy
Keep this PR stacked on PR #27. No merge into main or GitHub Pages release without explicit approval and actual production readiness.
