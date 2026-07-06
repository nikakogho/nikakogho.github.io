A [[LLM Training Stages|training stage]] of [[Large Language Models]] that comes after [[Pretraining LLM|pretraining]] and [[Midtraining LLM|midtraining]], and is also known as instruction fine tuning (IFT).
Where model learns to simulate user-assistant dialogues and starts to become Helpful Honest Harmless.

This is [[Supervised Learning]] predicting tokens on data much like in pretraining, but less data smaller batch size shorter sequences, lower learning rate, and optimized not for general knowledge, but for
- learning user-assistant dialogue format, such as to continue “Where is Rome?” with “Rome is in Italy” and not with “Where is Paris? Where is Berlin?”
- harmlessness (refusals, steering away from dangerous talks, being polite)
- honesty
- training on much smaller expert data

After this we usually have [[RLHF]] and [[Reinforcement Learning from Verifiable Rewards (RLVR)|RLVR]].