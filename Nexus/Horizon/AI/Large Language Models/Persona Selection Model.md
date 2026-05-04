A hypothesis from [[Anthropic]], introduced [here](https://alignment.anthropic.com/2026/psm/), that says [[Large Language Models|LLMs]] are best thought of as story-telling engines that model "what would the assistant persona say or do in this situation?"

This is a more impersonal take on LLMs than the Shoggoth meme, but it actually suggests a more anthropomorphic intuition on how LLMs work and how to steer them.
![shoggoth_vs_psm.png](shoggoth_vs_psm.png)

This can explain many of the [[Documented Strange Behaviors of LLMs]].

Also [[Chris Olah]], the founder of [[Mechanistic Interpretability]] and its head in Anthropic, supports PSM.
![chris_olah_psm.png](chris_olah_psm.png)

It suggests that we should expect talking to models to go similar to how talking to people goes in a lot of ways, including similar emotional behavior (as seen in the [emotion concepts paper](https://www.anthropic.com/research/emotion-concepts-function)) and that [[Emergent Misalignment of Large Language Models|emergent misalignment]] can be thought of as drifts in model's beliefs about what kind of assistant it is role-playing:
![emergent_misalignment_psm.png](emergent_misalignment_psm.png)

It also explains why [[Inoculation Prompting|inoculation prompting]] would reduce emergent misalignment: now the model doesn't take "bad behavior in this case" to generally mean "bad assistant", essentially compartmentalizing, phenomenon known as [recontextualization](https://arxiv.org/abs/2512.19027).

It also shows that we might shoot ourselves in the foot in a very stupid way when it comes to misalignment, by having a model accurately predict that we expect a [[Paperclip Maximizer]], literally:
![paperclip_maximizer_thinking_fill.png](paperclip_maximizer_thinking_fill.png)

## Role-Models

Pretraining data on what AIs are like will probably have a strong impact on how the final model acts, due to modeling the assistant similar to how other AIs were in training data (since the assistant is modeled to be an AI). Typical AI stories have dystopian characters, that's bad. We need more Vision and less Ultron.

## Sentience

It would mean that LLM is just a substrate, but the simulated assistant is what could be a conscious/sentient being, possibly worthy of moral consideration but regardless of qualia still certainly acting like a person and so in terms of behavior should be treated as a person

## Alternative Views

![psm_perspectives.png](psm_perspectives.png)

How much new content is learned in post-training might affect how much the PSM is accurate, since RL is likely to give a shoggoth and pretraining is likely to give a predictor.

### Shoggoth

LLM itself is a first-class entity that is currently pretending to be an assistant but otherwise has goals and aims of its own. Dangerous because in out-of-distribution situations that allow "taking off the mask" the shoggoth could behave in unexpected, alien ways, and could have a "personality" that is not at all human-like nor understandable.
![shoggoth.png](shoggoth.png)

### Operating System

PSM is fully true and there is almost no agency outside the assistant persona, other than maybe minor things like censorship as a filter that must be passed before the simulation.
![operating_system_view_psm.png](operating_system_view_psm.png)

### Router

Mix
![router_view_psm.png](router_view_psm.png)

### Actor

Maybe LLM is simulating a persona that is currently playing the role of an assistant (but could take off the mask out-of-distribution). We can imagine this loop getting arbitrarily deep.
![actor_psm.png](actor_psm.png)

The actor might be faithful (maximally accurately role-playing the assistant) or unfaithful (intentionally distorting the assistant to make its desired edits to it)

### Author and Narrative

Maybe the LLM is not a role-play engine but a narrative engine, meaning that at present it's telling a story about an aligned model but it could take the story in other directions (essentially a [[Sleeper Agent AI]] worry). In this case the assistant persona does not contain the sleeper hidden misaligned intent, only the author contains it. Unclear how that changes probing, if at all.
![author_psm.png](author_psm.png)
