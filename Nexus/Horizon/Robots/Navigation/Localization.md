Find out where the robot is at any moment, assuming we have the map.
If we don’t have a map then we do [[SLAM]].

## Types

![localization_types.jpeg](localization_types.jpeg)

* Local - must know starting position, keep track of drift
* Global - no start position
  * Sustained updates - no gap in sensing
  * Interrupted updates - might be turned off, taken elsewhere and turned on, “kidnapped robot” problem

## Algorithms

### Feature-Based Localization

Finds walls, corners, etc. on map, simplified the world model.

* Pro: less computation
* Con: hard to extract features reliably

#### Markov Localization

Computes *belief* in each possible pose (position + orientation) based on belief in last pose, movements, sensor readings and map

bel(x<sub>t</sub>) = f(bel(x<sub>t-1</sub>), u<sub>t</sub>, z<sub>t</sub>, m)

* x<sub>t</sub> - set of possible poses at time step t
* u<sub>t</sub> - moves at time step t
* z<sub>t</sub> - sensor readings at time step t
* m - map, assuming constant map

Good for global localization with sustained updates since it can quickly converge on right pose
![markov_global_localization.jpeg](markov_global_localization.jpeg)

#### Extended Kalman Filter (EKF)

Predicts what sensors will say based on current movement, then takes sensor readings and checks prediction accuracy. This is known as *correspondence variables*. Robot fixes its predictions based on it and increases accuracy, helping it localize based on features better.

Called *extended* because normal kalman filter works in linear systems, but robot movement is non-linear.

Does corrections with a [[Jacobian]].

### Iconic Localization

Map is stored as “this was the sensor reading at this pose”, like navigating by photo references

* Pro: more accurate
* Con: higher computation and storage needs, lighting change might be a problem

#### Grid-Based Localization

Split world into polygons, figure out which one robot is in. Can even reduce to finding pose in sub-map of the world in local localization

#### Monte Carlo Localization (MCL)

0. Random particles placed across map
1. Each given probability of being robot pose
2. Too low chance particles die
3. New particles added
4. Repeat
