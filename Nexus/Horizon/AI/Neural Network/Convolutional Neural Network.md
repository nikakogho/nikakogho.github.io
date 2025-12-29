Type of [[Artificial Neural Network|neural network]]

Often used in [[Computer Vision]]
**Convolution** - applying a filter that uses kernel matrix on each pixel to add some mixture of its neighbors to it, useful for feature extraction

Can be used to detect curve, shape, edge, etc.

Hype for CNNs was dead after [[AI Winter]] but in 2012 [[AlexNet]] revived it.

## 1D Convolution

* Size = how many neurons used
* Stride = step size
* Dilation = each convolution skips some values (can think of it as setting some middle weights to 0)
  ![stride_kernel_size_dilation.jpeg](stride_kernel_size_dilation.jpeg)

## 2D Convolution

Use square matrix as kernel
![2d_conv.jpeg](2d_conv.jpeg)
![2d_conv_image.jpeg](2d_conv_image.jpeg)

## Receptive Field

How many neurons of each previous layer affect this neuron
![cnn_receptive_field.jpeg](cnn_receptive_field.jpeg)

## Downsampling

6x6 image can become 3x3 by applying some function upon each 2x2 section of it.
Reduces image size.

Example on 4x4 image:
![nn_downsampling_ways.jpeg](nn_downsampling_ways.jpeg)

* a) Sub-sampling: just take first element of each group
* b) Max pooling: take max member
* c) Mean pooling: take average

## Upsampling

To increase resolution

![nn_upsampling_ways.jpeg](nn_upsampling_ways.jpeg)

## Changing Channel Count

### 1x1 Convolution

![1x1_convolution.jpeg](1x1_convolution.jpeg)
