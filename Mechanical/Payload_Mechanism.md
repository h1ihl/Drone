# Payload-Delivery Mechanism

This is the project's "interesting feature," a small, custom-designed, 3D-printed, servo-actuated payload release, manually triggered by the pilot. No autonomous release logic is needed.

## 1. Mechanism Selection

Real precedents researched (`../Research/Existing_Projects.md`, sources 7-9): servo-actuated hook release, trapdoor, and latch mechanisms are all real, previously-built, low-complexity approaches.

**Selected: servo-actuated rotating latch/hook.** Reasoning:
- Simpler to print and tune than a trapdoor (fewer moving/sealing surfaces).
- Lower mechanism-force uncertainty than a claw/gripper (a claw needs to grip a range of payload shapes reliably; a hook just needs to release a fixed attachment point).
- Directly matches the Printables/Hackaday/Zbotic precedents (sources 7-9), so this is a validated approach, not a novel unproven mechanism.

**Mechanism sequence:** the payload hangs from a printed hook/cradle attached to a servo horn. At rest, the servo holds the hook in the closed/latched position (payload secured). On pilot command (a spare RC channel/switch mapped in Betaflight, or a simple direct servo-signal trigger), the servo rotates the horn, opening the hook and releasing the payload by gravity.

## 2. Servo Selection & Force Analysis (Calculated)

- **Selected servo: SG90** (9 g, ~1.8 kg·cm / ~1.6 lb·in stall torque, **Manufacturer-specified**, one of the most well-documented micro servo specs out there).
- **Payload range:** 20-100 g (0.196-0.981 N weight force).
- **Moment arm:** for a hook mounted close to the servo horn's pivot (~15-20 mm arm), required holding torque:
  - At 100 g payload, 20 mm arm: T = F x r = 0.981 N x 0.020 m = **0.0196 N·m ≈ 0.20 kg·cm**
  - The SG90's rated ~1.8 kg·cm stall torque gives a **safety factor ≈ 9x** against the worst-case (100 g) payload at this moment arm, comfortable margin, and it lines up with the Zbotic reference's own sizing logic (source 9: "SG90 can hold ~900g of hatch plus payload force" at a 20mm arm, so this build's worst case of 100g is well within that same servo's demonstrated capability window).
- **Conclusion:** the SG90 is adequately sized with a large margin even at the top of the payload range. No need to step up to a heavier MG90S/MG996R servo, which would just add unnecessary mass/cost.

## 3. Design Details

| Item | Design decision |
|---|---|
| Hook/latch material | PETG (impact resistance for repeated release cycles; see `Manufacturing_Plan.md`) |
| Payload cradle | A simple printed loop/cup the payload hangs from or sits in, sized to the actual payload item (open item, depends on what's actually being "delivered," e.g. a small printed test mass) |
| Servo mount | Printed bracket, M2 bolted to the frame hub, positioned so the release swing arc doesn't intersect props or landing legs |
| Trigger | A dedicated switch on the handheld ESP32 TX, carried as an AUX channel over the custom RC link (`../Electrical/Electrical_Architecture.md` §1a) and mapped to a servo output in Betaflight (`servo` mixer/AUX assignment) same as it would be with a stock receiver. The Betaflight-side mixer setup needs no custom firmware; getting that AUX channel there over the custom link does, see the RC-link firmware notes |
| Release testing | Bench-tested repeatedly (Test 8, Payload Mechanism Test) before any flight test. Release reliability is measured (release success rate over N trials), not assumed |

## 4. Safety Factor Summary

| Load case | Force | Servo capability | Safety factor |
|---|---:|---:|---:|
| Max payload (100 g), 20 mm arm | 0.0196 N·m | 0.177 N·m (1.8 kg·cm) | **≈ 9x** |
| Min payload (20 g), 20 mm arm | 0.0039 N·m | 0.177 N·m | **≈ 45x** (over-margined at the low end, which is fine since the servo is sized for the worst case) |

## 5. Open Items

- Exact payload item(s) to be delivered: not decided yet, I'll assume a small printed test mass (e.g. a 3D-printed calibration weight) for initial testing, keeping with the "payload should be very small" idea.
- Exact moment arm depends on final CAD geometry. The 20 mm figure above is a reasonable placeholder, to be confirmed once the servo mount is modeled.
