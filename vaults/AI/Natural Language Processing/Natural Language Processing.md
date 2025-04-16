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
![Pasted\_image\_20250416174120.png](pasted_image_20250416174120.png)
![Pasted\_image\_20250416174047.png](pasted_image_20250416174047.png)Basically to calculate P(a) we calculate
Positive P = P(b | a) * P(c | a) * P(d | a) * P(d | a) * P(e | a)
and Negative P = P(b | ¬a) * P(c | ¬a) * P(d | ¬a) * P(e | ¬a)

and normalize them so positive P + negative P = 1 and our positive P then is P(a)