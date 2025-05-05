---
layout: post
title: Braitenberg Vehicles & the Illusion of Aliveness Part 2 - From Light Seeker to Explorer
date: 2025-05-05 22:00:00 +0400
categories:
  - Robotics
  - Philosophy
  - GameDev
  - AI
  - Neuroscience
tags:
  - Braitenberg
  - Emergence
  - Unity2D
---
In [[Braitenberg’s Vehicles & the Illusion of Aliveness - intro|part 1]] we wondered whether **our thoughts and emotions** might be _nothing more than layers of clever wiring_—if a toy car can mimic “curiosity” with just a handful of lines, where does true consciousness begin?

Today we bring the first five **Braitenberg Vehicles** off the page and into a Unity2D playground:
- **Light Seeker** (Vehicle 01)  
- **Fear** (Vehicle 02a)  
- **Aggressor** (Vehicle 02b)  
- **Love** (Vehicle 03a)  
- **Explorer** (Vehicle 03b)  

Each one uses the same pure-C# “brain” (Sensor → Wire → Motor); all we change is _which_ sensor drives _which_ motor, and whether the wire _excites_ or _inhibits_.

---

## Vehicle 01 – Light Seeker  
**Wiring**: 1 light sensor ➔ 1 wheel motor (+gain)  
**Behavior**: Stays still in darkness, crawls in dim light, rockets in brightness.  
A single sensor reading is multiplied by a positive gain and fed straight into wheel power, so brightness directly controls speed.

---

## Vehicle 02a – Fear  
**Wiring**: Left sensor ➔ Left motor (+1)  
      Right sensor ➔ Right motor (+1)  
**Behavior**: Turns **away** from the lamp and accelerates while fleeing.  
Because the wheel on the bright side spins faster, the vehicle always steers _away_ from the stimulus.

---

## Vehicle 02b – Aggressor  
**Wiring**: Left sensor ➔ Right motor (+1)  
      Right sensor ➔ Left motor (+1)  
**Behavior**: Curves **toward** the lamp and crashes head-on.  
Cross-wiring swaps which side drives which wheel, so bright light on one side pushes the opposite wheel, steering _into_ the light.

---

## Vehicle 03a – Love  
**Wiring**: Left sensor ➔ Left motor (−1)  
      Right sensor ➔ Right motor (−1)  
**Behavior**: Approaches the lamp but **slows down** as it nears, then gently bumps.  
Inhibitory wires subtract sensor value from a small baseline thrust—bright light _depresses_ wheel power, so the vehicle decelerates into an affectionate nudge.

---

## Vehicle 03b – Explorer  
**Wiring**: Left sensor ➔ Right motor (−1)  
      Right sensor ➔ Left motor (−1)  
**Behavior**: Turns **away** from bright spots but never stops—it drifts through mid-light regions.  
Cross-inhibition causes the vehicle to flee brightness _and_ regain its baseline thrust in darker areas, resulting in an endlessly curious wander.

---

## Try it yourself!

All five vehicles are implemented with under **40 lines** of core C#. You can:

1. **Clone the repo**  
`git clone https://github.com/nikakogho/BraitenbergPlayground`
2. **Open in Unity 2D**
3. **Run any of the demo scenes**:
    - **Vehicle 1 Demo** (Light Seeker)
    - **Vehicle 2 Demo** (Fear & Aggressor)
    - **Vehicle 3 Demo** (Love & Explorer)
    - **Four Way Demo** (all four side by side)
4. **Drag the lamp** to provoke different responses, press **L** to toggle sensor-ray gizmos.

🔗 **Source code**: [https://github.com/nikakogho/BraitenbergPlayground](https://github.com/nikakogho/BraitenbergPlayground)

---

## Questions to ponder
> 1. When does a reactive loop start to look like an “agent”?
> 2. Could adding memory or prediction make it _feel_ alive?  
> 3. At what point (if ever) do we draw the line between circuitry and consciousness?

Stay tuned for Part 3—vehicles with memory, logic gates, and emergent swarms!
