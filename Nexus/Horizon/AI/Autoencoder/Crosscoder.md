Explained in detail [here](https://transformer-circuits.pub/2024/crosscoders/index.html).

Model diffing means comparing 2 models, in this case a base model vs post-trained model.

We make a structure like a [[Sparse Autoencoder]] but it takes activations of both models, learns one latent that includes both same and unique features, and then reconstructs both.
![autoenc_vs_transcoder_vs_crosscoder.png](autoenc_vs_transcoder_vs_crosscoder.png)
