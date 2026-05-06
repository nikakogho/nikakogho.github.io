[[Reinforcement Learning]] with Human Feedback used to [[AI Alignment|align]] [[Large Language Models|LLMs]] in the [[LLM Training Stages|post-training]] stage.

Invented by [[Paul Christiano]], [[Dario Amodei]], [[Jan Leike]] and others in [this paper](https://arxiv.org/pdf/1706.03741) in 2017.

People judge which answer is better and it trains a **Reward Model**, then the reward model trains the base model (that we got from [[Pretraining LLM|pretraining]]) and gives a final helpful, harmless, honest model.

Works through [[Proximal Policy Optimization (PPO)]].

![rlhf_steps.png](rlhf_steps.png)

Similar to [[RLAIF]] - reinforcement learning with AI feedback.

Can be enhanced by [[Scalable Oversight]] methods.

## Recursive Reward Modeling
Upgrade on RLHF by using AI to help humans with giving better feedback:
1. Humans help train the first reward model (agent A)
2. Agent A is used to train the next, bit smarter reward model (agent B)
3. Agent B to make bit smarter C
4. Keeps going like this
5. Final model is our aligned LLM that is too smart for a human to give feedback on directly

Problem can be errors compounding for instance (if each agent was misaligned a bit and it got amplified)