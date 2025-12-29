Like a [[Recurrent Neural Network]] but with [[Attention (in Artificial Neural Network)|attention]] (typically self-attention) baked in.
Introduced in a cool paper [Attention Is All You Need](https://arxiv.org/abs/1706.03762) by [[Google Brain]] led by [[Ashish Vaswani]].
Explained very well [here](https://www.youtube.com/watch?v=QAZc9xsQNjQ\&list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm\&index=10\&t=2910s) and [here](https://jalammar.github.io/illustrated-transformer/).
Can be learned at [[ARENA]] [here](https://colab.research.google.com/github/callummcdougall/ARENA_3.0/blob/main/chapter1_transformer_interp/exercises/part1_transformer_from_scratch/1.1_Transformer_from_Scratch_exercises.ipynb).
Basically a bunch of Multi-Layer [[Perceptron]] + attention layers.

![transformer_visual.png](transformer_visual.png)

## Components
* [[Tokenizer]]
* [[Positional Embedding]]
* Transformer Block
  * Self-Attention
  * Multi-Layer Perceptron
* [[Residual Stream]]
* Embedding/Unembedding
* [[LayerNorm]]

## Steps
0. Input sequence (text) passes through the tokenizer and we get a vector of tokens
1. Tokens go through embedding matrix so that each becomes a vector
2. Each token also gets positional embedding
3. Residual stream forms, goes through transformer blocks (attention + MLP)
4. Finally a LayerNorm + Unembed gives us final logits
5. In simple inference we just take logit with max value and output that token, but for training or for probabilistic generation we will apply [[Softmax]] to get probability distribution and either sample from it for output or use it to train the network

## Encoder-Decoder Architecture
Encoder can also look in front, used by [[BERT]].
Uses self-attention for reasoning through content so far in both encoder and decoder sides, and uses cross-attention when decoder queries attend to encoder key value outputs
![transformer_layers.png](transformer_layers.png)

![transformer_decoder.gif](transformer_decoder.gif)

## Decoder-Only Architecture
Only looks back, can't look in the front.
No encoder so **only** self-attention
[[GPT]] and other LLMs are decoder-only.
![decoder_only_transformer.png](decoder_only_transformer.png)
