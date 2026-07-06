Type of [[Reinforcement Learning]] where we learn function Q(s, a) that returns how much value we will get if we are in state s and take action a.
This is not the same as just learning a value of that next state s' because taking action a in state s won't always get you in a same s'

## General Steps
start at Q(s, a) = 0 for all s, a (or on some positive or other initial number sometimes)

When action a in state s taken and reward r given:

Q(s, a) += alfa * (new value estimate - Q(s, a))

new value estimate = r + (max possible Q(s’, a’))
