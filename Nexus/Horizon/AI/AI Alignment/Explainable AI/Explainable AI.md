Attempt to use [[Machine Learning]] such that we understand logic our AIs use.
Can be for [[Artificial Neural Network|neural networks]] or for decision trees or other structures.

## Local Explanations

Explaining why the model gave this output for this input ("why was my loan rejected?").
Methods:

* [[LIME]]
* [[Anchors (Explainable AI)|Anchors]]
* [[Shapley Values]]
* [[SHAP]]

## For Neural Networks

### From Scratch

Some methods design neural networks from scratch to be interpretable.
These methods sadly don't apply to existing neural networks (like GPT) and if we try making serious frontier LLMs in their style, performance degrades, so they're only good for narrow "easy enough" tasks. Such methods include

* **Prototype-based Neural Networks (ProtoPNets)** - they force the network to learn specific "prototypes" (sub-ideas) at each location. Good for image recognition, not that good for language as language tends to need context from all over the place.
* **Monotonic Neural Networks** - force model to learn outputs that monotonically increase or decrease with change of input.
  * Increasing input xᵢ can only change yⱼ in a single, predetermined direction (always up or always down)
* **Kolmogorov-Arnold Networks (KANs)** - no linear weights, instead use [[Spline|splines]] as both weights and activation function.
  * Interpretable but currently inefficient to train (not friendly with GPUs yet).
  * Needs to be sparse.
  * Created in 2024 in [this paper](https://arxiv.org/abs/2404.19756)
  * Inspired by Kolmogorov-Arnold representation theorem that states that multivariate functions can be broken down into multiple univariate functions
  * ![kolmogorov_arnold_network.png](kolmogorov_arnold_network.png)

### On Existing Neural Networks

Some methods try to take any existing neural network and figure out its logic and even allow us to change it. This is the field of [[Mechanistic Interpretability]].
