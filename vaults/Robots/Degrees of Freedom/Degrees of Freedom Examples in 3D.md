DOF = 6 \* (N - 1 - J) + sum of joint DOF

## Example 1

3 legs
For each leg

* N = 2
* J = UUP = 3
* Joints total DOF = 5

In total

* N = 6 + moving base + ground = 8
* J = 3 \* 3 = 9
* joints total DOF = 5 \* 3 = 15
* Total DOF = 6 \* (N - 1 - J) + joints total DOF = -12 + 15 = 3
  ![Pasted\_image\_20250327145344.png](Robots/images/Pasted_image_20250327145344.png)

## Example 2

Left 2 legs have same structure of

* N = 2
* J = PUS = 3
* Joint total DOF = 6

Right leg has

* N = 1
* J = US = 2
* Joint total DOF = 5

Total

* N = 2 \* 2 + 1 + 1 triangle + 1 ground = 7
* J = 3 \* 2 + 2 = 8
* Joint total DOF = 6 \* 2 + 5 = 17
* Total DOF = 6 \* (N - 1 - J) + joint total DOF = 5
  ![Pasted\_image\_20250327145600.png](Robots/images/Pasted_image_20250327145600.png)

## Example 3

Let's treat each leg as 1 joint with some DOF and say they connect 2 links (body and triangle)

For each leg joints = URU so DOF = 5

N = 2
J = 3
Total joint DOF = 3 \* 5 = 15

Robot DOF = 6 \* (N - 1 - J) + total joint DOF = 3
![Pasted\_image\_20250327145910.png](Robots/images/Pasted_image_20250327145910.png)

## Example 4

Leg A = RRRP
Leg B = Leg C = RRRUR

DOF in A = 4
DOF in B = DOF in C = 6

Total joint DOF = 4 + 6 + 6 = 16
Treat each leg as 1 joint => N = 2 and J = 3

DOF = 6 \* (2 - 1 - 3) + 16 = 4
![Pasted\_image\_20250327151542.png](Robots/images/Pasted_image_20250327151542.png)

## Dual-Arm Robot

J = 3R + 4S + (joint on box that has 3 DOF as given in problem statement) = 8
N = ground + torso + 2 \* (upper arm + lower arm) + end-effector-with-hands = 7
J DOF = 3 + 4 \* 3 + 3 = 18

DOF = 6 \* (N - 1 - J) + J DOF = 6
![Pasted\_image\_20250327161245.png](Robots/images/Pasted_image_20250327161245.png)

## Dragonfly

4 wings each just N = 1 and J = 1R
4 legs each with N = 1 and J = 1R
4 leg connectors each USP so N = 2, J = USP = 3 and J DOF = 6

Total N = 4 (wings) + 4 (legs) + 8 (leg connectors) + robot base + ground = 18
Total J = 4R (wings) + 4R (legs) + 4USP (leg connectors) = 20
Total J DOF = 4 + 4 + 24 = 32

Total DOF = 6 \* (N - 1 - J) + Total J DOF = 6 \* (-3) + 32 = 14
![Pasted\_image\_20250327161535.png](Robots/images/Pasted_image_20250327161535.png)

## Planar vs Spatial Shape

### Refrigerator

Here both have 6R joints and 5 links + ground (N = 6) but a) is planar (all move in one plane) so uses 2D formula and gets DOF = 3 while b) uses 3D formula and gets DOF = 0
![Pasted\_image\_20250327144316.png](Robots/images/Pasted_image_20250327144316.png)

### Spherical 4-bar linkage

N = 3 bars + ground = 4
J = 4R
J total DOF = 4
All move on surface of sphere so motion is planar => m = 3

DOF = 3 \* (N - 1 - J) + J total DOF = 1
![Pasted\_image\_20250327150833.png](Robots/images/Pasted_image_20250327150833.png)

Workspace for this guy looks like this
![Pasted\_image\_20250327150946.png](Robots/images/Pasted_image_20250327150946.png)

### Surgical tool from before

If legs are same size then they are all on a sphere's surface => 2D => planar => m = 3
Leg = 4R
N = 3 (for each leg) \* 3 (leg amount) + 1 (end-effector) + 1 ground = 11
J = 4R \* 3 = 12
J total DOF = 12 = J<sub>1</sub>

DOF = 3 \* (N - 1) - 2J<sub>1</sub> = 6
![Pasted\_image\_20250327152750.png](Robots/images/Pasted_image_20250327152750.png)
