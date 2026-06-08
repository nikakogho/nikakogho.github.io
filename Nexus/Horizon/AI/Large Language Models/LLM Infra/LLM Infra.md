How [[Large Language Models]] are trained and served.

Topics:
- [[LLM Training Stages]]
- [[KV Cache]]
- Batching - putting fewer sequences in the batch will make it faster but decrease [[Model FLOPs Utilization (MFU)]], allowing for "pay more and have faster inference" like in [[Codex]]'s fast mode
- Optimizations of [[Attention (in Artificial Neural Network)|attention]] such as [[FlashAttention]]
- [[Model FLOPs Utilization (MFU)]]
- [[AI Supply Chain]]
	- Data
	- Networking
	- Compute ([[GPU Rack|GPU Racks]])
	- Memory ([[VRAM]])
	- Power (solar, nuclear, hydro, gas, whatever)

Related videos:
- Dwarkesh
	- [Reiner Pope How LLMs are trained and served](https://www.youtube.com/watch?v=xmkSf5IS-zw)
	- [Reiner Pope Chip Design from the bottom up](https://www.youtube.com/watch?v=oIk3R-sMX5o)
	- [SemiAnalysis ASML as bottleneck for LLM scaling](https://www.youtube.com/watch?v=mDG_Hx3BSUE)
	- [Elon orbital data center and Terafab](https://www.youtube.com/watch?v=BYXbuik3dgA)
	- [Jensen interview](https://www.youtube.com/watch?v=Hrbq66XqtCo)
