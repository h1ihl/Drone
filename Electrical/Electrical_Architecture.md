# Electrical Architecture

Concept: small modular-arm 2.5-3 inch quadrotor with servo payload release. Keeping it simple: no GPS, no companion computer, no custom PCB, no advanced telemetry.

## 1. Component Selection (Recommended / Brushless path)

| Role | Selected component | Key specs | Price (USD) | Source |
|---|---|---|---|---|
| Flight controller + ESC | 2S F4 AIO FC + Brushless ESC (no RX) | STM32F4, OSD, SmartAudio, built-in 4-in-1 ESC | $22.99 | [AliExpress](https://www.aliexpress.com/item/32969058968.html) |
| RC link — onboard RX | ESP32-C3 Super Mini | RISC-V, 2.4GHz WiFi, custom firmware: ESP-NOW in -> SBUS out (inverted UART) to the FC | ~$3.50-4.80 | [AliExpress](https://www.aliexpress.com/item/1005005319963906.html) |
| RC link — handheld TX | ESP32-WROOM-32 DevKit | Dual-core, 2.4GHz WiFi, custom firmware: reads sticks/switches -> ESP-NOW out | $2.20 | [AliExpress](https://www.aliexpress.com/item/1005003145871431.html) |
| RC link — sticks | KY-023 dual-axis joystick module x2 | 4 axes total (throttle, yaw, pitch, roll) | $0.60 each | [AliExpress](https://www.aliexpress.com/item/1882818018.html) |
| RC link — switches | Momentary/toggle switch x2 | Arm switch, payload-release trigger (AUX channels) | ~$0.50 each | Various, see `../BOM/BOM.xlsx` |
| RC link — TX power | USB power bank (5V) | Powers the handheld TX over USB, assumed already owned | **already owned / UNIVERSITY** | not counted in purchase cost unless confirmed unavailable |
| Motors (x4) | SPARKHOBBY XSPEED 1103 11000KV brushless | 2-3S rated, 1.5mm shaft, explicitly compatible with Gemfan/HQprop 65mm props; per-motor weight not published on this listing, ~3.3-3.55 g/motor carried over as an Estimate from other 1103 11000KV listings | C$33.58 (4-pack) | [AliExpress (Sparkhobby Store)](https://www.aliexpress.com/item/1005004927233900.html) |
| Propellers (x4 + spares) | Gemfan 65mm 2-blade | 1mm/1.5mm shaft, set of 8 (4 spare) | $4.49 | [GetFPV](https://www.getfpv.com/gemfan-65mm-micro-propellers-1mm-shaft-set-of-8.html) |
| Battery | 2S 450mAh HV LiPo (Turnigy BoltX 80C) | 7.6V nominal, XT30 | $5.99 | [HobbyKing](https://hobbyking.com/en_us/turnigy-nano-tech-300mah-2s-35-70c-lipo-pack.html)-class listing, see `../BOM/BOM.xlsx` for exact SKU |
| Payload servo | SG90 9g micro servo | 1.8 kg·cm stall torque | ~$3.00 | AliExpress (bulk-pack pricing, see `Payload_Mechanism.md`) |

**Total purchased (Recommended, brushless): see `../BOM/BOM.xlsx`, real-priced total is ~$117.95 CAD**, just under my original $100 CAD target plus stretch room. Real brushless FPV micro-motor pricing was initially found at ~$51 USD (~$71 CAD) for a matched 4-pack across a name-brand retailer (Pyrodrone/BetaFPV) and a generic AliExpress listing at nearly identical prices, which pushed the total to ~$155 CAD, documented honestly as a real cost floor at the time, not a shopping mistake. A later, more thorough AliExpress search (comparison-shopped against several other 1103/11000KV-class listings, verified for true per-motor price rather than a misleading multi-pack headline price) turned up the SPARKHOBBY XSPEED 1103 11000KV 4-pack at C$33.58 (~$8.40/motor) — same spec (1103, 11000KV, 1.5mm shaft, 2-3S rated) and explicitly compatible with the Gemfan/HQprop 65mm props already in this BOM, at under half the original motor cost. That single swap dropped the Recommended-tier total from ~$155 CAD to ~$117.95 CAD. The Minimum tier is unaffected (it substitutes brushed motors entirely) and stays at ~$124.68 CAD. Swapping the FlySky TX/RX pair for the custom ESP32 link is essentially cost-neutral, actually about $2 CAD cheaper (~$11.67 CAD combined for the RX/TX ESP32s, joysticks, and switches, vs. the ~$13.89 CAD the FlySky receiver alone cost, see `../BOM/BOM.xlsx`), it's a scope decision about demonstrating embedded programming, not a budget decision.

## 1a. Custom RC Link (ESP32, replaces FlySky TX/RX)

I'm replacing the stock FlySky transmitter/receiver pair with a self-written RC link between two ESP32 boards. The reason is deliberate: it turns "buy a receiver" into an actual embedded-programming deliverable (packet protocol, SBUS generation, failsafe logic) that fits the project's stated embedded-systems goal (`../Requirements/Requirements.md` §1), at close to the same purchased cost as the FlySky pair it replaces. **This is a real added engineering/schedule risk, not a drop-in swap** — a commercial receiver already has proven failsafe and RF behavior; here I have to build and validate that myself before it's trusted in the air. Flagged honestly, not glossed over.

**Link:** ESP-NOW (built into the ESP32 WiFi radio, connectionless, no router/pairing needed, low latency, typically ~2-5 ms one-way).

**TX firmware (handheld ESP32):**
- Reads 4 analog stick axes (throttle, yaw, pitch, roll) + 2 switch inputs (arm, payload release) from GPIO/ADC.
- Packs them into a small struct (channel values + a sequence number + a checksum) and broadcasts it via ESP-NOW at ~50-100 Hz.

**RX firmware (onboard ESP32):**
- Receives ESP-NOW packets, validates the checksum, updates a local channel-value table.
- Independently, on its own fixed timer (not tied to packet arrival), builds a standard 25-byte SBUS frame from the current channel-value table and writes it out over UART to the FC, at the ~9-14 ms interval Betaflight expects. Decoupling the SBUS timer from RF packet timing keeps the signal to the FC steady even if individual radio packets are late or dropped.
- **Failsafe watchdog:** if no valid ESP-NOW packet has been received within a timeout (~200-300 ms), the RX firmware sets the SBUS frame's failsafe flag (and/or forces throttle to a safe low value) instead of holding the last good command, the same behavior a commercial receiver provides, but here it has to be explicitly written and bench-tested (Test 5, `../Testing/Test_Plan.xlsx`), not assumed.

**SBUS signal inversion:** standard SBUS is an inverted 100000-baud UART signal. The RX ESP32's UART peripheral can generate this directly (hardware signal-invert option exposed by the Arduino-ESP32 core's `HardwareSerial.begin()`), so no separate inverter circuit should be needed. **Contingency:** if the FC doesn't accept the ESP32's inverted signal cleanly, a simple NPN-transistor inverter (~$0.50 CAD in parts, a transistor + two resistors, not separately itemized in the BOM) is a documented fallback.

**Known limitation vs. a commercial RC system, stated honestly:** ESP-NOW is a WiFi-radio protocol, not a purpose-built RC link. It doesn't have the frequency-hopping/diversity/interference-hardening that AFHDS2A (FlySky) or dedicated systems like ExpressLRS have, and its realistic range with stock antennas is on the order of tens to a couple hundred meters, well short of a commercial system's typical range. That's an acceptable trade for a hobby build flown at close range in a controlled test area, but it's a real limitation, not a hidden one, and range/failsafe behavior must be bench-verified (walk-away failsafe test) before any flight test, not assumed to match FlySky's proven behavior.

## 2. Minimum-Budget Fallback (Brushed path)

| Role | Approach | Why cheaper | Trade-off |
|---|---|---|---|
| FC + motor drivers | A brushed-whoop-class AIO board (built-in motor drivers, no separate ESC) | Comparable price to the brushless FC+ESC combo (~$35-43 USD for real options found), not actually much cheaper, so this isn't the main saving | Similar electronics cost |
| Motors (x4) | Coreless brushed motors (7x16mm or 8.5x20mm class) | ~$1-3 each (~$4-12 for 4) vs. ~$51 for brushless, this is the real saving | Much lower thrust; realistic AUW ceiling ~30-50 g, realistic payload capacity only ~5-15 g |
| Everything else | Same RX/battery/servo approach, scaled down | | |

The brushed path can realistically land close to $100 CAD (or under, if a receiver/battery is available via university inventory), but it can't meet the 20-100 g payload target. It's included here for completeness and as a fallback, not as the recommendation.

## 3. Voltage Rails

| Rail | Nominal voltage | Source | Loads |
|---|---|---|---|
| Battery / main power | 7.6 V (2S HV) | Battery direct | ESC (-> motors), FC power input |
| 5V | 5V regulated | FC/ESC board's onboard BEC | RX ESP32 (RC link), payload servo |
| Signal | 3.3V logic (internal to FC) | FC onboard regulator | MCU/gyro internal only |

No separate high-current PDB, fuse, or dedicated companion-computer power rail is needed at this scale. The FC/ESC board's onboard BEC handles the onboard RX ESP32 and servo directly (the ESP32-C3 Super Mini's onboard 5V->3.3V regulator accepts the BEC's 5V directly), which is standard practice for a build this small (unlike the archived v1 design's dedicated PDB/UBEC/fuse architecture, which was sized for a much higher-current system). The handheld TX ESP32 is powered separately, off the drone, from a USB power bank.

## 4. Interfaces

| Interface | Between | Protocol |
|---|---|---|
| FC <-> ESC | Same board (integrated) | Internal (DShot to onboard MOSFETs) |
| FC <-> Motors | ESC output -> motor phase wires | 3-phase, soldered direct (no bullet connectors needed at this small gauge) |
| FC <-> RC link | FC <-> onboard RX ESP32 | SBUS (single wire + power + ground), generated by custom RX firmware, see §1a |
| TX ESP32 <-> RX ESP32 | Handheld TX <-> onboard RX | ESP-NOW over 2.4GHz WiFi (wireless, no wired connection) |
| FC <-> Payload servo | FC servo output pad | PWM, mapped to a spare AUX channel in Betaflight |
| Battery <-> FC/ESC | XT30 connector | Direct, no separate power switch at this current level; unplugging the battery is the standard, sufficient practice for a build this small |

## 5. Wiring Diagram

See `Wiring_Diagram.pdf`, a simple, clearly labeled diagram (VBAT, 5V, GND, PWM/SBUS). Not a complex multi-page schematic, this is a genuinely simple electrical system.

## 6. Open Items

- Exact battery SKU/mass not independently re-verified yet, confirm at purchase time.
- ESP32 RC-link firmware (TX stick/switch reading, ESP-NOW packet format, RX SBUS encoder, failsafe watchdog) still needs to be written and bench-tested before any motors-on test, see §1a.
- Confirm the ESP32 hardware UART-invert approach actually produces a signal the FC accepts; fall back to the transistor-inverter contingency if not.
- Whether the university's engineering resources include any of the above (battery, ESP32 boards, or even a spare FC/ESC from a robotics club). Every dollar saved here directly closes the gap toward the original $100 CAD target.
