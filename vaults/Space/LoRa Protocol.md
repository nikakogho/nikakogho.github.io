Stands for Long Range.
Technique made by [Semtech](https://www.semtech.com/)

Uses **Chirp Spread Spectrum (CSS)** for long range communication. Used a lot in [[Satellite]]

## Chirp Spread Spectrum (CSS)
- Chirps - each symbol is a chirp, frequency moves up and down
- Robustness - each symbol sent in entire bandwidth so more chance of picking up
- Spread Factor (SF) - bits per symbol (5-12)
	- High SF -> more spread -> better pickup but lower data rate
- Bandwidth (B) - 125 kHz, 250 kHz or 500 kHz
	- Wider -> higher data rate but less sensitivity

## Range
155-170 dB link budget, several kilometers in urban areas or hundreds of kilometers to reach satellites

## Energy Use
Low transmit power

## LoRaWAN
Higher layer protocol that specifies more

## Typical Network
- End devices: battery-powered sensors and actuators using LoRa PHY
- Gateways - forward received LoRa packets over IP to a LoRaWAN Network Server; also relay downlink
- Network Server - device sessions, security, deduplication, ADR (Adaptive Data Rate)
- Application Server - user app, dashboard, analytics