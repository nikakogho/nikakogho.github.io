[[Reinforcement Learning]] algorithm where model mixes learning by interactions with environment and planning (learning by simulated rollouts according to its current world model, the current understanding of what new state and reward you get from being in state s and taking action a).

## Dyna-Q
Model mixes [[Q-Learning]] and [[Q-Planning]].

### Dyna-Q+
Dyna-Q but can work with a changing environment (therefore planning becomes inaccurate over time) by also using exploration.
