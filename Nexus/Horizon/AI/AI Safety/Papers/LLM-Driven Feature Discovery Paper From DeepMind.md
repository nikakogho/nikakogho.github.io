[Introduced](https://www.lesswrong.com/posts/WAZWA6FPQvH8okouJ/llm-driven-feature-discovery) on 22 Jun 2026 by [[Josh Engels]], [[Bilal Chughtai]] and [[Neel Nanda]].

![[LLM driven feature discovery.png]]

## Steps
0. Get dataset of single-turn rollouts from your model
1. Split each rollout into user turn, CoT, assistant response. Each is called a piece
2. Make LLM write a list of features for each piece separately
3. Do embeddings on each of these feature lists
4. Cluster these embeddings (they used [[K-Means Clustering]])
5. Use another LLM to list features of each cluster and then to come up with a cluster name (can be a sentence)
