Library for [[Einstein Summation]] used in [[NumPy]], [[TensorFlow]] and [[PyTorch]]

Used to make code more readable and flexible

## General Syntax
`np.einsum(subscripts, operand1, operand2, …, [out=…])`

- subscripts - input and output indices for Einstein summation
- operands - input tensors
- out (optional) to put result in given tensor. If not given then will just return result as tensor

## Dot Product
For vectors a and b notation is `i, i -> (scalar)`

`np.eunsum(‘i,i->’, a, b)`

## Outer Product
``` python
a = np.array([1, 2])
b = np.array([3, 4, 5])

# Einstein notation: i, j -> ij (matrix)
outer_product = np.einsum('i,j->ij', a, b)
```

## Transpose
`np.einsum('ij->ji', M)`

## Matrix-Vector Multiplication
``` python
mv_mult = np.einsum('ij,j->i', M, v)
print(f"\nMatrix-Vector Multiplication (M, v): {mv_mult}")
# Expected: [1*10 + 2*20, 3*10 + 4*20] = [50, 110]
# Equivalently: np.dot(M, v) or M @ v
```

## Matrix-Matrix Multiplication
``` python
A = np.array([[1, 2], [3, 4]]) # 2x2
B = np.array([[5, 6], [7, 8]]) # 2x2

# Einstein notation: ij, jk -> ik
AB_mult = np.einsum('ij,jk->ik', A, B)
```

## Sum Over Axis
``` python
arr = np.array([[1, 2, 3], [4, 5, 6]]) # 2x3

# Sum over columns (sum along axis 1): ij -> i
sum_axis1 = np.einsum('ij->i', arr)
print(f"\nSum over columns of arr: {sum_axis1}") # Expected: [6, 15]
# Equivalently: arr.sum(axis=1)
```

## Sum Of All Elements
`np.einsum('ij->', arr)`

## Trace Of Matrix
``` python
M = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

# Einstein notation: ii -> (scalar)
trace_M = np.einsum('ii->', M)
print(f"\nTrace of M: {trace_M}") # Expected: 1 + 5 + 9 = 15
```
