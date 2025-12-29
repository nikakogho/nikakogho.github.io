Type of [[Artificial Neural Network|neural network]] where instead of going through every neuron, we sometimes skip some sections by introducing experts and a router that decides which expert to ask in this layer.
Common in frontier [[Large Language Models]].

Explained in [this article](https://newsletter.maartengrootendorst.com/p/a-visual-guide-to-mixture-of-experts).
![mixture_of_experts.png](mixture_of_experts.png)
![moe_example_2.png](moe_example_2.png)

Current implementations mostly choose one expert at a time (**Sparse MoE**).

This group of experts per layer is meant to replace the feed-forward neural network ([[Perceptron|MLP]]) in a [[Transformer]]
![transformer_moe.png](transformer_moe.png)

## Router

Also FFNN. Trained to choose which expert to pick.
![MoE_Router.png](moe_router.png)

## Dense MoE

There is research into choosing multiple experts per layer.
Dense MoE chooses how much to care for each expert vs sparse MoE that completely drops some (in most cases only leaves 1)
![Dense_vs_Sparse_MoE.png](dense_vs_sparse_moe.png)
