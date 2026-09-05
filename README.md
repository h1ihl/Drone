# Drone Project: Custom 3D-Printed Micro Quadrotor with Servo Payload Release

Small hobby/engineering-student quadcopter project I'm building at the University of Calgary. I originally planned something much bigger and ended up redesigning it from scratch at a smaller, actually-buildable scale. See `Design_Journal.md` for the reasoning. The original, larger design's documentation used to be kept in an `_Archive_v1_Oversized_UAV/` folder for reference; that folder has since been removed from the repo.

**Full report:** `Drone_Project_Guide.pdf` (32+ pages, covers everything below in one document). Generated from this repo's markdown files by `Tools/report-generator/` — see that folder's README before hand-editing the PDF/BOM.xlsx/Test_Plan.xlsx, they're generated output, not source.

## Final Configuration Summary

| Item | Value |
|---|---|
| Frame concept | Modular arm design (2.5-3" prop class), selected over two alternatives, see `Research/Concept_Comparison.md` |
| Propulsion | 4x SPARKHOBBY XSPEED 1103 11000KV brushless motors, 65mm props, 2S F4 AIO FC+ESC |
| RC link | Custom ESP32-to-ESP32 link (ESP-NOW), RX ESP32 outputs SBUS to the FC, replaces a stock FlySky TX/RX pair, see `Electrical/Electrical_Architecture.md` §1a |
| Battery | 2S 450mAh HV LiPo |
| Payload mechanism | Servo-actuated latch/hook release (SG90) |
| Estimated bare mass | ~90 g |
| Payload target | 20-100 g |
| Required thrust (2:1 T/W @ 50g payload) | ~280 gf total |
| Cost, Minimum (brushed fallback) | ~$124.68 CAD |
| Cost, Recommended (brushless, meets payload target) | ~$117.95 CAD |
| Cost, Maximum (+ spares/charger) | ~$206.86 CAD |
| Timeline | 3-8 weeks part-time |

All figures above are Calculated/Estimated pending real testing, see `Testing/Test_Plan.xlsx`.

## Folder Structure

```
Drone Project/
├── Drone_Project_Guide.pdf       ← full report, start here
├── README.md                     ← this file
├── Design_Journal.md             ← notes on how the project evolved and why
├── Research/                     ← existing-project research + frame concept comparison
├── Requirements/                 ← project requirements
├── Mechanical/                   ← CAD architecture, frame design + calcs, payload mechanism, manufacturing, simple FEA
├── Electrical/                   ← electronics architecture + wiring diagram
├── BOM/                          ← full costed bill of materials (Minimum/Recommended/Maximum)
├── Testing/                      ← 10-test plan + KPI summary, TARGET values until measured
├── Resume/                       ← resume bullets + interview talking points
└── Tools/report-generator/       ← Node.js scripts that generate the PDF/xlsx above from the .md source
```

## Why the Budget Went Over $100 CAD

Real brushless FPV motor pricing was initially found at about $51 USD (~$71 CAD) for a matched set of four, confirmed against two separate real listings — the actual cost floor for hardware that meets the 100-300 g mass and 20-100 g payload target I set, not a shopping mistake. A later, more thorough AliExpress search (comparison-shopped against several competing 1103/11000KV listings) found the same motor spec — SPARKHOBBY XSPEED 1103 11000KV, 2-3S, 1.5mm shaft, Gemfan/HQprop 65mm compatible — for C$33.58/4-pack, under half the original price. That swap brought the Recommended tier down to ~$117.95 CAD, just barely above the original $100 CAD target. The Minimum tier (brushed motors) stays close to the original $100 CAD target instead, at reduced payload capacity (about 5-15 g instead of 20-100 g). Full reasoning in `Electrical/Electrical_Architecture.md` and `Mechanical/Frame_Design.md` section 5.

## Safety Notes

Propeller and LiPo battery hazards apply even at this small scale. Always spin motors with props off first (Test 2-3), only test with props on in a cleared area, keep a mapped RC kill-switch, charge LiPo batteries only in a fireproof bag, never leave a charging battery unattended, and check battery cells for swelling or damage before each use. Full safety section in `Drone_Project_Guide.pdf`.

## Open Items

- Confirm which components are actually available through University of Calgary inventory (battery, hardware, filament). Every item marked "CHECK INVENTORY" in `BOM/BOM.xlsx` lowers the real out-of-pocket cost if it's available.
- Confirm the final budget ceiling now that real pricing is known (~$118-207 CAD depending on tier).
- Pick the actual payload item(s) to deliver.
- Write and bench-validate the custom ESP32 RC-link firmware (ESP-NOW TX/RX, SBUS encoder, failsafe timeout) before any motors-on test. This replaces a proven off-the-shelf receiver with self-written firmware, so it needs its own bring-up and range/failsafe testing, see `Electrical/Electrical_Architecture.md` §1a and `Testing/Test_Plan.xlsx` Test 5.
