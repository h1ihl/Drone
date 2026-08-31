# CAD Architecture

Concept: modular-arm 2.5-3 inch quadrotor with servo payload release (see `../Research/Concept_Comparison.md`). Written package-agnostic, SolidWorks, Fusion 360, Onshape, whatever works.

## 1. Assembly Tree

```
Drone Assembly
│
├── Frame
│   ├── Center Hub (electronics deck)
│   ├── Arm × 4 (identical part, bolt-on)
│   └── Motor Mount × 4 (integral to arm tip, or separate, see §2)
│
├── Electronics Mount
│   └── FC/ESC standoff mount (soft-mount if vibration is an issue, see §3)
│
├── Battery Mount
│   └── Strap slot / friction-fit tray on top or bottom deck
│
├── Landing Gear
│   └── 4 simple printed legs/feet (or skip entirely; a light toothpick-class build often lands fine on the frame itself, and a small standoff foot is cheap insurance for the payload mechanism's ground clearance)
│
└── Payload Mechanism
    ├── Servo Mount
    ├── Latch/Hook Arm
    └── Payload Holder (see `Payload_Mechanism.md` for full design)
```

## 2. Key Dimensions & Interfaces (Estimated starting values, refine once CAD begins)

| Feature | Value | Note |
|---|---|---|
| Prop size | 65 mm (2.5") | Matches the selected 1103 11000KV motor/prop combo |
| Motor-to-motor diagonal | ~110-120 mm | Standard toothpick-class spacing for 65 mm props with safe clearance |
| Arm width | ~6-8 mm | Estimated starting point, narrow enough to be light, wide enough for M2 bolt clearance at the hub joint |
| Arm thickness | 3-4 mm | Print-oriented flat on its widest face for best layer-adhesion direction under bending (see `Manufacturing_Plan.md`) |
| Hub thickness | 2-3 mm | Enough for M2 heat-set inserts without breaking through |
| Motor mounting pattern | Per 1103 datasheet, confirm exact bolt circle from the motor at CAD time, not assumed | Typical micro-motor mounts use a small M1.4-M2 bolt circle |
| FC/ESC mounting | 25.5x25.5 mm standard AIO mounting holes (matches the Feather 3 frame reference and most whoop/toothpick AIO boards) | Confirm against the actual board purchased |

## 3. Vibration Consideration

Even at this small scale, a rigid FC mount directly on the frame can pick up motor vibration into the gyro. A simple compliant mount (thin TPU standoffs, or foam tape between the FC and the deck) is cheap insurance. This is optional at this scale (unlike the archived v1 design, where it was a first-class requirement for GPS-denied position hold), since Betaflight's gyro filtering generally tolerates a reasonable amount of vibration on a build this light. I'll add it if bench testing (Test 4, Gyro/IMU validation) shows noisy gyro data.

## 4. Fasteners & Tolerances

- M2 hardware throughout (bolts, heat-set inserts), appropriately scaled for a sub-100g frame. M3 would be oversized and heavy for a build this small.
- Heat-set brass inserts at the arm-to-hub joint (the whole point of the modular design, per `../Research/Concept_Comparison.md`) and at the payload-mechanism servo mount.
- Printed clearance tolerance: ±0.1-0.15 mm as a starting point on a well-calibrated desktop FDM printer, tighter than the larger v1 design needed since these are much smaller features.

## 5. Purchased Components as Reference Geometry

For fit-checking (not full detailed models, that would be overkill at this scale): block out the FC/ESC board footprint, motor bolt pattern, battery outline, and servo body from their real dimensions once purchased/confirmed, rather than guessing.
