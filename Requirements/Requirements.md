# Requirements

**Project:** Custom 3D-Printed Micro Quadrotor with Servo Payload Release
**Scale:** Small hobby/engineering-student project, not a capstone-level UAV. This replaces the original requirements I wrote for a much bigger autonomous UAV concept; that version was kept in an `_Archive_v1_Oversized_UAV/` folder for reference, which has since been removed from the repo.

## 1. Project Intent

Build a small, affordable, functional quadcopter, designing as much of the physical system as I reasonably can, then add a simple custom payload-delivery mechanism. The goal is real engineering depth (CAD, mechanical design, 3D printing, basic electronics, wiring, embedded systems, basic control systems, testing, iterative engineering) at a scale I can actually build and fly in **3-8 weeks of part-time work**, not months.

Target claim this project should support:

> "Designed and fabricated a lightweight custom quadrotor frame using CAD and additive manufacturing, integrating flight-control electronics and a servo-actuated payload delivery mechanism."

## 2. Hard Constraints

| Constraint | Value |
|---|---|
| Purchased hardware budget | **$100 CAD strict target, with some flexibility to stretch if needed** - see `../BOM/BOM.xlsx`; the fully-capable (brushless, 100-300 g class) build lands at ~$117.95 CAD after sourcing a cheaper motor listing (see `../Electrical/Electrical_Architecture.md`), and the cheaper brushed-motor fallback stays even closer to $100 CAD (~$124.68 CAD) at reduced payload capacity |
| Vehicle size | 2.5-5 inch propellers, small lightweight frame |
| Target all-up mass | ~100-300 g (brushless path) if practical |
| Payload target | 20-100 g, depending on actual lifting capacity |
| Timeline | 3-8 weeks part-time |
| Team | Solo student |
| Fabrication access | 3D printers, basic electronics tools, soldering equipment, CAD software, basic workshop tools, University of Calgary engineering resources, various sensors/batteries |

## 3. Functional Requirements

- FR1: Custom-designed, 3D-printed frame, not a purchased ready-to-fly frame.
- FR2: IMU/gyro-based flight stabilization using existing flight-control firmware (Betaflight or equivalent). I'm not reimplementing flight-critical stabilization software from scratch.
- FR3: Manual RC flight control, no autonomous navigation required. The RC link itself is a custom ESP32-to-ESP32 link I write (ESP-NOW + a self-encoded SBUS output to the FC) instead of a stock transmitter/receiver pair, see `../Electrical/Electrical_Architecture.md` §1a; this is a deliberate scope choice to demonstrate embedded programming, not a requirement to reimplement flight stabilization (FR2 still stands: Betaflight handles that).
- FR4: A custom-designed, 3D-printed, servo-actuated payload-release mechanism, manually triggered by the pilot.
- FR5: Basic wiring/electronics integration I assemble myself (frame, motors, ESC/FC, battery, servo).

## 4. Non-Functional Requirements

- NFR1: Feasible for one student within 3-8 weeks part-time.
- NFR2: Budget discipline: prioritize university inventory, then AliExpress/cheap suppliers, using real verified prices, never invented costs.
- NFR3: Documentation integrity: every number labeled Manufacturer-specified, Calculated, Simulated, Estimated, or Measured. No fabricated test, FEA, or flight results. Unmeasured KPIs marked **TARGET** until actually tested.
- NFR4: Reuse flight-critical firmware. Use an existing, proven flight controller/firmware (Betaflight, or a documented Arduino/ESP32/STM32 plus MPU6050-class alternative only if it's at least as reliable and doesn't eat weeks of development time) instead of writing my own stabilization control law.

## 5. Explicitly Out of Scope

GPS, LiDAR, Raspberry Pi/companion computer, computer vision, SLAM, optical flow, autonomous navigation, obstacle avoidance, expensive telemetry, custom PCB design, advanced ground station, large batteries, heavy payloads, carbon-fiber frame, any $500+ component. All of this was in scope for the archived v1 design; it's deliberately excluded here.

## 6. Success Criteria

1. Vehicle flies reliably under manual control.
2. Frame, motor mounts, and payload mechanism are original CAD/3D-printed designs with a documented, if simple, load case.
3. Payload-release mechanism reliably carries and releases a 20-100 g payload (brushless path) or a reduced payload appropriate to actual lifting capacity (brushed fallback).
4. A short, honest test record exists (`../Testing/Test_Plan.xlsx`) with TARGET values replaced by measured ones as testing happens.
5. The build is documented clearly enough to write 3-5 honest, unexaggerated resume bullets.

## 7. Open Questions

See the design-decision notes in `../Mechanical/Frame_Design.md` and `../Electrical/Electrical_Architecture.md` for the brushless-vs-brushed cost/capability trade-off, and `../README.md` for what's still unconfirmed (exact university inventory availability, final budget ceiling, which frame concept to build first).
