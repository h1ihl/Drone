# FEA Plan (Simple)

The idea here: if FEA is practical, do a small FEA study of the custom frame, not a giant project. A simple static load case is enough. This document defines that one simple study, not a multi-load-case aerospace-style analysis (see the archived v1 `FEA_Plan.md` for what that looked like, and why it was overkill for this project's scale).

## 1. What Gets Analyzed

**One part, one load case: the arm, under the design thrust load.**

- **Part:** a single modular arm (from `../Research/Concept_Comparison.md`'s selected Concept C).
- **Load case:** 0.69 N applied at the motor-mount end (the required-thrust design load from `Frame_Design.md` §2), fixed constraint at the hub-joint bolt holes.
- **Material:** PETG, standard published FDM material properties for the slicer/filament used (use the filament manufacturer's datasheet tensile strength, which counts as **Manufacturer-specified**, rather than a generic "PETG" textbook value, since real FDM part strength varies a lot by print settings).

## 2. Target

Factor of safety **>= 3** against the 0.69 N design load, given FDM print-quality uncertainty (same conservative logic as the archived v1 design, just applied to a much smaller, simpler load case here).

## 3. Method

- A single static linear FEA run in whatever CAD package I'm using (SolidWorks Simulation, Fusion 360 Simulation, or similar built-in tool, no separate FEA software needed at this scale).
- Default mesh is fine for a part this small and simple; a single mesh-refinement check at the bolt-hole stress concentration is good practice but not mandatory at this scale (unlike the archived v1's more rigorous mesh-convergence requirement).

## 4. What Happens With the Result

- If FoS >= 3: proceed to printing as designed.
- If FoS < 3: thicken the arm slightly or add a rib, a fast, cheap iteration at this part size (see `Manufacturing_Plan.md`'s ~10-15 minute per-arm print time).
- The result gets labeled **Simulated** in the documentation, and since the true achievable thrust is still pending Test 6 (`Frame_Design.md` §2), I'll spot-check the arm again once real thrust data exists in case the design load needs revising upward.

## 5. Status

**Not started.** No CAD geometry exists yet. This will run once frame CAD is modeled, as a same-day check, not a separate project phase.
