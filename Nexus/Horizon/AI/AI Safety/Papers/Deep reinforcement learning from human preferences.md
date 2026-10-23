A 2017 [[AI Safety Papers|paper]] by [[Paul Christiano]], [[Jan Leike]], [[Dario Amodei]], [[Shane Legg]], [[Miljan Martic]], [[Tom Brown]].
[Link](https://arxiv.org/abs/1706.03741).
Considered the introduction of [[RLHF]].

They basically separately train a policy π (a | s) that picks action a given a state s, and an ensemble of best guess reward estimators r<sub>1</sub> (s, a), r<sub>2</sub> (s, a) ... r<sub>n</sub> (s, a) that guess what reward the human would probably assign to taking action a when in state s.

It goes in asynchronous loop:
1. We generate trajectories based on current policy
2. We pick some top k trajectory pairs (can be different initial states, but same number of actions / same length of video) on which the reward estimators disagree the most about which is better and get humans to decide whether one is better, both are equal, or if they can't tell
3. We train each reward estimator in our ensemble on these pairs
4. We train policy based on average of the reward estimators

They showed that [[Deep Learning|deep]] [[Reinforcement Learning]] is highly effective and works better than training either on only human preferences or sometimes even on only already specified reward functions, because in some real world-like scenarios the reward function can be less precise than average non-expert human judgement