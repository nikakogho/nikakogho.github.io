A way to classify [[DC Motor|DC motors]].
Explained nicely in [this video](https://www.youtube.com/watch?v=wAtN3SEYSco).

## Brushed Motor

### Parts

* Stator - stationary magnetic parts, typically a permanent magnet, but could be [[Electromagnet|electromagnet]].
  ![dc_motor_stator.png](dc_motor_stator.png)
  ![dc_motor_stator_inside.png](dc_motor_stator_inside.png)
* Rotor - rotating piece with a bunch of copper coils to generate magnetic field
  ![dc_motor_rotor.png](dc_motor_rotor.png)
* Commutator - mechanical switch that flips direction of current's flow
  ![commutator.png](commutator.png)
* Brushes - current comes from them and they touch the commutator
  ![brushes.png](brushes.png)

### Steps

0. Rest
   ![brushes_empty.png](brushes_empty.png)
1. Current enters brushes
   ![brushes_charging.png](brushes_charging.png)
2. Brushes transmit current to commutator
   ![brushes_charging_commutator.png](brushes_charging_commutator.png)
3. Current flows through the rotor and makes a magnetic field
   ![brushes_causing_current_and_magnetic_field.png](brushes_causing_current_and_magnetic_field.png)
4. This generated magnetic field interacts with the magnet (stator) and generates motion
5. Commutator keeps flipping because of this rotation such that different poles are exposed to each brush, causing a flip in current and switching of generated magnetic field, so motion keeps going and doesn't stop when aligned

### Compared To Brushless DC Motor

Main upside is that it's cheaper and simpler.

Downsides:

* Doesn't last as long
* Brushes wear out
* Brushes sometimes get arcing (sparks / plasma discharge) that can cause damage
* Electrical noise from current flipping
* Less max speed
* Harder to dissipate heat

## Brushless Motor

Instead of brushes and commutator, a brushless motor directly flips the polarity of stators as needed, as measured by an electronic circuit that detects the system's orientation

![brushless_motor.png](brushless_motor.png)

### Parts

* Stator - fixed
  ![brushless_motor_stator.png](brushless_motor_stator.png)
* Rotor
  ![brushless_motor_rotor.png](brushless_motor_rotor.png)
  Mounted inside whatever we want to spin (in this case a fan blade)
  ![brushless_motor_rotor_in_fan.png](brushless_motor_rotor_in_fan.png)
* Electronic controller changes stator polarity as needed to keep the rotor spinning
  ![brushless_motor_electronic_controller.png](brushless_motor_electronic_controller.png)
  ![brushless_motor_state_1.png](brushless_motor_state_1.png)
  ![brushless_motor_state_2.png](brushless_motor_state_2.png)

### Compared To Brushed

Pros

* Lasts longer
* No arcing
* More energy efficient

Cons

* More expensive
* Limited temperature range
* Needs steady power source
* Needs extra circuitry for speed control
