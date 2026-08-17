A method of [[AI Alignment]] introduced in [[Anthropic]] where we give AI a bunch of rules (constitution) and often also let it learn on its own without labeled data ([[RLAIF]]).

We have the model assess itself over and over and become better through [[Supervised Learning]] and then [[Reinforcement Learning]].

Explained [here](https://arxiv.org/abs/2212.08073)

## In RL From AI Feedback
![constitutional_ai_steps.png](constitutional_ai_steps.png)

## In Midtraining
New method of [[Model Spec Midtraining]] is used to make subsequent RLHF / RLAIF generalize better.