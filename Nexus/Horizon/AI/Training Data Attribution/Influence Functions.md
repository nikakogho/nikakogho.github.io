Classic [[Training Data Attribution]] method from a 2017 paper ["Understanding Black-box Predictions via Influence Functions"](https://arxiv.org/abs/1703.04730).

Training dataset Z = z<sub>1</sub>, z<sub>2</sub> ... z<sub>n</sub> where z<sub>i</sub> = (x<sub>i</sub>, y<sub>i</sub>) with x being input and y being correct label, θ being model parameters, and L(z, θ) being loss for data point z for parameters θ.

We define $\hat{θ}$ as parameters at global minimum:
$$ \hat{θ} = argmin_θ \frac{1}{n} \sum_i L(z_i, θ)  $$

Note: [[Artificial Neural Network|neural networks]] train to local minimum not global, and [[Large Language Models]] are typically not even trained to local minimum, so this is an approximation to what parameters we would actually have after training.