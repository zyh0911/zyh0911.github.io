---
title:          "PRISM: A Programming-Free On-Device Multi-task Adaptation Framework for ReRAM-based Computing-in-Memory Accelerator"
date:           2026-07-11 00:00:00 +0000
selected:       true
pub:            "ACM/IEEE International Conference on Computer-Aided Design (ICCAD)"
pub_pre:        ""
pub_date:       "2026"
cover: /assets/images/covers/prism.jpg
abstract: >-
  Resistive random-access memory (ReRAM) crossbar arrays, known for high parallelism and energy efficiency, have been widely adopted to accelerate neural network (NN) inference. However, enabling on-device training on ReRAM-based accelerators remains challenging due to their high programming energy, voltage, and limited endurance. In this paper, we propose PRISM, a novel ReRAM programming-free on-device multi-task adaptation framework, enabling task adaptation via novel lightweight task-specific attribute prompt generation and step mask learning, with ultra-lightweight hardware and memory overhead, and eliminating energy-intensive ReRAM cell reprogramming. Specifically, PRISM first builds a task-specific attribute library using the frozen backbone model deployed in ReRAM by clustering representative features from a subset of the target new task dataset. Then, it computes the correlation between each input and the attribute library to generate a prefix prompt embedding. In addition, PRISM learns a novel crossbar column-wise and hardware-friendly step mask for each new task while keeping the backbone fixed. Extensive experiments show that the total training energy of PRISM is only 0.03% of that of all-parameter fine-tuning, with only 3.9% area overhead. Moreover, compared with the state-of-the-art multi-task adaptation method, PRISM improves accuracy by an average of 3.6% in the DeiT transformer model for standard multi-task adaptation datasets.
authors:
  - Yihang Zuo
  - Wanhao Yu
  - Asmer Ali
  - Li Yang
  - Deliang Fan
links:
    # paper: https://arxiv.org/abs/xxxx.xxxxx
    # Code: https://github.com/xxx
---

