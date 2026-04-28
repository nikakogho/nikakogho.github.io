A [[Supervised Learning]] method that just looks at k data points from training set and predicts based on them.

**Lazy learning** - does no work during training, all the work at inference.

For classification this is simply a majority vote of k nearest samples.

For regression it takes weighted average.

“Close” can mean euclidean distance or any custom definition of distance.