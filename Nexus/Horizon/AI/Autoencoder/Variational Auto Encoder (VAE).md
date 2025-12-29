A type of [[AutoEncoder]] but instead of learning mapping in latent space, VAE learns distribution in latent space.

Typically with 2 [[Artificial Neural Network|neural networks]] where 1 learns to summarize input as distribution (mean and variance) and other learns to generate data based on that probability distribution

Can work with images, text, audio, video, genomics…
![VAE.png](vae.png)
