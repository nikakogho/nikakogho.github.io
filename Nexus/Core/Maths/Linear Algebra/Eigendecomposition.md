Method in [[Linear Algebra]] to factor a square matrix using [[Eigenvectors & Eigenvalues]].

For square matrix A, its eigendecomposition is
A = V Λ V<sup>-1</sup>

where

* V = square matrix where columns are eigenvectors of A
* Λ = diagonal matrix with corresponding eigenvalues on main diagonal
* V<sup>-1</sup> is inverse of V

![eigendecomposition.png](eigendecomposition.png)

Useful for extracting eigenvectors and eigenvalues, or for quickly calculating a power of a matrix:
![eigendecomposition_power_of_matrix.png](eigendecomposition_power_of_matrix.png)
![eigendecompose_eigenvalues_powered.png](eigendecompose_eigenvalues_powered.png)

In [[PyTorch]], `eigenvalues, eigenvectors = torch.linalg.eigh(A)` will give us the eigenvalues and eigenvectors of matrix A using eigendecomposition.
