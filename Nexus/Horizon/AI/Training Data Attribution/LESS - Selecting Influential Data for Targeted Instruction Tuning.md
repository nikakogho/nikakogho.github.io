**L**ow-rank gradi**E**nt **S**imilarity **Search** (LESS), a [[Training Data Attribution]] method for [[Supervised Fine-Tuning (SFT)|SFT]] introduced in [this paper](https://arxiv.org/pdf/2402.04333). It is a cheaper variant of [[Influence Functions]].

Its main purpose is **targeted instruction tuning**: given a few examples of training data showing our desired behavior/capability, how do we select only subset of our training data to perform better on our metrics than we would with our entire training data?

Essentially this is removing some training data for the purpose of keeping just the most useful parts.

Limitation: this method does **NOT** let us add new data to our training set. However, the paper found that often training on just the best 5% outperformed training on the full dataset.

## Steps
![[LESS steps.png]]
### 1: Warmup [[LoRA]] Training
From our dataset D we take a random subset D<sub>warmup</sub> (5% of D) and train a LoRA on it for N epochs, checkpointing the model at each epoch.

### 2: Gradient Datastore
#### 2.1. Calculating Gradients
Each LoRA checkpoint has a total of P parameters. We calculate gradient for each sequence in our dataset D (with average loss on each completion token), and we store the resulting gradients matrix of size |D| x P for each LoRA checkpoint.

#### 2.2. Random Projection
For each one, use a random vector to project this matrix down to size |D| x d instead to make it computationally cheaper. These are our final **gradient datastores**.

### 3: Training Data Selection
0. We take the few examples of our desired behavior (from the dataset D or from elsewhere), call this D<sub>val</sub>. It will have m subtasks, such that each subtask is multiple elements of D<sub>val</sub> (like 5 examples of good reasoning)
1. We compute gradient features for each subtask:
	1. average of how they would change our LoRA (for each LoRA checkpoint)
	2. project down to d dimensions
2. We get validation set's gradient features matrix of size m x d for each LoRA checkpoint.
3. For each checkpoint i, we compute cosine similarity between each validation subtask's entry in features matrix and each overall dataset's entry in gradient datastore, so get a cosine similarities matrix of size |D| x m at each checkpoint
4. We now combine the cosine similarity matrix S<sub>i</sub> of each checkpoint i, weighted by the learning rate η<sub>i</sub> of that epoch. We get matrix I of size |D| x m where $$I[x, j] = \sum_i{η_iS_i[x,j]}$$ At this point our I matrix tells us how much each entry from our dataset D helps each of our m subtasks that we care about. This matrix I is called Inf<sub>Adam</sub>
5. We then take the maximum of those m values for each entry to get its maximal valuableness to get final score for each dataset entry x:$$score_x = max(I[x,:])$$ **Warning**: entry in our dataset can get away with being actively harmful across multiple features as long as it's good enough in one feature
6. We then sort our dataset in descending order and take some top K elements as our new training data

### 4: Train on Selected Data