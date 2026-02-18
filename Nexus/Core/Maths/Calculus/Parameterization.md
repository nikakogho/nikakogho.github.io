Function that represents a geometric shape with regard to some independent parameters *t*.

## Location On Unit Circle

Output will be a 2D vector representing x and y coordinates at time t

![parameterization_unit_circle.png](parameterization_unit_circle.png)

Can have different velocity and direction
![parameterization_unit_circle_faster.png](parameterization_unit_circle_faster.png)

## Tangent Vector

Rate of change of this r(t) so r'(t) (velocity)
$v(t)=r'(t)$

### Unit Tangent

Tangent vector normalized: $T = \frac{v(t)}{|v(t)|}$

## Arclength

Calculating total distance traveled from timestamps a to b by integrating velocity in the interval:
$Arclength = \int_{a}^{b}|v(t)| dt$
