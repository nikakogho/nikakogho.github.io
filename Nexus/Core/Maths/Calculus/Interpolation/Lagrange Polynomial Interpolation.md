Method of global [[Interpolation]] where we construct the Lagrange polynomial:

For given points (x0, y0), (x1, y1) ... (xn, yn)

Our Lagrange polynomial is
$$
f(x) = \sum_{j=1}^{n} y_{j}\prod_{k=1, k \neq j}^{n} \frac{x-x_k}{x_j-x_k}
$$

## First Order Lagrange Interpolation (2 Points)
So we have (x0, y0) and (x1, y1) and our formula simplifies to
$$
f(x) = y_1 \frac{x-x_2}{x_1-x_2} + y_2 \frac{x-x_1}{x_2-x_1}
$$

## Second Order Lagrange Interpolation (3 Points)
$$
f(x) = y_1 \frac{x-x_2}{x_1-x_2} \frac{x-x_3}{x_1-x_3} + y_2 \frac{x-x_1}{x_2-x_1} \frac{x-x_3}{x_2-x_3} + y_3 \frac{x-x_1}{x_3-x_1} \frac{x-x_2}{x_3-x_2}
$$
