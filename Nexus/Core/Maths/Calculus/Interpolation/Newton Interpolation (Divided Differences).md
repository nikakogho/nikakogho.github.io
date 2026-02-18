A global method of [[Interpolation]] (one polynomial to fit them all).

We construct a divided difference table up to whatever degree polynomial we need (degree of polynomial is number of data points - 1)
![divided_diff_table.png](divided_diff_table.png)

## First Order

$$
P_1(x) = \[f_0] + [f_0,1](x-x_0) = y_0 + \frac{(y_1-y_0)(x-x_0)}{x_1-x_0}
$$

## Second Order

$$
P_2(x) = P_1(x) + [f_0,1,2](x-x_0)(x-x_1) = P_1(x) + \frac{(\[f_1,2]-\[f_0,1])(x-x_0)(x-x_1)}{x_2-x_0}
$$

## n-th Order

### Recursive

$$
P_n(x) = P_{n-1}(x) + f\[x_0,x_1...x_n]\prod_{i=0}^{n-1}(x-x_i)
$$
