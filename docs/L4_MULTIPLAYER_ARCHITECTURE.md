# L4.P1 — Multiplayer architecture decision

## Decision: authoritative room server, static game client
Keep the Three.js/Vite UI on GitHub Pages. **GitHub Pages cannot host an authoritative WebSocket game server.**
Create an independent, free-tier-capable room coordinator for online matches. Candidate: Cloudflare Workers + Durable Objects (one object per private room). Supabase Realtime is a viable presence/lobby transport, but client-to-client broadcasts alone cannot be trusted for score, collisions or match verdict.

### Tradeoffs (verified against provider docs on 23 October 2026)
- Cloudflare Durable Objects lists a free usage allocation, but quotas, hibernation rules and billing conditions need verification at implementation time. No Cloudflare service has been created or connected.
- Supabase Realtime Free lists 200 concurrent connections and 100 messages/sec for its plan at the time of audit. Its message count increases with broadcasting recipients. A high-frequency game-state relay may exceed the user's ₹0 requirement.
- Prefer an authoritative Durable Object coordinator once the user has a Cloudflare account and approves connecting it. Until then, all work remains provider-neutral and local-testable.

## Trust boundary
Browser sends movement **intent** plus monotonic sequence number, never authoritative position or score. Server owns:
- room creation / invitation and expiry;
- role readiness and match clock;
- map collision, permitted speeds, tick simulation and scoring;
- snapshots and reconnect grace period;
- room cleanup and abuse limits.

## Protocol foundation included in this PR
- Versioned client intent validator, room code shape, player cap (8), two-team ready checks.
- Monotonic sequence guard rejects replayed/out-of-order move messages.
- 10 Hz input target for initial load testing; server snapshot frequency to be set after measuring quotas.
- No API keys, backend tokens, or per-room secrets in GitHub Pages bundle.

## L4 plan
- **P1 (this PR):** architecture, protocol contract, unit tests. No online claims.
- **P2:** private room lifecycle, invite, lobby and safety controls (requires real backend).
- **P3:** authoritative movement/event synchronization and room simulation.
- **P4:** reconnect, timeouts and recovery.
- **P5:** integration, abuse/load/cost checks, two-device test.
- **P6:** release readiness and deployment authorization.

## Exit criteria
P1 passes unit tests, syntax and production build. Multiplayer is **not enabled** or deployed. Server runtime and quota benchmarks are deferred until an approved provider exists.

Official references:
- https://developers.cloudflare.com/durable-objects/platform/pricing/
- https://supabase.com/docs/guides/realtime/limits
- https://supabase.com/docs/guides/realtime/broadcast
