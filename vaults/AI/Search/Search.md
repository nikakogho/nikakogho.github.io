Given state space and possible actions, and a transition model where given a state and number you get a new state, find way to reach a goal state from a start state, preferably cheapest such path

Ways: DFS, BFS, Dijkstra, Greedy Best-first Search, A*, Adversarial Search, Minimax, Alpha-Beta Pruning, Depth-Limited Minimax

Uninformed vs informed search

## Greedy Best-First Search
First expands on the node that is closest according to some heuristic function
For example when searching in a grid, prioritizing moving to cells that are closer to goal in coordinates

## A*
Expands node with lowest g(n) + h(n)
g(n) = cost to reach node n
h(n) = heuristic estimated cost from n to goal

Similar to greedy best-first search but also considers how much it cost us to get here

A* is optimal if these 2 requirements are met:
1. h(n) is admissible: `h(n) <= true` cost but never overestimates
2. h(n) is consistent: for every node n and its successor n' with step cost c, `h(n) <= h(n') + c`

## Adversarial Search
My opponent and I play a game and we have opposing goals

### Minimax
Type of adversarial search
Like in Chess or TicTacToe or other 2 player game, first find max of my possible moves, on next level min for opponent's best possible move and so on

#### Alpha-Beta Pruning
Optimization of minimax by eliminating some paths
No point going down a path that has already been nullified on a higher level

Example: if looking for max on a higher level and min on lower and our this level's min is 1 and higher level's max is already above it there is no point in continuing this pathway

## Depth-Limited Minimax
TicTacToe can be evaluated to the end but chess can't so instead after some level of depth we come up with a function to evaluate value of state, like just adding up value of remaining our figures - enemy figures, maybe also adding points for having king in a good position and so on