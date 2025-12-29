Neuroscience for AI.
Part of [[Explainable AI]] that aims to take any existing [[Artificial Neural Network|neural network]] and figure out or change part or all of its logic.

Created by [[Chris Olah]], mechanistic interpretability lead at [[Anthropic]]

Anthropic discusses it [here](https://www.anthropic.com/research/interpretability-dreams)

[[Neel Nanda]] ([[DeepMind]] Mechanistic Interpretability lead) teaches it [here](https://docs.google.com/document/d/1p-ggQV3vVWIQuCccXEl1fD0thJOgXimlbBpGk6FI32I/edit?pli=1&tab=t.0#heading=h.y0ohi6l5z9qn)

## Ways
- [[Sparse Autoencoder]] - decode meaning of concept in 1 layer of multi-layer [[Perceptron]]
	- Idea is that typically each neuron stores multiple ideas in overlapping manner since there's more concepts than dimensions in the residual stream vector so ideas get crammed and become less understandable. Sparse Autoencoders try to unscramble the neuron so we can see what ideas it's made of. Since it involves manual unscrambling, this method is **read-only**, it **can't alter the network**
- [[Circuit Analysis]]
- [[Feature Visualization]]
- Probing
	- [[Linear Probing]]
	- [[Concept-Based Probing]]
- Attribution Methods for Mechanism Discovery

## Problematic Concepts
- Polysemanticity - single neuron in network can mean different things (features)
	- Opposite of monosemanticity
- Superposition - more features than dimensions of [[Embedding Space]] due to using non-orthogonal basis vectors

## Work at DeepMind
- Led by [[Neel Nanda]]
- A researcher [[Callum McDougall]] set up [[ARENA]] for learning

## Work at Anthropic
- Led by Chris Olah, founder of mechanistic interpretability
- [[Tom Henighan]] - key contributor of Circuits research, often co-authors with Chris Olah