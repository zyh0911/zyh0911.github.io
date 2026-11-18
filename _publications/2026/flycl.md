---
title:          "FlyCL: Memory-efficient Sparse Forward-only Continual Learning"
date:           2026-11-17 00:00:00 +0000
selected:       true
pub:            "Design, Automation & Test in Europe Conference (DATE)"
pub_pre:        ""
pub_date:       "2027"
cover: /assets/images/covers/flycl.jpg
abstract: >-
  Continual learning (CL) enables AI models to incrementally adapt to new tasks, but remains challenging to deploy efficiently on edge platforms due to the high memory and computational demands of backpropagation. In this work, we propose FlyCL, the first memory-efficient, sparse, forward-only CL framework for pre-trained models (PTMs), which optimizes adapters purely through forward passes and updates the second multi-layer perceptron (MLP) projections and the classifier using closed-form solutions. For the first session, FlyCL computes the Gram matrix of the hidden activations, uses it to perform structured pruning on the backbone, and trains adapters with zeroth-order (ZO) optimization. For the next tasks, FlyCL updates the Gram matrix, the compensated projections, and the classifier in closed form to achieve task-specific adaptation. Extensive experiments show that FlyCL achieves up to 11.7× training memory reduction over state-of-the-art (SOTA) CL methods while pruning 30% of the backbone MLP channels; it stays within 0.8% of the most accurate baseline on CIFAR-100, surpasses it by 3.1% on ImageNet-R, and reduces the inference time by 17%–69%. On the same edge hardware with limited memory resources, FlyCL extends the maximum supported trainable model from ViT-base to a ∼3.6× larger ViT-large model, whereas traditional CL methods fail due to much larger memory requirements.
authors:
  - Yihang Zuo
  - Wanhao Yu
  - Asmer Hamid Ali 
  - Li Yang 
  - Deliang Fan
links:
    # paper: https://arxiv.org/abs/xxxx.xxxxx
    pdf: /assets/pdf/FlyCL.pdf
---
