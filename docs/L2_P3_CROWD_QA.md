# L2.P3 Crowd NPCs — implementation notes

- 48 deterministic, seeded pedestrian agents with wait, travel and gather states.
- Single GPU-instanced low-poly mesh to reduce draw calls.
- Crowd simulation advances only while match phase is playing.
- Reroute hook added for later environmental-event integration.
- Node tests cover deterministic startup, count, stable coordinates and reroute.

**Not yet verified:** real browser rendering, build, FPS, crowd collision, or gameplay routes. Current proximity-based waypoint selection is *not yet graph navigation*. Some straight-line transitions may cross geometry; proper collision-aware connected route edges and safety checks are required before calling this phase complete. No realistic operational crowd steering is implemented.
