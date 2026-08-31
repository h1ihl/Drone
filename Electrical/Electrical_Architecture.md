# Electrical Architecture

Concept: small modular-arm 2.5-3 inch quadrotor with servo payload release. Keeping it simple: no GPS, no companion computer, no custom PCB, no advanced telemetry.

## 1. Component Selection (Recommended / Brushless path)

| Role | Selected component | Key specs | Price (USD) | Source |
|---|---|---|---|---|
| Flight controller + ESC | 2S F4 AIO FC + Brushless ESC (no RX) | STM32F4, OSD, SmartAudio, built-in 4-in-1 ESC | $22.99 | [AliExpress](https://www.aliexpress.com/item/32969058968.html) |
| Receiver | FlySky FS-A8S | 2.4GHz, 8CH, PPM/i-BUS/SBUS output | $9.99 | [FlexRC](https://flexrc.com/product/flysky-fs-a8s-receiver/) |
| Transmitter | Any FlySky-compatible TX (FS-i6, FS-i6X, etc.) | 2.4GHz AFHDS 2A | **UNIVERSITY / CHECK INVENTORY or already owned** | assuming many hobbyist-adjacent labs/clubs have a compatible TX; not counted in purchase cost unless confirmed unavailable |
| Motors (x4) | 1103 11000KV brushless | ~3.3-3.55 g each, 2S-rated, 1.5mm shaft | $50.99 (4-pack) | [Pyrodrone](https://pyrodrone.com/products/betafpv-1103-11000kv-2s-brushless-motor-4pcs) |
| Propellers (x4 + spares) | Gemfan 65mm 2-blade | 1mm/1.5mm shaft, set of 8 (4 spare) | $4.49 | [GetFPV](https://www.getfpv.com/gemfan-65mm-micro-propellers-1mm-shaft-set-of-8.html) |
| Battery | 2S 450mAh HV LiPo (Turnigy BoltX 80C) | 7.6V nominal, XT30 | $5.99 | [HobbyKing](https://hobbyking.com/en_us/turnigy-nano-tech-300mah-2s-35-70c-lipo-pack.html)-class listing, see `../BOM/BOM.xlsx` for exact SKU |
| Payload servo | SG90 9g micro servo | 1.8 kg·cm stall torque | ~$3.00 | AliExpress (bulk-pack pricing, see `Payload_Mechanism.md`) |

**Total purchased (Recommended, brushless): see `../BOM/BOM.xlsx`, real-priced total is ≈ $156 CAD**, above my original $100 CAD target. This is a deliberate, documented trade-off, not a budget overrun I'm glossing over: real brushless FPV micro-motor pricing (~$51 USD for 4 motors, confirmed across both a name-brand retailer and a generic AliExpress listing at nearly identical prices) is simply the real cost floor for hardware that meets the 100-300 g / 20-100 g payload target. I've got room to stretch the budget somewhat, so I'm going with this. The Minimum tier below stays much closer to $100 CAD by accepting reduced payload capacity instead.

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
| Battery / main power | 7.6 V (2S HV) | Battery direct | ESC (→ motors), FC power input |
| 5V | 5V regulated | FC/ESC board's onboard BEC | Receiver, payload servo |
| Signal | 3.3V logic (internal to FC) | FC onboard regulator | MCU/gyro internal only |

No separate high-current PDB, fuse, or dedicated companion-computer power rail is needed at this scale. The FC/ESC board's onboard BEC handles the receiver and servo directly, which is standard practice for a build this small (unlike the archived v1 design's dedicated PDB/UBEC/fuse architecture, which was sized for a much higher-current system).

## 4. Interfaces

| Interface | Between | Protocol |
|---|---|---|
| FC ↔ ESC | Same board (integrated) | Internal (DShot to onboard MOSFETs) |
| FC ↔ Motors | ESC output → motor phase wires | 3-phase, soldered direct (no bullet connectors needed at this small gauge) |
| FC ↔ Receiver | FC ↔ FlySky FS-A8S | SBUS (single wire + power + ground) |
| FC ↔ Payload servo | FC servo output pad | PWM, mapped to a spare AUX channel in Betaflight |
| Battery ↔ FC/ESC | XT30 connector | Direct, no separate power switch at this current level; unplugging the battery is the standard, sufficient practice for a build this small |

## 5. Wiring Diagram

See `Wiring_Diagram.pdf`, a simple, clearly labeled diagram (VBAT, 5V, GND, PWM/SBUS). Not a complex multi-page schematic, this is a genuinely simple electrical system.

## 6. Open Items

- Exact battery SKU/mass not independently re-verified this session, confirm at purchase time.
- FlySky-compatible transmitter availability, check university inventory before buying a new one.
- Whether the university's engineering resources include any of the above (battery, RX, or even a spare FC/ESC from a robotics club). Every dollar saved here directly closes the gap toward the original $100 CAD target.
