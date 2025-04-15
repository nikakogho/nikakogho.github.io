## Hill Climbing
Moving to max or min value, might get stuck at local best
Might also get stuck because of flat values for a while

## Simulated Annealing
High “temperature” (odds of picking bad neighbors) at start that gets lower by end

### Pseudocode
``` python
def sim_anneal(problem, max):
  current = # start state
  for t in range(max):
    T = temperature(t)
    neighbor = random neighbor of current
    E = how much beyyer neighbor is than current
    if E > 0:
      current = neighbor
```
with probability e<sup>E/T</sup> set current to neighbor