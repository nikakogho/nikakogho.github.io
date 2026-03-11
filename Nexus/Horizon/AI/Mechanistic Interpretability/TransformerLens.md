Open-source tool (popularized by [[Neel Nanda]]) for [[Mechanistic Interpretability]] that wraps transformer models in a `HookedTransformer`, making it easy to:
- Run models with [[Activation Patching]]
- **Inspect internals** (residual stream, attention patterns, MLP activations, etc.)
- **Intervene** using forward hooks (ablation, activation patching, [[Steering Vectors|steering vectors]])

[Github](https://github.com/TransformerLensOrg/TransformerLens)

## Core idea
A transformer is basically a repeated stack of blocks, and TransformerLens exposes “hook points” inside those blocks.

Key workflow:
1. tokenize prompt
2. run with cache → `(logits, cache)`
3. read tensors from cache using hook names
4. optionally run again with hooks to modify tensors and compare outputs

## Minimal usage

```python
from transformer_lens import HookedTransformer

model = HookedTransformer.from_pretrained("gpt2-small")

prompt = "Hello World"
logits, cache = model.run_with_cache(prompt)

# logits: [batch, seq, vocab]
# cache: dict-like mapping hook_name -> activation tensor
```

## [[Residual Stream]]
"State” that gets updated layer by layer.

Common hook points per layer `L`:
- `blocks.L.hook_resid_pre` : residual entering the block
- `blocks.L.hook_resid_mid` : residual after attention add, before MLP
- `blocks.L.hook_resid_post` : residual leaving the block (after MLP add)

This is why `hook_resid_post` shows up everywhere: it’s a clean “layer output” representation for reading/patching/steering.

## Attention / MLP hook points (cheat sheet)
Layer block naming pattern: `blocks.{layer}....`
Attention (within `blocks.L.attn`):
- `blocks.L.attn.hook_q`, `hook_k`, `hook_v` (per-head Q/K/V)
- `blocks.L.attn.hook_attn_scores` (pre-SoftMax scores)
- `blocks.L.attn.hook_pattern` (post-SoftMax attention probabilities)
- `blocks.L.attn.hook_z` (per-head output before final projection)

MLP (within `blocks.L.mlp`):
- `blocks.L.mlp.hook_pre` (MLP hidden / pre-activation input depending on config)
- `blocks.L.mlp.hook_post` (MLP output)

## Cache only what you need

```python
from transformer_lens import HookedTransformer

model = HookedTransformer.from_pretrained("gpt2-small")
prompt = "The robot picked up the wrench and tightened the bolt."

logits, cache = model.run_with_cache(
    prompt,
    names_filter=lambda name: (
        "hook_resid_post" in name
        or "attn.hook_pattern" in name
    )
)

# Example: layer 3 residual stream output
resid3 = cache["blocks.3.hook_resid_post"]  # [batch, seq, d_model]
```

## Quick “read” example: look at an attention head

```python
from transformer_lens import HookedTransformer
import torch

model = HookedTransformer.from_pretrained("gpt2-small")
prompt = "The robot rolled up to the gas station, grabbed the nozzle, and began filling its engine."

tokens = model.to_tokens(prompt)
str_tokens = model.to_str_tokens(tokens[0])

logits, cache = model.run_with_cache(
    tokens,
    names_filter=lambda name: "attn.hook_pattern" in name
)

# pattern: [batch, n_heads, query_pos, key_pos]
pattern = cache["blocks.0.attn.hook_pattern"][0]
head = 0
query_pos = -1  # last token position (predicting next token)

attn = pattern[head, query_pos]           # [key_pos]
best_k = int(torch.argmax(attn).item())   # which earlier token is most attended to?

print("Most attended token:", best_k, str_tokens[best_k])
```

## Interventions with hooks (the “superpower”)
Can modify activations during a forward pass.

### Example: ablate (zero) one attention head output

```python
from transformer_lens import HookedTransformer
from functools import partial
import torch

model = HookedTransformer.from_pretrained("gpt2-small")
prompt = "The robot rolled up to the gas station, grabbed the nozzle, and began filling its engine using the"
tokens = model.to_tokens(prompt)

def ablate_head_z(z, hook, head_idx: int):
    # z: [batch, seq, n_heads, d_head]
    z = z.clone()
    z[:, :, head_idx, :] = 0.0
    return z

layer = 5
head = 7
hook_name = f"blocks.{layer}.attn.hook_z"

logits_normal = model(tokens)
logits_ablated = model.run_with_hooks(
    tokens,
    fwd_hooks=[(hook_name, partial(ablate_head_z, head_idx=head))]
)

# Compare top next token
pos = -1
p1 = torch.softmax(logits_normal[0, pos], dim=-1)
p2 = torch.softmax(logits_ablated[0, pos], dim=-1)
print("KL(normal||ablated):", torch.sum(p1 * (p1.log() - p2.log())).item())
```

## Activation patching (core causal tool)
Run prompt A → cache internals → run prompt B while replacing a chosen activation with A’s cached value.
```python
from transformer_lens import HookedTransformer

model = HookedTransformer.from_pretrained("gpt2-small")

prompt_A = "Alice gave Bob a book. Bob thanked Alice."
prompt_B = "Alice gave Bob a book. Bob insulted Alice."

tokens_A = model.to_tokens(prompt_A)
tokens_B = model.to_tokens(prompt_B)

_, cache_A = model.run_with_cache(tokens_A, names_filter=lambda n: "hook_resid_post" in n)

layer = 6
hookpoint = f"blocks.{layer}.hook_resid_post"

def patch_resid_post(resid, hook):
    # Replace the whole tensor (simple version). You can also patch only specific positions.
    return cache_A[hookpoint]

logits_patched = model.run_with_hooks(
    tokens_B,
    fwd_hooks=[(hookpoint, patch_resid_post)]
)
```

## [[Logit Lens]] (common pattern, even if not using it)

When decoding intermediate residual states into token logits, you typically do:
- apply final LayerNorm (`model.ln_final`)
- unembed (`model.unembed`)

(That mirrors what the actual model does at the end.)

## Shape
- Most cached tensors start with `[batch, seq, ...]`
- Attention patterns: `[batch, n_heads, query_pos, key_pos]`
- Head-wise outputs often: `[batch, seq, n_heads, d_head]`
- “next token” analysis usually looks at `pos = -1` (last prompt token position)
