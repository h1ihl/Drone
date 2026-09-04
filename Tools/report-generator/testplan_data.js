const tests = [
  ['Test 1', 'Frame fit and assembly', 'Dry-fit all printed parts (hub, arms, payload mount) with hardware before wiring anything', 'All bolt holes/inserts align; no interference between parts', 'TARGET: 0 fit issues'],
  ['Test 2', 'Motor operation', 'Spin each motor individually via the FC (props OFF), listen/feel for smooth rotation', 'No grinding, no excess heat, correct direction per Betaflight motor test', 'TARGET: all 4 motors pass'],
  ['Test 3', 'ESC operation', 'Verify all 4 ESC channels respond correctly and proportionally to throttle command (props off)', 'Smooth, proportional response, no channel dropout', 'TARGET: all 4 channels pass'],
  ['Test 4', 'Gyro/IMU validation', 'Check Betaflight gyro/accelerometer readings while gently rotating the frame by hand', 'Readings track rotation correctly, low noise', 'TARGET: clean signal, no excessive vibration noise'],
  ['Test 5', 'RC-link validation (custom ESP32 link)', "Confirm all RC channels respond correctly in Betaflight receiver tab, including the payload AUX channel; then walk the TX out of ESP-NOW range (or power it off) and confirm the RX ESP32's failsafe watchdog triggers correctly within its timeout", "All channels move correctly end-to-end, AUX channel triggers servo output, and the FC shows a failsafe condition (not stale/held values) within the RX firmware's timeout when the link is lost", 'TARGET: all channels pass, failsafe verified'],
  ['Test 6', 'Static thrust test', 'Mount on a simple bench thrust stand (e.g. kitchen scale + fixture), measure thrust (g) vs throttle %', 'Measured total thrust at a given throttle %; current draw (A)', 'TARGET: total thrust >= 280 gf (design requirement, Frame_Design.md 2) at a reasonable throttle %'],
  ['Test 7', 'Hover test', 'Tethered or low-altitude hover in a safe/open area, time the flight to low-battery cutoff', 'Flight time (min); qualitative stability', 'TARGET: stable hover achieved; flight time TBD (see Frame_Design.md 3)'],
  ['Test 8', 'Payload mechanism test', 'Bench-test the servo release mechanism repeatedly, without flying, at min/max payload mass', 'Release success rate over N trials; any binding/failure', 'TARGET: >=95% release success over 20 bench trials'],
  ['Test 9', 'Payload flight test', 'Full mission: take off, fly manually, carry payload, position over target, activate release, land', 'Payload delivered; release reliability in-flight; landing/frame condition', 'TARGET: successful payload delivery, no damage'],
  ['Test 10', 'Final demonstration', 'Complete flight + payload delivery demo, video-recorded for portfolio use', 'Overall mission success; all measured KPIs compiled', 'TARGET: full mission success, KPIs recorded in this sheet'],
];

const kpis = [
  ['Total AUW (bare)', '~90 g (Estimated, Frame_Design.md 1)', ''],
  ['Total system mass w/ payload', '140 g at 50g payload (Estimated)', ''],
  ['Required total thrust', '~280 gf / 2:1 T/W (Calculated target)', ''],
  ['Measured max thrust', 'NOT YET MEASURED', ''],
  ['Current draw (hover)', 'NOT FOUND / not calculable from available data — measure directly', ''],
  ['Flight time', 'TARGET — no reliable estimate available, see Frame_Design.md 3', ''],
  ['Payload capacity (measured)', 'TARGET — depends on Test 6 thrust result', ''],
  ['Payload release reliability', 'TARGET >= 95% (Test 8)', ''],
  ['Frame arm safety factor (simulated)', 'TARGET >= 3 (FEA_Plan.md)', ''],
  ['Print mass (frame + payload mechanism)', '~10-18 g (Estimated, Manufacturing_Plan.md 2)', ''],
  ['Print time (frame + payload mechanism)', '~1.5-2 hours (Estimated)', ''],
];

module.exports = { tests, kpis };
