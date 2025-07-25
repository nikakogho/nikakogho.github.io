Probability
Possible world is ω

0 <= P(ω) <= 1
Sum of P(ω) for all possible worlds = 1

## Conditional probability

P(a | b) = P(a ∧ b) / P(b)

P(a ∧ b) = P(a | b) \* P(b) = P(b | a) \* P(a)

### Bayes' Theorem

P(a | b) = P (b | a) \* P(a) / P(b)

## Bayesian Networks

Each variable depends on some amount of variables before
Acyclic

![Bayesian_Network.png](bayesian_network.png)

### Sampling

Steps:
0\. Knowledge so far is nothing

1. Iterate through each variable
   1. Pick its value randomly based on distribution of its possible values based on current knowledge
   2. Update knowledge

To find out approximate probability of some condition, we can just generate a bunch of samples and check how often this condition is met. Cheaper than exact calculation

## Markov Model

We say that current state depends on a fixed amount of previous states

### Hidden Markov Models

Suppose one event influences the second
We only observe a chain of seconds, but we know that first is a Markov chain
![Hidden_Markov_Model.png](hidden_markov_model.png)

We may be asked to predict the entire chain, or to predict a future state in a chain, or a current state or some past state at a specific point
