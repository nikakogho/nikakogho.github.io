How [[Probability|probability]] can be split between members of a set, each being non-zero and total being 1.
In case of a continuous set, each element's probability is 0, so we instead use probabilities of being in a segment.
For each distribution we typically ask for the mean and the variance.

## Uniform Distribution
Each is equally likely.
![[uniform distribution.png]]
Denoted as U(S) where S is the set of possible values.
Our variable X can take any value between a and x with equal likelihood.
Mean = $\frac{a+x}{2}$
Var = $\frac{(b-a)^2}{12}$
Std = $\sqrt\frac{(b-a)^2}{12}$

P(X < x) = $\frac{x-a}{b-a}$

## Normal (Gaussian) Distribution
![[bell curve.png]]
Most famous type of distribution, because according to the [[Central Limit Theorem]], a sum of random variables converges on this shape

## Rademacher Distribution
Discrete distribution where random variable has 50% chance of being 1 and 50% chance of being -1. Equivalent to U({ -1, 1 })
