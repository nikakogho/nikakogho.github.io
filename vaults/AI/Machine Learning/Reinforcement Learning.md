We have state and we take actions and environmet gives us feedback that we use to adjust and learn

## Markov Decision Processes
S = states
A = actions
P(s’ | s, a) = probability that we will get in state s’ if we are in state s and choose action a

### Discount factor
How much we value future reward
Between 0 and 1
0 = nearsighted, only present matters
1 = farsighted

### Markov Property
Like with Markov models here too we assume that only information about current state and chosen action are relevant for future

## [[Q Learning]]

## Exploration vs exploitation
Exploitation = stick with current beliefs about highest reward

Exploration = check the unknown even if it looks bad at first

### ε-greedy
Way to balance exploration-exploitation
0 <= ε <= 1

P(explore) = ε
P(exploit) = 1 - ε