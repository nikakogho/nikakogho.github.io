## Vector Norms

Measure size of a vector in some sense, essentially in the sense of how you want to describe boundaries.

1-norm is sum of absolute values.
2-norm is square root of sum of squares.
n-norm is n-th root of sum of n-th powers.
infinity norm is max value.

![vector_norms.png](vector_norms.png)

## Induced Matrix Norms

Maximum amount a matrix can stretch a vector in some direction.
Defined as
$$
|A| = \max_{x \ne 0} \frac{|Ax|}{|x|}
$$
Where $||A||$ can be any specific induced matrix norm such as

### Induced Matrix 1-Norm: Max of Sums of Column Absolute Values

$$
|A|*1 = \max_j \sum_i |a*{ij}|
$$

### Induced Matrix Infinity-Norm: Max Row Absolute Value Sum

$$
|A|*1 = \max_i \sum_j |a*{ij}|
$$

### Frobenius Norm (Euclidean)

$$
|A|*F = \sqrt{\sum_i \sum_j |a*{ij}|^2}
$$

### Induced Matrix 2-Norm: Spectral Norm

Largest singular value
$$
|A|*2 = \sigma*{\max}(A)
$$
