A part of [[Midtraining LLM|midtraining]] in [[Large Language Models|LLM]] meant to improve alignment to model spec / [[Constitutional AI|constitution]].
First explored by Anthropic Fellows in [this paper](https://arxiv.org/pdf/2605.02087).

We use [[Supervised Learning]] on synthetic documents ([[Synthetic Document Finetuning]]) to convince the model that the traits it gets reinforced on later in fine-tuning relate to other desirable traits from our Model Spec / constitution. It is meant to be reinforced farther with Alignment fine-tuning (mostly just adding more MSM related content in [[Supervised Fine-Tuning (SFT)|SFT]]).

Intuition:
![[msm broadly.png]]

Necessary documents for SDF are created by the LLMs directly from our model spec:
![[msm docs creation.png]]
