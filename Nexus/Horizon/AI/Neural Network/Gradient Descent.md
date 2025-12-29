Direction of loss function to adjust [[Artificial Neural Network]]

![Gradient_Descent.png](gradient_descent.png)

## Basic version

0. Start with random weights
1. Calculate gradient based on **all** data points
2. Update weights
3. Back to step 1

## Stochastic

0. Start with random weights
1. Calculate gradient based on **1 random** data point
2. Update weights
3. Back to step 1

## Mini-Batch

0. Start with random weights
1. Calculate gradient based on **a small batch** of data points
2. Update weights
3. Back to step 1

## Gradient Clipping
To prevent a few far off data points from altering things too much, we set upper limit on how much a gradient can change weights