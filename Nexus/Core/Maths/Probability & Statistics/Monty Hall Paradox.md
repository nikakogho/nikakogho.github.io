A [[Probability|probability]] paradox of the following situation: you are playing a game where you must pick one of 3 doors. Behind one of the doors is a car.

You pick a door.
Now, the game master opens one of the 2 other doors that is guaranteed to not have a car, and now gives you an option to either change your pick or still have that same door picked.

Should you change your pick?

Naively you may think “there are now 2 doors closed and one of them has a car so 50/50 doesn’t matter which I pick”, but this is wrong because the first door was never possible to be opened by the game master and game master had to open a door without a car behind it (the process of generating our data mattered). Since game master only picked which door to open from the 2 you didn’t pick and with constrain that the picked door must not have a car behind it, those probabilities got redistributed, and now your original pick has a chance of 1/3 but the other locked door has a chance of 2/3.

This is what [[Causality|causality]] diagram looks like when both our original pick of the door and the real location of the car affected which doors the game master could have opened
![monty_hall_real.jpeg](monty_hall_real.jpeg)

If however game master had opened a not-your door at random, without guaranteeing that it’s opening a door that’s not a car, then indeed the remaining 2 doors (your original and the unopened other) would be 50/50 for which has a car
![monty_hall_fake.jpeg](monty_hall_fake.jpeg)
