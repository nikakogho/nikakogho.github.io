Einstein Operations

Main part is `rearrange`

## rearrange
Allows rearranging dimmensions

``` python
from einops import rearrange

# imagine a batch of 64 images, each 32x32 with 3 channels
images = torch.randn(64, 32, 32, 3)

# The einops way
rearranged_images = rearrange(images, 'b h w c -> b c h w')
```

### For Flattening On Some Axes

``` python
# input: (64, 32, 32, 3)
flattened_images = rearrange(images, 'b h w c -> b (h w c)')
# output shape: (64, 3072)
```

## Untlattening

``` python
# input: (64, 3072)
unflattened_images = rearrange(flattened_images, 'b (h w c) -> b h w c', h=32, w=32)
# output shape: (64, 32, 32, 3)
```