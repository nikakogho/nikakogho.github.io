Graphics Processing Unit (should've been called Parallel Processing Unit honestly).

More parallel but sequentially slower work than [[CPU]].
![GPU_vs_CPU.png](gpu_vs_cpu.png)

Originally for video games, then for crypto mining, these days for training and running [[Large Language Models]].

Mostly dominated by [[Nvidia]].

[This video](https://www.youtube.com/watch?v=h9Z4oGN89MU) explains how GPUs work.

Part of a [[Graphics Card]]
![graphics_card.png](graphics_card.png)

## GPU Parts

GPU chip contains

* Processing Cores known as [[Streaming Multiprocessors (SM)]] made of mix of
  * [[Warp Cores]] made of
    * [[CUDA Core|CUDA cores]]
    * [[Tensor Cores]]
  * [[Ray-Tracing (RT) Cores]] - H200 and such LLM-optimized GPUs don't have this
* Memory & Cache
  * Register - fast, on-chip, small
  * L1 Cache / shared memory - 1 per SM
  * L2 Cache - 1 per chip, larger shared cache as bridge between SMs and external [[VRAM]]
  * Memory Controllers - high speed busses between processing cores and VRAM
* Controllers
  * Gigathread Engine / Schedulers - manages and distributes threads and tasks among SMs
  * Raster Output Units (ROPs) - final steps of writing pixels to framebuffer for display
  * Texture Mapping Units (TMUs) - mapping texture (2D surface) on 3D objects
  * Display Controllers

![gpu_non_processing_parts.png](gpu_non_processing_parts.png)
For a more detailed look we can see Nvidia [[GA102 GPU]] architecture
