---
title:          "Dominant-Layer ZO: A Single Layer Dominates Zeroth-Order Fine-Tuning of LLMs"
date:           2026-07-11 00:00:00 +0000
selected:       true
pub:            "Conference on Neural Information Processing Systems (NeurIPS)"
pub_pre:        ""
pub_date:       "2026"
cover: /assets/images/covers/dlzo.png
abstract: >-
 Zeroth-order (ZO) optimization enables memory-efficient fine-tuning of large language models (LLMs) using only forward passes, but it remains unclear how useful adaptation is distributed across layers. In this work, we reveal a surprising phenomenon: ZO fine-tuning is sharply dominated by a single decoding layer. Across multiple LLM families and downstream tasks, fine-tuning this dominant layer alone consistently matches or even exceeds full-model ZO fine-tuning. We further show that the dominant layer is task-agnostic but model-specific, and can be identified before training through a simple inference-only analysis of activation outliers. Specifically, the dominant layer consistently aligns with the first activation-outlier layer in the pre-trained model. To explain this phenomenon, we analyze how perturbation effects propagate under ZO optimization. We find that the dominant layer combines two key properties: high perturbation sensitivity and early placement in the residual stream, allowing perturbation-induced effects to propagate and accumulate through remaining subsequent decoding layers. As a result, this layer produces disproportionately strong and stable optimization signals under forward-only updates. Extensive experiments on LLaMA2-7B and Qwen3-8B across nine benchmarks show that dominant-layer ZO fine-tuning improves average performance over full-model MeZO and LoRA-based ZO fine-tuning while achieving up to 4.52 training speedup.
authors:
 
  - Wanhao Yu
  - Ziyan Wang
  - Zheng Wang
  - Abeer Matar Almalky
  - Yihang Zuo
  - Shuteng Niu
  - Sen Lin
  - Adnan Siraj Rakin
  - Deliang Fan
  - Li Yang
links:
    paper: https://arxiv.org/pdf/2606.05516
    # Code: https://github.com/xxx
---

