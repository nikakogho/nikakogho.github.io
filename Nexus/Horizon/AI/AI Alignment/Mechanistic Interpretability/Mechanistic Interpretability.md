[[Neuroscience]] for [[AI]].
Part of [[Explainable AI]] that aims to take any existing [[Artificial Neural Network|neural network]] and figure out or change part or all of its logic.
Relevant for [[AI Alignment]].

Created by [[Chris Olah]], mechanistic interpretability lead at [[Anthropic]]

Anthropic discusses it [here](https://www.anthropic.com/research/interpretability-dreams)

[[Neel Nanda]] ([[DeepMind]] Mechanistic Interpretability lead, former student of Chris Olah) teaches it [here](https://docs.google.com/document/d/1p-ggQV3vVWIQuCccXEl1fD0thJOgXimlbBpGk6FI32I/edit?pli=1&tab=t.0#heading=h.y0ohi6l5z9qn) and made [[TransformerLens]] as an open-source tool for making mech interp easy.

## Ways
- [[Sparse Autoencoder]] (SAE) - decode meaning of concept in 1 layer of multi-layer [[Perceptron]]
	- Idea is that typically each neuron stores multiple ideas in overlapping manner since there's more concepts than dimensions in the residual stream vector so ideas get crammed and become less understandable. Sparse Autoencoders try to unscramble the neuron so we can see what ideas it's made of. Since it involves manual unscrambling, this method is **read-only**, it **can't alter the network**
- [[Circuit Analysis]]
- [[Feature Visualization]]
- Probing
	- [[Linear Probing]]
	- [[Concept-Based Probing]]
- Attribution Methods for Mechanism Discovery
- [[Steering Vectors]]
- [[Logit Lens]]
- [[Activation Oracles]]

## Problematic Concepts
- Polysemanticity - single neuron in network can mean different things (features)
	- Opposite of monosemanticity
	- Meant to be solved with SAEs
- Superposition - more features than dimensions of [[Embedding Space]] due to using non-orthogonal basis vectors

## Work at DeepMind
- Led by [[Neel Nanda]]
- A researcher [[Callum McDougall]] set up [[ARENA]] for learning

## Work at Anthropic
- Led by Chris Olah, founder of mechanistic interpretability
- [[Tom Henighan]] - key contributor of Circuits research, often co-authors with Chris Olah

## Interesting Findings
- In Transformers
	- Steering Vectors
		- [Refusal vector](https://arxiv.org/abs/2406.11717)
		- [Persona Vectors](https://www.anthropic.com/research/persona-vectors)
		- [Assistant Axis](https://www.anthropic.com/research/assistant-axis)
	- [[Grokking]] with modular addition
	- [[Induction Heads]]
	- [[Indirect Object Identification]]
- In Vision Models
	- [[Feature Visualization]]
	- [[High-Low Frequency Detectors]]
