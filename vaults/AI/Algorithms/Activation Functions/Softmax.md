Transforms logits (vector of real numbers) into probability distribution where each has positive value and sum is 1

Steps:
1. Each number x in vector becomes e<sup>x</sup> to become positive
2. Vector is normalized (divided by size) so that sum is 1