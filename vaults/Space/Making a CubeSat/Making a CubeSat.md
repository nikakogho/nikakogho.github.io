Will be first Georgian satellite

Likely specs: 1U with Jetson Nano + multispectral camera for Earth imaging
Will need a ground station, perhaps customized [[SatNOGS]]

CubeSat Sections: frame, power (solar panels + LiPo batteries), on-board computer, antenna (receiver + sender), camera

Ground Station sections covered in [[Making a Ground Station]]

Useful tutorial from UNOOSA [here](https://www.unoosa.org/documents/pdf/psa/access2space4all/KiboCUBE/AcademySeason2/On-demand_Pre-recorded_Lectures/KiboCUBE_Academy_2022_OPL17.pdf)
This [EdgeFlyte kit](https://www.edgeflyte.com/shop/1u-cubesat-kit) can be good

## Frame
TODO

## Thermal
Must do good enough thermal insulation that internals like batteries, camera and computer stay in operational temperature (typically 0°C to 40°C or sometimes -10°C to 50°C)

TODO details

## Power
TODO

## On-board computer
[Jetson Nano](https://developer.nvidia.com/embedded/jetson-nano)
costs $99

TODO

## Attitude Determination and Control Systems (ADCS)
TODO

## Antenna
Can use VHF (137-148 MHz), UHF (400-470 MHz), S-Band (2-2.4 GHz) or X-Band (8-8.4 GHz)
Ground station will have to send and receive in same frequency
Higher frequency can be more distorted by noise like weather but we will need it for high resolution imaging

### VHF
- Basic beacon signals and simple commands
- Downlink speed mostly 1.2-9.6 kbps, sometimes 19.2 kbps, max 38.4 kbps
- Uplink of 1.2-2.4 kbps

### UHF
- Telemetry, tracking & command, sometimes mission data
- Downlink of 9.6-38.4 kbps, best case 100-250 kbps
- Uplink of 1.2-9.6 kbps

### S-Band
- Main mission data download like Earth images or other
- Downlink from 100 kbps to 1-2 Mbps. Possible to get 4-10 Mbps
- Uplink max 1 Mbps if ground station power and other factors allow

### X-Band
- For high resolution imaging
- Downlink of 10-100 Mbps
	- Advanced CubeSats (6U+) with good ground station might push to 200-500 Mbps
- Uplink mostly not used in this range, overkill. Would be multiple Mbps if used

## Camera
TODO

## Auto-deployment
Solar panels and folded antennas must be first closed (by a wire that burns through current perhaps) and then automatically opened

## Stress tests
### Vibration
Random vibration, sine vibration and shock

### Random vibration
TODO

#### Sine vibration
TODO

#### Shock
TODO

### Heat
Typical qualification test of +100°C
Worst possible case of +125°C

### Cold
Typical minimum requirement of -50°C
Worst possible case of -150°C

## Total Cost
Maybe $10-15k