A tool for autonomously looking for vulnerabilities and [[AI Alignment|misalignment]] in [[Large Language Models]]. Described [here](https://alignment.anthropic.com/2025/petri/).
![[petri basic.jpeg]]

## Process
We have 3 models:
- The target model being evaluated
- The audit model that generates prompts and environment and engages the target model based on seed instructions from the user
- A judge model that evaluates the final transcript of an interaction
![[petri pipeline.jpeg]]

In principle a seed can be created also by an AI model, but understanding of at least how the seeds were made is necessary to be able to reason about what is happening and what the results mean.

This is quite similar to [[Model Diffing Agents]].