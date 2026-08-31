# Manufacturing Plan

Small parts, short print times. This should be a fast, iterative process, not a manufacturing project in its own right.

## 1. 3D Printing

| Parameter | Recommendation | Rationale |
|---|---|---|
| Material, frame (arms, hub) | **PETG** | Better impact resistance than PLA for a part that will occasionally crash; easier than ABS (no enclosure needed); optimizes for strength-to-weight rather than maximum thickness |
| Material, payload latch/hook | **PETG** | Repeated-cycle mechanism part; PLA is too brittle for a part that flexes/impacts repeatedly (per the Zbotic reference in `Payload_Mechanism.md`) |
| Nozzle | 0.4 mm standard | No feature needs finer |
| Layer height | 0.16-0.2 mm | Standard for small structural parts |
| Wall count | 3 perimeters | Enough for a small, lightly-loaded part without adding unnecessary mass. This is a much lighter structural duty cycle than a large UAV frame, so strength-to-weight over thickness applies directly here |
| Infill | 20-25% gyroid | Light but adequate for these small, low-load parts |
| Print orientation | Arms flat (long axis horizontal), loading direction in-plane with layers, not peeling them apart | Same FDM-anisotropy logic as any printed part |
| Supports | None needed for the arm/hub geometry as planned; the payload latch mechanism may need minimal supports at the hinge/pivot feature depending on final design | Check once actual CAD geometry exists |
| Heat-set inserts | M2 brass inserts at the arm-to-hub joint and the servo mount | Required for the modular/repairable design goal (`../Research/Concept_Comparison.md`) |

## 2. Approximate Print Time & Material Usage (Estimated, no real print exists yet)

| Part | Est. print time | Est. material |
|---|---|---|
| Hub | ~20-30 min | ~3-5 g |
| Arm x4 | ~10-15 min each (~45-60 min total) | ~1-2 g each (~5-8 g total) |
| Payload mount/latch assembly | ~20-30 min | ~3-5 g |
| **Total frame + payload mechanism** | **~1.5-2 hours** | **~10-18 g filament** |

At typical PETG spool pricing, this is a trivial material cost, well under $5 CAD in filament (confirmed in `../BOM/BOM.xlsx`).

## 3. Machining

None required. This is a deliberate choice (per `../Research/Concept_Comparison.md`'s selected concept): everything structural is 3D printed, keeping this within the university's basic workshop/3D-printer access without needing CNC/laser-cutting time.

## 4. Hardware

| Item | Spec |
|---|---|
| Arm-to-hub bolts | M2 socket-head cap screws |
| Heat-set inserts | M2 brass |
| Servo mount bolts | M2 |
| Battery strap | Hook-and-loop (Velcro) strap, or a simple printed friction-fit tray |

## 5. Assembly Sequence

1. Print hub, 4 arms, payload latch assembly.
2. Install heat-set inserts (soldering iron or dedicated tool, low heat).
3. Bolt arms to hub.
4. Mount motors to arm tips.
5. Mount FC/ESC board to hub, wire to motors (see `../Electrical/Wiring_Diagram.pdf`).
6. Mount receiver, battery tray.
7. Mount payload servo + latch assembly.
8. Wire servo to FC/ESC board's servo output.
9. Cable management (zip ties/tape, clear of prop arcs).
10. Continuity check before first power-on (Test 1-3 in `../Testing/Test_Plan.xlsx`).

Total build time (printing + assembly), separate from electronics sourcing/shipping wait time: realistically **2-4 hours** of hands-on work. This is the kind of project that can genuinely be finished start-to-finish in a weekend once parts are in hand, which fits fine within the overall 3-8 week timeline being dominated by parts shipping and iterative testing, not raw build labor.
