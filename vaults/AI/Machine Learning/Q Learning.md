Type of [[Reinforcement Learning]] where we learn function Q(s, a) that returns how much value we will get if we are in state s and take action a

## General Steps
start at Q(s, a) = 0 for all s, a

When action a in state s taken and reward r given:

Q(s, a) += alfa * (new value estimate - Q(s, a))

new value estimate = r + (max possible Q(s’, a’))
