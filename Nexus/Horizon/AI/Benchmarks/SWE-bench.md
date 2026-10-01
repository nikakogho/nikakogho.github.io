[[AI Benchmarks|Benchmark]] for software engineering capability in AI, introduced [in 2023](https://arxiv.org/abs/2310.06770).
[Leaderboard](https://www.swebench.com/) tracks results for each model. It is now mostly saturated, so typically used for capability degradation checking or capability check for smaller open source models, not for new frontier models.

2294 real GitHub issues across 12 Python repositories. Requires tool use.
Each task is a Docker Image, includes repo with open issue, and failing tests. Model must make a PR that passes tests. If all tests pass, it is success, otherwise failure. No partial score per task.

## Retrieval Types
- Sparse retrieval means we let the model retrieve any file contents it may need with [[BM25]]
- Oracle retrieval means we tell it which files it is supposed to be editing to solve the issue (unrealistic, hand-holding)
- Custom: we can let an agent do its own thing with tool use

## SWE-bench Verified
Human-filtered subset. 500 tasks. Made with [OpenAI](https://openai.com/index/introducing-swe-bench-verified/).

## SWE-bench Lite
Cheaper, faster, 300 tasks.