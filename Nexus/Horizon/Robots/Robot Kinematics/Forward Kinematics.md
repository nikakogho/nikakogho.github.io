Applying series of [[Homogenous Transform|homogenous transformations]] to a chain of joints to get the position and rotation of final guy (claw/hand/whatever)

Total transformation from start to end is multiplication of each step

## Example
If starting reference frame is F and final end effector guy is through 3 joints, there would be 
F -> M<sub>1</sub> -> M<sub>2</sub> -> M<sub>3</sub>
With each transition done by a homogenous transform H<sub>1</sub>, H<sub>2</sub> and H<sub>3</sub>, so
F -> M<sub>3</sub> = H<sub>1</sub> * H<sub>2</sub> * H<sub>3</sub>
