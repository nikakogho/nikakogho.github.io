From [[Dario Amodei]], [[Chris Olah]], [[Paul Christiano]], [[Jacob Steinhardt]], [[John Schulman]] and [[Dan Mané]].

[Paper](https://arxiv.org/abs/1606.06565) released in 2016.

They focus on practical issues in [[Machine Learning]] models of 2010s and fully avoid talking about [[X-Risks]]. and [[AGI]].

In this paper they suggest 5 main ways designing an AI via [[Supervised Learning]] or [[Reinforcement Learning]] can go wrong:
1. Wrong objective function leading to undesired side effects: they use example of a cleaning robot knocking over a vase because its objective function only cared about cleaning the floor and maybe about speed and was indifferent to everything else. This is elaborated on in [[Eliezer Yudkowsky|Eliezer’s]] [[Hidden Complexity of Wishes]]. This is also related to [[Orthogonality Thesis]]: the sense that no matter how smart an AI is, it simply won’t care about “common sense things” or niceness if it has an objective function that doesn’t care about them. Also related to [[Instrumental Convergence]]: many objective functions will have useful immediate subgoals like gain power, remain functional, ensure they can’t modify you unless this would make you even more successful in accomplishing the original objective etc.
2. Avoiding [[Reward Hacking]]: maybe the cleaning robot will game its reward function and instead of cleaning the floor that we wanted, will most literally execute the reward function which was perhaps “your camera must not see any dirt” so it shuts down its camera or hides rubble behind an item
3. [[Scalable Oversight]]: here defined as how to check that cleaning robot is still respecting the objective function across its training in a cheap and scalable way. So like asking a human every second is not scalable
4. Safe exploration: how to ensure that exploratory moves (from exploration vs exploitation) of the robot are safe, when exploratory by definition means some uncertainty
5. Robustness to distributional shift: how to make sure the robot generalizes to new kinds of environments correctly

They offer some broad ways to solve these problems:
## For Avoiding Negative Side Effects
### Impact Regularizer
Define or learn an [[Impact Regularizer]] that will make it so the robot counterfactually changes the environment as little as possible, compared either to
- What would happen if this robot did not act at all / followed a very passive policy π<sub>null</sub>
    - This is not neutral if a robot was in the middle of something that the environment depended on (like if a self driving car suddenly stops that is not a neutral act and not a safe act)
- What would happen if this robot followed a safe but suboptimal “default” policy

Today we are largely in the comfort zone of not having too worry about this too much because our [[Large Language Models]] come pre-embedded with a human common sense prior that they both understand and for now care about. This may change after sufficient amount of [[Reinforcement Learning from Verifiable Rewards (RLVR)|RLVR]] though.

### Minimize Empowerment
Empowerment could be measured straightforwardly as maximizing action space in future. This can manifest in choosing to grab keys, remain near center of a room, avoiding shutdown, etc.

Not a perfect measure as in reality some vast option spaces are unimportant (which set of moves to make to move around in empty space) while some single bit actions are super important (whether or not to press a button that shuts down the power grid).
Still, could be a useful measure overall and training models with a regularization term that minimizes empowerment might help avoid some of instrumental convergence.

### [[Cooperative Inverse Reinforcement Learning]]
Type of [[Inverse Reinforcement Learning]] where AI agent and human work together to achieve human’s goals, or generally for multi-agent cooperation.

### [[Reward Autoencoder]]
Think of agent’s policy/actions as calculating some reward function. So we would apply an [[AutoEncoder]] that takes in agent’s actions, encodes them into a reward function and decodes them back into the same actions.
If it is failing to get decoded, we are probably not doing things right.

### Reward uncertainty and aversion to exploration
Model things so agent uses a lot of uncertainty and has a prior probability distribution that unexplored state-action space must be worse than some baseline policy.

## Avoiding Reward Hacking
It feels like most common sense advice here is lacking, as in, even though they list many previous papers, they could have arrived at better conclusions had they also considered Omohundro’s instrumental convergence and Yudkowsky’s papers and posts in detail.

They do mention both [[Future of Humanity Institute]] and [[MIRI]], but not in nearly as much detail as they should have.