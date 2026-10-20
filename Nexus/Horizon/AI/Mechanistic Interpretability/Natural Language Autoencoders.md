A relatively new [[Mechanistic Interpretability]] technique: type of [[AutoEncoder]] used in [[Large Language Models]] where we take some activations (like say layer5 in residual stream), encode it into natural language text, and then decode this text back into those activations.

For this job we use a model that starts out initialized same as our LLM, in order to preserve the same prior for representation of ideas, and is then trained like a normal autoencoder and we hope that [[KL Divergence]] is enough to keep it such that the produced text is faithful.
Sort of a fancy cousin of [[Activation Oracles]].

Potential issue: it could be encoding activations in a way that doesn’t correspond to same meaning as common sense English reading of that text would suggest. 
Example: suppose some activations at layer l, called act<sub>l</sub> currently in reality represent something like “I am planning to cheat”, but our NLA learns to encode and decode with negation on both sides, so our displayed text becomes “I am not planning to cheat”, and it gets decoded right back into equivalent activations of “I am planning to cheat”. Though in principle we could maybe evaluate this by checking the text on examples where we feel more confident about ground truth scenarios.

TODO details and paper link

In any case, NLAs are a kind of tool where if it says nothing, we don’t know this means the model is safe, but if it does say something, we should pay attention more deeply.

