Like a recurrent [[Neural Network]] but with [[Attention|self-attention]] baked in

Introduced in a cool paper [Attention Is All You Need](https://arxiv.org/abs/1706.03762)

Explained very well [here](https://www.youtube.com/watch?v=QAZc9xsQNjQ\&list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm\&index=10\&t=2910s) and [here](https://jalammar.github.io/illustrated-transformer/)

Basically a bunch of Multi-Layer [[Perceptron]] + attention layers

Before self-attention, each token also gets positional encoding and feeds it into output in “Add and Normalize” layer
![transformer_layer.png](transformer_layer.png)

True in both encoder and decoder
![transformer_layers.png](transformer_layers.png)

## Decoder

![transformer_decoder.gif](transformer_decoder.gif)
