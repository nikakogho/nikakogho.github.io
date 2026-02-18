Finding derivative numerically when exact calculation is not practical.

We use finite differences and some small number h.

As h shrinks accuracy increases, but then we reach a point where [[Catastrophic Cancellation]] and also division and operations on lower bits makes the result less accurate.

## Forward Difference
$$
D = \frac{f(x + h) - f(x)}{h}
$$
has first order error

## Backward Difference
$$
D = \frac{f(x) - f(x - h)}{h}
$$
also has first order error

## Central Difference
$$
D = \frac{f(x + h) - f(x - h)}{2h}
$$
Generally more accurate, has second order error

## [[Richardson Extrapolation]]
We find derivatives D(h) and also D(h/2) and combine to get new 
$$
D = \frac{2^pD(\frac{h}{2}) - D(h)}{2^p-1}
$$
