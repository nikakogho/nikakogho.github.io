Protein Y controlled by \[\[Transcription Factor]] X in its active form X\*
![Pasted\_image\_20240330163922.png](pasted_image_20240330163922.png)
Y = f(X\*)
Expressed as hill function
![Pasted\_image\_20240330164035.png](pasted_image_20240330164035.png)
K = **activation coefficient**, concentration of active X needed to significantly activate
β = **maximal promoter activity**, reached at high activator concentrations (when X\* ≫ K)
As n increases, it looks more and more like a step function

Typically n between 1 and 4

**β0 = basal expression level** = non-zero minimal expression level

## For repressor

![Pasted\_image\_20240330164501.png](pasted_image_20240330164501.png)
K = **repression coefficient**
β = promoter does not bind at all

## Logic Function

Often 0 or β is good enough
f(X\*) = β \* θ(X\* > K) for activator
θ = 1 if X\* > K else 0

f(X\*) = β \* θ(X\* < K) for repressor

## Multiple factors

Many affect
AND gate: f(X\*, Y\*) = β \* θ(X\* > K<sub>x</sub>) \* θ(Y\* > K<sub>y</sub>), basically X\* AND Y\*
OR gate: f(X\*, Y\*) = β \* θ(X\* > K<sub>x</sub> OR Y\* > K<sub>y</sub>), basically X\* OR Y\*
SUM genes: f(X\*, Y\*) = β<sub>x</sub>X\* + β<sub>y</sub>Y\*

## Production / removal

For transcription factor X that creates protein Y, signal S<sub>x</sub> turns it to active state X\*

Production of Y is balanced by

1. α<sub>deg</sub> = *protein degradation* = destruction by specialized proteins
2. α<sub>dil</sub> = *dilution* = less concentration because cell grew
   α = α<sub>deg</sub> + α<sub>dil</sub>

Change in concentration of Y = dY/dt = β - αY
where
β = rate of protein production
α = probability per unit time that each protein Y is removed

Steady state = Y<sub>st</sub> => dY/dt = 0 => Y<sub>st</sub> = β / α

## Removing when β = 0

if β = 0 then Y starts being removed at
Y(t) = Y<sub>st</sub> \* e<sup>−αt</sup>
![Pasted\_image\_20240330172414.png](pasted_image_20240330172414.png)

**T<sub>1/2</sub>** = **Response time** = time to reach Y = Y<sub>st</sub>/2
**T<sub>1/2</sub>** = ln(2) / α

## Start of transcription

Y(t) = Y<sub>st</sub> \* (1 − e<sup>−αt</sup>)
**T<sub>1/2</sub>** = log(2) / α
Concentration slowly rises

Fast removal rate (high α) allows faster changes in concentration in either direction

## Stable proteins

in some proteins there is no degradation (α<sub>deg</sub> = 0)
Response time = 1 cell generation (when cell divides and each part gets half)
