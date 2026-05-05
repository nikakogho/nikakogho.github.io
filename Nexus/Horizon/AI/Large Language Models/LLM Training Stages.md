1. [[Pretraining LLM]] - produces document completer
2. [[Midtraining LLM]] - similar to pretraining but more targeted to high quality tasks (long context usage, coding, math, STEM)
3. Post-training LLM - gives direction, personality, censorship, reasoning, tool use
   4. [[Supervised Fine-Tuning (SFT)]]
   5. [[Reinforcement Learning]] from [[RLHF|human]] or [[RLAIF|AI]] feedback.
   6. [[Reinforcement Learning from Verifiable Rewards (RLVR)]]

![llm_training_pipeline.jpeg](llm_training_pipeline.jpeg)

Analogy
![pretraining_and_posttraining.png](pretraining_and_posttraining.png)

LLM at any point can be further modified by full fine-tuning on a new dataset or by [[LoRA - Low-Rank Adaptation of Large Language Models|LoRA]].
