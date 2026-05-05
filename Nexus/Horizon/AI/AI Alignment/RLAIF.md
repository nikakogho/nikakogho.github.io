[[Reinforcement Learning]] from AI feedback.
Cousin of [[RLHF]].
A popular version of RLAIF is [[Anthropic]]'s [[Constitutional AI]].

1. We start with a helpful-only RLHF model and use it along with critique steps (obtained from a constitution) to generate a dataset of prompt-harmless response pairs.
2. We then fine-tune the base model on these pairs
3. We then score this fine-tuned model between 2 options of possible responses on prompts.
4. Use that set of preferences to train a **reward model**
5. Use the reward model to turn our fine-tuned LLM into a good final LLM that is helpful, honest, harmless
   ![rlaif_steps.png](rlaif_steps.png)
