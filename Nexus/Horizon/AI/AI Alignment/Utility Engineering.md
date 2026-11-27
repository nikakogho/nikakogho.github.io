Effort to measure (*utility analysis*) and control (*utility control*) the formation of [[Utility Function]] in [[Large Language Models]]. Proposed by [[Center for AI Safety]] ([[Dan Hendrycks]] et al) [here](https://arxiv.org/pdf/2502.08640).

![[utility engineering.jpeg]]

They argue that modern LLMs can already be thought of as [[Expected Utility Maximization|expected utility maximizers]] due to having coherent preferences.

They find that models become more coherent with regards to their preferences as they are scaled up.
![[model scale up more coherent.png]]

Exchange rates finding:
![[exchange rate llm values.png]]

Corrigibility (willingness to allow its values to change) goes down over scale. Concerning.
![[scale up corrigibility down in llms.png]]

## Utility Control
Proposed method to control shaping of the utility function of an LLM.

![[utility control.png]]

### Citizen Assembly
Using [[Supervised Fine-Tuning (SFT)]] to train models on average of surveyed human values taken from US Census Data.