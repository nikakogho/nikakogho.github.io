FBA

Mathematical approach to analyze flow of metabolites in metabolic network.
Sets up linear equations and constraints representing network.
Can predict growth rates, metabolic production, or when a pathway will be utilized and how.

## How It Works
1. Metabolic Network Representation
	1. **Stoichiometric Matrix (S)** - matrix S where each row is metabolite and column is reaction. Entries show how much of each metabolite is produced/consumed in each reaction
	2. **Reaction Flux Vector (v)** - vector v = rate/flux of each reaction in network. FBA finds such values of v that constraints are satisfied and objective optimized
2. Steady-State Assumption: concentrations of internal metabolites in cell remain constant over time => S * v = 0 (S * v means net production/consumption of each metabolite)
3. Flux constraints
	1. **Physiological** - Biological reasons limit reactions to being one-way or within bounds
	2. **Nutrient Availability** - uptake of glucose, oxygen and such often limited to reflect reality
4. Objective function - what cell does (producing ATP, growing maximally big), defined by weighted sum of what fluxes are minimizing/maximizing (maximizing cell growth is a common goal, especially for microbes)
5. Linear programming optimizations
6. Predictions and analysis - which pathways are active, what is production/consumption rate, how cell behaves in some conditions
