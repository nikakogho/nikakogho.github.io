Piecewise polynomials typically for local [[Interpolation]]

## Linear Splines

Line between each point pairs
![linear_spline.png](linear_spline.png)

Rough transitions, bad if modeling movement (expects instant shift of velocity and acceleration)

## Quadratic Splines

Piecewise quadratic polynomials (y = ax<sup>2</sup> + bx + c) with smooth transitions.
Allows smooth change of velocity but not of acceleration

## Cubic Splines

Piecewise cubic polynomials (y = ax<sup>3</sup> + bx<sup>2</sup> + cx + d) with smooth transitions
![cubic_spline_3rd_order.png](cubic_spline_3rd_order.png)
Better for modeling motion since it allows smoother transition of velocity and acceleration.

### Solving Cubic Splines

For n+1 data points we have n cubic polynomials, each with 4 parameters, so we need 4n equations.

* We get 2n equations of just P<sub>i</sub>(x<sub>0</sub>) = y<sub>i</sub> and P<sub>i</sub>(x<sub>i+1</sub>) = y<sub>i+1</sub>.
* Another n-1 equations from first order derivatives: P<sub>i</sub>'(x<sub>i+1</sub>) = P<sub>i+1</sub>'(x<sub>i+1</sub>)
* Another n-1 equations from second order derivatives: P<sub>i</sub>''(x<sub>i+1</sub>) = P<sub>i+1</sub>''(x<sub>i+1</sub>)
* Another 2 equations at start at endpoint assuming second order derivatives are 0 (or given number if given). **Natural cubic spline** means second order derivatives at first and last point = 0

### Clamped Cubic Splines

Instead of last 2 equations being "second order derivatives at edges are 0", we might get some specific constraints like P<sub>5</sub>'(x<sub>5</sub>) = 7 and P<sub>3</sub>'(x<sub>3</sub>) = 4

## B-Splines

TODO

## Smoothing Splines

Sometimes we don't want to exactly pass through each point and prefer flexibility at the cost of bit of error (like not [[Overfitting|overfitting]] in machine learning).

Smoothing splines use a knot and penalize the second derivative (curvature)

TODO details
