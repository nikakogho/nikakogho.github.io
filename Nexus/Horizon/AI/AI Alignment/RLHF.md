[[Reinforcement Learning]] with Human Feedback used to [[AI Alignment|align]] [[Large Language Models|LLMs]].

Invented by [[Paul Christiano]], [[Dario Amodei]], [[Jan Leike]] and others in [this paper](https://arxiv.org/pdf/1706.03741) in 2017.

People judge which answer is better and it trains a **Reward Model**, then the reward model trains the base model (that we got from [[Pretraining LLM|pretraining]]) and gives a final helpful, harmless, honest model.

![rlhf_steps.png](rlhf_steps.png)

Similar to [[RLAIF]] - reinforcement learning with AI feedback.
