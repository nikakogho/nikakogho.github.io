Configuration = state

Configuration space has:
- [[Degrees of Freedom]]
- [[Configuration Space Topology]] - 2D plane vs 2D surface of 3D sphere
- Representation by parametrization
    - explicit (simple but not flexible): specific params like x, y and angle
    - implicit (more flexible to change): relation between parameters like x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> = 1
- Task space - end-effector’s rotation + position space
    - workspace - part of task space the end-effector can reach

Holonomic Constraints involve coordinates and maybe time (“you stay here”)
Non-Holonomic Constraints also involve velocity (coordinate’s derivative) (“you move this way”)

## Holonomic Constraints
For robots that have closed loops

When a set of equations (in total k equations <= n for n joints) represent C-space

C-space is then (n-k) dimensional surface in R<sup>n</sup>

g(θ) = 0 is **integral constraint**

## Non-Holonomic Constraints
![[IMG_5166.jpeg]]
![[IMG_5165.jpeg]]
Since g(θ) = 0
d/dt g(θ(t)) = 0
so dg/dθ (θ) θ‘ = 0
A(θ) θ‘ = 0

A(θ) = dg(θ)/dθ

AKA **pfaffian constraints** for velocity constraints
