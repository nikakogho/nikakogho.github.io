Open-source [[Machine Learning]] framework from [[Meta AI]].

[Repo](https://github.com/pytorch/pytorch).

[Docs](https://pytorch.org/docs/stable/index.html).

`import torch`

## Install
Pip packages: `torch`, `torchvision` and `torchaudio`

### CPU
`pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu`

### GPU
`pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118`

## Tensors
Like [[NumPy]] arrays but more GPU and parallel friendly.

### 1D Tensor
`x = torch.tensor([1, 2, 3])`

### Shape
`print(x.shape)`

### 2D Tensor (Matrix)
`y = torch.tensor([[1.0, 2.0], [3.0, 4.0]])`

## Tensor With Random Values
`rand_tensor = torch.randn(2, 3)`

This will create a matrix with 2 rows and 3 columns

### Arithmetic
Can do `a + b`, `a * b`...

## AutoGrad
Automatically calculates [[Gradient Descent]] function based on operations performed on tensor.
Allows to just call `x.backward()` and get calculated gradient values for each node.

Can control it with `requires_grad` like:
`a = torch.tensor(3.0, requires_grad=True)`

Smaller version (MicroGrad) explained by [[Andrej Karpathy]] [here](https://www.youtube.com/watch?v=VMj-3S1tku0&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ&index=1&pp=iAQB)

## torch.nn ([[Neural Network]])
Contains linear layers, [[Convolutional Neural Network|convolutional]] layers, [[Activation Functions|activation functions]] and loss functions

### Example neural network with 1 hidden layer
``` python
import torch
import torch.nn as nn

# Define a simple neural network
class SimpleNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(SimpleNN, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.fc2(out)
        return out

# Model parameters
input_size = 10
hidden_size = 5
output_size = 2
batch_size = 4

# Create an instance of the model
model = SimpleNN(input_size, hidden_size, output_size)
print("Model Architecture:\n", model)

# Create dummy input data
dummy_input = torch.randn(batch_size, input_size)

# Forward pass
output = model(dummy_input)
print("\nOutput shape:", output.shape)
print("Output (logits):\n", output)
```

### torch.nn.CrossEntropyLoss
Applies [[Softmax]] + [[Negative Log Likelihood Loss (NLLLoss)]] to logit to calculate loss

## torch.optim
[[Optimization]] algorithms like Stochastic Gradient Descent, Adam, etc. to automatically apply gradient descent's calculated step to neural network's parameters

``` python
# Assuming SimpleNN model and dummy_input are defined as above

# Dummy target data (for classification)
# For CrossEntropyLoss, target should be class indices (LongTensor)
dummy_target = torch.randint(0, output_size, (batch_size,))
print("Dummy Target (class indices):", dummy_target)

# Define a loss function (CrossEntropyLoss explained below)
criterion = nn.CrossEntropyLoss()

# Define an optimizer
optimizer = optim.Adam(model.parameters(), lr=0.01)

# Training loop (simplified)
num_epochs = 5
for epoch in range(num_epochs):
    # Zero the gradients
    optimizer.zero_grad()

    # Forward pass
    outputs = model(dummy_input)

    # Compute loss
    loss = criterion(outputs, dummy_target)

    # Backward pass (compute gradients)
    loss.backward()

    # Update model parameters
    optimizer.step()

    print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}")
```

## torch.utils.data
Efficient data loading and preprocessing and batching

With `Dataset` and `DataLoader`

- `Dataset` is a wrapper over data that exposes `__len__()` and `__getitem__(idx)`
- `DataLoader` is a batched iterator over `Dataset`

### Example
``` python
from torch.utils.data import Dataset, DataLoader

# Custom Dataset class
class CustomDataset(Dataset):
    def __init__(self, data, labels):
        self.data = torch.tensor(data, dtype=torch.float32)
        self.labels = torch.tensor(labels, dtype=torch.long)

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        return self.data[idx], self.labels[idx]

# Dummy data
sample_data = [[1.0, 2.0], [3.0, 4.0], [5.0, 6.0], [7.0, 8.0]]
sample_labels = [0, 1, 0, 1]

# Create dataset instance
dataset = CustomDataset(sample_data, sample_labels)

# Create DataLoader
batch_size = 2
dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

print("\nIterating through DataLoader:")
for i, (batch_data, batch_labels) in enumerate(dataloader):
    print(f"Batch {i+1}:")
    print("  Data:\n", batch_data)
    print("  Labels:", batch_labels)
```
