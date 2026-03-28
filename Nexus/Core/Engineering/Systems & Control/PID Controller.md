Proportional, Integral, Derivative.

Used a lot in [[Electrical Engineering]] for [[Systems & Control Theory|controlling]] the state of a system (velocity, position, angle, temperature, humidity...).

Given an error of how off our current state is from desired state (like we want to be at location 15 but we are at 5 so error is 10), PID controller decides how much to act to correct the course (acting can be in different units due to being commanding of muscles or of devices)

- e(t) = error at time *t*
- u(t) = control output at time *t*, measured by adding proportional, integral and derivative parts:
$$
u(t) = K_p * e(t) + K_i * \int{e(t)dt} + K_d * \frac{de(t)}{dt}
$$
- Proportional (present): multiplies current error by constant K<sub>p</sub> (to push harder if we are farther). If K<sub>p</sub> is too high, on approach we will overshoot over and over again and fail to stabilize, causing oscillation
- Integral (past): multiplies accumulated error by constant K<sub>t</sub> to notice change trends and adjust, useful to fix steady-state error (when the state stabilized some fixed distance away from desired state)
- Derivative (future): dampener K<sub>t</sub> to act as friction against how fast the error changes, preventing overshoot