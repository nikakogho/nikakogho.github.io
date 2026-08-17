Inner content of a [[Residual Network]], typically [[Transformer]].

Shape $[B, S, D]$ where B is batch size, S is token sequence count and D is embedding dimension. Each [[Attention (in Artificial Neural Network)|attention]] and [[Perceptron|MLP]] block reads from it and writes back into it.

![[residual stream.png]]
