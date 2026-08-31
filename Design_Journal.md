# Design Journal

Some notes on how this project actually came together, mostly so I remember my own reasoning later.

## Where I started

My first pass at this was way too ambitious. I wanted a portfolio-level autonomous UAV: Pixhawk 6C flight controller, a Raspberry Pi 5 companion computer, GPS-denied navigation with optical flow and LiDAR, sensor fusion, the whole thing. On paper it looked great for a resume. In practice it worked out to something like $2,000+ CAD and a 5 to 8 month build, with a 72-page design report before I'd even ordered a single part.

That's a capstone project, not something one student builds part-time for fun. I caught myself over-engineering it and decided to scrap the approach and start over at a scale I could actually finish.

## The reset

The old design is still sitting in `_Archive_v1_Oversized_UAV/`. I didn't delete it, since some of the research is still useful, but it's not the plan anymore.

What I actually want is a small, cheap hobby quadcopter I can build and fly in a few weeks, with a simple custom payload-release mechanism as the "interesting" feature. No GPS, no LiDAR, no companion computer, no autonomous navigation. None of that is needed to make this a real engineering project, and all of it adds cost, complexity, and time I don't have.

Rough targets I set for the redo:

- 2.5 to 5 inch propellers, total mass around 100 to 300 g
- Off-the-shelf Betaflight flight controller and firmware (no reason to write my own stabilization code)
- A servo-actuated payload release I design and print myself
- Original budget target: $100 CAD for purchased hardware
- Timeline: 3 to 8 weeks of part-time work, not months

The engineering value is supposed to come from the frame design, the mechanical/electrical integration, the payload mechanism, and actually testing and measuring the result, not from throwing more expensive electronics at it.

## The budget reality check

Once I started pricing real parts instead of guessing, the $100 target didn't hold up. Small brushless FPV motors alone run about $51 USD for a matched set of four (checked against two separate real listings, so it's not a one-off bad price). Hitting the 100 to 300 g mass range with a 20 to 100 g payload basically requires that motor class.

So I ended up with three tiers instead of pretending $100 was still realistic:

- **Minimum** (brushed motors, no ESC needed): stays close to $100 CAD, but payload capacity drops to around 5 to 15 g
- **Recommended** (brushless): about $156 CAD, meets the actual payload target
- **Maximum** (with spares and a charger): about $283 CAD

I'd rather stretch the budget a bit and get a drone that actually hits the payload target than hit an arbitrary number and end up with something that can barely lift anything. The full comparison is in `Electrical/Electrical_Architecture.md` and `Mechanical/Frame_Design.md`.

## What I'm keeping myself honest about

I don't want this documentation to make claims I haven't actually tested. Every number in here is labeled as Manufacturer-specified, Calculated, Estimated, or Measured, and anything I haven't tested yet is marked TARGET. I'd rather have an honest set of estimates now and update them once I've actually built and flown the thing than write numbers that sound impressive and turn out to be wrong.

Still open: confirming which parts I can actually get through the university (receiver, battery, hardware, filament, transmitter) instead of buying new, and locking in the final budget now that I know real pricing.
