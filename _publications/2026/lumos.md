---
title:          "LUMOS: A Monolithic 3D 2T0C MoS₂ eDRAM-based Lookup Table CIM Accelerator with Dual-Side Compression"
date:           2026-11-17 00:00:00 +0000
selected:       true
pub:            "Design, Automation & Test in Europe Conference (DATE)"
pub_pre:        ""
pub_date:       "2027"
cover: /assets/images/covers/lumos.jpg
abstract: >-
  Digital compute-in-memory (DCIM) accelerators improve the energy efficiency of large language model (LLM) inference by placing the computing logic within the memory array. However, existing DCIM designs share three limitations in LLM inference: a large, energy-hungry adder tree, a mismatch with the matrix-vector multiplication (GEMV) in the decoding phase, and limited on-chip capacity. This paper presents LUMOS, a monolithic 3D 2T0C MoS₂ eDRAM-based lookup table (LUT) accelerator with dual-side compression, co-designed across the device, algorithm, and architecture levels. At the device level, we fabricate MoS₂ transistors and calibrate a SPICE model against their measured characteristics; the resulting cell and array simulations show high density, low access energy, and long retention. At the algorithm level, LUMOS compresses the weights via vector quantization (VQ), which also reformulates decoding from GEMV to matrix multiplication, and applies 4:8-structured input sparsity to reduce bandwidth and memory demand. At the architecture level, every multiplication becomes a table lookup followed by a shallow adder tree, and the working set of a layer stays on the die. LUMOS achieves 37.7 TFLOPS/W and 9.59 MB/mm² effective on-die memory density, 1.91×–8.51× more energy-efficient than state-of-the-art DCIM macros. By holding a Qwen3-30B-A3B block on 38 cores, it decodes with zero off-chip weight traffic, 10.4× faster and 275× more energy-efficiently than the streaming VQ accelerator EVA on the same 2-bit model.
authors:
  - Yihang Zuo
  - Anna Bethke
  - Asmer Hamid Ali
  - Jing Xie 
  - Ivan Sanchez Esqueda
  - Deliang Fan
links:
    # paper: https://arxiv.org/abs/xxxx.xxxxx
    # pdf: /assets/pdf/LUMOS.pdf
---
