If we adjust too much to training data, we may not generalize well to testing data

## Dropout
[[Artificial Neural Network|Neural networks]] avoid this with dropout: temporarily removing randomly selected nodes to make sure the network trains its abilities generally and doesn't depend on single "neurons".
In inference the model uses all units but divides weights by dropout probability, or does *Monte Carlo method* of turning off random neurons (like in training) multiple times and using mean of their result

![dropout_intuition.png](dropout_intuition.png)

## Regularization

Weights summed up in some way and added to loss function to discourage overcomplicated networks

### L1 (lasso)

Sum of weights added to loss function

### L2 (ridge)

Sum of squares of weights added to loss function

### Elastic Net

Combination of L1 and L2

## Early Stopping

Stop training a neural network when performance starts to degrade as it means overfitting has kicked in

## Double Descent

Using a network that's too large causes overfitting, but if you keep scaling up eventually it starts to fit model well again, even better than before overfitting. So far it seems this may hold infinitely, as the second overfit point has not been observed. It is theorized that there may be a second overfit, then triple descent, then another overfit and so on.

![double_descent.png](double_descent.png)
