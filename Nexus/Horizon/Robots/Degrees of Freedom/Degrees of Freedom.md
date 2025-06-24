In open chain (serial chain) simply sum of DoF of each joint

In closed chain we count total DoF by **Grübler’s formula**

## Grübler’s formula
for closed loop systems where constraints are independent

m = DOF in space (3 for 2D and 6 for 3D)
n = number of links including ground
J = number of joints

Total DOF = m * (n - 1 - J) + sum of DOF of each joint

For instance, with [[Stewart’s Platform]] we will have 6 DOF in total, meaning all positions and rotations of 3D space

Sometimes Grübler’s formula tells us 0 DOF when really it's 1 if all sides are same size because of some geometry stuff that it can't capture

## [[Degrees of Freedom Examples in 2D]]

## [[Degrees of Freedom Examples in 3D]]