---
author: Jiaying
---

Most mobile robots we work with plan on a costmap: a dense grid where every cell holds a cost, searched with A* or one of its relatives whenever the robot needs a route. That works well in a building you have already mapped. It works less well when the map is being built as you drive, because every new scan changes the grid and the search has to start again over a space that keeps growing.

FAR Planner, from Yang et al. at CMU, throws the grid out. It keeps a visibility graph instead, a sparse set of obstacle corners joined by the straight lines between them that nothing blocks. This post covers what that buys you, how we reproduced it, and what we had to work out for ourselves.

> **TODO (Jiaying):** one or two sentences on why the lab picked this up. Which robot or project needed map-less navigation, and what was wrong with the existing stack?

## Why a visibility graph

In open 2D space, the shortest path around polygonal obstacles always bends at obstacle corners. So you don't need every cell. You need the corners, and you need to know which pairs of corners can see each other. A large floor can collapse to a graph small enough that searching it is close to free.

The catch is that the graph is only as good as the polygons. A costmap degrades gracefully when the sensor data is noisy, since a few bad cells cost you a slightly worse path. A badly extracted polygon can delete a corridor from the graph entirely.

## How FAR Planner builds the graph

The planner works on the obstacle point cloud around the robot. Each update it:

1. projects nearby obstacle points into a local grid and extracts polygon outlines from them;
2. adds the polygon vertices to the graph and connects the pairs that have line of sight;
3. merges the local layer into a global graph that persists as the robot moves on.

The part that makes it more than a static visibility-graph planner is the dynamic update. When something moves into a line of sight, the edge through it is disconnected. When the obstruction clears, the edge comes back. Route planning runs over whatever graph exists at that moment.

> **TODO (Jiaying):** check this summary against the paper and the code, and correct anything I have flattened. A figure of the polygons and edges on one of our runs would help here (the tile thumbnail may already be the right one).

## Attempt, fail, reroute

The other idea is in the name. FAR stands for Fast, Attemptable Route planner, and in unknown space it is optimistic. Space it has not seen yet counts as traversable, so it will route the robot through a gap it has never observed. If the gap turns out to be a wall, the new scan disconnects the edge and the planner finds another way.

That sounds reckless, and in some buildings it probably is.

But the alternative is a planner that refuses to move until it has seen everything, which is not navigation at all. The question is how often a wrong guess costs you, and that depends heavily on the environment.

> **TODO (Jiaying):** an example from our runs where an attempt failed and the reroute worked, and ideally one where it didn't. Short clip or before/after screenshot.

## Our setup

> **TODO (Jiaying):**
> - Robot and sensors (LiDAR model, odometry source).
> - Simulation first, or straight onto hardware? Which environments?
> - What sits underneath FAR Planner as the local planner and terrain analysis, and whether it is CMU's development environment or our own stack.
> - ROS version and anything that needed porting.

## What the paper doesn't tell you about tuning

This is the section the post exists for. The paper reports results with a configuration that suits CMU's robots and test sites, and the defaults did not carry over cleanly to ours.

> **TODO (Jiaying):** the parameters that mattered, roughly in the order you hit them. For each one: what it controls, what went wrong at the default, what you changed it to, and how you could tell. Candidates worth checking: the voxel and grid resolution used for polygon extraction, sensor range, how aggressively polygons are simplified, the thresholds for connecting and disconnecting edges, and anything to do with how unknown space is treated.

> **TODO (Jiaying):** failure modes you saw that tuning did not fix, such as glass, thin obstacles, ramps, or clutter that produced too many small polygons.

## Where it fits

> **TODO (Jiaying):** your view on when you would reach for FAR Planner over a costmap planner, and when you would not. What would you try next? If this connects to the [M20 waypoint navigation work](#/blogs/waypoint-navigation-m20), say how the two approaches differ.

FAR Planner: Fan Yang, Chao Cao, Hongbiao Zhu, Jean Oh and Ji Zhang, "FAR Planner: Fast, Attemptable Route Planner using Dynamic Visibility Update," IROS 2022.
