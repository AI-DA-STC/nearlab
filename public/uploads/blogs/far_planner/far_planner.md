---
author: Jiaying
---

FAR Planner comes from CMU's Robotics Institute and was presented at IROS 2022 as the "Fast, Attemptable Route Planner". It plans over a visibility graph that it keeps updating while the robot drives. A robot can set off for a goal in a building it has never seen, find that the route it chose is a dead end, and plan again. That loop gives this post its title.

The post has three parts: how the planner works, as the paper describes it; what the [M20-autonomy-sim](https://github.com/AI-DA-STC/M20-autonomy-sim) repo adds to run it on the DeepRobotics M20 in Gazebo; and what that integration teaches, followed by where it falls short. Everything here is simulation. The notes on behaviour come from reading the repo and diffing it against the projects it copies from.

## How FAR Planner works

A visibility graph has a node at every obstacle corner and an edge between every pair of corners that can see each other. The shortest path around polygonal obstacles always follows these edges, which is why the idea is old. It has stayed niche because the graph is expensive to build and needs obstacles as polygons.

The paper's argument is that unknown space is where the graph is cheapest. Unseen areas contain few obstacles, so they add few edges, and repairing the graph as the robot sees more stays cheap. Grid searches (A*, D* Lite) and sampling planners (RRT*, BIT*, SPARS) both struggle there. They have to be re-run or repaired after every change, or they spend samples on space nobody has seen.

### Obstacles become polygons

FAR does not work on raw points. A terrain analysis module upstream labels the obstacle points. FAR projects them into a binary image centred on the robot, inflates them by the vehicle size and blurs the image with an average filter. It then traces the contours in the blurred image (border following, after Suzuki and Abe), simplifies each contour with Douglas-Peucker and prunes vertices by the angle between their two edges. What remains is a small polygon per obstacle.

### A visibility graph in two layers

Connecting every pair of vertices that can see each other costs O(n² log n), which is too much if n spans the whole map on every scan. FAR splits the graph in two. The local layer is rebuilt from each frame in a window around the robot (40 m × 40 m in the paper). The global layer holds everything seen so far, and each new local layer is merged into it:

- Local vertices are matched to global vertices by nearest neighbour within a distance threshold. A matched global vertex moves to the mean of its inlier observations, found with an iterated robust fit over several frames.
- A global vertex that stays unmatched for several frames is voted out. An unmatched local vertex is added as a new one.
- Edges are updated or added. Any edge that is now blocked, or that touches a removed vertex, is deleted.

To keep the graph sparse, the local layer drops long edges that run into a polygon and keeps the ones that pass around it. Short edges are all kept, because noise in vertex positions makes their direction unreliable. Only the area near the robot is rebuilt, so the work is spread evenly across frames.

### Planning, and why it can attempt

To plan, the robot and the goal are added to the global layer as vertices, joined to every polygon vertex they can see, and a graph search returns the shortest path. Vertices the robot has had a clear line to count as free space, and the rest count as unknown. The search can run over free space only, or over free and unknown space together. The second is what the paper calls attemptable navigation: with no free route to the goal, the planner takes the shortest route through space it has not seen. FAR's config switches to it automatically when the free-space search fails (`is_attempt_autoswitch: true`).

When the robot gets closer and an obstacle comes into view, the edges through it are removed and the search runs again on a graph that has barely changed. A moving obstacle is handled the same way. The edges it blocks are disconnected, then reconnected once the line of sight returns. A route into a dead end costs travel time (the paper's physical run covers 388 m in 406 s and goes into four dead ends on the way), but the replan itself is cheap.

![Three panels showing a robot attempting a straight route through unseen space, discovering a wall that deletes the edges crossing it, and replanning around the end of the wall](/Users/krishnaiyer/Workspace/nearlab/public/uploads/blogs/far_planner/images/attempt_fail_reroute.webp)

*Attempt, fail, reroute. The graph, the shortest paths and the deleted edges are computed for this toy layout. The layout itself is invented.*

In the paper's simulated ground-vehicle runs, FAR's average search time stayed under 10 ms and it used less than 20% of one CPU thread. Travel time was up to 12% shorter than A* and up to 47% shorter than D* Lite, with A* slightly ahead in one of the three environments.

## Running it on the M20

The M20 is DeepRobotics' wheel-legged quadruped. Each of the four legs has two hip joints, a knee and a driven wheel, 16 joints in all, and a reinforcement-learning policy runs them from a velocity command. FAR sits inside CMU's autonomy stack, which expects a ground vehicle that publishes odometry and a registered point cloud and accepts a velocity command. The repo's job is to make the M20 look like that vehicle.

FAR itself only outputs a waypoint. In the stack, terrain analysis labels obstacle points for it, a local planner picks a short collision-free path towards its waypoint, and a path follower turns that path into a velocity.

### What was reused and what was written

Most of the code is reused. FAR's source, config and launch file are identical to those in CMU's [autonomy_stack_go2](https://github.com/jizhang-cmu/autonomy_stack_go2). The rest of that stack differs from upstream in three files (two RViz configs and the Goalpoint tool) plus one new Point-LIO config. The stack is CMU's build for the Unitree Go2, so the path follower's Go2 sport-API output is switched off (`is_real_robot: false`). The M20 policy, `policy.onnx`, is byte for byte the one in DeepRobotics' [sdk_deploy](https://github.com/DeepRoboticsLab/sdk_deploy) repository as of 25 December 2025.

What the repo adds is five pieces on the main path, nine edited files in DeepRobotics' SDK, a set of parameter overrides and a simulated M20.

![The pipeline from the Gazebo M20 model through the LiDAR adapter, Point-LIO, the CMU bridge, terrain analysis, FAR planner, local planner, velocity relay and RL controller, back to the simulated joints](/uploads/blogs/far_planner/images/pipeline.webp)

*The pipeline from Gazebo's sensors to the joint torques. Topic names are the ones in the repo's launch files.*

![An animated screen capture with the Gazebo world on the left and RViz on the right, where FAR's polygons and visibility edges grow as the robot drives](/uploads/blogs/far_planner/thumbnail.webp)

*A simulated run. Gazebo is on the left. On the right, RViz shows FAR's polygons (red) and visibility edges (cyan) as they grow.*

### Simulating the robot

The world is the Indoor Corridors model from CMU, run in Gazebo Sim with ODE physics at 1 ms steps. The M20 is an SDF model with a 100 Hz IMU and front and rear LiDARs. Each LiDAR has 16 beams by 512 samples over 180° (±15° vertically, 30 m range, 10 Hz) and sits 0.38 m ahead of or behind the base. Only the front LiDAR feeds the autonomy stack.

`gazebo_controller_ros2.py` makes Gazebo look like the real robot to DeepRobotics' controller. It reads joint states and the IMU and republishes them as the `drdds` messages that `rl_deploy` expects. It also converts each joint command (position, velocity, kp, kd and feedforward torque) into a torque at 1 kHz, clipped to the motors' torque limits. Its joint direction and offset tables must match the ones in DeepRobotics' `M20Interface` exactly, so that the two conversions cancel. Until `rl_deploy` sends its first command, the node holds the spawn pose with a PD law.

Nine files of DeepRobotics' SDK were edited. The substantive changes are these:

- DDS topic names became relative, so the robot can live in a namespace such as `/M20`.
- Battery level and driver status start as healthy, because the simulator publishes neither.
- The start-up wait for joint data gives up after about ten seconds instead of waiting for ever.
- The idle state commands zero torque on the hips and knees and a little damping on the wheels, and its joint-velocity checks were removed.

The remaining edits wire in the new command source described below.

### Getting LiDAR data into Point-LIO

Point-LIO expects a Velodyne-style cloud with per-point `time` and `ring` fields, and Gazebo's LiDAR provides neither. `pointcloud_lio_adapter.py` takes the ring from each point's row and the time from its column, as a fraction of the 0.1 s scan. It writes the fields at the byte offsets of PCL's padded Velodyne point. The M20 config for Point-LIO then selects the Velodyne type with 16 scan lines, a 180° field of view, a 30 m detection range and the LiDAR's offset of (0.38, 0, 0.08) m, with extrinsic estimation switched off.

### From Point-LIO to CMU's conventions

`lio_to_cmu_bridge.py` renames frames and topics. Point-LIO's `camera_init` frame becomes `map` and its odometry child frame becomes `sensor`. `/aft_mapped_to_init` is republished as `/state_estimation` and `/cloud_registered` as `/registered_scan`. A static identity transform makes `vehicle` equal to `sensor`.

The bridge also cuts the robot out of its own scan. Points inside a box around the body (−0.45 to 0.55 m forward, ±0.35 m sideways, −0.35 to 0.45 m vertically) or closer than 0.2 m to the robot are dropped. If fewer than 200 points, or fewer than 5% of the scan, would survive, the unfiltered scan is published instead.

### From velocity to legs and wheels

The path follower publishes `/cmd_vel` as a `TwistStamped` in m/s and rad/s. The M20's policy takes three numbers for forward, sideways and yaw. Three pieces carry the command across:

- `cmd_vel_to_raw_relay.py` converts it to a plain `Twist` on `/cmd_vel_raw`. With the launch file's values it applies a 0.01 deadband, scales forward by 1, lateral by 0.3 and yaw by 3, and clamps to 1 m/s and 2 rad/s.
- `Ros2CmdVelInterface` is a new command source for `rl_deploy`, selected with the `--autonomy` flag. It divides the three values by 1, 1 and 2, clips each result to ±0.7 and passes them to the policy. A relayed command takes priority over a direct `/cmd_vel` for 0.5 s.
- The interface accepts commands only in RL control mode, and only after a two-second settle. The operator brings the robot up by publishing `stand` and then `control` to `/m20_mode`, and a request is ignored unless the robot is already in the state before it.

### Retuning the planners

The FAR node in `autonomy_sim.launch.py` restates a few settings and changes two. Everything else in FAR's config stays at the shipped defaults, and the topic remappings are the same as upstream's.

```python
far_planner = Node(
    package='far_planner',
    executable='far_planner',
    parameters=[FAR_CFG, use_sim_time, {
        'robot_dim': 0.6,
        'local_planner_range': 2.5,
        'util/obs_inflate_size': 1,
        'util/dynamic_obs_dacay_time': 0.25,   # shipped config: 1.0
        'util/new_points_decay_time': 0.25,    # shipped config: 1.0
        'g_planner/goal_adjust_radius': 1.0,
    }],
    ...
)
```

The CMU nodes were retuned more heavily. This table lists every setting in the launch file that differs from the upstream defaults.

| Node | Setting | Upstream | This repo |
|---|---|---|---|
| terrainAnalysis | `decayTime` | 2.0 s | 1.0 s |
| terrainAnalysis | `clearDyObs` | false | true |
| terrainAnalysis | `noDataObstacle` | true | false |
| terrainAnalysisExt | `decayTime` | 10 s | 1.5 s |
| terrainAnalysisExt | `voxelTimeUpdateThre` | 2.0 s | 0.5 s |
| localPlanner, pathFollower | `twoWayDrive` | false | true |
| localPlanner | `goalClearRange` | 0.5 m | 1.0 m |
| pathFollower | `lookAheadDis` | 0.5 m | 0.35 m |
| pathFollower | `yawRateGain`, `stopYawRateGain` | 1.5, 1.5 | 4.0, 6.0 |
| pathFollower | `maxYawRate` | 80°/s | 60°/s |
| pathFollower | `dirDiffThre` | 0.4 rad | 0.15 rad |
| pathFollower | `slowDwnDisThre` | 0.75 m | 1.0 m |
| pathFollower | `is_real_robot` | true | false |

### Sending a goal

In RViz, the Goalpoint tool publishes the goal on `/goal_point`. The repo's copy of the tool sends the goal first and the `/joy` message that switches the local planner into autonomy mode 10 ms later. Upstream sends the joystick message first. A comment in the source says to raise the delay to 1 s on a real robot.

Two details are easy to trip over. FAR drops a goal that arrives before its graph is initialised, and prints "V-Graph Initialized" when it is ready. And the local planner and path follower both start with `autonomyMode: False`. They ignore FAR's waypoint, and the follower holds zero speed, until a `/joy` message turns autonomy on. A goal published from the command line therefore only moves the robot if an earlier Goalpoint click has already switched autonomy on.

## Lessons from the integration

**Adapt the robot and leave the planner alone.** FAR's source and config are untouched. Its interface is a handful of topics and frames: odometry and a registered scan in the `map` frame, terrain clouds that CMU's own nodes derive from that scan, and a goal. Nearly all of the work was producing the first two from the M20's sensors and turning the stack's velocity output into something the policy accepts. Apart from parameters, nothing in the stack had to change.

**Put a probe at every seam.** The README's troubleshooting section is mostly about plumbing: a hung ROS 2 daemon caused by stale processes, a LiDAR that publishes nothing, Point-LIO rejecting a cloud for missing fields, and an empty RViz because the fixed frame did not match the topic (`camera_init` for Point-LIO's, `map` for CMU's). Two debug topics make the end of the chain checkable. `/m20_cmdvel_debug` reports the command source, the three scaled commands and the requested and current state. `/M20/exec_debug` reports the wheel command, the actual wheel speed, torque and damping. Together they split a robot that will not move into four cases.

| What the topics show | Where the fault is |
|---|---|
| Command scale is zero | `/cmd_vel_raw` is not reaching `rl_deploy` |
| Wheel velocity command is zero | The policy is not producing wheel motion |
| Wheel command is non-zero but wheel speed is small | Actuator or contact problem in Gazebo |
| Wheel speed is non-zero but the body does not move | Friction or collision with the world |

**Keep the robot out of its own map.** A scan that includes the robot's legs puts obstacles at the robot's own position. The bridge cuts a box around the body out of every scan, and falls back to the unfiltered scan rather than publish an almost empty one.

**Let the sensor decide which defaults survive.** The LiDAR's lowest beam points 15° down, and the sensor sits about 0.55 m above the floor when the robot stands. That height is an estimate from the 0.38 m stand height, the 9 cm wheel radius and the 8 cm mount offset, and it puts the first floor return a little over two metres away. CMU's `noDataObstacle` option marks a cell as an obstacle when it holds fewer than ten points, within a window 0.3 to 1.8 m ahead of the robot. For this sensor on a robot standing still, the floor in that window returns no points, so every cell in it would count as an obstacle, and the repo turns the option off. The shorter terrain memories in the table may follow from the same kind of reasoning, but the repo does not say why they were made.

**Log commanded and achieved velocity before touching gains.** A yaw command passes through the path follower's gain, the relay's ×3 and the interface's ÷2, then a cap of 0.7, before it reaches the policy. The relay and the interface combine to ×1.5, and the cap is reached once the planner asks for about 0.47 rad/s. For comparison, DeepRobotics' own keyboard interface gives the policy at most 0.7 forward, 0.5 sideways and 0.7 yaw. The README names four places where turning can go wrong (the interface's scaling, the relay scale, wheel torque in the controller and Gazebo's wheel contact) and points to the two debug topics to isolate them. The repo does not record the outcome. A log of commanded against achieved yaw rate would show which factor is off.

**Treat bring-up order as part of the design.** The launch files start nodes on fixed delays between 5 and 17 seconds, with Point-LIO at 8 s, the bridge at 9 s, CMU at 15 s and FAR at 17 s. The M20 has to be stood up before it takes commands, and FAR has to finish its first graph before it accepts a goal. Launch arguments (`point_lio`, `bridge`, `cmu`, `route_planner`) start the stack in parts, and the README checks each stage with `ros2 topic hz` on a short list of topics.

**Check upstream before writing a command interface.** DeepRobotics has since added its own ROS 2 command source to `sdk_deploy`. It takes a `Twist` in m/s and rad/s, clamps it per axis (0.7, 0.5 and 0.7 by default), rejects non-finite values and zeroes the command after 0.25 s without input. The repo has no timeout, and only its relay checks for non-finite values. Moving to the official interface would also make the units explicit.

## Drawbacks and open problems

### The method

**Optimism costs time.** In attempt mode FAR takes the shortest route through unseen space, so it walks into any dead end that happens to lie on it. Nothing in the method predicts which unseen routes are likely to be open. The paper's physical run entered four dead ends on a 388 m route.

**It trusts its inputs.** The graph is built from the terrain analysis output and the odometry. FAR can reset its graph (`/reset_visibility_graph`) but has nothing that corrects it, and Point-LIO has no loop closure. Odometry drift therefore bends the polygons and edges, and nothing pulls them back.

**Its world is flat.** Obstacles are polygons from a 2D projection (the repo runs with `is_multi_layer: false`). FAR splits the terrain cloud into free and obstacle points at a height of 0.15 m above ground (`util/terrain_free_Z`), so a step, a ramp or a staircase is either open floor or a wall. The M20's policy has no terrain input either, so that binary view is all the robot knows about the ground ahead.

### This integration

**Simulation only, with perfect sensors.** The Gazebo LiDAR and IMU have their noise set to none, and every setting above was chosen for that world. The adapter invents per-point timestamps, so Point-LIO is told that the points of a Gazebo scan, which is a single snapshot, arrived over 100 ms. The self-filter box and the 0.38 m LiDAR offset were set for the simulated model and would need re-measuring on a real M20. There is no hardware launch for the autonomy stack, and the README says the simulation-only scripts need review before deployment.

**The command-to-velocity mapping is hand-tuned and unchecked.** Nothing compares the achieved velocity with the commanded one. The interface stamps each command, but nothing checks its age. DeepRobotics' `SafeController` has a command-heartbeat check that its run loop never calls, so if the autonomy stack stops, the last command stays latched. DeepRobotics' current README also lists problems with its newer policy in simulation: "negligible sideways motion, yaw overshoot, and drift at zero input". The older policy used here may share them.

**Safety checks were loosened for simulation.** The idle state no longer checks joint velocities against their limits, the start-up wait for joint data gives up after about ten seconds and carries on, and battery level and driver status default to healthy. These changes keep Gazebo from tripping the checks, and they need reverting before the code drives a robot.

**Perception faces forward.** `twoWayDrive: true` lets the local planner reverse, but only the front LiDAR, 180° wide, feeds Point-LIO and the terrain maps. The rear LiDAR is simulated and bridged but unused, so the robot is blind when it backs up.

**Footprint and extrinsics are inherited, not measured.** `vehicleLength` and `vehicleWidth` (0.3 and 0.7) come from the Go2 launch files and do nothing here, because `checkRotObstacle` is false. Path blocking uses a compiled 0.55 m search radius and a precomputed path library that was not regenerated, and FAR's `robot_dim` is a single number. The LiDAR sits at (0.38, 0, 0.08) in the SDF but at (0.32, 0, −0.013) in the GLIM launch file. Point-LIO's offset uses the SDF value as if the IMU were at the base origin, while the SDF puts the IMU about 8 cm from it, and extrinsic estimation is off.

**The data path is plain Python.** The adapter, the self-filter and the map accumulation each loop over every point in Python, and the bridge runs them on the thread that republishes odometry. With 8,192 points at 10 Hz that is fine. A denser sensor would not be. None of this was profiled.

**Bring-up is tied to one machine.** The launch files use fixed delays rather than readiness checks. `gazebo.launch.py` forces NVIDIA render offload with variables written for one laptop's GPU and starts `nvidia-smi` monitors. The README and `glim_slam.launch.py` contain `/home/cjy/...` paths. `autonomy_sim.launch.py` still documents the Gazebo Classic setup and the `indoor_nav` world, while the README describes Gazebo Sim and `indoor_large`. Two simulators live side by side, and the docs disagree about which one is current.

**No evidence yet, and no record of where the code came from.** The repo has no logs, metrics or tests, so nothing says how FAR performs on the M20: no success rate, travel time or planning time. It bundles DeepRobotics' SDK, CMU's stack and Point-LIO from unrecorded commits, with two commits of its own. The only way to see what changed is to diff against upstream, which is how the file counts in this post were found. The SDK copy matches DeepRobotics' repository as it stood in late December 2025. DeepRobotics has since updated the M20 policy twice (26 May and 29 July 2026) and its control parameters (12 August).

None of the integration problems touch FAR itself. The first steps would be to compare commanded with achieved velocity, add a command timeout, restore DeepRobotics' safety checks, and run the pipeline on the real robot's LiDAR.
