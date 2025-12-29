A [[Convolutional Neural Network]] that did so well in 2012 that it revived hype in [[Deep Learning]].

Made by Alex Krizhesvky, [[Ilya Sutskever]] and [[Geoffrey Hinton]].

## Architecture

![alexnet.jpeg](alexnet.jpeg)
0\. Images are 224x224 RGB

1. Conv with 11x11 kernel, stride 4
2. MaxPool with 5x5 kernel
3. MaxPool
4. 3 Conva 3x3 kernels
5. 2 Fully Connected (FC) layers size 4096
6. FC layer size 1000
7. [[Softmax]]

Has ~60 million parameters, mostly in FC

## Training

* Trained for 90 epochs
* Trained on 1.2 million ImageNet images + data augmentation
* Took 5-6 days
* Used ~1.43 GFLOPs
* [[Optimization#Stochastic Gradient Descent|Stochastic Gradient Descent]] with 0.9 momentum and batch size 128
* Used 2 Nvidia GTX 580 GPUs
* [[Overfitting|Dropout]] with p = 0.5 in first 2 FC layers
* L2 weight decay
