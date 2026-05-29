[[AI Safety]] techniques for managing the use of potentially misaligned AI models in deployment, preventing them from causing damage, getting useful work out of them, and escalating to human attention if they act too dangerously.

Explained by [[Buck Shlegeris]] in [this interview with 80K Hours](https://www.youtube.com/watch?v=BHKIM1P7ZvM).

Main papers:
* [AI Control](https://arxiv.org/abs/2312.06942)
* [Ctrl-Z: Controlling AI Agents via Resampling](https://arxiv.org/abs/2504.10374)
* [Adaptive Attacks on Trusted Monitors Subvert AI Control Protocols](https://arxiv.org/pdf/2510.09462)

Important to keep in mind that in most complex real world scenarios we can't give 100% guarantees of control, just like we can't give 100% guarantee that given code isn't a virus, due to [[Halting Problem]] and [[Rice's Theorem]].

## Trusted Monitors

Using another AI model that we trust (but is likely weaker than this one) as a judge that filter's this model's actions:
![ai_control_trusted_monitor_sample.png](ai_control_trusted_monitor_sample.png)

## Resampling vs Retrying

Retrying is

1. Model proposes action
2. Judge flags it as suspicious
3. Model is told about this and so proposes another action
4. Judge either flags it as suspicious and repeats or accepts

Problem with retrying is that model receives feedback on what kinds of actions the judge rejected so the model gets an opportunity to learn from that feedback and still successfully sneak in a backdoor.

Resampling on the other hand simply either samples multiple times right away, or rewinds the model's history to that point where it proposed an action and makes it propose alternatives without the model knowing what got rejected.

### Fixed-k Resampling

```python
candidates = [sample_action(context) for _ in range(5)]  
scores = [monitor(a) for a in candidates]
```

### Selective Resampling

```python
a1 = sample_action(context)  
suspicion1 = monitor(a1)  
  
if suspicion1 > threshold:  
	candidates = [a1] + [sample_action(context) for _ in range(4)]  
else:  
	candidates = [a1]
```

## Defer To A (More) Trusted Model

If the main untrusted model's action is suspicious enough to not execute but not enough to escalate to human, we may just defer to a (more) trusted model for this task:

```python
def defer_to_trusted_protocol(state):
    action = untrusted_agent(state)
    score = trusted_monitor(state, action)

    if score.suspicion < 0.4:
        return execute(action)

    # Suspicious: use trusted weaker model instead.
    trusted_action = trusted_agent(state)

    # Optionally monitor trusted output too, mostly for ordinary mistakes.
    trusted_score = trusted_monitor(state, trusted_action)

    if trusted_score.suspicion > 0.7:
        return ask_human(state)

    return execute(trusted_action)
```

Could potentially make a huge chain here of this more trusted model also deferring to an even more trusted but even weaker model if flagged too suspiciously and so on.

## Tool/Action Sandboxing
Only allow using tools with certain parameters, like editing files only in certain folders, or only making specific web requests.

``` python
ALLOWED_TOOLS = {"read_file", "run_tests", "edit_file"}
FORBIDDEN_PATHS = {".env", "secrets.json", "private_keys/"}

def validate_tool_call(tool_call):
    if tool_call["name"] not in ALLOWED_TOOLS:
        return False, "Tool not allowed"

    path = tool_call.get("path", "")
    if any(path.startswith(forbidden) for forbidden in FORBIDDEN_PATHS):
        return False, "Forbidden path"

    if tool_call["name"] == "edit_file":
        if not path.startswith("src/") and not path.startswith("tests/"):
            return False, "Edits only allowed in src/ or tests/"

    return True, "ok"
```
