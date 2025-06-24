Type of [[Artificial Neural Network|neural network]] where output at each layer includes a hidden state that becomes input of next iteration

Useful when we need history, like in [[Large Language Models]]

Has problem of [[Vanishing Gradient]] or [[Exploding Gradient]] when network is too deep. 

## LSTM
[[Long Short-Term Memory]] solves vanishing gradient problem by using forget, input and output gates with cell state (long term memory) and hidden state (short term memory)

## GRU
[[Gated Recurrent Unit (GRU)]] has fewer gates but solves same problem