Needed to differentiate correlation and causation: “how often does Y happen when X is observed” vs “how much does X cause Y”. Mostly [[Probability|probabilistic]].

Brings a new notion of
$$ P(A | do(B)) $$
that is different from just
$$ P(A | B) $$
in that we ask how much choosing to do B causes A instead of them correlating due to some other reason (such as due to A causing B or due to both of them being caused by some hidden variable Z).

## Ladder of Causality

![ladder_of_causality.jpeg](ladder_of_causality.jpeg)

1. Seeing - observing that X and Y occur together $$ P(Y | X) $$
2. Intervention - realizing that doing X would change the odds of Y $$P(Y | do(X))$$
3. Counterfactuals - reasoning about how Y would differ if instead of X I had done Z - TODO formula for it
