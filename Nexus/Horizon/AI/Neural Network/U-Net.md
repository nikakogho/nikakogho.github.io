A [[Convolutional Neural Network]] used for [[Stable Diffusion]] ([[Image Generation]]) or object detection.
Uses [[Residual Network#ResidualBlock|residual blocks]].

2 main paths (both made of residual blocks):

1. Encoder (contracting) - makes image progressively smaller like a typical [[Convolutional Neural Network]] and increases number of channels. Tries to capture semantic content (the "what" of the image)
2. Decoder (expansive) - takes compressed info of encoder and upsamples it, making the image larger and larger till getting to full size

Features of first encoder blocks are sent straight to decoder elements by long range skip connections

## For Image Segmentation

Classifying each pixel as belonging to one of the categories (ground, car, person...)
![u_net_image_segmentation.png](u_net_image_segmentation.png)
![unet_image_segmentation_detailed.png](unet_image_segmentation_detailed.png)

## Text To Image

Uses [[Attention (in Artificial Neural Network)|cross-attention]] to figure out how to turn a vector (gained by tokenizing text input) into rules of what to focus on now and how to change things
