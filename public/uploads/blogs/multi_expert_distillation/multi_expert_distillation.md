---
author: Vetrivel Karthikeyan
---

A search-and-rescue site is rarely one kind of ground. A robot might cross rubble, climb a broken stair, roll down a smooth corridor and step over debris, all within a few minutes. Wheeled quadrupeds suit that mix: wheels when the floor is flat, legs when it isn't. Training one controller that handles all of it is harder than training a controller for any single terrain.

This post describes the framework we built for that. We train a separate expert policy per terrain family with PPO in simulation, then distil the experts into one student policy that runs on the robot. The framework itself is meant to be the reusable part, so that the next robot or the next terrain is a configuration change rather than a new codebase.

> **TODO (Vetrivel):** name the robot (or robots) this targets, and say whether the results here are simulation only or include hardware.

## Why not train one policy on everything?

You can, and it is the obvious first attempt. Our working assumption is that the single policy tends to settle on a compromise gait that is mediocre everywhere. The reward terms that make stair climbing work pull against the ones that make flat-ground rolling efficient, and the curriculum has to keep every terrain in play at once.

> **TODO (Vetrivel):** is this what we actually saw? If there is a baseline run of a single policy trained on the full terrain set, its numbers belong here, since it is the comparison the whole approach rests on.

Splitting the problem lets each expert specialise. The cost is that you now have several policies and a robot that can only run one, which is where distillation comes in.

## The experts

There are five experts, one per stage of the terrain curriculum.

> **TODO (Vetrivel):**
> - Simulator and RL library (for example Isaac Lab with rsl_rl), number of parallel environments, training time per expert.
> - The five terrain families and what each expert is trained on.
> - Observation and action spaces. Do experts get privileged information (height scans, friction, contact states) that the student will not?
> - The reward terms that differ between experts, and any that are shared.
> - How the curriculum advances, for example by terrain difficulty level as success rate rises.

## Distilling into one student

> **TODO (Vetrivel):**
> - Distillation method: behaviour cloning on expert rollouts, DAgger-style online distillation, or something else. Why that one?
> - How the student knows which expert to imitate on mixed terrain. Does it get a terrain label, or does it infer from proprioception and perception alone?
> - Student architecture (MLP, recurrent, history encoder) and what it observes.
> - What the student loses relative to each expert, and whether it gains anything on transitions between terrains.

## Built to scale

> **TODO (Vetrivel):** what "standard framework" means in practice. How a new terrain, robot or reward is added; how runs are configured and launched; what is logged. A short snippet of a config file would show this better than prose.

## Results

> **TODO (Vetrivel):** per-terrain comparison of the experts, the student, and the single-policy baseline. Success rate, traversal speed, falls, energy, or whichever metrics you tracked. Include the number of seeds or evaluation episodes behind each figure. A short video of the student crossing a mixed course would be the best thing on the page.

## What comes next

> **TODO (Vetrivel):** sim-to-real status and plans, terrains still missing from the curriculum, and anything you would change about the setup if you started again.
