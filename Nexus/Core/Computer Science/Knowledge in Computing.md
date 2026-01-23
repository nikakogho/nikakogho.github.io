## Propositional Logic
¬ ("not"), ∧ ("and") and ∨ ("or") symbols to build logical statements

Proposition defined as A, B, C, P, Q, whatever can denote some statement about the world
A = "it is raining today"
B = "I am wearing a green shirt"

All either true or false

### Implication
P → Q
If P is true then Q is true

Same as `¬P ∨ Q`

### Biconditional
P ↔ Q
P is true if and only if Q is true

Same as `(P ∧ Q) ∨ (¬P ∧ ¬Q)`

### Entailment
P ⊨ Q

"If P is true then we are absolutely certain that Q is true"

This is a higher statement that says that Q is already logically defined as true within P and that `P ∧ Q` is a tautology (redundant because Q being true was already part of P being true)

## Inference
Does our knowledge base infer a statement?
Is `KB ⊨ A` true?

We check for all possible models in our knowledge base, if A is always true then yes it entails A

### Example
P: it is Tuesday
Q: it is raining
R: Harry will go run

KB:
- (P ∧ ¬Q) → R
- P
- ¬Q

Query:
- R

Is `KB ⊨ A` true here?

We check it by iterating through all possible values of our symbols P Q R and making sure that each time KB is true, A is also true

## First-Order Logic
Constant symbols (“Harry”, “Hogwarts”, “Lion”)

Predicate (“Is a Person”, “Is scary”)
Predicate takes constants as input and gives true or false as output