---
layout: post
title: Dreamscape Grove - grow a forest with focus
date: 2025-06-15 12:00:00 +0400
categories:
  - Neuroscience
tags:
  - Neuroscience
---
> *“What if the only controller you needed was your own mind?”*

I just released **Dreamscape Grove**, a Windows stand-alone game that lets you cultivate a low-poly forest **purely by staying focused**, using **neurofeedback** to train your focus.  

- [Here](https://youtu.be/EU_obsIUCwc) is the dev-diary video walkthrough and a link to try it yourself.
- [Here](https://github.com/nikakogho/DreamscapeGrove) is the GitHub repo for source code.

## What’s neurofeedback, anyway ? 🧠
BCI 101 – EEG headsets pick up tiny voltage changes when millions of neurons fire together.

Focus metric – A simple ratio of theta : beta bands correlates with attention.

Neurosity Crown already streams a focus value (0-1) that updates ~4 Hz – perfect for real-time feedback.

## How Dreamscape Grove works 🌲
focus-osc-bridge.js logs into the Crown, rebroadcasts /focus.

FocusManager in Unity updates every frame.

TreeSpawnController spawns saplings while focus > threshold; neglect shrinks the forest.

## Try it!
Download latest DreamscapeGrove Windows ZIP from [here](https://github.com/nikakogho/DreamscapeGrove/releases).

Install Node 18, set CROWN_ID / EMAIL / PWD (see DreamscapeGrove_Windows_Setup.md).

Run DreamscapeGrove.exe, choose Neurosity Crown (SDK) in settings, and grow.

No Crown? Select Mock device to drive the forest with a sine-wave focus demo.

## Roadmap
0 .6 ▶ Dev-log series & WebGL teaser

0 .7 ▶ In-game credential UI

0 .8 ▶ Raw EEG → custom focus DSP
