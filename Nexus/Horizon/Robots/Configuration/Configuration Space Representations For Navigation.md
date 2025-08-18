Needed for [[Configuration]] for [[Navigation]] of [[Robotics|robots]]

Multiple methods to represent and plan the configuration trajectory, such as Meadow Maps, Generalized Voronoi Graphs (GVG), and grids

### Meadow Maps

Draw thick (equal to robot width) rectangular boundaries around obstacles
![meadow_map.jpeg](meadow_map.jpeg)

At most basic step we simply connect corners
![meadow_map_straight.jpeg](meadow_map_straight.jpeg)

Then we take their midpoints for less bumpy navigation
![meadow_map_midpoints.jpeg](meadow_map_midpoints.jpeg)

Alternatively (a better way in fact) we apply path relaxation to skip some steps where it’s possible to turn A -> B -> C into A -> C without a collision
![meadow_map_relaxed.jpeg](meadow_map_relaxed.jpeg)

#### Problems

1. Computationally expensive
2. Relies on map being fully accurate and static
3. Unclear how to tell the robot is at midpoint

### Generalized Voronoi Graphs (GVGs)

We create a line (Voronoi Edge) equidistant from all obstacles. This naturally puts robot path always in middle and avoids the need to thicken the map
![GVG.jpeg](gvg.jpeg)

### Grid

We mark cells that contain obstacle as occupied
![grid_search.jpeg](grid_search.jpeg)

4-connected if only up-down-left-right moves,
8-connected if diagonal allowed

#### Digitization Bias

Cells that barely contain obstacle are marked as occupied, wasting space. Can be solved by using smaller cells but that means higher space and time cost

#### Quadtrees

Avoid waste of space by recursively shrinking cell size when cell not free
![quadtree_recursion.jpeg](quadtree_recursion.jpeg)

Called octree in 3D maps
