Weights of a [[Artificial Neural Network|neural network]] can be stolen in a couple of ways and each way needs a method of protection or bad actors can obtain the network and remove restrictions and [[Securing AI Models From Misuse|misuse the model]].

[RAND report](https://www.rand.org/pubs/research_reports/RRA2849-1.html) summarizes main approaches to securing weights.

[[Keri Warr]] is the head of protecting from this at [[Anthropic]].

## Operational Capacity Levels

* OC1 (Amateur) - 1 hobbyist hacker with < $1000 budget trying surface level attacks for days
* OC2 (Professional opportunistic) - small group with < $10K with some cyber infra for weeks
* OC3 (Cybercrime syndicates and insiders) - 10 or so experts with < $1 million or an insider, trying for months
* OC4 (State-level orgs) - 100 pros spending a year with < $10 million
* OC5 (Top tier state-level) - 1000 pros backed by a state spending years with ~ $1 billion

## Security Levels

5 levels, level x meaning it protects from OC x.

SL5 currently considered impossible without extra government help

## Attack Vectors

![weight_exfiltration_attack_vectors.png](weight_exfiltration_attack_vectors.png)
