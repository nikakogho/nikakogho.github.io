Extension of [[Thought Anchors Paper]]. [Link](https://arxiv.org/pdf/2510.27484).

Basically offering an enhanced way of running evals.

![[thought branches paper.png]]

**Resilience**: number of times we must remove a sentence from CoT for it to not reappear anymore.

They found that
- Some sentences are not as causally relevant as the sentences suggest (like in agentic misalignment evals, explicitly mentioning self-preservation was not causally relevant for whether or not the model really would blackmail)
- Resampling is much more effective than adding a custom off-policy sentence