Piecewise polynomials typically for local [[Interpolation]]

## Linear Splines

Line between each point pairs
![linear_spline.png](linear_spline.png)

Rough transitions, bad if modeling movement (expects instant shift of velocity and acceleration).
If transition point has a mismatch of first order derivatives, we call it a **knot**
![spline_knot.png](spline_knot.png)

## Quadratic Splines

Piecewise quadratic polynomials (y = ax<sup>2</sup> + bx + c) with smooth transitions.
Allows smooth change of velocity but not of acceleration (C<sup>1</sup>)

## Cubic Splines

Piecewise cubic polynomials (y = ax<sup>3</sup> + bx<sup>2</sup> + cx + d) with smooth transitions
![cubic_spline_3rd_order.png](cubic_spline_3rd_order.png)
Better for modeling motion since it allows smoother transition of velocity and acceleration (C<sup>2</sup>)

### Solving Cubic Splines

For n+1 data points we have n cubic polynomials, each with 4 parameters, so we need 4n equations.

* We get 2n equations of just P<sub>i</sub>(x<sub>0</sub>) = y<sub>i</sub> and P<sub>i</sub>(x<sub>i+1</sub>) = y<sub>i+1</sub>.
* Another n-1 equations from first order derivatives: P<sub>i</sub>'(x<sub>i+1</sub>) = P<sub>i+1</sub>'(x<sub>i+1</sub>)
* Another n-1 equations from second order derivatives: P<sub>i</sub>''(x<sub>i+1</sub>) = P<sub>i+1</sub>''(x<sub>i+1</sub>)
* Another 2 equations at start at endpoint assuming second order derivatives are 0 (or given number if given). **Natural cubic spline** means second order derivatives at first and last point = 0

### Clamped Cubic Splines

Instead of last 2 equations being "second order derivatives at edges are 0", we might get some specific constraints like P<sub>5</sub>'(x<sub>5</sub>) = 7 and P<sub>3</sub>'(x<sub>3</sub>) = 4

## B-Splines

A type of smoothing spline that gives C<sup>2</sup> continuity (smooth transition of both velocity and acceleration) and local control but doesn't interpolate exactly

## Smoothing Splines

Sometimes we don't want to exactly pass through each point and prefer flexibility at the cost of bit of error (like not [[Overfitting|overfitting]] in machine learning).

Smoothing splines use a knot and penalize the second derivative (curvature)

TODO details
![spline_types_comp.png](spline_types_comp.png)
