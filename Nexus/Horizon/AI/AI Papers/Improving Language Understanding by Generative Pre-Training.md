In 2018, [[OpenAI]] released [this paper](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf) about GPT-1.

Idea of pretraining a [[Artificial Neural Network|neural network]]was already demonstrated by Google in [Semi-supervised Sequence Learning](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/44267.pdf) but only applied to [[Recurrent Neural Network|RNNs]] and [[Long Short-Term Memory|LSTMs]]. Also, [[Transformer|transformer]] was introduced in "Attention Is All You Need".

[[Alec Radford]], [[Ilya Sutskever]] and others decided to combine these 2 ideas, and to pretrain a [[Large Language Models|large language model]], a decoder-only transformer, on the task of predicting the next token given a list of tokens so far. They found that pretraining generally on a lot of text first and then finetuning for a specific task (without changing the architecture much or at all) was competitive with making a custom architecture and from scratch training for each task, and achieved SOTA results in 9 out of 12 benchmarks. They also found that transformers did this job much better than LSTMs.

Due to GPT-1 being a language model, it also had an advantage that a specific task could simply be explained in text.

GPT-1 Stats:
- 117M parameters
- 12 layers, decoder-only
- 12 attention heads
- Trained on BooksCorpus (7000+ books)
	- 1-1.3B tokens per epoch
	- 100 epochs
	- 100-130B total tokens
- Context window of 512 tokens
- Character-level [[Byte-Pair Encoding]] tokenizer
- Vocabulary of 40 478 tokens (40 000 BPE merges)
- Unsupported characters (including most unicode) tokenized as `<unk>`
