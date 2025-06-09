Making sure robot doesn't fall.
Mostly used in [[Legged Locomotion]] but needed for all robots.

## Static Balance

At least 3 joints (usually legs) remain on ground at all times to together make up a **support polygon** and center of mass (COM) is kept always inside this polygon, while other legs move forward and change this polygon.
Slower but safer.

In nature this is rare but lobsters do it because they prefer safety from underwater currents over speed.

## Dynamic Balance

"Controlled falling" in case of [[Walking]] or [[Running]].
Balance is maintained in a complex way to ensure that the robot "falls forward" while its legs are lifted. Once all legs on ground, becomes stable again.

### Zero Moment Point

Placing a leg or a joint such that it has no horizontal moment
![Zero_Moment_Point.png](zero_moment_point.png)
