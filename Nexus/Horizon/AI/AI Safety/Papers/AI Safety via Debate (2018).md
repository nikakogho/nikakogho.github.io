From [[Geoffrey Irving]], [[Paul Christiano]] and [[Dario Amodei]] while at [[OpenAI]].
Introduced a solution to [[Scalable Oversight]] problem: [[AI Safety with Debate]].

Assuming we can have 2 adversarial agents that really are trying to convince a judge of “X” and “Y” (which may or may not turn be the same statement) they each make their case over a sequence of *n* statements and then the judge decides which option to pick.

Central assumption: **refuting a lie is easier than lying, sufficiently so that the less intelligence / nonexpert judge can eventually tell the truth by just seeing the transcript**.

Many possible arguments can be made by both sides, and going through entire evidence could overwhelm the judge. This is solved by only sampling a single trajectory and **trusting** that both agents presented their best case, played their best move.
![[AI safety via debate branching.jpeg]]
