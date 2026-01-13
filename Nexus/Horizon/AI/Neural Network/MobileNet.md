Efficient form of [[Convolutional Neural Network]] (typically 10x fewer computations needed) using **Depthwise Separable Convolution**.

Introduced by Google in 2017 in [this paper](https://arxiv.org/abs/1704.04861) for lower compute CNN to run on mobile.

## Architecture

![MobileNet_architecture.png](mobilenet_architecture.png)

## Depthwise Separable Convolution

2 parts: depthwise convolution and pointwise convolution

![Depthwise_Separable_Convolution.png](depthwise_separable_convolution.png)

### Depthwise Convolution

Use n<sub>channel</sub> amount of filters, each one applying only to one channel
![Depthwise_Convolution.png](depthwise_convolution.png)

### Pointwise Convolution

n<sub>out_channels</sub> amount of 1x1 convolutions to turn the h x w x n<sub>channel</sub> into h x w x n<sub>out_channels</sub>
![Depthwise_Separable_Convolution_2.png](depthwise_separable_convolution_2.png)

## MobileNet V2

Added a [[Residual Network]] and expansion step
![MobileNet_V2.png](mobilenet_v2.png)
