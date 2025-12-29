Weighted average of previous encoded values

Used by [[Transformer]]

Explained very well [here](https://www.youtube.com/watch?v=QAZc9xsQNjQ\&list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm\&index=10\&t=2910s)

![attention_ai_drawing.png](attention_ai_drawing.png)

We get query, key and value vectors for each token from trained values of W<sup>Q</sup>, W<sup>K</sup> and W<sup>V</sup>
![attention_qkv.jpeg](attention_qkv.jpeg)

### Self-Attention As Routing

![self_attention_as_routing.jpeg](self_attention_as_routing.jpeg)

### Computing Self-Attention Weights

![computing_self_attention_weights.jpeg](computing_self_attention_weights.jpeg)

### Vector Form

![self_attention_logic.jpeg](self_attention_logic.jpeg)

### Condensed Matrix Form

![attention_calculation_matrix.jpeg](attention_calculation_matrix.jpeg)

### Multi-Headed Attention

We repeat same logic for as many attention heads as we have, getting that many Z values from that many query, key, value weights.

Typically we give each head a dimensionality of `d_head = d_embedding / n_heads` to make sure each head uses a non-overlapping subspace in embedding dimensions, for parallelism and efficiency.
Overlapping them has been [proposed](https://arxiv.org/abs/2410.14874) for vision transformers, called **Multi-Overlapped-Head Self-Attention (MOHSA)**.

![multihead_attention.jpeg](multihead_attention.jpeg)

To turn them into 1 matrix again for the MLP layer, we concatenate them and multiply them by another weights matrix
![multihead_attention_concat.jpeg](multihead_attention_concat.jpeg)

## Self-Attention Interaction Types

![self_attention_interaction_types.png](self_attention_interaction_types.png)

## Cross Attention

For encoder-decoder transformers.
Key and value in encoder, query in decoder.
![cross_attention_transformer.png](cross_attention_transformer.png)

### Summary

![attention_full_formula.jpeg](attention_full_formula.jpeg)

![self_attention.png](self_attention.png)
![attention_iron_man.png](attention_iron_man.png)

## Sparse Attention

Optimization trick, mostly pay attention to last *n* tokens.
**NOT** used by frontier LLMs due to losing too much data.
![sparse_attention.png](sparse_attention.png)
![transformer_normal_vs_sparse_attention.png](transformer_normal_vs_sparse_attention.png)

* Strided - properly see last *n* tokens and then kinda see every *k*-th token
* Fixed - properly see only up to last block
