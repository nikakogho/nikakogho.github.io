I used this in [this research](https://www.lesswrong.com/posts/buyCkzfa2J3Dso6tz/exploratory-a-steering-vector-in-gemma-2-2b-it-boosts) on reducing paltering in Gemma-2-2B-IT

We extract a vector for a concept like ["refusal"](https://arxiv.org/abs/2406.11717) or "friendliness" or "honesty" or "Frenchness" or ["persona"](https://www.anthropic.com/research/persona-vectors) at a specific layer of the residual stream, and then we add or subtract this vector in other forward passes to make the model do this more or less.

## Ways To Extract The Steering Vectors
### Mean Activation Difference
For the same model under a pair of prompts where one gives this behavior and other doesn't, store the difference in activations of the residual stream at the candidate layer between these runs.

Average these differences across many prompt pairs and get the possible steering vector at this layer.

Then check if it makes sense by applying it positively and negatively at different strengths for other scenarios and also make sure that replacing it with a bunch of random vectors never does quite that.

### Extracting From a [[Sparse Autoencoder]]
A SAE can be used to find the linear direction for a concept (the formula for activating the monosemantic neuron for this concept) and that can become the steering vector.

We would check its validity the same way