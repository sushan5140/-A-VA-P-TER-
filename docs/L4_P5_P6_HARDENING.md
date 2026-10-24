# L4 P5/P6 — Combined integration hardening

Implemented a server-side session gateway that binds previously verified player identity to random 256-bit bearer capabilities. Movement takes only the session capability and a validated raw intent packet. The gateway checks size, schema, rate and movement sequence through existing coordinator/simulator. Resume rotates the capability. Revocation rejects subsequent input. Integration tests cover identity isolation, rate caps, token rotation, expiry and invalid members.

IMPORTANT: This is NOT an authentication service. The issue() caller must be a trusted server after verifying room membership/identity. Never let the browser invoke issue() with arbitrary actorId. The token is sensitive; HTTPS/WSS and secure issuance are mandatory. The current in-memory session store loses connections on restart and does not clean dormant sessions automatically.

Still blocked for multiplayer release: hosted durable authoritative room service; authenticated network ingress and secure initial session issuance; persistent room state; server-authoritative map collisions, events and scoring; multi-device latency/reconnect and rate/cost testing. GitHub Pages cannot host the backend.

This PR is stacked after #28 and #27. Do not merge into main or deploy before user approval. CI success verifies domain logic, not a functional live multiplayer environment.
