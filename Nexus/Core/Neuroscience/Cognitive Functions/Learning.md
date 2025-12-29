Forming [[Memory|memories]] that can be retrieved.
Forming [[Reflex|reflexes]] that can be used.

Uses [[Neuroplasticity]]
Depends on [[Cognitive Load]]

[[NeuroChat]] is a project attempting to use neuroadaptation with [[Muse]] EEG recordings + personalized AI tutor (GPT-4) for better engagement in learning

## Hebbian Learning for Long Term Potentiation

Cells that fire together, wire together.

How?

### Glutamate Example

![hebb_glutamate_1.png](hebb_glutamate_1.png)

* At rest, [[Glutamate]]-releasing [[Synapse|synapses]] have AMPA receptors and NMDA receptors
  * AMPA opens upon receiving glutamate
  * NMDA is also voltage-gated since Mg<sup>2+</sup> blocks the road until enough voltage shoves it aside
* ![hebb_glutamate_2.png](hebb_glutamate_2.png)
* When there is glutamate around to bind to NMDA at the same time as enough depolarization inside the postsynaptic neuron, the NMDA receptor's [[Ion channel]] opens and lets calcium through
* This calcium likely triggers building of more AMPA receptors, strengthening the synaptic connection through [[Long Term Potentiation]] (LTP)
* In fact at first there are only NMDA receptors and it takes a couple synchronized spikes for AMPA receptors to start building up

### Mechanisms of LTP

* Adding more AMPA receptors to postsynaptic dendrite
* “Upgrading” existing AMPA receptors by phosphorylation with protein kinases![LTP_options.jpeg](ltp_options.jpeg)
* Axon might form more synapses on same dendrite
* Dendritic spine grows to make room for more ion channels

## Long Term Depression (LTD)

For unlearning (weakening synaptic connection and eventually undoing the synapse).
Happens the other way around: if a presynaptic neuron released neurotransmitters while postsynaptic neuron is **NOT** spiking, it triggers removal of AMPA receptors, making the synapse weaker.
When enough receptors are removed, eventually the synapse is undone.

### Heterosynaptic LTD

LTD can sometimes also be triggered if postsynaptic neuron spikes while presynaptic doesn’t release neurotransmitter

### How a synapse is undone

3 levels:

1. Functional weakening - typical LTD: receptors removed, synaptic strength decreased
   1. Reversible in minutes/hours
   2. AMPA receptors are removed
   3. AMPA receptors are dephosphorylated
2. Structural weakening - if synapse is inactive for days
   1. Postsynaptic spine shrinks
   2. Axon terminal gets smaller
   3. Scaffolding proteins disappear
   4. Partially reversible
3. Synapse elimination - in developmental or learning pruning
   1. Spine retracts
   2. Presynaptic terminal withdraws
   3. Synapse physically disappears
   4. Sometimes might be reversible if
      1. Neurons are close enough
      2. Circuit is still around
      3. Strong correlated activity
      4. Easier in early life (possible in adults but uncommon)

## LTP-LTD Table

| Presynaptic (neurotransmitter release) | Postsynaptic fires | Synaptic change    |
| -------------------------------------- | ------------------ | ------------------ |
| Yes                                    | Yes                | LTP                |
| Yes                                    | No                 | LTD                |
| No                                     | Yes                | Heterosynaptic LTD |
| No                                     | No                 | No change          |

## Spike Timing-Dependent Plasticity

![spike_timing-dependent_plasticity.jpeg](spike_timing-dependent_plasticity.jpeg)
