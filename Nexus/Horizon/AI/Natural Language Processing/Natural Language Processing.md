Features

* Automatic summary
* Information extraction
* Language identification
* [[Speech Recognition]] (speech-to-text)
* Text-to-speech
* Machine translation
* Named entity recognition
* Word sense disambiguation
* Detecting sarcasm (apparently hard)
* etc.

## [[Formal Grammar]]

Rules to generate language

## [[n-gram]]

Predicting next item (character, word, token) based on last n items
Used in [[Large Language Models]]

### Bag of words model

Each time we find a word that comes after this n-gram we put it in this n-gram's bag (more common words are put in more times)
Then when predicting next word for this n-gram we randomly draw from this bag

### Naive Bayes
P(b | a) = P(a | b) \* P(b) / P(a)

We can simplify a complex conditional and say that if we are asked to calculate a given b, c, d, e we can say it like this
![Pasted\_image\_20250416174120.png](Another%20Bayesian%20Probabilities%20Table.png)
![Pasted\_image\_20250416174047.png](Bayesian%20Probabilities%20Table.png)Basically to calculate P(a) we calculate
Positive P = P(b | a) * P(c | a) * P(d | a) * P(d | a) * P(e | a)
and Negative P = P(b | ¬a) * P(c | ¬a) * P(d | ¬a) * P(e | ¬a)

and normalize them so positive P + negative P = 1 and our positive P then is P(a)

#### Additive smoothing
To make sure we don't exclude a possibility just because one key was never found (just because word "grandson" was never mentioned in a positive message, the previous logic would assume all messages must be negative), we add a constant value **α** to all probabilities to avoid multiplying by zero

##### Laplace Smoothing
α = 1

## Information retrieval
Find info based on query

### Topic modeling
Find out what a document is about

### tf-tf-idf
tf = term frequency = how many times this word appears
idf = inverse document frequency = how common/rare this word is = log (total documents / documents with this word)

tf-idf = tf * idf and is used to measure importance of words (maximized for words that show up many times but in few documents)

## Vector Representation of Words
Transform words to vectors, with similar meaning words having similar values
Words can be said to have similar meaning if they appear in similar context

Vector is weights coming from this node, if word is assumed to be an input node in a **word2vec** [[Artificial Neural Network|neural network]]

This is called an [[Embedding Space]]
