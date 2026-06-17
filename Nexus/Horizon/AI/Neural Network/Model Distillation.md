We have a teacher model and a student model. Teacher is typically a larger model (mostly, unless we are dealing with **self-distillation**). Student model learns by imitating the teacher's outputs (either sharp answers or logits).

Idea is that maybe the teacher went through some super expensive training, possibly even including [[Reinforcement Learning]] where correct distribution was not available and training signal was much more sparse, but the student just has to do [[Supervised Learning]] on teacher's outputs and so attain a similar performance much more cheaply, and on a smaller, cheaper/faster architecture.

Another intuition is also that if we have access to teacher's logits and not just the final answer, then we can extract [[Dark Knowledge In Neural Networks|dark knowledge]] from the teacher model.

Chinese labs often use this to train smaller [[Large Language Models|LLMs]] that perform on a competitive level to giant American models.

## Self-Distillation
Special case where a model trains on its own outputs to refine its performance. Idea being that maybe its scattered representations can be cleaned up and it can boost performance.

### Born Again Neural Networks
Introduced [here](https://arxiv.org/abs/1805.04770), idea is to start with a teacher model at generation 0 and train generation n+1 from outputs of generation n, where model architecture is always same and it's just weights changing. This improves performance for a while, but eventually plateaus and then degrades if pushed past generation 4 or so.