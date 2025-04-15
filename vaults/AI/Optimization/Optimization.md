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
    deltaE = how much better neighbor is than current
    if deltaE > 0:
      current = neighbor
    else:
      p = e ** (deltaE / T)

      if random.choice() < p:
        current = neighbor
```
