How much of our hardware's FLOPS are we actually using:
$$ MFU = \frac{Model's\ FLOPs\ per\ token\ *\ tokens\ per\ second}{Theoretical\ max\ FLOPS\ of\ hardware} $$

## Overall
- Good frontier pretraining MFU: 45-60%
- Good open-source large training MFU: 35-50%
- Normal hobby/academic finetune MFU: 5-25%
- Good SFT on serious infra: 25-45%
- Online RLHF / RLVR: 5-30%
- Inference prefill: 30-70%
- Inference decode batch=1: <1-5%
- Inference decode server-batched (batch size 1-512, possibly more with attention sparsity tricks): 5-30%

## When Training Frontier Models
- Pretraining: 40-60%
- Warmup/debugging/stalls: 10-40%
- SFT: 15-45%
- LoRA / QLoRA: irrelevant in frontier
- Reward Model Training / DPO: 10-40%
- RLHF / PPO / GRPO / agentic RL: 5-30%

## When Training Open Source / Open Weight Models
- Pretraining: 30-50%
- Warmup/debugging/stalls: 5-35%
- SFT: 10-35%
- LoRA / QLoRA: 1-25%
- Reward Model Training / DPO: 5-30%
- RLHF / PPO / GRPO / agentic RL: 2-20%
