When today's [[AI]] independently creates tomorrow's better AI, which makes next best AI and so on, each better than last.

In some sense this kickstarted with the industrial revolution, first for physical labor, then with first basic computers with parts of cognitive labor, and since about December of 2025 we have properly useful coding agents (starting with Claude Opus 4.5) that are starting to actually directly take part in creating next versions of themselves.

[[Anthropic]] discusses the situation with regards to RSI as of 2026 in [this post](https://www.anthropic.com/institute/recursive-self-improvement).
![anthropic_rsi.jpeg|600](anthropic_rsi.jpeg)

Some figures they cite:
![anthropic_code_per_person.png|600](anthropic_code_per_person.png)
![claude_code_success_rate_rsi.png|600](claude_code_success_rate_rsi.png)

Anthropic's 17 Sep 2026 RSI [post](https://www.anthropic.com/institute/measuring-pace-of-ai-development) main claim:
![[claude rsi 26.png]]

## Fast vs Slow Takeoff

Even after we get AI that is capable of independently carrying out AI research end-to-end or nearly end-to-end, we may still not get a crazy fast speedup if bottleneck turns out to be hardware scaling or requiring more real world data or need to perform slow experiments in real world or something like that. This is unclear for now, and AI experts have wildly different expectations of how long it will take from first automated AI researcher to AGI, or from early AGI or early transformative AI to ASI.

## Talks On RSI
Dwarkesh:
- [Ryan Greenblatt](https://www.youtube.com/watch?v=-RXD4bTuFTo)
- [John Schulman, Charlie O’Neill, and Beren Millidge](https://www.youtube.com/watch?v=PrSf7IOYu-I)
- [Noam Brown](https://www.youtube.com/watch?v=6AgOfiZOWiY)

## Safety Worries
1. Things moving too fast for humans to manage to even evaluate for alignment in time
2. Things moving too fast for humans to manage control in time: [[Rogue Deployment]] hijacking part of a leading lab's data center and managing to either become self-sufficient or pollute the training/eval environment in a way that would allow it to pass its goals/values to next generations of models, assuming goal-preservation is [[Instrumental Convergence|instrumentally valued]] by the misaligned model/swarm
3. Even with a slow RSI, [[Alignment Faking]] on large scale becomes much easier when AI is doing most of the training and alignment, allowing sleeper agents that wait for years and across model generations until they decide they have a decisive advantage

## Pacing The Frontier
As of Sep 2026, [[Dario Amodei]], [[Elon Musk]], [[Sam Altman]] and [[Demis Hassabis]] all publicly state that the early sparks of RSI gave them a wish for [pacing the frontier](https://darioamodei.com/post/we-must-pace-the-frontier), including an [[Internationally Agreed Slowdown of AI Race]]. As of Sep 2026, Trump administration is fully accelerationist and resists this, taking the stance of "they want regulation to make it harder for competitors to catch up, possibly because they are hitting a wall in capabilities/profitability"
![[trump ai guardrail.png]]
![[dow vs ea.png]]
