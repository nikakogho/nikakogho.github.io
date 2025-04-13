In 2D a 2x2 matrix that fits into [[Homogenous Transform]] like this
![[Pasted image 20250318180757.png]]

In 3D a bit more complex 3x3 matrix

## Matrix Constraints 
Rotation constraint: R<sup>T</sup>R = I so R<sup>-1</sup> = R<sup>T</sup>
Right handed frame => det R = 1

## Special Orthogonal Group
SO(3) is group of all 3x3 matrices that satisfy matrix constraints

SO(2) same in 2D

SO(n) is called **Lie Group**

SO(2) commutes (AB = BA)
for higher n SO(n) is not commutative

## PreRotate and PostRotate
If we have these 3 frames of reference
![[Pasted image 20250403004436.png]]
Rotation of b from s is R<sub>sb</sub> which let's say is equal to rotation operation expressed as matrix R

If we rotate some vector v in c frame by R we will get it rotated and equal to new position of 
v' = Rv

We could also apply this rotation operator R to R<sub>sc</sub>
If we PreRotate => R<sub>sc</sub>' = RR<sub>sc</sub>
If we PostRotate => R<sub>sc</sub>'' = R<sub>sc</sub>R
