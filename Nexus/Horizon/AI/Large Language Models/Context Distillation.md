Type of [[Model Distillation]] where train a [[Large Language Models|large language model]] to answer a prompt X the way it would previously answer prompt C + X for some context C.
First introduced in [[A General Language Assistant as a Laboratory for Alignment]] by [[Anthropic]].

We generate ground truth by just querying our model with a prompt C + X and then use that ground truth Y as a training target and train (X, Y) pairs.

- Hard distillation: we train such that Y is one-hot encoded: exact next token that we got is 1 and all other tokens are 0
- Soft distillation: we train such that ground truth Y is the entire distribution and our loss function is [[KL Divergence]] loss between ground truth and our distribution for next token, so we pass way more information

Hard is typically preferred when 
- distilling models whose distribution we don’t have access to (like models queried in API sometimes)
- when we have storage issues (hard distillation stores 1 correct token, soft stores entire distribution over vocabulary)
- hard distribution can also work if student model has different vocabulary from teacher, while soft will need some adapting