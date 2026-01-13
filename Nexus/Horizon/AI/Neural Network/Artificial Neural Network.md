Layers, linear equations, sometimes [[ReLu]] or [[Sigmoid Activation]]

Input layer, hidden layers, output layer

Can do [[Backpropagation]] using [[Gradient Descent]] or other way to learn by result

In **binary classification**\* for [[Supervised Learning]] a neural network is made of [[Perceptron]] neurons

Good video for this from [Harvard](https://www.youtube.com/watch?v=J1QD9hLDEDY)

## Training a Neural Network
Typically uses [[Backpropagation]] using [[Gradient Descent]].

Different forms of training:
- Full from scratch
- Fine-tuning: we take existing trained model and further train it
- [[LoRA - Low-Rank Adaptation of Large Language Models]] - we take existing trained model, freeze its weights and add new weights but fewer

## [[Convolutional Neural Network]]

Used in [[Computer Vision]]

### [[Residual Network]]

A neural network, typically CNN, allowing skip connections (x -> x + F(x)) because deep neural networks sometimes can’t learn due to [[Degradation Problem In Deep Neural Networks]].

## [[Recurrent Neural Network]]

Used in active tasks where we must keep track of attention and history (like in [[Transformer|transformers]] like [[ChatGPT]])

Types:

* [[Long Short-Term Memory]]
* [[Gated Recurrent Unit (GRU)]]

## Adversarial Neural Network

2 or more neural networks train by competing with each other

[[Generative Adversarial Network (GAN)]]

## Deep Neural Network

Many layers.
Technically still same as if there was only 1 hidden network, as stated by [[Universal Approximation Theorem]], but deep neural network needs fewer total neurons because it can learn features and be more adaptable.

### [[Neural Network Normalization]]

Ways to stabilize a neural network:

* [[BatchNorm]]
* [[GhostNorm]]
* [[LayerNorm]]
* [[GroupNorm]]
* [[InstanceNorm]]
  ![nn_normalization_schemes.jpeg](nn_normalization_schemes.jpeg)

## [[U-Net]]

Similar to ResNet, for [[Stable Diffusion]]

## [[Transformer]]

State-of-the-art solution for making best neural networks.

Uses [[Attention (in Artificial Neural Network)|attention]] and MLP

## Autoencoder

Encodes data in lower dimensional resolution and then decodes it.

Traditionally deterministic and regenerating the same content, but some twists exist:

* [[Variational Auto Encoder (VAE)]]
* [[Sparse Autoencoder]]

## [[Graph Neural Network]]

For processing graphs (nodes and edges)
