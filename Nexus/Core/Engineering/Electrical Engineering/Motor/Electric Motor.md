Converts electricity to motion (mostly rotation).

Can be [[AC Motor]] or [[DC Motor]]

Required [[Voltage|voltage]] at a given moment is the effort required to pass this current through its resistance (I \* R) + the voltage needed to overcome the generated back EMF:
V = I \* R + V<sub>emf</sub>

## Torque Constant

Property of a motor that says how much [[Torque|torque]] it produces per [[Current|current]]. Written as K<sub>t</sub> in
$T_m = K_t \* I$
where

* T<sub>m</sub> is torque produced by motor
* I is current

## Back EMF

Motor's spin creates a backward pushing [[Electromotive Force]] (back EMF), a voltage that acts like friction and it's proportional to angular velocity $\dot{\theta}$:
$V_{emf} = K_t \* \dot{\theta}$

## Torque-Speed Tradeoff

![motor_operational_diamond.png](motor_operational_diamond.png)

### Stall Torque

T<sub>stall</sub> is the max torque a motor can give when it's forced to stop (speed = 0).
$T_{stall} = \frac{K_t V}{R}$

### No-Load Speed

$\dot{\theta}*{nl}$ is max speed the motor can have when there is no mechanical pressure (torque = 0)
$\dot{\theta}*{nl} = \frac{V}{K_t}$
