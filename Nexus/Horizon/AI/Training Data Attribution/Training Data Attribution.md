Techniques to determine what parts of the training data caused a certain change in the model. Typically used in [[Large Language Models]] to see what caused [[AI Alignment|misalignment]] or what degraded capabilities, but can also be used to see what caused the model to improve in some way.

![[tda general parts.jpeg]]
Can be formalized as
- Trained model to measure
- Model behaviors under investigation (LLM propensity, benchmark performance, neuron activations, loss changing over the course of training…)
- Training entities (datasets) that caused the behaviors
- Influence measure: the techniques used to do attribution

Techniques:
- Retraining: remove parts of dataset and train again and compare result, repeat many times for removing many different parts of the dataset
- Semantic attribution
	- [[TURF]] from [Chunky Post-Training paper](https://arxiv.org/html/2602.05910v1)
- Activation-based
	- [[Probe-Based Training Data Attribution]] - cheap but needs [[DPO]]
- [[Influence Functions]] - expensive
    - [[TRAK]], a variant of influence functions
- [[LESS - Selecting Influential Data for Targeted Instruction Tuning]] - cheaper variant of influence functions
- Training dynamics - we check multiple checkpoints during training
    - [[TracIn]] - variation of influence function that does not simplify training process as being done in a single full batch and instead acknowledges that data point’s effect depends on when in training it’s applied
    - [[SGD-influence]]
