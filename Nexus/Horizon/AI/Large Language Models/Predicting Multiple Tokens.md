We could make a [[Transformer|transformer]] have multiple unembedding matrices in the end so that it predicts multiple tokens instead of just one. Works well along with [[Speculative Decoding]].
The transformer would have to be trained to do this (from scratch or normal LLM fine tuned for this job).

Explained [here](https://arxiv.org/abs/2401.10774).