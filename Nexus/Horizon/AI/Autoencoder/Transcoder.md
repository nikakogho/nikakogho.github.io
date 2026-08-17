Like a [[Sparse Autoencoder]] but instead of encoding and representing the [[Residual Stream]], it encodes and represents the MLP of a specific layer.

What SAE does: residual stream -> MLP<sub>in</sub> -> MLP<sub>h</sub> -> SAE -> MLP<sub>h reconstructed</sub> -> MLP<sub>out</sub> -> residual stream.

What transcoder does: residual stream -> MLP<sub>in</sub> -> transcoder -> MLP<sub>out</sub> -> residual stream.

So essentially reads activations of layer n and predicts activations of layer n+1, n+2, n+3...
![autoenc_vs_transcoder_vs_crosscoder.png](autoenc_vs_transcoder_vs_crosscoder.png)

![transcoder_mlp.png](transcoder_mlp.png)
