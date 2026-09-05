# Frame Design & Simple Engineering Analysis

Selected concept: **C, Modular Arm Design** (see `../Research/Concept_Comparison.md`), sized to the 2.5-3 inch prop class. Every value below is labeled honestly: Manufacturer-specified, Calculated, Estimated, or Measured. Nothing here is a fabricated test or performance result. Thrust and flight-time figures that can't be pinned down from real published data are explicitly deferred to bench/flight testing (`../Testing/Test_Plan.xlsx`), not guessed.

## 1. Weight Budget (Estimated bottom-up mass, brushless/Recommended path)

| Component | Mass | Basis |
|---|---:|---|
| Frame (modular arms + hub, 3D printed) | 10 g | **Estimated**, no CAD/print exists yet; benchmarked against the real Feather 3 frame (~5 g bare X-frame, source 1 in `Existing_Projects.md`), plus a margin for the modular arm-joint hardware bosses |
| Flight controller + ESC (2S F4 AIO combo) | 6 g | **Estimated**, typical mass for this board class; exact figure not published on the listing found |
| Onboard RX (ESP32-C3 Super Mini) | 3 g | **Estimated**, typical published mass for this compact board class (~22x18mm bare board), not independently re-verified yet |
| Motors (4x 1103 11000KV) | 14 g | **Manufacturer-specified**, ~3.3-3.55 g each across multiple real listings ([BetaFPV](https://betafpv.com/products/1103-brushless-motors), cross-checked against AliExpress/T-Motor listings) |
| Propellers (4x 65mm) | 4 g | **Estimated**, small 2-blade micro props are typically ~1 g each |
| Battery (2S 450mAh HV, e.g. Turnigy BoltX) | 28 g | **Estimated**, typical mass for this capacity/chemistry class, not independently re-verified yet |
| Payload-release servo (SG90) | 9 g | **Manufacturer-specified**, the SG90's ~9 g mass is one of its best-documented specs |
| Payload mount/latch hardware (printed) | 5 g | **Estimated** |
| Wiring, connectors, heat-shrink | 5 g | **Estimated** |
| **Total bare AUW (no payload)** | **~ 84 g** | Sum, rounded to **90 g** for margin |

This lands comfortably within the 100-300 g target band once a payload is added, and lines up with real precedent (source 5 in `Existing_Projects.md`: toothpick-class builds "stay under ~250 g AUW"; source 3: a documented real 75 g 3-inch build).

## 2. Thrust Requirement (Calculated target, NOT a claimed achieved thrust)

Using a mid-range payload target of 50 g (within the 20-100 g range) for baseline sizing:

- Total system mass = 90 g (bare) + 50 g (payload) = **140 g**
- Weight = 0.140 kg x 9.81 m/s² = **1.37 N**
- Target thrust-to-weight ratio = **2:1**
- **Required total thrust = 2 x 1.37 N ~ 2.75 N ~ 280 gf**, i.e. **~ 70 gf per motor** (4 motors)

**This is the required number, not a claimed capability.** I couldn't find a real, independently-verified thrust-in-grams curve for the specific 1103 11000KV + 65mm prop + 2S combination (one bench-test source, fishpepper.de, turned up but its actual data tables weren't accessible in this pass, so it's flagged as **NOT FOUND**, not estimated). What is real and sourced: this exact motor/prop/cell-count combination is the standard, widely-used configuration for 2S toothpick/whoop-class builds in this weight class (`Existing_Projects.md`, sources 1-6), which gives reasonable qualitative confidence that ~70 gf/motor is achievable well under full throttle. The actual achieved thrust **has to be confirmed by Test 6 (Static Thrust Test) in `../Testing/Test_Plan.xlsx`** before I trust it for real flight. If bench testing shows the motors fall short of ~70 gf/motor at a reasonable throttle percentage, the payload target needs to come down accordingly. That's recorded here as an open item, not silently assumed to work.

## 3. Battery (Estimated, pending bench confirmation)

- Battery: 2S 450 mAh HV LiPo (e.g. Turnigy BoltX 80C, 7.6 V nominal), **Manufacturer-specified** capacity/voltage, **Estimated** mass (see §1).
- Current draw at hover-equivalent throttle: **NOT FOUND / not calculable from reliable data yet**. The only power figures I found for this motor class (peak power/current ratings synthesized from listings) were internally inconsistent between sources, so I'm not using them here rather than risk presenting a wrong number as fact.
- **Flight time: TARGET, to be measured in Test 7 (Hover Test).** Community experience with this general build class (toothpick/whoop, 2S, small LiPo) typically falls in a several-minutes-per-charge range, but that's not claimed here as a design value, only as a rough sanity-check range to be confirmed or corrected by measurement.

## 4. Simple Structural Calculations

### Arm loading (Calculated, preliminary)

Each arm carries its motor's reaction thrust. Using the required-thrust figure above (70 gf/motor ~ 0.69 N) as the working design load (not the motor's true max, which is unknown pending Test 6):

- Design load per arm ~ **0.69 N**, applied at the arm tip (motor mount), reacted at the hub joint.
- A conservative preliminary target safety factor of **>= 3** against this load is set for the arm design, consistent with standard practice for small FDM-printed structural parts (layer-adhesion anisotropy makes a lower margin risky). This is a design target, to be confirmed by the simple FEA study in `FEA_Plan.md` once CAD geometry exists.
- Because the true achievable motor thrust is unverified (§2), I'll also check the arm against a higher bounding case once Test 6 data exists, e.g. the motor's actual measured max thrust, not just the ~70 gf design target, since a crash/prop-strike event can briefly load the arm well above steady hover thrust.

### Motor mount (Calculated, preliminary)

Concentrated load transfer from the motor's 4-hole (or similar) bolt pattern into the arm tip, same design load as above (0.69 N design case, re-checked once measured thrust data exists).

### Payload attachment (Calculated, preliminary)

The payload mount must support the payload's static weight (0.20-1.00 N for a 20-100 g payload) plus a dynamic/landing-impact allowance. A conservative 3x static weight impact-load design case is used (matching common small-UAV landing-load practice): **0.6-3.0 N** depending on the actual payload chosen.

Full FEA (a single simple static load case, kept deliberately small) is in `FEA_Plan.md`.

## 5. Brushed-Motor Fallback (strict-budget path, see `../Electrical/Electrical_Architecture.md` for the full cost comparison)

If the brushless path's real component cost (~$155 CAD, see `../BOM/BOM.xlsx`) ends up too far above the $100 CAD target even with some flexibility, a brushed-motor micro build (coreless 8.5x20mm-class motors, no separate ESC needed) is a real fallback, but it caps AUW around 30-50 g and realistic payload capacity around 5-15 g, well below the 20-100 g payload target. I'm recording that trade-off here rather than quietly building to a target the cheaper hardware can't actually hit. **Recommendation: go with the brushless path**, since I've got some budget flexibility.
