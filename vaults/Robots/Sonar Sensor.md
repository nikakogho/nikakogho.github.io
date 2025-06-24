Sends out sound, times how long it took for echo to return.
Can make [[Sonar Ring]].

Ultrasound on ground, different frequency in water.

## Ultrasonic Sensor

* β is angle for field of view
* R is range as far as this sensor sees
* Region I is where detected object is
* Region III is where we could have also checked if Region I didn’t interfere
* Region II we know is empty
* Region IV we cannot see
  ![IMG_5959.jpeg](img_5959.jpeg)

Downside of ultrasonics is

* **specular reflection** - when target surface is not flat relative to sensor, light may reflect at different angles, bounce around other objects and eventually return to sensor, giving inaccurate range estimate. Glass is especially problematic
* **foreshortening** - if target is imaged at angle, since we are flattening it we may perceive it as shorter than it really is
* **cross-talk** - in a design line sonar ring, sound emitted by one sonar may be reflected such that it hits another sonar, giving it wrong data. Most designs av
