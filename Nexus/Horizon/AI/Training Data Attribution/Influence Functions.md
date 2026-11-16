Classic [[Training Data Attribution]] method from a 2017 paper ["Understanding Black-box Predictions via Influence Functions"](https://arxiv.org/abs/1703.04730).

Training dataset Z = z<sub>1</sub>, z<sub>2</sub> ... z<sub>n</sub> where z<sub>i</sub> = (x<sub>i</sub>, y<sub>i</sub>) with x being input and y being correct label, θ being model parameters, and L(z, θ) being loss for data point z for parameters θ.

We define $\hat{θ}$ as parameters at global minimum, where **empirical risk** (average loss) is lowest:
$$ \hat{θ} = argmin_θ \frac{1}{n} \sum_i L(z_i, θ)  $$

Note: [[Artificial Neural Network|neural networks]] train to/around local minimum not global, and [[Large Language Models]] are typically not even trained to local minimum, so this is an approximation to what parameters we would actually have after training.

We define upsampling of a data point *z* by some weight $\epsilon$ as involving it $\epsilon$ times more in calculating **empirical risk**:
$$ \hat{θ}_{\epsilon,z} = argmin_{\theta} (\frac{1}{n} \sum_i L(z_i, \theta) + \epsilon * L(z, \theta)) $$

Influence Function I is a function that takes in a data point *z* we want to vary and a target data point z<sub>test</sub> and tells us how much the loss of the trained (trained till global minimum) model would change with an infinitesimal change to "weight" of z:
$$ I_{up,loss} (z, z_{test}) = \frac{d L(z_{test}, \hat{θ}_{\epsilon,z})}{d\epsilon} \vert_{\epsilon=0} $$
