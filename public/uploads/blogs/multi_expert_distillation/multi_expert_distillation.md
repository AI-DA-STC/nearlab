---
author: Vetrivel Karthikeyan
---

## Objectives

1. Build a standardized skill acquisition framework for scalable simulation based training for locomotion in quadrupeds (Unitree B2W)
2. Build and validate an end-to-end pipeline that trains policies in simulation and validates Sim2Sim on Isaac Sim.

## Key Use Cases

The project aims to develop a robust policy capable of **navigating complex search-and-rescue environments**, while building **a library of specialised skills** that enables the agent to intelligently select and switch between behaviours based on the situation.

![](/uploads/blogs/multi_expert_distillation/images/image5.webp)



![](/uploads/blogs/multi_expert_distillation/images/image1.webp)

## Working Direction

### Tools and Frameworks

| Package | Version |
|---|---|
| Isaac Sim | 5.1.0 |
| Isaac Lab | 2.3.2 |
| rsl-rl-lib | 5.4.1 |

### Implementation details

- **Hardware availability**: 1 x RTX5090 Aftershock PC : Done 
- **Hyperparameters:** Can be found in Appendix B
- **Simulator & Training**: Isaac Sim
- **PPO Training**: RSL-RL, used by Isaac Lab (.onnx) + PyTorch
- **Testing / Validation**: Isaac sim
- **Logging / Experiment Tracking:** Weights & biases (wandb)

### Approach

The Unitree B2W is supplied with a factory locomotion controller, but it is not specifically tuned for robust traversal across challenging terrain. This project therefore aims to **develop a training pipeline** that produces a more capable locomotion policy. Multiple expert policies are first trained, with each expert specialising in a distinct skill. Their behaviours are then distilled into a single student policy that uses onboard proprioceptive measurements and depth-camera observations to recognise the terrain and switch intelligently between the learned skills.

The overall pipeline was primarily based on Rudin et al. (2025). However, because the paper provides limited details on the training of its individual expert policies, the methodology from Hoeller et al. (2023), its predecessor, was also used as a reference. Rudin et al. (2025) explicitly states that its locomotion-module training closely follows the procedure introduced by Hoeller et al. Furthermore, Rudin et al. (2025) extends the five original skills - walking, climbing, descending, jumping, and crouching - with four additional locomotion skills.

