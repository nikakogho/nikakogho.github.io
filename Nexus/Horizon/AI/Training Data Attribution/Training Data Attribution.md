Techniques to determine what parts of the training data caused a certain change in the model. Typically used in [[Large Language Models]] to see what caused [[AI Alignment|misalignment]] or what degraded capabilities, but can also be used to see what caused the model to improve in some way.

Techniques:
- Retraining: remove parts of dataset and train again and compare result, repeat many times for removing many different parts of the dataset
- Semantic attribution
	- [[TURF]] from [Chunky Post-Training paper](https://arxiv.org/html/2602.05910v1)
- Activation-based
	- [[Probe-Based Training Data Attribution]] - cheap but needs [[DPO]]
- Influence Functions - expensive
- [[LESS - Selecting Influential Data for Targeted Instruction Tuning]] - cheaper variant of influence functions
