A concept in [[Information Theory]] but also used in [[Artificial Neural Network|neural networks]] to calculate loss.

Compares difference between 2 probability distributions.

Often used in neural networks to compare expected output with actual output to calculate loss.

## Cross-Entropy Loss Between 2 Probability Distributions

If distribution has C amount of elements, we write
![Cross_Entropy_Loss_Formula.png](cross_entropy_loss_formula.png)

## In Classification Tasks

Mostly true answer is all 0s except for a single correct place where it is 1 (one-hot encoding), so formula simplifies to:

Cross-Entropy Loss = − log(p<sub>y</sub>​)

Where p is probability distribution and y is the index of the correct answer
