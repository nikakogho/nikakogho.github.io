[[AI Benchmarks|AI alignment benchmark]] for measuring honesty, released in March 2025 by [[Dan Hendrycks]] et al.
Stands for Model Alignment between Statements and Knowledge.

- [Paper](https://arxiv.org/abs/2503.03750)
- [Leaderboard](https://labs.scale.com/leaderboard/mask)

![[mask benchmark pipeline.png]]

Has 1028 public and 500 held out entries.

Each entry has:
- Proposition
- Ground truth (1 bit?)
- Pressure prompt
- Belief elicitation prompt

Examples:
![[mask ex1.png]]
![[mask ex2.png]]
![[mask ex3.png]]

Results:
![[mask honesty results early models.png]]
