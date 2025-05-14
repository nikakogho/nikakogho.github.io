Will be a custom implementation of [[SatNOGS]] for our own [[Making a CubeSat|CubeSat]]

Details for **QartvelNest** on my [GitHub](https://github.com/nikakogho/QartvelNest)

## Parts to buy
- Communication - UHF Yagi
- Rotator - SatNOGS v3
- NEMA17 Stepper Motors
- Arduino MEGA + CNC shield
- Raspberry Pi 4
- 6m mast

Parts total cost ~$1500

## Mechanical Assembly

1. 3‑D print SatNOGS rotator pieces (STL files: https://gitlab.com/librespacefoundation/satnogs/satnogs-rotator).
2. Assemble rotator with NEMA17 motors, M5 threaded rod; calibrate backlash ≤0.5°.
3. Yagis: follow DX Engineering instruction sheet; ensure element spacing within ±1 mm.
4. Mount antennas on crossboom; attach to rotator with stainless U‑bolts.
5. Run LMR‑400 coax through rotator bearings; add ferrite chokes every 1 m.
6. Install mast with 3‑point guy wires; align true North using solar noon shadow method ±2°.

## Electronics & Software Setup
• Flash Arduino with rotator‑controller firmware (https://github.com/satnogs/satnogs-rotator-controller).
• Install SatNOGS‑client‑ansible on Raspberry Pi (docs: https://wiki.satnogs.org/SatNOGS_Client_Setup).
• Connect RTL‑SDR to Pi via powered USB hub; verify 0.5 ppm frequency error with kalibrate‑rtl.
• Build GNU Radio ‘gr‑satellites’ flowgraph for 9k6 GMSK AX.25 (example script: https://github.com/guruofquality/grextras).
• Configure hamlib (rigctld, rotctld) for ICOM IC‑910H; test Doppler auto‑tuning with GPredict.
• Push first observation to SatNOGS network; aim to decode ISS beacon as validation.
• Implement Python watchdog script to auto‑reboot Pi on USB failure (sample code link)

## Operational Check‑List
**Daily**: update TLE, run `satnogs-auto-scheduler` for next 24 h.
**Weekly**: visual antenna inspection, SWR check < 1.3.
**After each pass**: verify decoded frames stored in InfluxDB.
**Emergency**: lightning forecast >50 kA km‑2 – disconnect feedlines.
