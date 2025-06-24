## Hill Climbing
Moving to max or min value, might get stuck at local best
Might also get stuck because of flat values for a while

## Simulated Annealing
High “temperature” (odds of picking bad neighbors) at start that gets lower by end

### Pseudocode
``` python
def sim_anneal(problem, max):
  current = # start state
  for t in range(max):
    T = temperature(t)
    neighbor = random neighbor of current
    deltaE = how much better neighbor is than current
    if deltaE > 0:
      current = neighbor
    else:
      p = e ** (deltaE / T)
      if random.choice() < p:
        current = neighbor
```

## Adam
Adaptive Moment Estimation

One of the most popular for [[Deep Learning]]

### Momentum
If one direction favored for a while, will speed up in that direction to avoid local bumps and speed up the process

### RMSprop (Root Mean Square propagation)
Exponentially decaying average of past gradients for each parameter so each can adapt its learning rate: parameters historically updated by a lot decrease their learning rate to prevent overshoot, while one with little movement increases learning rate to speed up the process

## Stochastic Gradient Descent
Stochastic (random) mini-batch is chosen, passed through forward pass and then [[Gradient Descent]] for [[Backpropagation]]

### Example
``` python
import torch, torch.nn as nn, torch.optim as optim

model = nn.Sequential(
    nn.Flatten(),
    nn.Linear(28*28, 128), nn.ReLU(),
    nn.Linear(128, 10)
)

criterion = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=0.01)  # ← SGD chosen here

for xb, yb in dataloader:          # loop over mini-batches
    preds = model(xb)              # 1. forward
    loss  = criterion(preds, yb)

    optimizer.zero_grad()          # reset accumulated grads
    loss.backward()                # 2. backward (∂loss/∂θ)
    optimizer.step()               # 3. update: θ ← θ – η·∇θ
```
