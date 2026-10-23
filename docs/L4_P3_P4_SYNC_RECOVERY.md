# L4.P3–P4 Sync and Recovery

Implemented: server-owned movement simulation that accepts validated direction intents and monotonic packet numbers; advances positions with speed/bounds limits and room clock; publishes snapshots; stops motion on disconnect. Recovery module stores grace deadlines, permits resuming within 30 seconds and expires absent players.

Security boundary: player IDs must come from authenticated server sessions, not client-supplied identity. The recovery manager itself does not authenticate reconnects; real deployment needs signed rotating resume credentials, secure transport and rate limits.

Not implemented: hosted WebSockets, durable storage, authoritative map collision, mission scoring, event sync, real network snapshot broadcast, two-device validation and provider cost tests. This is a backend-domain simulation only, not multiplayer you can play online.

Do not merge to main or deploy Pages until Level 4 release gate and user approval.