The main repository used for the training is [near-locomotion-quadruped](https://github.com/vet3whale/near-locomotion-quadruped/tree/b2w-distillation-training), which used 3 submodules [robot_lab](https://github.com/vet3whale/robot_lab/tree/b2w-distillation-training), [unitree_mujoco](https://github.com/vet3whale/unitree_mujoco/tree/086d869cdc104fbdaf30af9f6dc410e948d6f497) and [unitree_rl_lab](https://github.com/vet3whale/unitree_rl_lab/tree/c5d7d2e73bab36c2e258ae7e2337498ec0db14c2). robot_lab was the repository used for training the policy, unitree_rl_lab was used for the controller to deploy policies onto the robot and unitree_mujoco was used for Sim2Sim validation, before deployment.

**Neural Network:**

Hoeller et al. (2023) uses a plain MLP for the actor and critic, with no recurrence, since an elevation map needs no memory. Rudin et al. (2025) adds an LSTM to the student once the input becomes depth images. Rudin et al. (2025) implements the following:

![](/uploads/blogs/multi_expert_distillation/images/image25.webp)

Neural Network implemented on `robot_lab` for the **walking expert training**:

- **Expert actor:** MLPModel, hidden dimensions [512, 256, 128], ELU, no recurrence, no observation normalisation. **Output:** Gaussian action distribution with a scalar standard deviation initialised at 1.0.
- **Expert critic:** MLPModel, hidden dimensions [512, 256, 128], ELU, no observation normalisation. Reads the uncorrupted copy of the same observations rather than a larger set. **Output:** Single Scalar Output.
- **Distilled student:** CNNRNNModel. Reads the deployable groups only: student (57 proprioceptive values), student_commands (3-element velocity command), depth_front and depth_rear (two 48 × 32 depth images). No height scan. **Output:** 16 actions, 12 leg joint position targets and 4 wheel velocity targets.
- **Fine-tuned student:** CNNRNNModel, inherited unchanged from the distilled student, same four input groups. Paired with a fresh MLPModel critic of [512, 256, 128], ELU, reading privileged proprioception and the height scan. **Output:** 16 actions from the actor, single scalar from the critic.

![](/uploads/blogs/multi_expert_distillation/images/image16.webp)

**Inputs / Outputs:**

- **Expert input (247):** Proprioception and command (60) plus a 187-point elevation map. The 60 splits into base linear velocity 3, base angular velocity 3, projected gravity 3, velocity command 3, joint position 16, joint velocity 16, previous action 16. The map is a downward ray-caster over a 1.6 m × 1.0 m grid at 0.1 m resolution, giving 17 × 11 samples.
- **Distilled student input (3132)**: The same 57 proprioceptive values, the 3-element command on a separate group, and two 48 × 32 (1536) depth images from a front and a rear camera, clipped to 2 m and updated at 15 Hz.
- **Fine-tuned student input (3132)**: Unchanged from the distilled student. Fine-tuning alters the weights and the terrain, not the observation contract.
- **Outputs:** A 16-dimensional vector of target joint positions q* (one per actuator). Each target is fed to the robot's joint-level PD controller, which converts the position target into a motor torque via τ=K<sub>p</sub>(q*− q)+K<sub>d</sub>(q̇*−q̇) with q̇*=0. 

**Control Rate**: 

- Policy runs at 50 Hz (one action every 20 ms) 

### Stage 1: Expert Training

**A. Observations**:

Based on Rudin et al. (2025):

![](/uploads/blogs/multi_expert_distillation/images/image23.webp)

1. Expert, Student and Critic all have 
- Base linear velocity v<sub>b</sub>, 
- Base angular velocity ω<sub>b</sub>, 
- Gravity vector in the base frame g<sub>b</sub>, 
- Joint positions and Joint velocities (q, q̇ ), 
- Target base position (r*), 
- Remaining time to reach it (t*),
- Target heading (ψ*).
1. Expert’s only exteroceptive is a robot-centric 2.5D height scan covering 2m x 1m patch around base, fine elevation map (Em<sub>2m×1m</sub>).
2. Student has four depth images (4×I)
3. Critic has fine elevation map (Em<sub>2m×1m</sub>), coarse elevation map (Em<sub>6m×3m</sub>) and horizontal lidar scan (Ls<sub>tray/30<sup>∘</sup></sub>).

![](/uploads/blogs/multi_expert_distillation/images/image2.webp)

On Hoeller et al. (2023), while they do not specify as expert, student, critic observations, their locomotion training used:

- Base linear velocity v<sub>b</sub>, 
- Base angular velocity ω<sub>b</sub>, 
- Gravity vector in the base frame g<sub>b</sub>, 
- Joint positions and Joint velocities (q, q̇ ), 
- Target base position (r*), 
- Remaining time to reach it (t*),
- Target heading (ψ*),
- Height Scans (h) as observations.

Observations implemented on `robot_lab` for the **walking expert training**:

- Base Linear Velocity (**`base_lin_vel`**) - 3 dim (vx, vy, vz in base frame)
- Angular Velocity (**`base_ang_vel`**) - 3 dim (wx, wy, wz in base frame)
- Gravity Vector (**`projected_gravity`**) - 3 dim (unit gravity in base frame)
- Joint Positions (**`joint_pos`**) - 16 dim 
- Joint Velocities (**`joint_vel`**) - 16 dim
- Last actions (**`actions`**) - 16 dim 
- 1.6m x 1.0m Elevation Map (**`heigh_scan`**) - 187 dim
- Velocity Command (**`velocity_commands`**) - 3 dim (lin_x, lin_y, ang_z)

Expert policy input = 247 dim. 

**B. Terrain configurations**:

- Walking policy trained utilizing 60% stairs, 20% inclined planes, and 20% stochastic obstructions. 
- Based on Hoeller et al. (2023), in this terrain, the robot must traverse various irregular terrains consisting of stairs, slopes, and randomly placed small obstacles.
- Specialised Skills train on 80% of their target obstacle type and 20% random rough terrain.

Terrain implemented on `robot_lab` for the **walking expert training**:

| **Terrain piece** | **Share** | **Params** | **Description** |
|---|---|---|---|
| `MeshInvertedPyramidStairsTerrainCfg` | 30% | step height 5 cm, tread 27.5 cm | sharp, solid stair edges |
| `HfInvertedPyramidStairsTerrainCfg` | 30% | step height 5 cm, tread 27.5 cm | smoother heightfield stairs |
| `HfInvertedPyramidSlopedTerrainCfg` | 20% | slope 0.176 rad (~10°) | a continuous outward incline |
| `HfDiscreteObstaclesTerrainCfg` | 20% | 8 boxes, height 5-15 cm, width 0.4-1.0 m | scattered low obstacles to step over |

**C. Reward System**:

Since the rewards on Hoeller et al. (2023) were for position-tracking, default robot_lab rewards were used instead.

Rewards implemented on `robot_lab` for the **walking expert training:** 

*Refer to Appendix B for the rewards system used.*

**D. Termination Conditions**:

Hoeller et al. (2023) terminates on base collision, and on feet contact force exceeding 1500N. 

Termination Conditions implemented on `robot_lab` for the **walking expert training:** 

```
class TerminationsCfg:
   """Termination terms for the MDP."""
```

```
   # MDP terminations
   time_out = DoneTerm(func=mdp.time_out, time_out=True)
   # command_resample
   terrain_out_of_bounds = DoneTerm(
       func=mdp.terrain_out_of_bounds,
       params={"asset_cfg": SceneEntityCfg("robot"), "distance_buffer": 3.0},
       time_out=True,
   )
```

```
   # Contact sensor
   illegal_contact = DoneTerm(
       func=mdp.illegal_contact,
       params={"sensor_cfg": SceneEntityCfg("contact_forces", body_names=""), "threshold": 1.0},
   )
```

**^ Refer to** [**velocity_env_cfg.py**](https://github.com/vet3whale/robot_lab/blob/54b0967902271b17f39cb24e39a26001ebdc0792/source/robot_lab/robot_lab/tasks/manager_based/locomotion/velocity/velocity_env_cfg.py)

- The rewards and penalties were not changed and remained the same as what was used in `robot_lab`, these exact termination conditions were not implemented.
- Instead the training has 3 types termination conditions:
   - Episode ends at 20s (`time_out`)

```
self.episode_length_s = 20.0
```

   - Robot is out of bounds and is within 3m of the terrain edge

```
"distance_buffer": 3.0
```

   - Illegal Contact is **disabled**, so the robot does not get terminated when its feet contact force is large. Instead, it just gets penalised.

```
self.terminations.illegal_contact = None
```

**E. Domain Randomisation:**

In Hoeller et al. (2023), the teacher's elevation map is perturbed by adding noise to individual height points and shifting the whole map up to 7.5cm in all directions. Helps with conservative footholds and tolerance to state-estimation drift. 

Domain Randomisation implemented on `robot_lab` for the **walking expert training:**

- Per-point noise only, no map shift. 
- The policy group is corrupted at ±0.1m per height point, ±0.1 base linear velocity, ±0.2 angular velocity, ±0.05 projected gravity, ±0.01rad joint position, ±1.5rad/s joint velocity.

```
noise=Unoise(n_min=-0.1, n_max=0.1)
```

 ^ can be found in [velocity_env_cfg.py](https://github.com/vet3whale/robot_lab/blob/54b0967902271b17f39cb24e39a26001ebdc0792/source/robot_lab/robot_lab/tasks/manager_based/locomotion/velocity/velocity_env_cfg.py)

- The critic group is uncorrupted. 
- Physics randomisation from robot_lab was kept: friction, restitution, base and link masses, centre of mass, actuator gains scaled U(0.5, 2.0), external wrench on reset, full orientation randomisation on spawn, and a ±0.5m/s push every 10 to 15s.

```
class EventCfg:
```

^ can be found in [velocity_env_cfg.py](https://github.com/vet3whale/robot_lab/blob/54b0967902271b17f39cb24e39a26001ebdc0792/source/robot_lab/robot_lab/tasks/manager_based/locomotion/velocity/velocity_env_cfg.py)

**Training Run**: 

[https://wandb.ai/vetri-nus/b2w-walking-policy?nw=nwusere1397899](https://wandb.ai/vetri-nus/b2w-walking-policy?nw=nwusere1397899)

^ working policy: 2026-07-07_06-00-00_height_scan_enabled

2 separate training runs were done for expert, one was with **elevation maps and base_lin_vel enabled** and another with **elevation maps and base_lin_vel disabled**.

Num_envs = 4096

Overall Convergence

![](/uploads/blogs/multi_expert_distillation/images/image8.webp)

**mean_reward** is the undiscounted return summed over one episode. 

The run with Height Scans has ended with a reward value of 287 and the one without Height Scans ended with 273. Both the rewards have **converged / plateaued** and the **run with Height Scans have scored around 10-15 points higher than without Height Scans**. 

Loss Convergence

![](/uploads/blogs/multi_expert_distillation/images/image4.webp)

**Value Loss (Critic):** This measures the critic’s squared error in predicting future reward, so it measures gradient noise in the updates. The run with Height Scans converged to 0.034 and the one without to 0.052, roughly 35% lower. Both critics saw identical inputs, so the difference comes from the Height Scan actor producing more predictable rollouts, which gives cleaner policy gradients.

**Entropy:** This term is an indicator on how much the policy still randomises its actions, which is the exploration. Both runs have decayed to around 20, which would mean it has slowly reduced its exploration and became a deterministic policy.

Stability and Tracking

![](/uploads/blogs/multi_expert_distillation/images/image11.webp)



![](/uploads/blogs/multi_expert_distillation/images/image3.webp)

**ang_vel_xy_l2** penalizes roll and pitch angular velocity, so it measures how much the torso rocks and pitches while driving. The run with Height Scans ended at -0.115 and the one without at -0.127, about 5% better, corresponding to 1.52 rad/s versus 1.60 rad/s RMS. At the same iteration count the two are equal, so this is effectively a tie.

**error_vel_xy** is how far the robot's actual horizontal speed is from the commanded speed, in m/s. The run with Height Scans ended at 0.25 m/s and the one without at 0.48 m/s, roughly half the error. Both plateaued by iteration 3000. Note this gap is driven mostly by the extra base_lin_vel observation rather than the elevation map itself.

### Stage 2: Depth Student (DAgger-style distillation)

**Target Design:**

The objective of this stage is to distill the privileged expert policy into a deployable student policy. The expert receives accurate terrain information from an elevation map, whereas the student must infer the surrounding terrain using onboard depth cameras. During DAgger-style distillation, the student visits states using its current policy, while the expert provides the target actions used to train the student.

|  | **Teacher (privileged)** | **Student (deployable)** |
|---|---|---|
| Proprioception | Base linear velocity, base angular velocity, projected gravity, joint positions, joint velocities and previous actions | Same |
| Terrain Sensing | Privileged elevation maps | 2 depth maps (with CNN encoder) |
| Memory | None (feed-forward MLP) | LSTM (2 layers) |

**Total Proprioceptive Dimensions** = base lin vel + base ang vel + proj gravity + joint pos + joint vel + actions = 3 + 3 + 3 + 16 + 16 + 16 = 57 dim

![](/uploads/blogs/multi_expert_distillation/images/image16.webp)

Define the experts to be distilled in [teachers.txt](https://github.com/vet3whale/robot_lab/blob/b2w-distillation-training/source/robot_lab/robot_lab/tasks/manager_based/locomotion/velocity/config/wheeled/unitree_b2w/teachers.txt).

**Student Network Implementation:**

`rsl_rl` provides separate CNN and RNN model implementations through `cnn_model.py` and `rnn_model.py`, but it does not directly provide a model that combines both CNN and RNN processing. Therefore, the student is implemented as a custom subclass of `CNNModel`, while reusing the existing `rsl_rl.modules.RNN` and `rsl_rl.modules.MLP` building blocks.

Each depth camera has its own CNN encoder, with no weight sharing between the front and rear cameras. The convolutional features from each camera are passed through a fully connected compression stack, producing a fixed **64-dimensional latent vector per camera**.

The LSTM input consists of the proprioceptive vector and the two camera latents:

LSTM input width = 57<sub>proprioception</sub>+2×64<sub>camera latents</sub>=185

This 185-dimensional input is processed by a two-layer LSTM with a hidden size of 256.

The policy head receives three inputs:

1. The 256-dimensional LSTM output
2. The original 57-dimensional proprioceptive vector through a skip connection
3. The separate three-dimensional velocity command

Therefore:

Head input width = 256<sub>LSTM output</sub>+57<sub>proprioception</sub>+3<sub>commands</sub>=316

**Depth Image Degradation:**

Based on the “Parkour in the Wild” paper (Rudin et al., 2025), the following methods are used to degrade the depth images:

1. **Clip**: “The depth is clipped at 2 m. Additionally, pixels with a value below 0.15 m are considered empty (set to 2 m as well).”
2. **Edge noise**: “Identify edges by **thresholding the depth gradient** across the image. **Pixels around the edges** are then **randomly set to empty** or **shuffled with neighboring pixels**.” Implementation: 
- “**thresholding the depth gradient”:** Edge noise is introduced by applying two fixed 3×3 Sobel kernels to calculate the horizontal and vertical depths, g<sub>x</sub> and g<sub>y</sub>. The gradient magnitude, √(g<sub>x</sub><sup>2</sup>+g<sub>y</sub><sup>2</sup>), is then computed, and pixels exceeding the edge_thresh value of 0.1 is marked edges.
- “**Pixels around the edges”:** The resulting edge mask is dilated by one pixel using a 3×3 max-pooling operation, creating a wider band around each depth discontinuity. 
- “**randomly set to empty**”: Within this band, random value u ∈ [0,1) is generated for every pixel: pixels with u <0.5 are treated as empty and set to 1.0
- “**shuffled with neighboring pixels”:** Remaining pixels are replaced with the value of a randomly selected neighbouring pixel from the upward, downward, leftward, or rightward direction.
3. **Holes**: “**Patches of the image are set to the maximum depth**. The patches are identified by thresholding slowly evolving **Perlin noise Perlin (2002)**, which ensures temporal consistency of the missing data.” Implementation:
- **"Perlin noise Perlin (2002)":** They used a 6x8 cell lattice with a unit gradient vector at each of the (7x9) nodes. For each pixel, dot the four surrounding corner gradients with the offset to the pixel, then bilinearly blend those four dots using the quintic fade 6t⁵-15t⁴+10t³ (_perlin_fade). 
- **"Patches set to maximum depth"**: threshold the field, noise > hole_thresh (0.25) → set those pixels to 1.0
4. **Blind spot**: “Remove data in the leftmost 1 to 5 columns of the image. This mimics the blind spot of stereo-matching at small distances.” Implementation:
- **"leftmost 1 to 5 columns"**: Each environment draws an integer k ∈ [1,5] once per episode via `randint(blind_min, blind_max+1)`.
- **"remove data":** Build a column mask `col_index < k` and set those leftmost columns to 1.0.
- **Per-episode, per-camera**: k is stored in blind_k and re-rolled only for envs that just terminated, via `reset(env_ids)`, so the blind width is fixed within an episode and independent across parallel envs.
5. **Gaussian Blur**: “**Blur the whole image** using a Gaussian kernel, which removes minor details and further helps bridge the sim-to-real gap.” Implementation:
- Apply torchvision.gaussian_blur with a 3x3 kernel, σ=0.8.

^ implemented in [observations.py](https://github.com/vet3whale/robot_lab/blob/b2w-distillation-training/source/robot_lab/robot_lab/tasks/manager_based/locomotion/velocity/mdp/observations.py)

**Hardware Compatibility**

B2-W ships with 2x Intel RealSense D435i depth cameras, front and rear (from unitree docs).

How Depth Camera was implemented in Isaac Sim using Raycaster + Pinhole Camera

Refer to [multiexpert_teacher_env_cfg.py](https://github.com/vet3whale/robot_lab/blob/320633be03b8cf2fdf4d1e3c0707673c802b5ac2/source/robot_lab/robot_lab/tasks/manager_based/locomotion/velocity/config/wheeled/unitree_b2w/multiexpert_teacher_env_cfg.py):

The two D435i cameras use `RayCasterCameraCfg`, not a rendered camera. A ray-caster shoots one ray per pixel at the terrain mesh and returns the hit distance: 48 x 32 = 1536 rays per camera, cheap enough to scale.

`PinholeCameraPatternCfg` decides where those rays point. It is the only place the optics live. To match hardware we solve for focal length from the [D435i website](https://realsenseai.com/products/depth-camera-d435i/) field of view:

f = aperture / (2 * tan(HFOV / 2)) = 20.955 / (2 * tan(43.5 deg)) = 11.04 cm

Leaving `vertical_aperture` unset gives square pixels from the 48:32 aspect ratio, so the vertical FOV lands at 58 deg. That is the real sensor's FOV with no crop.

Three settings match the real camera:

- `distance_to_image_plane` returns Z depth along the optical axis, like RealSense, not slant range.
- `depth_clipping_behavior="max"` with `max_distance=2.0` sends misses and far hits to the 2 m clip.
- `mesh_prim_paths=["/World/ground"]` casts against terrain only, so the cameras never see the robot's own legs.

Extrinsics come from the URDF, converted to a quaternion in ROS convention: both cameras pitch 45 deg down, front and rear.

`update_period=1/15` runs the sensor at 15 Hz against a 50 Hz policy. Between updates the student reuses the last image, matching the staleness it will see on the robot.

| **Specs** | **Value on paper** | **Code (All found in** [multiexpert_teacher_env_cfg.py](https://github.com/vet3whale/robot_lab/blob/320633be03b8cf2fdf4d1e3c0707673c802b5ac2/source/robot_lab/robot_lab/tasks/manager_based/locomotion/velocity/config/wheeled/unitree_b2w/multiexpert_teacher_env_cfg.py)**)** |
|---|---|---|
| Depth Cameras | 2x D435i at URDF mounts f_dc (+0.42m) and r_dc (-0.42m) → from b2w urdf | `DEPTH_CAM_FRONT_POS = (0.42161, 0.025, 0.061851)` `DEPTH_CAM_FRONT_RPY = (-2.3562, 0.0, -1.5708)` `DEPTH_CAM_REAR_POS = (-0.42244, -0.025, 0.038026)` `DEPTH_CAM_REAR_RPY = (-2.3562, 0.0, 1.5708)` |
| Depth FOV | 87 x 58 deg (based on datasheet, +/- 3deg) | `DEPTH_HFOV_DEG = 87.0` `DEPTH_HORIZONTAL_APERTURE = 20.955  # PinholeCameraPatternCfg default (cm)` `DEPTH_FOCAL_LENGTH = DEPTH_HORIZONTAL_APERTURE / (2 * math.tan(math.radians(DEPTH_HFOV_DEG) / 2))  # ~11.04 cm` |
| Image Size | 48x32 px; 87/48 = 58/32 = 1.81 deg/px, so the full FOV maps with square pixels, no crop | `DEPTH_WIDTH = 48` `DEPTH_HEIGHT = 32` |
| Depth Range | clip at 2 m; pixels under 0.15 m read far (D435i min-Z ~0.105 m at low capture res, so capture at e.g. 424x240) | `DEPTH_MAX_RANGE = 2.0  # paper clips depth at 2 m; keep identical on the robot` `DEPTH_MIN_RANGE = 0.15  # pixels closer than this are treated as empty (read far)` |
| Image Rate | 15 Hz images, 50 Hz policy | `update_period=1 / 15,  # paper Sec. 3.6: images at 15 Hz (do NOT copy the 50 Hz height_scanner)` |

**Training Run**

[https://wandb.ai/vetri-nus/b2w-multiexpert-depth-enabled?nw=nwusere1397899](https://wandb.ai/vetri-nus/b2w-multiexpert-depth-enabled?nw=nwusere1397899)

^ working policy: 2026-07-15_14-19-16_walking_expert_distillation

Overall Convergence:

![](/uploads/blogs/multi_expert_distillation/images/image20.webp)

**mean_reward:** Sum of all weighted reward terms over one 1000-step episode, averaged across environments. Rises 11 to 292 in the first 1000 iterations, then flat for the remaining 25,000. It hits 95% of its final value at iteration 838. Appears that the whole task is solved in the first 3% of the run. Note: the dip at around 6-7k is because the training crashed and was resumed.

Loss Convergence:

![](/uploads/blogs/multi_expert_distillation/images/image13.webp)

**Loss/behaviour:** MSE between student and frozen teacher action, mean((a_student - a_teacher)²) over 12 joints. Measures how much of the teacher survives the observation bottleneck.

Falls 25.9 to 0.35 by iteration 1000, then decays asymptotically: 0.25 at 1142, 0.20 at 1895, 0.17 at 3371, 0.16 at 4270, 0.153 at 26000. This shows that the loss is converging.

Stability and Tracking:

![](/uploads/blogs/multi_expert_distillation/images/image19.webp)



![](/uploads/blogs/multi_expert_distillation/images/image22.webp)

**ang_vel_xy_l2:** Penalty on ω<sub>x</sub>² + ω<sub>y</sub>², squared roll and pitch rate of the base in (rad/s)². Yaw is excluded because yaw rate is commanded. Spikes to -0.227 at iteration 552, then settles to -0.030 by 2000 and converging to -0.027 at 26000.

**error_vel_xy:** Raw ‖v_cmd_xy - v_actual_xy‖ in m/s, base frame. Starts at 0.94, rises to 2.24 at iteration 392, then collapses to 0.30 by 1000 and converges to 0.233 by 26000.

### Stage 3: RL-Finetuning

Following multi-expert distillation, the student policy should be further optimised using RL. During the distillation stage, the student is trained to only imitate the actions produced by the expert. However based on the Rudin et al. (2025) paper, the performance for individual skills can drop and generalisation to unseen terrains is low. 

Rudin et al. (2025) paper’s suggestion was “This problem can be circumvented using three key components: **maximum performance and robustness** of the foundation policy under the action noise added during fine-tuning, conservative tuning of the **RL hyper-parameters**, and efficient **pre-training of the critic network**.”

**Training:**

Before fine tuning the actor, pretrain the critic, since during distillation we only train the actor. This means we still run PPO but we don't let the gradients propagate back to the actor and let the critic train first, then after some iterations unfreeze the actor and continue to finetune the actor.

**Phase A**: Frozen Actor, Random init critic is trained. ONLY load actor from student distillation.

**Phase B:** Unfreeze Actor, Load in Critic from Phase A (Backpropagate to the actor after the critic has stabilised, and gives more accurate rewards)

Introduced 3 flags: ([train.py](https://github.com/vet3whale/robot_lab/blob/410489efac06723971750e3d41f8f471bcee4518/scripts/reinforcement_learning/rsl_rl/train.py))

- `--init_actor_from <checkpt>`: Loads weights into PPO actor from student checkpt file
- `--init_critic_from <checkpt>`: Use this after Phase A to load in trained critic
- `--freeze_actor` : Freeze actor 
   - “`parameter.requires_grad_(False)`“ → pytorch function to freeze actor
   - “`runner.alg.schedule = "fixed"`” → keep LR during this period the same.

**Terrain:**

No new terrains have been added.

| Sub-terrain | Perc. | Expert (v1) | Fine-Tune | Row 0 | Top Row |
|---|---|---|---|---|---|
| mesh_stairs_inv | 30% | (0.05, 0.05) | (0.05, **0.10**) | 5 cm | 10 cm |
| hf_stairs_inv | 30% | (0.05, 0.05) | (0.05, **0.10**) | 5 cm | 10cm |
| hf_slope_inv | 20% | (0.176, 0.176) | (0.176, **0.29**) | 10<sup>∘</sup> | 16<sup>∘</sup> |
| discrete_obstacles | 20% | (0.05, 0.15) | (0.05, **0.20**) | 15 cm | 20 cm |

**Outcome:**

2 Training runs were done for the RL Finetuning. 
View Appendix B for the PPO Hyperparameters used for 2 runs.

The PPO Hyperparameters were tuned for this Finetuning section. Following are the terms that were tuned and the reasons:

**Run 1:** 

- Set init_noise_std ≈ 0.1–0.2 to match the distilled student
   - `actor = copy.deepcopy(UnitreeB2WMultiExpertDistillationRunnerCfg.student)`
^ Means actor also inherits the 0.1 from distilled student ([rsl_rl_ppo_cfg.py](https://github.com/vet3whale/robot_lab/blob/410489efac06723971750e3d41f8f471bcee4518/source/robot_lab/robot_lab/tasks/manager_based/locomotion/velocity/config/wheeled/unitree_b2w/agents/rsl_rl_ppo_cfg.py) →[rsl_rl_multiexpert_distillation_cfg.py](https://github.com/vet3whale/robot_lab/blob/410489efac06723971750e3d41f8f471bcee4518/source/robot_lab/robot_lab/tasks/manager_based/locomotion/velocity/config/wheeled/unitree_b2w/agents/rsl_rl_multiexpert_distillation_cfg.py))
- `desired_kl = 0.01` →`desired_kl = 0.005`
   - desired_kl is the target KL divergence between the policy before and after an update; the adaptive schedule raises or lowers the LR to hold KL near it. It is the size of the trust region. 
   - Halving it halves how far the policy is allowed to move per update, since the actor arrives already well-established from imitating the expert policy.
   - The default 0.01 permits steps large enough to overwrite inherited behavior.
- `LR = 1e-3` →`LR = 1e-4`
   - 1e-3 is a from-scratch value, sized for random initial weights where large steps are free. Here the gradient lands on top of a trained actor, so the same step size is destructive. 
   - Same reasoning as desired_kl, applied to the other knob that controls step size.

**Run 2 (changes were done on top of Run 1):**

- Entropy Coef = 0.01 → 1e-4
   - Done to kill the entropy inflation. This was hypothesised to flatten Policy/mean_std and stop the reward decline.
- Phase B’s LR schedule is fixed && LR = 1e-4 →3e-5
   - Take the LR out of the controller's hands. 
   - Pin schedule="fixed" at 1e-5 to 5e-5, or keep adaptive and tighten desired_kl to ~0.003. Either way the LR stops drifting on a KL signal that the inflating std has already corrupted.

Why it might have failed?:

- Run 1: Although the evaluation script gave a success rate of 96.1%, the mean_reward was diverging, which could mean it is still exploring and is getting penalised more.
- Run 2: The mean_reward was converging/stabalised here, but the entropy was decreasing and when the evaluation script was run, on the policy, it underperformed Run 1. It only scored 77.0%

**Future Work:**

1. **PPO Hyperparameters** should be further studied and understood before tweaking it for finetuning. Exploration vs Reward Optimisation.
2. **Terrain Config**: For a single expert distillation, we kept the same terrain configuration used for walking policy expert. For multi-expert distillation, we should use a terrain configuration that is a combination of all of the experts.
3. **Reward System:** With multi-expert, reward system should also be tweaked to ensure that it serves as a middle ground for PPO training the student  

**Training Run**

[https://wandb.ai/vetri-nus/b2w_student_finetune?nw=nwusere1397899](https://wandb.ai/vetri-nus/b2w_student_finetune?nw=nwusere1397899)

View Appendix B for the PPO Hyperparameters.

Phase A - Overall Convergence:

![](/uploads/blogs/multi_expert_distillation/images/image12.webp)

**mean_reward** is the undiscounted return summed over one episode, averaged over 512 envs. Run 1: 290.5, Run 2: 291.2. A tie by construction: the actor is frozen, so reward cannot move after ~iteration 45, and any difference here is env noise.

Phase A - Loss Convergence:

![](/uploads/blogs/multi_expert_distillation/images/image15.webp)

**Loss/value** is the critic's mean squared error predicting the discounted return. Run 1 converges to 0.136, Run 2 to 0.141, same place. Run 2's lower LR is slower to warm up (2.05 vs 1.21 over the first 200 iterations) but the gap closes by iteration ~1000, so 4000 iterations is ~3000 wasted in both.

**Loss/entropy** is the negative entropy of the action distribution; entropy rises with the Gaussian's std. Constant at -14.1383 in both runs. The frozen actor cannot change its std, so this metric carries zero information in Phase A.

Phase A - Stability and Tracking:

![](/uploads/blogs/multi_expert_distillation/images/image24.webp)



![](/uploads/blogs/multi_expert_distillation/images/image17.webp)

**ang_vel_xy_l2** is the penalty on squared roll and pitch rate of the base; neither is commanded, so it measures unwanted body rocking. Run 1: -0.0339, Run 2: -0.0330. This is the frozen-actor baseline, the number Phase B must not degrade.

**error_vel_xy** is the absolute error between commanded and achieved base linear velocity, m/s. Run 1: 0.342, Run 2: 0.335. Identical; this is the inherited distilled student's tracking, unmodified.

Phase B - Overall Convergence:

![](/uploads/blogs/multi_expert_distillation/images/image7.webp)

**mean_reward** - Run 1 ends at 269.9, Run 2 at 291.3. Both peak at ~299 near iteration 50; Run 1 then decays monotonically (293 → 287 → 279 → 274 → 270), losing 10% over 10k iterations, while Run 2 holds 291-293 flat. Run 1 did not converge, it diverged slowly.

Phase B - Loss Convergence:

![](/uploads/blogs/multi_expert_distillation/images/image18.webp)

**Loss/entropy** - the entropy bonus pushes std up, the reward gradient pushes it down, and whichever wins sets the final policy. Run 1 ends at +24.0, Run 2 at -28.9. Run 1's entropy_coef=0.01 beat the reward gradient; Run 2's 1e-4 let the reward gradient win, which is what you want when fine-tuning an already-competent student.

**Loss/value** - Run 1: 0.105, Run 2: 0.098, essentially tied. The trap: Run 1's critic was accurately predicting a policy that was getting worse, so value loss never flagged the failure. Do not use it as an actor health check.

Phase B - Stability and Tracking:

![](/uploads/blogs/multi_expert_distillation/images/image14.webp)



![](/uploads/blogs/multi_expert_distillation/images/image10.webp)

**ang_vel_xy_l2** - Run 1: -0.165, Run 2: -0.041. Run 1 is 4.9x worse than the frozen-actor baseline (-0.034) and Run 2 is barely above it. Run 1's chassis is rocking; on hardware that is heat in the actuators and a base that will not hold attitude.

**error_vel_xy** - Run 1: 0.318, Run 2: 0.295. Both are at or better than the Phase A baseline of ~0.34, so straight-line speed tracking survived in both. Run 2's 0.295 is the best of all four runs and the only genuine gain from unfreezing the actor.

### Stage 4: Evaluation

The Rudin et al. (2025) used the following method to compute: “the average success rate computed by collecting 1000 roll-outs in simulation on randomized terrains at 90% of the maximum training difficulty”

An evaluation script called [evaluate.py](https://github.com/vet3whale/robot_lab/blob/b2w-distillation-training/scripts/evaluation/evaluate.py) was implemented.

Algorithm:

1. **resolve_checkpoint(--policy)** → give name (find path from name) or path to the run to test (find policy from run)
2. **load_actor_weights(checkpoint)** → pulls actor weights out
3. **build_agent_cfg(is_depth_student)** →find the checkpoint’s architecture/config and rebuild
4. **build_env_cfg(is_depth_student)** →find the defined terrain env, to test the policy on.
5. **gym.make(...)** →generate terrain meshes 
6. **place_envs_across_patches(env)** →override original terrain’s original terrain.env_orgins, to spread the robots evenly across the 10x20 patch grid
7. **env.reset()** →robots spawn at those origins 
8. **wrap + build_policy(...)**→ builds actor network by: 1) architecture from agent config 2) input widths from selected obs groups 3) output width from action count → all using OnPolicyRunner.__init__ 
9. **rollout(env, policy)** →monitor the actions of the policy, whether fell, completed, or dnf
10. **success = reached & ~fell**
11. **report(...)**→convert to .csv and create evaluation_table.csv

Flags:

| **Flag** | **Values** | **Default** |
|---|---|---|
| `–policy` | expert, student, student_finetune, or a path to a model_*.pt | required |
| `–terrain` | finetune, rough_v1, rough_v0 | finetune |
| `–num_envs` | robots to rollout | 1000 |
| `–gui` | watch evaluation in GUI | off |

Constants: 

| **Constant** | **Value** | **Description** |
|---|---|---|
| `COMMAND` | (0.6, 0, 0) | Training range is (-1, 1), so choose in between |
| `EPISODE_S` | 20 | - |
| `GOAL_FRACTION` | 0.5 | Since spawn from centre, the robot has to clear half the total width of the task |
| `DIFFICULTY` | 0.9 | - |
| `NUM_ROWS/COLS` | 10/20 | 1000 robots training in parallel would mean 5 robots in each grid. |
| `FALLEN_GRAVITY_Z` | -0.3 | Threshold to determine which stage is considered as the robot has fallen. z = -1 (upright), z = 0 (on its side), z = 1 (inverted) → cos θ = 0.3, about 72° of tilt |

Terrain:

| Parameter | Finetune (train) | Finetune (**test**) |
|---|---|---|
| Inverted Pyramid Stairs (Up) | (0.05, **0.10**) | 9.5 cm |
| Sloped pyramid (up) | (0.176, **0.29**) | 0.279 (16<sup>∘</sup>) |
| Discrete obstacles / boxes | (0.05, **0.20**) | 18.5 cm |

^Difficulty is 90% of Student Fine-tune Terrain Config

![](/uploads/blogs/multi_expert_distillation/images/image26.webp)

### Benchmarking

An evaluation script as described in Stage 4: Evaluation, was used to get the following metrics:

| Terrain | Expert success | Student Success | Student Fine Tune Success (run1) | Student Fine Tune Success (run2) |
|---|---|---|---|---|
| finetune | 93.3 % | 82.8% | 96.1% | 77.0% |
| rough_v0 (OOD) | 75.1 % | 67.1 % | 75.8 % | 70.7% |

1000 robots were tested at 90% difficulty of the Student Finetune Terrain and Rough_V0 terrain.

Finetune Terrain

| Parameter | Percentage | Finetune (train) | Finetune (**test**) |
|---|---|---|---|
| Inverted Pyramid Stairs (Up) | 60 % | (0.05, 0.10) | 9.5 cm |
| Sloped pyramid (up) | 20 % | (0.176, 0.29) | 0.279 (16<sup>∘</sup>) |
| Discrete obstacles / boxes | 20 % | (0.05, 0.20) | 18.5 cm |

Rough V0

| Parameter | Rough_V0 (train) | Rough_V0 (**test**) |
|---|---|---|
| Pyramid Stairs (Down) | (0.05, 0.23) | 21.2 cm |
| Inverted Pyramid Stairs (Up) | (0.05, 0.23) | 21.2 cm |
| Sloped pyramid (up) | (0.0, 0.40) | 0.360 (19.8<sup>∘</sup>) |
| Inverted sloped pyramid (down) | (0.0, 0.40) | 0.360 (19.8<sup>∘</sup>) |
| Discrete obstacles / boxes | (0.05, 0.20) | 18.5 cm |
| Random rough | (0.02, 0.10) | Unchanged by difficulty |

## Appendix A — Future Work

- Task 1: Find base PID for Unitree B2W to stabilise after deployment. Done by reading ‘topic echo /sportsmodestate’. Refer to this repo: [https://github.com/unitreerobotics/unitree_ros2](https://github.com/unitreerobotics/unitree_ros2)
- Task 2: Deploy trained student/teacher policy on B2W
- Task 3: Benchmark the terrains B2W underperforms, by stress testing on different terrains, both outdoors and indoors.

## Appendix B — Parameters used

**Reward System for Expert training and Student-Finetuning:**

| **Active reward functions** |  |  |  |  |
|---|---|---|---|---|
| **No.** | **Function** | **Description** | **Thresholds** | **Weight** |
| 1 | track_lin_vel_xy_exp | Rewards the robot for matching the commanded forward/sideways ground velocity. | 𝜎 = √ 0.25 ≈ 0.5 | 3.0 |
| 2 | track_ang_vel_z_exp | Rewards the robot for matching the commanded turning rate about the vertical axis. | 𝜎 = √ 0.25 ≈ 0.5 | 1.5 |
| 3 | joint_power | Penalizes using too much leg joint power, encouraging energy-efficient motion. | - | -1e-5 |
| 4 | stand_still | Penalizes unnecessary leg motion when the robot is supposed to stay still. | c<sub>th</sub>=0.1 | -2.0 |
| 5 | joint_pos_penalty | Penalizes leg joint positions that are undesirable or too far from preferred posture. | v<sub>th</sub>=0.5, c<sub>th</sub>=0.1, s=5.0 | -1.0 |
| 6 | joint_mirror | Encourages left-right diagonal leg symmetry in motion. | - | -0.05 |
| 7 | feet_contact_without_cmd | Rewards or favors feet staying in contact when there is no strong motion command. | c<sub>th</sub>=0.1 | 0.1 |
| 8 | upward | Rewards keeping the body oriented upright. | - | 3.0 |
| 9 | lin_vel_z_l2 | Penalizes vertical body velocity, so the robot avoids bouncing up and down. | - | -2.0 |
| 10 | ang_vel_xy_l2 | Penalizes rolling and pitching angular velocity, encouraging a more stable body. | - | -0.05 |
| 11 | undesired_contacts | Penalizes contacts from body parts that should not hit the ground or environment. | F<sub>th</sub>=1.0 | -1.0 |
| 12 | contact_forces | Discourages hard impacts, encourages soft landings. | F<sub>th</sub>=100.0 | -1.5e-4 |
| 13 | joint_torques_l2 | Penalizes leg joint torques (effort/actuator load). | - | -1e-5 |
| 14 | joint_acc_l2 | Penalizes leg joint accelerations (jerky leg motion). | - | -1e-7 |
| 15 | joint_acc_wheel_l2 | Penalizes wheel joint accelerations. | - | -2.5e-10 |
| 16 | joint_pos_limits | Penalizes leg joint positions violating soft limits. | - | -5.0 |
| 17 | action_rate_l2 | Penalizes large step-to-step action changes (smoothness). | - | -0.01 |

**PPO Hyperparameters for Expert training and Student-Finetuning:**

| **Hyperparameter** | **Explanation** | **rsl-rl (expert)** | **rsl-rl (finetune-student) Run 1** | **rsl-rl (finetune-student) Run 2** |
|---|---|---|---|---|
| **Objective / Advantage** |  |  |  |  |
| Discount γ | how strongly future rewards count | 0.99 | 0.99 | 0.99 |
| GAE λ | controls GAE bias-variance trade-off | 0.95 | 0.95 | 0.95 |
| Clip ε | width of PPO’s clipping band | 0.2 | 0.2 | 0.2 |
| Advantage Norm | keeps advantage scale stable | Global | Global | Global |
| **Optimisation** |  |  |  |  |
| Learning Rate | actor and critic LR | 1.0e-3 | **1.0e-4** | **3.0e-5** |
| LR schedule | how learning rate changes | schedule=”adaptive” | **Phase A: schedule=”fixed”** **Phase B: schedule=”adaptive”** | **Phase A: schedule=”fixed”** Phase B: schedule=”fixed” |
| KL target | desired limit of policy drift | desired_kl=0.01 | **desired_kl=0.005** | desired_kl=0.005 |
| Learning epochs K | passes over one rollout batch | num_learning_epochs=5 | num_learning_epochs=5 | num_learning_epochs=5 |
| Minibatches M | chunks used during each batch pass | num_mini_batches=4 | num_mini_batches=4 | num_mini_batches=4 |
| Updates per rollout | optimiser steps from one rollout | 5×4=20 joint steps (i.e. grad steps) | 5×4=20 joint steps (i.e. grad steps) | 5×4=20 joint steps (i.e. grad steps) |
| Gradient Clip c | max. Permitted gradient norm | max_grad_norm=1.0 | max_grad_norm=1.0 | max_grad_norm=1.0 |
| Value loss coef c<sub>v</sub> | weight placed on critic loss | value_loss_coef=1.0 | value_loss_coef=1.0 | value_loss_coef=1.0 |
| Entropy coef c<sub>e</sub> | strength of exploration bonus | entropy_coef=0.01 | entropy_coef=0.01 | **entropy_coef=1.0e-4** |
| Value clipping | clips the critic-update objective | use_clipped_value_loss=True | use_clipped_value_loss=True | use_clipped_value_loss=True |
| **Data Collection** |  |  |  |  |
| Parallel Environment | no. of env run in parallel | num_envs=4096 | num_envs=512 (because GPU heavy) | num_envs=512 (because GPU heavy) |
| Rollout Length | data collection before updating | num_steps_per_env = 24 per environment | num_steps_per_env = 24 per environment | num_steps_per_env = 24 per environment |
| Max Episode Length | longest duration of one episode | episode_length_s = 20.0, sim.dt = 0.005, step_dt = decimation*sim.dt → no. of steps = episode_length_s / step_dt = 20.0/(0.005*4) = 1000 policy steps | episode_length_s = 20.0, sim.dt = 0.005, step_dt = decimation*sim.dt → no. of steps = episode_length_s / step_dt = 20.0/(0.005*4) = 1000 policy steps | episode_length_s = 20.0, sim.dt = 0.005, step_dt = decimation*sim.dt → no. of steps = episode_length_s / step_dt = 20.0/(0.005*4) = 1000 policy steps |
| Training Length | number of collect-and-update iterations | max_iterations=5000 | max_iterations=10000 | max_iterations=10000 |
| **Policy** |  |  |  |  |
| Initial Policy Std | intial amount of action randomness | init_noise_std=1.0 | distribution_cfg.init_std=0.1 | distribution_cfg.init_std=0.1 |
