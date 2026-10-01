Massive Multitask Language Understanding. 
A multiple-choice questionnaire [[AI Benchmarks|benchmark]] introduced in 2020 [here](https://arxiv.org/abs/2009.03300) by [[Dan Hendrycks]] et al.
Dataset is [here](https://huggingface.co/datasets/cais/mmlu) on [[HuggingFace]].

14 000 questions across 57 subjects grouped into STEM, humanities, social sciences and "other".

Example entry:
```
What is the embryological origin of the hyoid bone?

A. The first pharyngeal arch
B. The first and second pharyngeal arches
C. The second pharyngeal arch
D. The second and third pharyngeal arches"

Answer: 
```

Guessing randomly will give you average of 25% score.

It has a 0 shot evaluation version where a question is directly presented, and a 5 shot evaluation (5 examples first).

This benchmark is saturated on frontier models, so people made benchmarks like [MMLU-Pro](https://arxiv.org/abs/2406.01574) (which is now [also saturated](https://benchlm.ai/benchmarks/mmlu-pro)).

These days mostly just used to check if a fine-tune degraded capabilities.