A [[Machine Learning]] technique invented by [[Richard Sutton]] where we have a state and we take actions and environment gives us feedback that we use to adjust and learn.

General symbols:

* s or w - current state of the world
* z - current state that agent believes to be in
* a - action
* π - policy, what action to take from state s
* o - observation that agent receives about world state
* θ - parameters of the policy function (or value function if using other methods), in case of a neural network meaning model weights

## Markov Decision Process (MDP)

S = states
A = actions
P(s’ | s, a) = probability that we will get in state s’ if we are in state s and choose action a

### Discount factor

How much we value future reward
Between 0 and 1
0 = nearsighted, only present matters
1 = farsighted
Denoted as γ

For a process with T timestamps, the return (value) of a state at time t is
$$ G_t = \sum_{k=0}^{T-t-1} γ^k \* r_{t+k} $$
In case of infinite T (endless environment), discount factor will eventually make it meaningless to consider any future states so this formula still makes sense.

### Markov Property

Like with Markov models here too we assume that only information about current state and chosen action are relevant for future

## Partially Observable Markov Decision Process (POMDP)

Here we assume that the agent keeps track of the state of the world at time t on its own (denoted as z<sub>t</sub>) and it doesn’t necessarily ideally reflect the real state of the world at time t (w<sub>t</sub>), because the agent doesn’t see w<sub>t</sub> directly, but instead sees a partial observation o<sub>t</sub>, which might even include noise.

Markov Decision Process is a simplified case of this where w<sub>t</sub> = o<sub>t</sub> = z<sub>t</sub>

### State Update Function

And so agent updates its state with a **state-update function** as
z<sub>t+1</sub> = SU(z<sub>t</sub>, a<sub>t</sub>, o<sub>t+1</sub>)

We can break this down into agent first predicting its next state with a **prediction function** P(z<sub>t</sub>, a<sub>t</sub>) and then adjusting it based on received observation with an **update function**
z<sub>t+1</sub> = U(P(z<sub>t</sub>, a<sub>t</sub>), o<sub>t+1</sub>)

### Universal Model of POMDP

![POMDP_universal.jpeg](pomdp_universal.jpeg)

## Stochastic Markov Decision Process

Sometimes taking action a from state s is not guaranteed to bring us in a specific state s’ and instead we have a probability distribution of which states we may end up in.

Case study:
![stochastic_mdp.jpeg](stochastic_mdp.jpeg)
We have

* 3 states: s<sub>0</sub>, s<sub>1</sub> and s<sub>2</sub>
* 2 actions from each: a<sub>0</sub> or a<sub>1</sub>
* Each action has some probability of taking us to any state from the given state
  * p(s = s<sub>2</sub>, a = a<sub>1</sub>, s’ = s<sub>1</sub>) = 0.3
* Only non-zero rewards are of transition from s<sub>1</sub> to s<sub>0</sub> with action a<sub>0</sub> and from s<sub>2</sub> to s<sub>0</sub> with action a<sub>1</sub>
  * R(s = s<sub>1</sub>, a = a<sub>0</sub>, s’ = s<sub>0</sub>) = +5
  * R(s = s<sub>2</sub>, a = a<sub>1</sub>, s’ = s<sub>0</sub>) = -1

## k-Armed Bandit Problem

If there is no changing state, then we must simply learn the value of an action directly, so we just have action and reward. This is called k-armed bandit for having k actions to choose from.
In this case, the problem becomes finding out the probability distribution of reward from each action ("arm"), and balancing that exploration-exploitation tradeoff
![multi_armed_bandit.png](multi_armed_bandit.png)

### Contextual Bandits

We have context (state), but unlike in full RL, here the state doesn’t change, so in any one run it stays the same.

## On-Policy vs Off-Policy

On-policy means you learn the policy π by taking actions using it.

Off-policy means you learn a policy π<sub>1</sub> by taking actions using another policy π<sub>2</sub>

### [[Q Learning]]

A popular off-policy method: where we learn a function Q(s, a): how much value we get by taking action a when in state s.

## Exploration vs exploitation

Exploitation = stick with current beliefs about highest reward

Exploration = check the unknown even if it looks bad at first

### ε-greedy

Way to balance exploration-exploitation
0 <= ε <= 1

P(explore) = ε
P(exploit) = 1 - ε

In a stationary world it makes sense to decrease ε over time and stick to exploitation afterward.
In a **non-stationary world** however it makes sense to continue to explore on some level since the rewards can change over time.

## Trajectory

* Trajectory = sequence of states, rewards, actions
* Rollout = simulated trajectory
* Episode = trajectory that starts in initial state and ends in terminal state (like one full game of chess)

## In AI Alignment

Used as [[RLHF]] or [[RLAIF]] to make base models (produced by [[Pretraining LLM|pretraining]]) helpful, honest, harmless.

## In LLM Tool Use

Used for [[Reinforcement Learning from Verifiable Rewards (RLVR)]].
