---
layout: blog
title: "Title Index: Paper-Title Search for EDA / Arch / Circuits"
date: 2026-09-28 00:00:00 +0000
tags:
  - EDA
  - tools
---

**[Title Index](/title-index/)** is a small search tool I built for quickly checking what has been published at top EDA, computer architecture, and circuits venues. It covers about **17,100 papers from 2024–2026**.

**Venues covered**

- **EDA**: DAC, ICCAD, DATE, ASP-DAC, ISPD, TCAD, TODAES
- **Architecture**: ISCA, MICRO, HPCA, ASPLOS, IEEE TC, IEEE TPDS, ACM TACO
- **Circuits**: ISSCC, JSSC, CICC, ESSCIRC/ESSERC, A-SSCC, VLSI Symposium, ISCAS, ISVLSI, GLSVLSI, IEEE TVLSI

**Features**

- Keyword search with `"exact phrase"`, `-exclude`, and `A OR B` syntax (space means AND)
- Optional prefix matching (e.g. `llm` also matches `llms`) and author search
- Filters by domain, venue, and year, plus a per-domain/year histogram of the matches
- Each result links to its DOI

Everything runs in the browser from a static JSON file, so searches are instant and no server is involved. Handy for literature surveys or for checking whether an idea has been done before.

👉 [Open Title Index](/title-index/)
