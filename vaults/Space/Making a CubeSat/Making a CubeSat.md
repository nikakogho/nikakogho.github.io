**QartvelSat-1** will be first Georgian satellite

Plan document on Google Drive [here](https://drive.google.com/drive/folders/1nq60LDRE2MJi6KV53ytwD44ZEqf387NK?usp=drive_link)

Likely specs: 1U with Jetson Nano + multispectral camera for Earth imaging
Will need a ground station, perhaps customized [[SatNOGS]]

CubeSat Sections: frame, power (solar panels + LiPo batteries), on-board computer, antenna (receiver + sender), camera

Ground station details covered in [[Making a Ground Station]]

Useful tutorial from UNOOSA [here](https://www.unoosa.org/documents/pdf/psa/access2space4all/KiboCUBE/AcademySeason2/On-demand_Pre-recorded_Lectures/KiboCUBE_Academy_2022_OPL17.pdf)
This [EdgeFlyte kit](https://www.edgeflyte.com/shop/1u-cubesat-kit) can be good

## Frame
Will buy COTS for ~ $3k

## Thermal
Must do good enough thermal insulation that internals like batteries, camera and computer stay in operational temperature (typically 0°C to 40°C or sometimes -10°C to 50°C)

E-M Solutions MLI Blanket Kit for 1 U (Aluminized Mylar layers)

Around $600

## Power

### Battery
Li‑ion pack 20 Wh (2× INR18650‑35E) + PCB

### Solar Cells
Potentially from [AzurSpace](https://www.azurspace.com/index.php/en/products/products-space/space-solar-cells)

## On-board computer
**STM32H7 custom board** of ours about $100

[Jetson Nano](https://developer.nvidia.com/embedded/jetson-nano)
costs $99

## Attitude Determination and Control Systems (ADCS)
**Torquer PCBs + Magnetometer (LSM303AGR)**

Around $300

## Antenna
Will be using UHF frequency range (see more [[Satellite Antenna Frequencies|here]]) for two-way comms

Around $1k

## Camera
**Teledyne FLIR Blackfly S BFS-U3-200S6M-C**  
A compact industrial‐grade USB3 camera that—when paired with a modest C-mount lens—comes in under $1k total.

Can check [here](https://www.digikey.com/en/product-highlight/t/teledyne-flir/blackfly-s-advanced-machine-vision-cameras)

Will need radiation shielding and testing as this camera is not space qualified by default

### Camera Alternatives
- **Basler ace acA1300-200um** (1.3 MP global shutter): $509 + lens → ≈$750 [here](https://graftek.com/product/aca1300-200um)
- **Raspberry Pi High-Quality Camera** (12.3 MP IMX477 via CSI-2): $50 + lens/housing → ≈$300

## Auto-deployment
Solar panels and folded antennas must be first closed (by a wire that burns through current perhaps) and then automatically opened

## Stress tests
Will conduct at TÜBİTAK UZAY, Ankara

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

## Required Software Simulations

- **Orbit & Pass Prediction**
    
    - _Tool Exists:_ AGI STK (licensed) or open-source Orekit/Poliastro (Python).
        
- **Power-Budget & Solar-Array Modelling**
    
    - _Either:_ MATLAB Simulink Simscape or custom Python (NumPy-based) script.
        
- **Thermal Analysis**
    
    - _Tool Exists:_ ESATAN-TMS or Thermal Desktop; or simplified Python thermal RC network model.
        
- **Radiation Environment & Dose**
    
    - _Tool Exists:_ ESA SPENVIS / NOVICE; or custom Python interfacing to AP-8/AE-8 data.
        
- **ADCS Dynamics & Detumble**
    
    - _Either:_ MATLAB Simulink (AOCS toolbox) or Python (SciPy ODE).
        
- **Link Budget & RF-Performance**
    
    - _Either:_ SatNOGS-link-budget tool or custom Python (link-budget equations + Doppler).
        
- **Payload AI Inference Profiling**
    
    - Jetson Nano Docker bench scripts (TensorRT) + power/thermal telemetry logging.
        
- **FDIR & Fault-Tree Simulation**
    
    - Custom Python test harness injecting sensor failures and verifying watchdog/reset behavior.

## Total Cost
Under $20k