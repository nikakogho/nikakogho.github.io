Type of adversarial training for [[AI Alignment|AI alignment]] where we edit the model's internals (like with [[Steering Vectors]] or [[Sparse Autoencoder|SAE neurons]]) to elicit bad behavior to give negative feedback on it with [[RLHF]] so that the model learns to be "vaccinated" against harmful internal activations. Described [here](https://www.lesswrong.com/posts/atBQ3NHyqnBadrsGP/latent-adversarial-training).

## Problems
General problem with this is that the model could just learn to obfuscate its internal activations, so the author of that post suggested that this must be applied the whole time in training so we never get in a situation of an already fully formed deceptive model getting exposed to this technique.

### Vector Migration
If a model has some deception vector or a sleeper agent trigger vector and we artificially increase it to catch it and give feedback on it, a model might just learn to move that functionality somewhere else and form a similar vector in another layer (causing a whack-a-mole problem), or even obfuscate this concept such that it's no longer represented linearly (this would be hard, maybe [[Gradient Hacking]] hard).