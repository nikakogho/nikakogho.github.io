A [[Reward Model]] often used in [[RLHF]] that gives us a probability that some choice A is better than B:
P(A > B) = sigmoid(r<sub>A</sub> - r<sub>B</sub>)

where $$ sigmoid(x) = \frac{1}{1+e^{-x}} $$
From this also the Bradley-Terry loss is -log(sigmoid(r<sub>A</sub> - r<sub>B</sub>)).

For loss only the absolute difference between r<sub>A</sub> and r<sub>B</sub> matters, so same result for 104 and 100 as for -10 and -14.