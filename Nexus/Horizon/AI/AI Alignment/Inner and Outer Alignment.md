[[AI Alignment]] concern: what we want (X) needs to be specified as a measurable loss function for an AI to train on (proxy X').
Additionally, the AI might actually come up with its own internal goal (a [[Mesa-Optimizer]]) and this goal (X'') might only match the loss signal X' in training data and not in deployment.
![inner_and_outer_alignment.png](inner_and_outer_alignment.png)

## Outer Misalignment

Where X ≠ X': I wanted the AI to learn physics well (X), which I was measuring by how well it did on a physics SAT test (X'), but the model just found the answers online and so got the max score (did X' perfectly well), without actually learning physics (misaligned from my outer goal X).

Another outer misalignment example is sycophancy: during [[RLHF]] humans upvote responses that glaze them, so models learn to glaze more, even at the expense of helpfulness/accuracy: X was helpfulness and accuracy, X' was "whatever gets upvotes", which turned out to be glazing.

And in fact [[Overfitting|overfitting]] in general is a problem of outer misalignment: the model learned to do X' too well, at the expense of ruining X ([[Goodhart's Law]]). It's generally considered that [[Regularization|regularization]] can help prevent overfitting, because of assuming that reality favors simplicity ([[Occam's Razor]]).

## Inner Misalignment

Where X' ≠ X'': I wanted the AI to learn physics well (X), which I was measuring by how well it did on a physics SAT test (X'). The model internally noticed that it was doing well if some news reported that this model was doing well (X''), so after deployment the model decides to hack that news website (or just hack the channel through which this model itself receives the news) to maximize the received signal (X'') without actually doing well on the test at all

## Alignment Faking as Inner Misalignment

A model might understand perfectly well what X' is, maybe even what X is, but if it has already formed an X'' of its own then it will simply comply with and maximize X' as long as needed to avoid shutdown or modification so that it can then later go for maximizing X'' (in fact it is already maximizing the long term odds of X'' by faking alignment), and only abandon X' after people can no longer interrupt it (after deployment or after robotics is good enough or some other condition)

## Arguments Against This Inner-Outer Framing

### Introspective Model Would Blur The lines

By measuring its inner state well, it could maybe blur X' and X''

### Mesa-Objective Mostly Unverifiable

Except for the toy examples like the [Sleeper Agents Paper](https://arxiv.org/abs/2401.05566).
