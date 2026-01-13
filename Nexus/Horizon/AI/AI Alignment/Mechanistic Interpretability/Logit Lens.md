Technique in [[Mechanistic Interpretability]] for [[Transformer]]-based [[Large Language Models]].

We apply the unembedding matrix in an earlier layer of [[Residual Stream]] to see what token is being predicted here. Helps for locating which neurons/layers store what concepts/features.

[Example video](https://www.youtube.com/watch?v=VfzKnAiY7ow)

## Code
With [[TransformerLens]] this is as simple as
``` python
# pip install transformer_lens torch

import torch
from transformer_lens import HookedTransformer

device = "cuda" if torch.cuda.is_available() else "cpu"
model = HookedTransformer.from_pretrained("gpt2-small", device=device)

prompt = "The robot rolled up to the gas station, swiped its card, grabbed the nozzle, and began filling its engine using the"
tokens = model.to_tokens(prompt)

# Cache just resid_post to save memory
logits, cache = model.run_with_cache(
    tokens,
    names_filter=lambda name: "resid_post" in name
)

pos = -1  # last prompt position -> next-token distribution

def topk_tokens(logits_1d, k=8):
    vals, idx = torch.topk(logits_1d, k)
    toks = model.to_str_tokens(idx)  # token IDs -> readable strings
    return list(zip(toks, [float(v) for v in vals.detach().cpu()]))

print("\n=== Logit lens (layer-wise) ===")
for layer in range(model.cfg.n_layers):
    resid = cache["resid_post", layer]              # [batch, seq, d_model]
    ln_resid = model.ln_final(resid)                # apply final LayerNorm
    layer_logits = model.unembed(ln_resid)[:, pos, :]  # [batch, vocab]
    print(f"Layer {layer:02d}:", topk_tokens(layer_logits[0], k=8))

print("\n=== Final model logits (for comparison) ===")
print("Final:", topk_tokens(logits[0, pos, :], k=8))
```
