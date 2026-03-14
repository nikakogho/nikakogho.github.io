[[Markov Model]] where the actual transitions are between hidden states but instead we see the operations that produce them. Can think of it as a state machine like
![HMM_state_machine.png](hmm_state_machine.png)

Or like a zero-one-random (Z1R) process that emits a 0, then a 1, then a random between 0 and 1 and repeats, so ...01R01R01R01R...
![z1r_process.png](z1r_process.png)

## Transition Matrix

Matrix that describes probability of going from state A to state B.
Horizontal is "from" options and vertical is "to" options so vertical sums to 1
![hmm_transition_matrix.png](hmm_transition_matrix.png)
