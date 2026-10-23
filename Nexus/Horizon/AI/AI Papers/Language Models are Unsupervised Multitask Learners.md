In [this paper](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf), [[OpenAI]] team of [[Alec Radford]], [[Ilya Sutskever]], etc. introduced GPT-2, a first concerningly good [[Large Language Models|large language model]].

In many ways, it was a scaled up [[Improving Language Understanding by Generative Pre-Training|GPT-1]].

New contributions:
- Byte-level [[Byte-Pair Encoding]] so that any Unicode is handled, without exploding vocabulary size
- Scaled up to 1.5B parameters
- Demonstrated that larger models are more capable, zero-shotting SOTA performance on even more tasks than before
- Open weights models released
- Trained at 4 sizes, each released:

| Model        | Parameters               | Layers | Hidden dimension |
| ------------ | ------------------------ | ------ | ---------------- |
| GPT-2 Small  | 117M (often called 124M) | 12     | 768              |
| GPT-2 Medium | 345M (often called 355M) | 24     | 1,024            |
| GPT-2 Large  | 762M (often called 774M) | 36     | 1,280            |
| GPT-2 XL     | 1.5B                     | 48     | 1,600            |
OpenAI, most notably [[Dario Amodei]], initially [wanted to withhold](https://openai.com/index/better-language-models) the release of the GPT-2 model weights, citing [[AI Safety|safety concerns]].