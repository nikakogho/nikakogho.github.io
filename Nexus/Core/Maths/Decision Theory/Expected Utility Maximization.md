Idea in economics and [[Decision Theory]] that, as stated for example by [[Von Neumann-Morgenstern Utility Theorem]] (not the only [[Coherence Theorems|coherence theorem]]!), rational agents (roughly, agents that have coherent preferences) decide what to do based on what they expect will maximize their [[Utility Function]] U.

If an agent prefers an outcome X over outcome Y, we say its utility function gives X a higher utility, as in U(X) > U(Y), in which case we can also say X ≻ Y.

Real world situations often involve uncertainties, so we instead use *lotteries*. A lottery L is a probability distribution over possible outcomes (like 30% chance of outcome X, 40% chance of Y and 30% chance of Z), in this case the utility of L is the weighted utility of its outcomes:
$$ U(L)= E_{o \sim L} [U(o)] \\ = \sum_o P(o | L)U(o) $$
Where
- U is the utility function
- L is the lottery
- E is expected value (weighted sum)
- o is each option in L
- U(o) is value of outcome o
- P(o | L) is probability of outcome o in L
