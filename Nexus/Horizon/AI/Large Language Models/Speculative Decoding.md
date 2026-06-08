Technique to make [[Large Language Models]] predict multiple next tokens together.

Used by [Meta](https://ai.meta.com/research/publications/efficient-speculative-decoding-for-llama-at-scale-challenges-and-solutions/), [OpenAI](https://vamvas.ch/openai-predicted-outputs), [DeepMind](https://blog.google/innovation-and-ai/technology/developers-tools/multi-token-prediction-gemma-4/).

Basic idea: the LLM predicting one token at a time is too slow, we can do better by having a smaller LLM predict multiple tokens (which will be cheaper) and then the larger LLM will accept some first *n* of those tokens plus add its own token.

Explained for Gemma [here](https://x.com/googlegemma/status/2051694045869879749).

The large model is called **target model**, small one is called the **draft model**.
![target_and_draft_models_speculative_decoding.png](target_and_draft_models_speculative_decoding.png)

Additionally, the draft model could be [[Predicting Multiple Tokens]].
