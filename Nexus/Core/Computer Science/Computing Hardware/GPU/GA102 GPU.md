A popular [[GPU]] chip from [[Nvidia]] used by

* **GeForce RTX 3090 Ti:** GA102-350-A1 (Fully enabled)
* **GeForce RTX 3090:** GA102-300-A1
* **GeForce RTX 3080 Ti:** GA102-250-KD-A1
* **GeForce RTX 3080 (12GB):** GA102-220
* **GeForce RTX 3080 (10GB):** GA102-200/202
* **GeForce RTX 3070 Ti:** Some models use GA102 (e.g., GA102-150) instead of the standard GA104
* **Workstation/Server:** RTX A6000, A40, A4500

![ga102.png](ga102.png)

## Architecture

![ga102_parts.png](ga102_parts.png)

### Processing Cores

On a high level, its main part is the processing cores:

* 10 752 [[CUDA Core|CUDA cores]]
* 336 [[Tensor Cores]]
* 84 [[Ray-Tracing (RT) Cores]]
  ![cuda_tensor_rt_cores.png](cuda_tensor_rt_cores.png)

Processing cores separated into 7 **Graphics Processing Clusters** (GPCs)
![GPCs.png](gpcs.png)

Each GPC has 12 [[Streaming Multiprocessors (SM)]]
![GPC_SMs.png](gpc_sms.png)

Each SM has 4 [[Warp Cores|warp cores]] and 1 ray-tracing core
![SM_warp_and_rt_cores.png](sm_warp_and_rt_cores.png)

Each warp core has 32 CUDA cores and 1 tensor core
![warp_core_cuda_and_tensor_cores.png](warp_core_cuda_and_tensor_cores.png)

### Other Parts

* Gigathread Engine - manages task distribution among SMs
* L2 Cache - memory shared by entire GPU chip, faster than actually going to VRAM

![gpu_non_processing_parts.png](gpu_non_processing_parts.png)
