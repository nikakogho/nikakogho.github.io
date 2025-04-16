Separate datasets for learning and testing

We tell the AI what to optimize for, what the goal is, by giving labels (answers) on learning data and then checking its accuracy on testing data

## Classification
Identify correct cattegory (descrete output value) for given input, like “is this photo a dog, a cat or a horse?”

**Categorical** output

For a "yes/no" question
- **sensitivity** = true positive rate (0 to 1)
- **specificity** = true negative rate (0 to 1)

### K-nearest neighbors
New point will be assigned value equal to whatever is most common in K of nearest neighbors

## Regression
Continuous value like “by what amount of force should I move the hand”

**Numerical** output

Technically regression is also clasification since possible values in *int* or *float* are finite but for practical purposes we treat it as continuous because it allows us to think differently about it