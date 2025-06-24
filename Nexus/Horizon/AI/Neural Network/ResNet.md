Residual Network

Type of deep [[Convolutional Neural Network]] that solves [[Degradation Problem In Deep Neural Networks]] by **skip connections** and **shortcut connections**

Used for [[Stable Diffusion]]

A residual block is a [[Artificial Neural Network]] that uses this shortcut

![ResNet.png](resnet.png)
![ResNet_2.png](resnet_2.png)

## Main Idea

If a neural network is too deep in the sense that behavior could've been learned by way fewer neurons and the rest must now simply pass over identity functions, it is much easier to learn that identity if we formulate a "skip connection" that lets us wire a result directly through skipping some channels

## Residual Block

Part of such a neural network

```python
import torch
import torch.nn as nn
from einops.layers.torch import Rearrange

# For this example, let's assume we are working with image data.
# A basic residual block for a ResNet.

class ResidualBlock(nn.Module):
    def __init__(self, in_channels, out_channels, stride=1):
        super(ResidualBlock, self).__init__()

        # This is the main path of the block, F(x)
        self.conv_block = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, stride=stride, padding=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_channels, out_channels, kernel_size=3, stride=1, padding=1, bias=False),
            nn.BatchNorm2d(out_channels)
        )

        # This is the shortcut connection, for x
        self.shortcut = nn.Sequential()
        if stride != 1 or in_channels != out_channels:
            # Socratic Question: Why a 1x1 convolution here?
            # Answer: It's the most efficient way to match the dimensions (channels and spatial size)
            # of the shortcut 'x' to the output of the main block 'F(x)' so they can be added.
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_channels, out_channels, kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(out_channels)
            )

        self.relu = nn.ReLU(inplace=True)

    def forward(self, x):
        # The core idea: H(x) = F(x) + x
        out = self.conv_block(x)      # This is F(x)
        shortcut_out = self.shortcut(x) # This is x (potentially transformed)
        
        # The heart of ResNet: the addition
        out += shortcut_out
        out = self.relu(out) # Final activation after addition
        return out
```

## ResNet

Network that uses residual block to potentially skip some logic

```python
class ResNet(nn.Module):
    def __init__(self, block, num_blocks, num_classes=10):
        super(ResNet, self).__init__()
        self.in_channels = 64

        # Initial convolution - processes the raw image
        self.conv1 = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=3, stride=1, padding=1, bias=False),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True)
        )

        # The four main stages of the network
        self.layer1 = self._make_layer(block, 64, num_blocks[0], stride=1)
        self.layer2 = self._make_layer(block, 128, num_blocks[1], stride=2)
        self.layer3 = self._make_layer(block, 256, num_blocks[2], stride=2)
        self.layer4 = self._make_layer(block, 512, num_blocks[3], stride=2)

        # Socratic Question: Why is nn.AdaptiveAvgPool2d a clever choice here?
        # Answer: It pools each feature map to a fixed size (1x1), regardless of the input image size.
        # This makes the network more flexible and removes the need for a fixed-size input.
        self.avg_pool = nn.AdaptiveAvgPool2d((1, 1))
        
        # We can use einops to flatten the output of the pool for the final linear layer!
        self.flatten = Rearrange('b c h w -> b (c h w)')
        self.fc = nn.Linear(512, num_classes)

    def _make_layer(self, block, out_channels, num_blocks, stride):
        # The first block in a layer might have a different stride to downsample
        strides = [stride] + [1] * (num_blocks - 1)
        layers = []
        for s in strides:
            layers.append(block(self.in_channels, out_channels, s))
            self.in_channels = out_channels # Update in_channels for the next block
        return nn.Sequential(*layers)

    def forward(self, x):
        out = self.conv1(x)
        out = self.layer1(out)
        out = self.layer2(out)
        out = self.layer3(out)
        out = self.layer4(out)
        out = self.avg_pool(out)
        out = self.flatten(out)
        out = self.fc(out)
        return out

# Example: Create a ResNet-18 (1 initial conv + 4 stages of 2 blocks each * 2 layers/block = 17 + 1 fc = 18)
def ResNet18():
    return ResNet(ResidualBlock, [2, 2, 2, 2])

# Let's test it with a dummy tensor
model = ResNet18()
dummy_image_batch = torch.randn(4, 3, 32, 32) # Batch of 4, 3-channel, 32x32 images (like CIFAR-10)
output = model(dummy_image_batch)
print(output.shape) # Should be torch.Size([4, 10])
```
