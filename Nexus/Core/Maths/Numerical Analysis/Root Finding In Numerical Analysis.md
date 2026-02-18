Finding x for which f(x) = 0

## Bisection Method
Starting with some interval (a, b) where f(a) * f(b) < 0

we calculate f(a), f(b), and also midpoint c = (a+b)/2 at which we get f(c)

new interval is then
- (a, c) if b * c > 0
- (b, c) if a * c > 0
Because c becomes the lower magnitude one of its sign. 

This goes on until either
- f(c) = 0 -> x = c
- change between previous and current c is lower than threshold
- max iteration steps passed

### Newton's Method
#### First Order Way
Take some initial x<sub>0</sub> and keep doing
x<sub>n+1</sub> = x<sub>n</sub> - f(x<sub>n</sub>)/f'(x<sub>n</sub>)

Until either
- f(x<sub>n</sub>) = 0 -> x = x<sub>n</sub>
- change between x<sub>n</sub> and x<sub>n+1</sub> is lower than threshold
- max iteration steps passed