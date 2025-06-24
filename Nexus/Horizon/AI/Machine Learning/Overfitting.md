If we adjust too much to training data, we may not generalize well to testing data

## Dropout
[[Neural Network|Neural networks]] avoid this with dropout: temporarily removing randomly selected nodes to make sure the network trains its abilities generally and doesn't depend on single "neurons"

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