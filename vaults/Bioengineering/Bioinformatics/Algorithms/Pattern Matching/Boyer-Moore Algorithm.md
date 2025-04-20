A pattern matching algorithm that skips pointless cases

Works by **bad character rule** and **good suffix rule**

## Bad character rule

![Pasted_image_20250420183137.png](pasted_image_20250420183137.png)

## Good suffix rule

Identify suffix that exactly matches and then after point of mismatch check for other such suffixes in pattern. If none found, shift totally. If found then shift by that much and continue logic
Explained well [here](https://medium.com/@neethamadhu.ma/good-suffix-rule-in-boyer-moore-algorithm-explained-simply-9d9b6d20a773)
![Pasted_image_20250420183722.png](pasted_image_20250420183722.png)
