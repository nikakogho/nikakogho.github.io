Layers, linear equations, sometimes [[ReLu]] or [[Sigmoid Activation]]

Input layer, hidden layers, output layer

Can do [[Backpropagation]] using [[Gradient Descent]] or other way to learn by result

In **binary classification*** for [[Supervised Learning]] a neural network is made of [[Perceptron]] neurons

Good video for this from [Harvard](https://www.youtube.com/watch?v=J1QD9hLDEDY)

## [[Convolutional Neural Network]]
Used in [[Computer Vision]]

### [[ResNet]]
A CNN allowing skips because deep neural networks sometimes can’t learn due to [[Degradation Problem In Deep Neural Networks]]

## [[Recurrent Neural Network]]
Used in active tasks where we must keep track of attention and history (like in [[Transformer|transformers]] like [[ChatGPT]])

Types:
- [[Long Short-Term Memory]]
- [[Gated Recurrent Unit (GRU)]]

## Adversarial Neural Network
2 or more neural networks train by competing with each other

[[Generative Adversarial Network (GAN)]]

## Deep Neural Network
Many layers.
Technically still same as if there was only 1 hidden network, as stated by [[Universal Approximation Theorem]], but deep neural network needs fewer total neurons because it can learn features and be more adaptable.

## [[U-Net]]
Similar to ResNet, for [[Stable Diffusion]]

## [[Transformer]]
State-of-the-art solution for making best beural networks.

Uses [[Attention (in Artificial Neural Network)]] and MLP

## Autoencoder
Encodes data in lower dimensional resolution and then decodes it.

Traditionally deterministic and regenerating the same content, but some twists exist:
- [[Variational Auto Encoder (VAE)]]
- [[Sparse Autoencoder]]
