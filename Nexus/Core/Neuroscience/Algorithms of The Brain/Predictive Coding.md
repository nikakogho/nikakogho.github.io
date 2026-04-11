An [[Algorithms Of The Brain|algorithm]] the [[Brain|brain]] is theorized to be using for cognition.
Main idea: brain is always trying to predict sensory data and only updates upon **prediction error**: when received input is different from what was expected. Goal of the brain is to minimize this error.

Unlike [[Backpropagation|backpropagation]], learning with predictive coding can be performed entirely in parallel, no need for 1-layer-at-a-time global coordination.

## Hierarchical Prediction

Higher-level brain areas predict what previous layers would give them as input, like in [[Visual Cortex]] V2 tries to predict what [[Primary Visual Cortex|V1]] would send it:

1. V2 sends its prediction to V1
2. V1 compares that against its actual sensory input
3. V1 sends the **residual error** (difference between prediction of V2 and actual sensory input) back up to V2
4. V2 adjusts its synapses to predict more accurately next time
   ![predictive_coding_hierarchy.png](predictive_coding_hierarchy.png)

## Error Neuron

Special neurons whose job it is to transmit the residual error.
We can imagine that at each layer there's a neuron predicting the value for layer below, and an error neuron that predicts how much that predicted value deviated from real signal
![predictive_coding_one_level_representation_and_error.png](predictive_coding_one_level_representation_and_error.png)

Such representational neuron x<sub>i</sub> is inhibited by e<sub>i</sub> and excited by error neurons of below layer
![representation_calculation_pred_coding.png](representation_calculation_pred_coding.png)

Error neurons receive excitatory input from representation neuron and inhibitory input from representation neurons in layer above
![error_calc_pred_coding.png](error_calc_pred_coding.png)
