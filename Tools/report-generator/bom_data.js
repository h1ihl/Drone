const USD_TO_CAD = 1.39; // 2026-08-30 mid-market rate

// category, part, qty, spec, price({usd}|{cad}), supplier, link, university, required, tier, componentType, verified
const rows = [
  ['Flight controller', '2S F4 AIO FC + Brushless ESC (no RX)', 1, 'STM32F4, OSD, SmartAudio, built-in 4-in-1 ESC', {usd:22.99}, 'AliExpress', 'https://www.aliexpress.com/item/32969058968.html', 'No', 'Yes', 'Recommended', 'Purchased', 'Manufacturer-specified'],
  ['RC link', 'ESP32-C3 Super Mini (onboard RX)', 1, 'RISC-V, 2.4GHz WiFi, custom firmware: ESP-NOW RX -> SBUS out (inverted UART) to FC', {usd:3.99}, 'AliExpress', 'https://www.aliexpress.com/item/1005005319963906.html', 'No', 'Yes', 'Recommended', 'Purchased', 'Estimated - real AliExpress listings found, $3.50-4.80 USD range'],
  ['RC link', 'ESP32-WROOM-32 DevKit (handheld TX) + KY-023 dual-axis joystick x2 + momentary/toggle switch x2', 1, 'Dual-core, 2.4GHz WiFi, custom firmware: reads sticks/switches -> ESP-NOW out. 4 stick axes (throttle, yaw, pitch, roll) + 2 AUX switches (arm, payload release). Powered via USB power bank, already owned, not priced separately.', {usd:4.40}, 'AliExpress (DevKit $2.20 + 2x joystick $0.60 + 2x switch ~$0.50 est.)', 'https://www.aliexpress.com/item/1005003145871431.html ; https://www.aliexpress.com/item/1882818018.html', 'No', 'Yes', 'Recommended', 'Purchased', 'Estimated - DevKit and joystick prices from real AliExpress listings found; switch price is a typical-component estimate, no specific listing checked'],
  ['Motors', 'SPARKHOBBY XSPEED 1103 11000KV brushless motor (4-pack)', 1, '2-3S rated, 1.5mm shaft, explicitly compatible with Gemfan/HQprop 65mm props; price is for the full set of 4; bare pigtail wire leads, no connector', {cad:33.58}, 'AliExpress (Sparkhobby Store)', 'https://www.aliexpress.com/item/1005004927233900.html', 'No', 'Yes', 'Recommended', 'Purchased', 'Manufacturer-specified (price/specs from listing); per-motor weight not published on this specific listing, ~3.3-3.55g/motor is a cross-shopping Estimate from other 1103 11000KV listings, not confirmed for this product'],
  ['Propellers', 'Gemfan 65mm 2-blade prop (set of 8, 4 spare)', 1, '1mm/1.5mm shaft options', {usd:4.49}, 'GetFPV', 'https://www.getfpv.com/gemfan-65mm-micro-propellers-1mm-shaft-set-of-8.html', 'No', 'Yes', 'Recommended', 'Purchased', 'Manufacturer-specified'],
  ['Battery', '2S 450mAh HV LiPo, 80C, XT30', 1, '7.6V nominal', {usd:5.99}, 'Turnigy/HobbyKing-class listing', 'https://hobbyking.com/en_us/turnigy-nano-tech-300mah-2s-35-70c-lipo-pack.html', 'CHECK INVENTORY', 'Yes', 'Recommended', 'Purchased', 'Manufacturer-specified (SKU to confirm)'],
  ['Servo', 'SG90 9g micro servo', 1, '1.8 kg-cm stall torque', {usd:3.00}, 'AliExpress (bulk-pack pricing)', 'https://www.aliexpress.com/item/32425569444.html', 'No', 'Yes', 'Recommended', 'Purchased', 'Manufacturer-specified'],
  ['Wiring', 'Silicone wire, XT30 pigtail, servo extension', 1, 'Misc small-gauge wire/connectors', {cad:6.00}, 'Various', '', 'No', 'Yes', 'Recommended', 'Purchased', 'Estimated'],
  ['Connectors', 'XT30 battery connector (spare/pigtail)', 1, 'Solder-on connector', {cad:2.00}, 'Various', '', 'No', 'No', 'Recommended', 'Purchased', 'Estimated'],
  ['Fasteners', 'M2 socket-head bolts + brass heat-set inserts', 1, 'Assorted lengths, ~20 inserts', {cad:10.00}, 'Various', '', 'CHECK INVENTORY', 'Yes', 'Recommended', 'Purchased', 'Estimated'],
  ['3D-printing material', 'PETG filament (frame + payload mechanism + TX enclosure, ~20-30g)', 1, 'Partial spool usage', {cad:4.00}, 'University makerspace or own spool', '', 'CHECK INVENTORY', 'Yes', 'Recommended', 'University/Purchased', 'Estimated'],

  // Minimum tier - brushed fallback substitutions (replace motor line for this tier's total)
  ['Motors (Minimum tier alt.)', 'Coreless brushed motor 8520 (4pcs + props)', 1, '8.5x20mm, ~53000rpm, 3.7-7.4V', {usd:9.00}, 'AliExpress/Amazon', 'https://www.aliexpress.com/item/32823056468.html', 'No', 'Alt.', 'Minimum', 'Purchased', 'Estimated (price not independently confirmed)'],
  ['Flight controller (Minimum tier alt.)', 'Brushed whoop AIO FC (built-in motor drivers + RX)', 1, 'e.g. BetaFPV F4 Brushed FC class board', {usd:42.99}, 'TinyWhoop.com', 'https://www.tinywhoop.com/products/betafpv-f4-brushed-fc-frsky-rx-osd', 'No', 'Alt.', 'Minimum', 'Purchased', 'Manufacturer-specified'],

  // Maximum tier additions (spares/tools)
  ['Spare/replacement', 'Spare motor set (4x Sparkhobby XSPEED 1103 11000KV)', 1, 'Crash spares, same listing as primary motor set', {cad:33.58}, 'AliExpress (Sparkhobby Store)', 'https://www.aliexpress.com/item/1005004927233900.html', 'No', 'No', 'Maximum', 'Purchased', 'Manufacturer-specified'],
  ['Spare/replacement', 'Spare battery (2S 450mAh HV)', 1, 'Extended test-session capacity', {usd:5.99}, 'Turnigy/HobbyKing-class', '', 'No', 'No', 'Maximum', 'Purchased', 'Manufacturer-specified'],
  ['Tools', 'LiPo-safe charging bag', 1, 'Fireproof storage/charge bag', {cad:12.00}, 'Various', '', 'CHECK INVENTORY', 'No', 'Maximum', 'Purchased', 'Estimated'],
  ['Tools', '2S LiPo balance charger', 1, 'If not already available', {cad:35.00}, 'Various', '', 'CHECK INVENTORY', 'No', 'Maximum', 'Purchased', 'Estimated'],
];

function priceCAD(p) {
  if (p.cad !== undefined) return p.cad;
  return Math.round(p.usd * USD_TO_CAD * 100) / 100;
}

module.exports = { USD_TO_CAD, rows, priceCAD };
