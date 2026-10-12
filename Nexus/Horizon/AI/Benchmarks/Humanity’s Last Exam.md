[[AI Benchmarks|AI capabilities benchmark]] made [in Jan 2025](https://arxiv.org/abs/2501.14249) by many people, including [[Dan Hendrycks]] and [[Alexandr Wang]].

[Website and leaderboard](https://lastexam.ai).

Closed ended, multi-modal benchmark with public part 2500 questions across STEM, humanities, etc + private test set.
MCQ and questions with exact string/numeric answers (but cannot be easily googled).

Meant to be a successor to [[MMLU]].

## Questions
2500 in public set, across STEM, humanities, etc.
![[HLE domains.jpeg]]

24% are MCQ.
76% are exact match (must give exact string/numeric answer).

14% have both text and image.

## Pipeline Used To Create Dataset
0. Question gets submitted
1. Gets checked that current LLMs can’t solve it
2. Iteratively refinrd by human experts
3. Approved by human experts
4. Go into either public or private set
![[HLE pipeline.jpeg]]

## Issues
~46% is flawed though [according to Epoch AI](https://epoch.ai/benchmarks/hle/review) randomly auditing 48 questions.

## HLE-Verified
Verified subset of 1800 questions

## HLE-Diamond
Released 22 Sep 2026, has 1000 questions manually checked for 1 year before release.

Scores:
- GPT 6 Astra no tools: 59.9%
- GPT 6 Astra with tools: 82.9%
- Fable 5.1 no tools: 50.7%
- Fable with tools: 72.3%
- Opus 5.5 no tools: 54.6%
- Opus 5.5 with tools: 73.9%