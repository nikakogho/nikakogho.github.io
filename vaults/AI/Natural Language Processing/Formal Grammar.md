Rules to generate language
Part of [[Natural Language Processing]]

## Context-Free Grammar
Generate sentences by replacing one symbol with other symbols
Context-free because does not depend on previous nor on future sentences

Non-terminal symbols

* N - Nouns
* V - Verbs
* D - Determiners

Terminal symbols are actual words that each non-terminal may resolve to

Example:
"She saw the city"

* N = "She" and "city"
* V = "saw"
* D = "the"

Could also have nested non-terminals

Example:
NP = noun-phrase
VP = verb-phrase
S = sentence

NP -> N | D N
VP -> V | NP
S -> NP VP

NP may be "city" or "the city"

S can be "The girl saw the city"
![Pasted\_image\_20250416151557.png](pasted_image_20250416151557.png)

**nltk** is a python library for this