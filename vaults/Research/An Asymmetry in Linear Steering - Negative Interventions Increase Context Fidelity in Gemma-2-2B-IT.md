---
layout: post
title: "An Asymmetry in Linear Steering: Negative Interventions Increase Context Fidelity in Gemma-2-2B-IT"
date: 2025-12-29 21:30:00 +0400
categories:
  - AI
  - MechInterp
tags:
  - AI
  - MechInterp
---
I experimented with steering vectors to see if I could affect paltering (using true but misleading statements) behavior in Gemma-2-2B-IT.

I got asymmetric result: a steering vector in Layer 10 for residual stream worked well for decreasing paltering, didn't work well for increasing. For safety this is good, but it probably hints that I made some mistakes.

This generalizes for both paltering to convince you that bad thing is actually good, and for convincing you that good thing is actually bad.

- [Paper](https://docs.google.com/document/d/1Vw4ZY1DxN2hUvMdVbpvp3_X6_eBcXXBQgiywfA4ZUSA/edit?usp=sharing)
- [Repo](https://github.com/nikakogho/gemma2-context-fidelity-steering)
