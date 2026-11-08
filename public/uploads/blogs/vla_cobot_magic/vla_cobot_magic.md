---
author: Krishna
---

Vision-language-action models are trained on someone else's robot. To run one on yours, you either finetune it on your own demonstrations or make your robot look enough like the training robot that the model can't tell the difference. We took the second route with the AgileX Cobot Magic. This post covers the bridge we wrote between its ROS1 stack and Physical Intelligence's [openpi](https://github.com/Physical-Intelligence/openpi), and the policy router that sits on top.

The short version: openpi policies run on the Cobot Magic for single-arm table-top tasks with no finetuning, as long as the observations reaching the model match what it was trained on.

Getting that match right was most of the work.

## The robot

The Cobot Magic is AgileX's take on the Mobile ALOHA design: two arms, wrist cameras, and a head camera, driven through ROS1. Because the openpi models were trained partly on ALOHA-style data, the hardware is close to their training distribution. Close, not identical, and the gap is where things broke.

> **TODO (Krishna):** what "split type" means for this unit, the arm and gripper models, camera models and placement, and any differences from the ALOHA setup that you had to compensate for.

## Why openpi

openpi publishes pretrained checkpoints and runs inference as a policy server. A client sends an observation and gets back a chunk of future actions. That split matters here, because ROS1 and openpi don't want to live in the same Python environment, and a network boundary between them sidesteps the conflict.

> **TODO (Krishna):** which checkpoints you used (π0, π0-FAST, π0.5, base or ALOHA-tuned) and why. Confirm the Python version constraint is the reason for the split, or give the real one.

## The bridge

The bridge subscribes to the robot's ROS1 topics, assembles them into the observation dictionary the policy expects, sends it to the server, and turns the returned action chunk back into arm commands.

> **TODO (Krishna):**
> - The topic-to-observation mapping: which camera topics feed which image keys, how joint states are ordered and normalised, gripper representation.
> - How you synchronise images and joint states, and what happens when one arrives late.
> - How the action chunk is executed: rate, how many steps before requerying, any smoothing or temporal ensembling.
> - Safety limits on the command side.
>
> A table of topic → observation key would be the clearest way to show the first point. A diagram of the full loop could replace the tile thumbnail or sit here.

## The policy router

> **TODO (Krishna):** what the router does and what "test-time adaptable" means in this setup. Does it pick between checkpoints or prompts per task, adjust something at inference, or switch arms? How is the choice made?

## What worked, and what didn't

> **TODO (Krishna):** the tasks you tried, with success counts out of N trials for each. Failure cases worth describing: lighting, camera angle drift, objects outside the training distribution, grasp failures. If anything needed a fix you did not expect, such as a flipped camera or a joint offset, that is the most useful thing a reader could take from this post.

## Next steps

> **TODO (Krishna):** two-arm tasks, finetuning on our own demonstrations, or the mobile base. And whether the bridge is something others could reuse, with a link if it is public.
