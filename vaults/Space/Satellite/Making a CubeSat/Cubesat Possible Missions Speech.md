***Speech to KU Leaders: Georgia's First 1U CubeSat - Mission Roadmap***

## Opening

Distinguished Rector, Deans, and colleagues--thank you for the opportunity to outline how Kutaisi International University can place Georgia among the world's space-faring nations with a single 1-unit CubeSat. I will present twenty-five candidate missions ranked from most to least valuable, explain why each matters globally and locally, and close with five recommended mission bundles that maximise impact while staying within our ~= $20 000 budget.

---

### 1 - Precision-Agriculture NDVI Imager

*What?* A tiny multi-spectral camera plus our on-board NVIDIA Jetson Nano computes Normalised Difference Vegetation Index (NDVI) on-orbit.

*Why globally?* Food security hinges on early crop-stress detection; Planet charges farmers for this data--our open system would democratise it.

*Novelty & benefits:* First sub-$20 k satellite to deliver **edge-processed** NDVI. Georgian vineyards and hazelnut orchards get weekly health maps; students learn applied AI, optics, and agronomy.

*How?* COTS PiCam with dual-band filter, Jetson runs a CNN to calibrate & map NDVI, downlink only 8-bit geo-tiffs via UHF--fitting power & data budgets.

### 2 - Wildfire & Smoke Early-Warning

Visible/IR camera + Jetson vision model flags smoke plumes within minutes. Protects Borjomi-Kharagauli National Park; globally relevant as fires intensify. The novelty is real-time *onboard* fire detection in a 1U, demonstrated only by 6U OroraTech so far. Same camera bus as Mission 1, so no added mass--just new firmware.

### 3 - Flood Mapping

After heavy rain, repeat images are differenced on-orbit; water pixels are flagged and vector outlines are down-linked for civil defence. Supports Georgia's Emergency Management Service and World Bank resilience programs. Uses camera of Missions 1-2; costs only software.

### 4 - Landslide Monitoring

AI change-detection on Caucasus slopes warns road and rail planners. Landslide mapping satellites exist, but none run edge AI in 1U. Educational bonus: geoscience & ML fusion.

### 5 - Environmental IoT Gateway

A LoRa transceiver collects data from in-situ avalanche beacons, weather or seismic sensors and forwards the packets. Opens living lab for IoT & low-power networking, attracting industry partners. Jetson handles scheduling & compression.

### 6 - Maritime AIS Receiver

VHF antenna logs Automatic Identification System messages, giving Georgia continuous Black-Sea vessel traffic awareness and feeding global ship-tracking services. Proven on Spire's CubeSats, but we add AI anomaly detection for illegal fishing.

### 7 - Coastal Vessel Detection (Optical)

Camera plus YOLO v5 runs on Jetson to spot un-registered craft--complements AIS by catching "dark" ships. Shares Mission 1 hardware.

### 8 - Ocean-Colour & Algal-Bloom Monitor

Blue/green channels of the camera track chlorophyll & pollution plumes in the Black Sea.

Public-health win; same imager.

### 9 - Land-Use & Deforestation Tracker

Edge classifier labels forest, farm, urban growth. Supports environmental NGOs; trains students in remote-sensing analytics.

### 10 - Glacier & Snowpack SurveySeasonal imaging of Caucasus glaciers helps hydro-resource modelling and climate research

leverages Mission 1 optics.

### 11 - GNSS-Reflectometry Soil-Moisture Probe

Passive GPS reflections reveal soil wetness--cheaper than a radar payload. Georgia's irrigation planning benefits; technique validated by NASA CYGNSS but never in 1U with COTS SDR.

### 12 - ADS-B Flight Tracking

1090 MHz SDR captures aircraft positions over Black Sea air corridors; data sold to flight-aware companies and aids SAR.

### 13 - Amateur-Radio Beacon & STEM Uplink

UHF ham-band transceiver sends telemetry that schools can decode; students upload short scripts to run on the Jetson, fostering nationwide STEM excitement.

### 14 - Lightning & Transient Luminous Event Sensor

Fast photodiode detects lightning, sprites; data shared with atmospheric-physics labs world-wide.

### 15 - Radiation Dosimeter

Solid-state detector logs ionising flux; baseline for future Georgian satellites and university physics courses.

### 16 - Magnetometer Space-Weather Probe

Tri-axis fluxgate maps local geomagnetic field; data feeds international auroral indices.

### 17 - UV / Ozone Photometer

Measures Earth-reflected UV for ozone column estimates--citizen-health value during high UV periods.

### 18 - Meteor & Debris Flash Camera

Wide-FOV sensor catches atmospheric entries; contributes to debris flux models.

### 19 - Edge-AI Super-Resolution / Compression Demo

Software-only mission: Jetson runs a super-res GAN, proving we can quadruple image detail *or* compress 10x before downlink--doubling science per byte.

### 20 - Reconfigurable Software Platform

Lockheed-style "AppStore in space": upload new code mid-mission, turning the CubeSat into a research computer--magnet for grants & internships.

### 21 - Avalanche Early-Warning Network

Extension of Mission 5: snow-pack sensors uplink risk data via LoRa; Jetson fuses with camera-based snow images, pushes alerts to mountain villages.

### 22 - Space-Debris Collision Alert Experiment

Uses star-track camera & ADCS telemetry to sense micro-impacts and update conjunction risk tables--publishes open data for global safety.

### 23 - Optical Laser Downlink Test

Blue-LED laser comm beacon boosts data-rate during direct passes; positions us at the forefront of optical CubeSat comms.

### 24 - Citizen-Science Multi-Sensor Lab

Expose radiation, magnetometer, UV, and camera to K-12 coding contests; students design space experiments--priceless outreach.

### 25 - Store-and-Forward Data Relay

Generic low-bit-rate mailbox for remote researchers or NGOs. Simple, but lowest novelty compared to earlier IoT concept, hence last.

---

## Synergy & Bundle Recommendations

1. "Geo-Guardian Imaging + AI" -- Missions 1-4, 7-10, 19, 20

Shared assets: one multispectral camera, one Jetson, same comms. Fits 1U power if we time-slice processing.

2. "Smart Environmental Telemetry" -- Missions 5, 21, 25, 13

Shared LoRa/UHF radio, tiny AI gateway code; perfect disaster-resilience storyline.

3. "Sea & Sky Safety" -- Missions 6, 7, 12

Combines AIS + optical vessel detection + ADS-B with one dual-band SDR and camera.

4. "Space-Weather Classroom" -- Missions 14-18, 24

Sensor suite (radiation, magnetometer, UV, lightning) drives a nationwide STEM programme.

5. "Tech-Leap Demo Sat" -- Missions 19, 20, 22, 23

Showcases Georgia's software ingenuity and emerging optical-comms talent.

---

### Closing

By choosing Bundle 1 or 2 we can deliver direct societal value to Georgia and a publishable scientific first--while staying within UNOOSA's free LEO launch and a ~20 k component budget.

With your support, Kutaisi International University will not only orbit Georgia's flag, but also pioneer affordable, AI-enhanced space capability for the region.