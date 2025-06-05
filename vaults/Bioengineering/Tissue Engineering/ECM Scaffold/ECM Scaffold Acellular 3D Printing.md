For [[ECM Scaffold Fabrication]].
Part of [[Tissue Engineering]].

Unlike conventional methods that work by removing (like with sculpting), this is additive manufacturing, building from ground up (well except we might also add support structures that we later remove but it's still mostly additive).

For acellular prints.
For cellular we use **bioink** in [[3D Bioprinting]].

Printing heart's small parts in a 2023 video [here](https://www.youtube.com/watch?v=mMeOjwH4NVU)

## Stereolithography (SLA)
Shines laser-accurate light on **photopolymer** (light-reactive, mostly UV) resin and solidifies it layer by layer.

Often for [[Bone]], [[Cartilage]].

### Steps
1. Build platform submerged in liquid vat of resin
2. Light curing - UV laser or digital light projector (DLP) projects on specific parts of current layer to solidify it
3. Platform moves down by fixed height (platform height) so next liquid layer flows on top of solidified layer
4. Repeat until done
5. Post-Processing
	1. Removed from vat
	2. Washed
	3. Post-cured in oven to completely solidify
	4. Support structures (if used for overhanging parts) removed

### Used For
- Specially designed biodegradable photopolymers like
	- poly(propylene fumarate) (PPF)
	- modified polycaprolactone (PCL)
	- polyethylene glycol (PEG)
- Sometimes in ceramic resins but more complex process here

### Cons
- Cytotoxic - can kill cells (mitigated by using biofriendly materials so that this liquid resin can become bioink filled with cells)
- Only works with photopolymers and that means not for many tissues
- Removing support structures can sometimes damage it
- Some resin layers have problem with light properly penetrating and solidifying all parts

## Selective Laser Sintering (SLS)
Lasering on powdered material.

For each layer, powder is spread on build platform, laser heats it up and melts them and makes them attach (sinter), while powder parts stay for support.

Used for
- custom bone implants
- porous scaffolds for bone or cartilage

### Steps
0. Powder bed preparation - thin powder spread uniformly on platform just under melting point temperature
1. Laser sintering - high powered laser (often CO<sub>2</sub> or fiber) heats and sinters correct parts
2. Lowering and new layer spread on platform
3. Repeat until done
4. Cooldown
5. Sinter part carefully excavated
6. Post-processing - excess powder removed

## Used with
Thermoplastic polymer powders like
- Polycaprolactone (PCL)
- Nylon (Polyamides)
- Polyether ether ketone (PEEK)
- Sometimes with ceramics or metal if stronger laser

### Cons
- Hard to control porosity
- Surface often needs extra work to be biofriendly
- Heating and cooling may give thermal stress or warping

## Fused Deposition Modeling (FDM)
AKA Fused Filament Fabrication (FFF)

Most common, and used in normal 3D printers people buy.

Molten thermoplastic filament comes out of tip and deposits on a layer, then cools, then next layer starts and so on.

### Used with
Biocompatible and biodegradable materials like
- Polylactic Acid (PLA) - very common
- Polycaprolactone (PCL) - low melting point is good
- Acrylonitrile Butadiene Styrene (ABS) - common in normal 3D printing but rare for bioprinting due to biocompatibility issues
- Polyether ether ketone (PEEK) - for high strength, needs high temperature printer

Minimum pore size limited by nozzle diameter.

Often for rapid prototyping, sometimes for porous scaffolds with PLA or PCL for bone or cartilage

### Pros
Common, cheap, easy to use

### Cons
- Lower resolution
- Weaker
- Nozzle clogging
- Few biocompatible materials go with it
- Large parts sometimes warp in cooling