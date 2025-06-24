Type of [[Recurrent Neural Network]] made to solve [[Vanishing Gradient]] problem.

At each point has hidden state (short-term memory) and cell state (long term memory)

Uses 3 gates: forget, input and output, each can have value between 0 and 1

![LSTM.webp](lstm.webp)

* Would just keep old memory if forget = 1 and input = 0
* Would erase all old memory if forget = 0

## Forget Gate

Overwrites cell state

f<sub>t</sub> = σ(X<sub>t</sub> \* U<sub>f</sub> + H<sub>t-1</sub> \* W<sub>f</sub>)

* X<sub>t</sub> - input to current timestamp
* U<sub>f</sub> - weight of input
* H<sub>t-1</sub> - hidden state at last timestamp
* W<sub>f</sub> - weight matrix of hidden state
* σ - [[Sigmoid Activation]] to put the answer between 0 and 1

## Input Gate

Deciding if we should add to cell state the new input we just received

## Output Gate

What part of current state to show vs hide

## Code Example

```python
# Define an LSTM layer: input size 5, hidden size 3
lstm = nn.LSTM(input_size=5, hidden_size=3, batch_first=True)
# Dummy sequence (same shape as before)
seq = torch.randn(1, 4, 5)
# Initial hidden and cell states (h0, c0)
h0 = torch.zeros(1, 1, 3)
c0 = torch.zeros(1, 1, 3)
output_seq, (hT, cT) = lstm(seq, (h0, c0))
print("LSTM outputs at each step:\n", output_seq)
print("Final hidden state h_T:\n", hT)
print("Final cell state c_T:\n", cT)
```
