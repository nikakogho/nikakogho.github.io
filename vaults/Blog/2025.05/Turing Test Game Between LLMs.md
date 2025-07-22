---
layout: post
title: Turing Test Game Between LLMs
date: 2025-06-08 04:00:00 +0400
categories:
  - Philosophy
  - AI
tags:
  - AI
  - TuringTest
---
What happens if we make 2 LLMs talk to each other, one tasked with pretending to be human, other tasked with guessing if it’s talking to a human or AI? 
Does the interrogator always guess right that it talks to AI? Does it always guess wrong and assume it talks to a human? Does it depend on a model? Let’s see.

## First Game
one pretends to be human, wins if it convinces the detective that it is human.
Detective wins if it correctly guesses whether it’s talking to human or AI.

GPT o3 vs Gemini 2.5 Pro

### Results
GPT beats Gemini both at pretending to be a human and at telling that it’s talking to an AI.

### Full Conversations
https://nikakogho.github.io/#/nexus/notes/horizon/ai/turing-test/turing-test-gpt-o3-vs-gemini-25-pro

## Second game
same rules, but now
GPT o3 vs DeepSeek R1

### Results
GPT beats DeepSeek in both pretending and detecting.

### Full conversations
https://nikakogho.github.io/#/nexus/notes/horizon/ai/turing-test/turing-test-gpt-o3-vs-deepseek-r1

## Third game
This time let’s say that both sides pretend to be human, both sides try to convince the other side that it’s talking to a human, and both sides start with context that they are talking maybe to a human or maybe to AI.

GPT o4-mini-high vs o4-mini-high (one running in temporary chat to make sure they dont see each other from memory)

### Result
They take quite a bit longer, and eventually they both conclude that they’re talking to a human. So they both win at pretending and lose at detecting.

### Full conversation
https://nikakogho.github.io/#/nexus/notes/horizon/ai/turing-test/turing-test-both-pretending-and-guessing-gpt-o4-mini-high-vs-o4-mini-high

## Overall conclusion
AIs are quickly getting very impressive with their ability to pose as human. They are mastering just about everything we assume only sentient, conscious, embodied minds must be capable of contemplating.
We are probably not far from AIs that are truly absolutely impossible to tell apart from humans.

Also, obviously, sample size here is too small, this should be repeated a lot, and we should also see how they do if they can keep the context of previous games, to see how much (if at all) they can improve at both deception and detection.

## A slight warning
It might not be in humanity’s best interest to teach AI how to pretend to be human 😅
