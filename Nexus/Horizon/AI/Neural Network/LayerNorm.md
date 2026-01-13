Type of [[Neural Network Normalization]] often used in [[Transformer|transformers]].

PyTorch by default has it normalizing across 2 dimensions.
![layernorm.png](layernorm.png)

Has parameters γ and β (new mean and std)
$$
y = \frac{x - \mathbb{E}\[x]}{\sqrt{\mathrm{Var}\[x] + \epsilon}} \cdot \gamma + \beta
$$

## In Transformer

It normalizes just for one dimension (the embedding vector of the given token), as opposed to [[BatchNorm]] which would take across all batch members + token vectors
![layernorm_vs_batchnorm_transformer.png](layernorm_vs_batchnorm_transformer.png)

Used around [[Attention (in Artificial Neural Network)|attention]] block, MLP block and unembedding matrix

### Post-LN

Each sublayer does `x = LayerNorm(x + Sublayer(x))`

Used in original transformers

### Pre-LN

Each sublayer does `x = x + Sublayer(LayerNorm(x))`

More common in modern LLMs
