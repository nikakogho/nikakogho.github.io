For classification tasks with [[Neural Network|neural networks]].

Takes as input a vector that already passed through [[Softmax]] and become log-probabilities.

## Formula
For vector v where correct answer was at index y

- P (guessed right) = v<sub>y</sub>
- P (guessed wrong) = 1 - v<sub>y</sub>

Loss = -log (v<sub>y</sub>)

Intuition: each value in v is between 0 and 1. In that range, logarithm is always <= 0 so -log is always positive.
