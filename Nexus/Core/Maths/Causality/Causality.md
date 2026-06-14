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
3. Counterfactuals - reasoning about how Y would differ if instead of X I had done Z - TODO formula here

## Confounding

Essentially the difference between P(Y | X) and P(Y | do(X)), as in what assumptions we must change if we are naturally observing X vs manually fixing it to some value. The idea being that naturally the factors that determine X could also be affecting Y (confounding).

**Deconfounding** is controlling for (or not controlling for) variables such that we end up with a **causal diagram** where no variable causally affects both X and Y, except through X.

### Deconfounding Games

#### Game 1

![causality_game_1.jpeg](causality_game_1.jpeg)
Here nothing affects X so we shouldn’t control for any variable. In fact if we do control for either A or B then we are affecting X -> Y path and harming our study.

#### Game 2

![causality_game_2.jpeg](causality_game_2.jpeg)
Here also there is no variable that affects both X and Y without going through X’s path. As in, sure A affects X and it affects Y through X but it doesn’t affect Y if we remove its connection to X so we don’t need to control for anything.

And in fact if we were to control for B or C then we would be connecting A and D to each other and then we would have the problem of affecting Y through A (A ~ D -> E -> Y),
although that harm would be cancelled out if we controlled for D.

We would again be harmed if we controlled for E though as that would block X’s causal effect on Y.

#### Game 3

![causality_game_3.jpeg](causality_game_3.jpeg)
Here B is a confounder as it directly affects both X and Y so we must control for it.

#### Game 4

![causality_game_4.jpeg](causality_game_4.jpeg)
Here X has no causal effect on Y, and we dont’t have any confounders.
But if we were to control for B then suddenly it would link X and Y (unless we also controlled for A or C to reclose the pipe).

#### Game 5

![causality_game_5.jpeg](causality_game_5.jpeg)
Here C is a confounder since it causally affects both X and Y.

We can deconfound this either by just controlling for C, or by controlling for both B and A (because controllig for B alone opens up the A - C pipe).e controllig for B alone opens up the A - C pipe).
e controllig for B alone opens up the A - C pipe).