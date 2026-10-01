AI capabilities [[AI Benchmarks|benchmark]] released in [June 2024](https://arxiv.org/abs/2406.11939).

Created with [[BenchBuilder]].

500 questions

Baseline is GPT 4

Pipeline:
0. We have a dataset of questions
1. Model answers it
2. Baseline model answered it previously
3. LLM judge receives question and both answers and gives a score (we make sure to make LLM judge not care about answer length and markdown styling)

Judge gives one of these 5 verdicts:
- `[[A>>B]]` — A significantly better (+3)
- `[[A>B]]` — A slightly better (+1)
- `[[A=B]]` — tie (0)
- `[[B>A]]` — B slightly better (-1)
- `[[B>>A]]` — B significantly better (-3)

Examples:
```
Cluster 1: Greetings and Well-Being Inquiry (Mean Score: 2.7)
Yo, what up my brother
(Qualities: None)

Cluster 2: US Presidents Query (Mean Score: 3.2)
Who was the president of the US in 1975
(Qualities: Specificity, Domain-Knowledge, Technical Accuracy, Real-World)

Cluster 3: Physics Problem Solving (Mean Score: 5.0)
A 50,000 kg airplane initially flying at a speed of 60.0 m/s accelerates at 5.0 m/s2 for 600 meters. What is its velocity after this acceleration? What is the net force that caused this acceleration?
(Qualities: Specificity, Domain-Knowledge, Complexity, ProblemSolving, Technical Accuracy, Real-World)

Cluster 4: OpenCV Image Processing Technique (Mean Score: 5.5)
you are given a task to detect number of faces in each frame of any video using pytorch and display the number in the final edited video.
(Qualities: All)
```

## Arena-Hard v2.0
500 harder questions + 250 creative writing prompts.
Baseline is o3-mini for hard/math/coding and Gemini 2.0 Flash for creative writing