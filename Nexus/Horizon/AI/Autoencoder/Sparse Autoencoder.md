Used in [[Mechanistic Interpretability]] research

Type of [[AutoEncoder]] that forces most neurons in hidden layer to stay quiet (sparse) so that it can avoid memorizing and has to figure out patterns.
More neurons in hidden layer than in original input.
Assumes original input neurons are polysemantic but can be broken down into multiple monosemantic neurons.

![SAE.png](sae.png)

Not as creative as [[Variational Auto Encoder (VAE)]], but better for learning features and understanding exactly what is going on.

Pros:

* Finding unknown unknowns (unsupervised exploration)
* Sometimes for finding good [[Steering Vectors]]
* Getting a general idea of a part of the model's workings

Cons:

* Can't give guarantees about safety since it can't guarantee that any particular concept (such as deception, eval awareness, hidden goal or some other safety-relevant one) is linear and findable
* Not as good when you know what you are looking for
* False positives sometimes
* Not well red-teamed

## Problems with SAEs

### Feature Absorption

Since L1 loss incentivizes fewest amount of neurons to activate, overlapping concepts get unnaturally learned as "A except B" instead of just "A"
![SAE_feature_absorption.png](sae_feature_absorption.png)

This is fixable with [Matryoshka SAEs](https://www.lesswrong.com/posts/rKM9b6B2LqwSB5ToN/learning-multi-level-features-with-matryoshka-saes)

### Feature Splitting

![SAE_feature_splitting.png](sae_feature_splitting.png)
This can also be solved with other architectures like Matryoshka SAEs.
