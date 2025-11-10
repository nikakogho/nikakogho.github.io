Simultaneous Localization and Mapping.
For when we don’t have a map or it keeps changing a lot.
If we already have a map then we just need [[Localization]].

Usually sensing surroundings (often by [[LiDaR]]) and then computing what objects are around and comparing that to map accumulated so far to determine where we are and what total world map is. Each measurement is probabilistic.

Many possible implementations, one way by doing Graph SLAM explained [here](https://medium.com/machinevision/implement-slam-from-scratch-b1fb599f40c8).

## Rao-Blackwellized Filtering
Popular method for calculating maximum likelihood map using particles.

TODO how

## Loop Closure Problem
Due to small errors accumulating in mapping, a robot might come full circle and not realize it, or map the whole place a bit wrong and get a mismatch between start and end locations.

### Solutions
- Feature matching - match geometric features to unique spots, familiarity means loop. Problem if place actually has similar looking sections
- Sensor scan matching - same but use all raw input not just identified features
- Hybrid featire-scan matching
- Expectation matching - how likely is it that we’ve come full circle? Computationally expensive

## Terrain Mapping
Based somewhat on US Army’s studies for their cars, tanks, and infantry.

Natural terrain has *surgace configuration* that has
- landforms
- relief
- slope

Also vegetation (plants, gardens), water (river/lake/whatever)

There are also man-made features like roads, bridges, walls, towers, airports…

### Digital Terrain Elevation Maps
US has *Digital Terrain Elevation Data (DTED)* that gives average elevation over some area.
10m x 10m or 30m x 30m resolution map is usually enough

### Terrain Identification
Height alone is not enough, as we also need information about trees, rocks, grass, mud…

- **Projective terrain identification** lets a robot see and think about path planning in terrain before it hits a rock/mud/other. Common problem here is telling apart tall grass that can be traversed from rock that must be avoided
- **Reactive terrain identification** is when a robot adjusts after bumping into obstacle.

[[Stereophotogrammetry]] is used to let a robot or a drone make a map that is higher resolution than from satellite pictures.

[[Characteristic Dimension]] measures minimum length of robot for how narrow places it can pass through and such.

[[Traversabillity]] is also a concern.