---
author: Krishna
---

*This is ongoing work. We'll update the post as the system matures.*

The Deep Robotics M20 is a wheeled-legged quadruped. We wanted it to take a goal anywhere on a floor we had already mapped and get there reliably, run after run.

> **TODO (Krishna):** the site and the task. Is this inspection rounds, delivery, something else? It changes what "reliably" has to mean.

Nav2 can do this out of the box. Its global planner searches the costmap for a path, and on every replan it searches the whole costmap again. In a large building that is slow. Worse, the path it finds is the cheapest line through free cells. It has no idea that people walk down the middle of corridors, that doorways are where you line up before you go through, or that one route through the atrium is much safer than another that is technically shorter.

Our approach is to do the routing once, offline, on a sparse graph that captures the building's structure, and leave Nav2 to handle the short hops between graph nodes.

## The map

We build the map with GLIM, a LiDAR-inertial mapping framework from Koide et al. that produces a globally consistent point cloud of the site.

> **TODO (Krishna):** sensor setup on the M20, how long a mapping run takes, and how the GLIM point cloud becomes the 2D occupancy map Nav2 localises against. A screenshot of the point cloud belongs here.

## The waypoint graph

From that map we generate a sparse waypoint graph with SWAGGER. The graph puts nodes along corridors and at junctions and doorways, and joins them with edges the robot can drive. Routing between two points becomes a search over a small graph rather than every costmap cell, and the route follows the shape of the building because the graph does. That, at least, is the theory. How well it holds depends on how good the generated graph is, which we are still finding out.

> **TODO (Krishna):** link and citation for SWAGGER; how many nodes and edges the graph has for our site; any manual cleanup (pruned edges, added nodes at docking points); how a goal pose is snapped to the graph.

## Routing offline, hopping online

At run time a goal goes through two stages. The route is a shortest path on the waypoint graph, which should cost almost nothing to compute. Nav2 then only ever plans between consecutive waypoints, a few metres at a time, so each global plan is small and the local controller keeps its usual job of avoiding whatever is actually in the way.

> **TODO (Krishna):** which Nav2 planner and controller run the hops, and whether you measured replanning time against the full-costmap baseline.

## Sequencing and recovery

A behaviour tree sequences the hops. It sends the next waypoint, watches for arrival or failure, and decides what to do when a hop fails. The obvious recovery is to back up and retry. The more interesting one is to mark the edge as blocked and reroute on the graph, which is cheap precisely because the graph is small.

> **TODO (Krishna):** the actual tree, ideally as a diagram, and the recovery behaviours you implemented. Which failures still need a human?

## Where it stands

> **TODO (Krishna):** what works today, what is still being built, and what the next update to this post will cover. Any numbers from runs so far, even rough ones, with how many runs they come from.
