Training or fine-tuning an [[Large Language Models|LLM]] will require loading all its weights in memory and passing [[Backpropagation|backpropagation]] through all of them, needing too much memory, compute, and time.
Instead, we can make a lightweight edit with LoRA by freezing the existing weights and adding new ones like this at each layer:
![lora_A_and_B.png](lora_a_and_b.png)

We make 2 matrices A and B such that A @ B has same shape as our pretrained weights. Their matmul then gives the change matrix
![lora_change_matrix.png](lora_change_matrix.png)

This change matrix's calculation adds to normal result to produce output and our loss function now only affects these matrices A and B
![lora_loss_function.png](lora_loss_function.png)
