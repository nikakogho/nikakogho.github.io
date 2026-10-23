In [this paper](https://arxiv.org/abs/2005.14165), [[OpenAI]] team led by [[Alec Radford]] explain GPT-3.

They mostly follow [[Improving Language Understanding by Generative Pre-Training|GPT-1]] and [[Language Models are Unsupervised Multitask Learners|GPT-2]], just scale it up to 175B parameters. They train at each size for 300B total tokens. They observe that larger models perform better for same amount of compute, as predicted by their [[Scaling Laws For Neural Language Models]] paper.

This paper demonstrated **in-context learning**: ability of [[Large Language Models]] to learn directly by getting text demonstration of few examples, no longer needing finetuning for many tasks.

Training Data (total 300B tokens):

| Dataset                 | Unique tokens in dataset | Tokens GPT-3 trained on |
| ----------------------- | -----------------------: | ----------------------: |
| Common Crawl (filtered) |                     410B |                  180.4B |
| WebText2                |                      19B |                   55.1B |
| Books1                  |                      12B |                   22.8B |
| Books2                  |                      55B |                  23.65B |
| Wikipedia               |                       3B |                   10.2B |
| **Total**               |                 **499B** |             **292.15B** |
