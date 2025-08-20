Weighted average of previous encoded values

Used by [[Transformer]]

Explained very well [here](https://www.youtube.com/watch?v=QAZc9xsQNjQ\&list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm\&index=10\&t=2910s)

![attention_ai_drawing.png](attention_ai_drawing.png)

We get query, key and value vectors for each token from trained values of W<sup>Q</sup>, W<sup>K</sup> and W<sup>V</sup>
![attention_qkv.jpeg](attention_qkv.jpeg)

### Vector Form

![self_attention_logic.jpeg](self_attention_logic.jpeg)

### Condensed Matrix Form

![attention_calculation_matrix.jpeg](attention_calculation_matrix.jpeg)

### Multi-Headed Attention

We repeat same logic for as many attention heads as we have, getting that many Z values from that many query, key, value weights
![multihead_attention.jpeg](multihead_attention.jpeg)

To turn them into 1 matrix again for the MLP layer, we concatenate them and multiply them by another weights matrix
![multihead_attention_concat.jpeg](multihead_attention_concat.jpeg)

### Summary

![attention_full_formula.jpeg](attention_full_formula.jpeg)

![self_attention.png](self_attention.png)
![attention_iron_man.png](attention_iron_man.png)
