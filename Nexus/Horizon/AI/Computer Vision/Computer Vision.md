Often uses [[Convolutional Neural Network]] but can be done manually with some OpenCV and maths.

## [[Image Processing]]
Image is filtered by **kernels** such that neighboring pixels affect each other's values, useful for feature extraction

## [[Image Generation]]
Text or other image (or both) used to make new image

[[Stable Diffusion]] is a common method for it

## [[Motion Detection]]
Can be hardcoded but more often involves neural networks.
Can use complex sensors like [[LiDaR]], [[RGB-D Camera]], or regular camera.

## KIU Computational Project
My take on computer vision for a video motion detection as university project using only hardcoded algorithms [here](https://github.com/nikakogho/KIU_NP/tree/main/CP1).
The idea here was to manually hardcode edge detection by pixel value change in neighbors and to manually choose convolution kernels.
