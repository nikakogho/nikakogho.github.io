Typical [[RLHF]] has problems scaling to large [[Large Language Models|LLMs]] and to smarter-than-human models or just complex scenarios, so we need ways to scale the oversight capability of humans. Possibly by using other LLMs that are "on our side".

Intro from [[BlueDot Impact]] on scalable oversight [here](https://blog.bluedot.org/p/scalable-oversight-intro).

## Task Decomposition

Subtasks will be easier for humans to understand. Problematic if we can't decompose cleanly.

### Iterated Amplification

TODO

#### Iterated Amplification and Distillation (IDA)

TODO

## RL with AI Feedback

Broadly [[RLAIF]], most notably [[Constitutional AI]].

## Debate

AIs argue, human judge picks answer.

Possible problems:

* The more convincing sounding AI wins, which may not be the correct one (scamming incentivized)
* Models might cooperate to convince a human to pick an answer

## Weak-To-Strong Generalization

TODO

## Deliberative Alignment

Reason explicitly in chain of thought about the safety/alignment of the response, and in supervised fine-tuning we train the model on this clarified CoT.

Example:
![deliberative_alignment_example.png](deliberative_alignment_example.png)

Problems:

* [[Chain of Thought Faithfulness]] is not guaranteed
