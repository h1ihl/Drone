const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({ size: 'letter', margin: 40 });
doc.pipe(fs.createWriteStream(process.argv[2]));

const W = doc.page.width;
const COL = { power: '#c0392b', reg5v: '#e67e22', signal: '#2980b9', boxLine: '#2c3e50', text: '#1a1a1a' };

function box(x, y, w, h, label, sublabel) {
  doc.rect(x, y, w, h).lineWidth(1.2).stroke(COL.boxLine);
  doc.fontSize(9).fillColor(COL.text).font('Helvetica-Bold');
  doc.text(label, x + 4, y + 6, { width: w - 8, align: 'center' });
  if (sublabel) {
    doc.font('Helvetica').fontSize(7);
    doc.text(sublabel, x + 4, y + h - 18, { width: w - 8, align: 'center' });
  }
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
}
function wire(x1, y1, x2, y2, color, label) {
  doc.moveTo(x1, y1).lineTo(x2, y2).lineWidth(1.8).stroke(color);
  if (label) {
    doc.fontSize(6.5).fillColor(color).font('Helvetica-Bold');
    doc.text(label, (x1 + x2) / 2 - 35, (y1 + y2) / 2 - 8, { width: 70, align: 'center' });
  }
}

doc.fontSize(16).fillColor(COL.text).font('Helvetica-Bold')
  .text('Micro Quadrotor Wiring Diagram', 40, 30, { width: W - 80, align: 'center' });
doc.fontSize(8.5).font('Helvetica').fillColor('#666')
  .text('Custom 3D-Printed Micro Quadrotor with Servo Payload Release | Rev B | 2026-09-04', 40, 52, { width: W - 80, align: 'center' });

const top = 100;
const battery = box(240, top, 110, 45, 'LiPo Battery', '2S 450mAh HV\nXT30, 7.6V nom');
const fc = box(220, top + 100, 150, 60, 'FC + ESC (AIO)', '2S F4 AIO board\nBuilt-in 4-in-1 ESC');
wire(battery.cx, battery.y + battery.h, fc.cx, fc.y, COL.power, 'VBAT (7.6V)\nXT30');

const motors = [];
const positions = [[80, top + 100], [80, top + 220], [430, top + 100], [430, top + 220]];
const labels = ['Motor 1 (FL)', 'Motor 2 (FR)', 'Motor 3 (RL)', 'Motor 4 (RR)'];
for (let i = 0; i < 4; i++) {
  const m = box(positions[i][0], positions[i][1], 90, 40, labels[i], '1103 11000KV');
  motors.push(m);
}
wire(fc.x, fc.cy, motors[0].x + motors[0].w, motors[0].cy, COL.power, '3-phase');
wire(fc.x, fc.cy + 20, motors[1].x + motors[1].w, motors[1].cy, COL.power, '3-phase');
wire(fc.x + fc.w, fc.cy, motors[2].x, motors[2].cy, COL.power, '3-phase');
wire(fc.x + fc.w, fc.cy + 20, motors[3].x, motors[3].cy, COL.power, '3-phase');

const rx = box(80, top + 320, 130, 50, 'RX ESP32 (onboard)', 'ESP32-C3 Super Mini\nSBUS out, 2.4GHz');
wire(fc.x, fc.y + fc.h - 10, rx.cx, rx.y, COL.signal, 'SBUS + 5V + GND');

const servo = box(310, top + 320, 130, 50, 'Payload Servo', 'SG90 9g\nLatch release');
wire(fc.x + fc.w, fc.y + fc.h - 10, servo.cx, servo.y, COL.signal, 'PWM (AUX ch.)\n+5V + GND');

const wireless = '#8e44ad';
const tx = box(80, top + 400, 150, 45, 'TX ESP32 (handheld)', 'DevKit + sticks/switches\nUSB power bank, off-board');
doc.save().dash(3, { space: 2 }).moveTo(tx.cx, tx.y).lineTo(rx.cx, rx.y + rx.h).lineWidth(1.8).stroke(wireless).undash().restore();
doc.fontSize(6.5).fillColor(wireless).font('Helvetica-Bold').text('ESP-NOW\n(wireless)', tx.cx - 35, (tx.y + rx.y + rx.h) / 2 - 10, { width: 70, align: 'center' });

const legendY = top + 470;
doc.fontSize(9).font('Helvetica-Bold').fillColor(COL.text).text('Legend', 40, legendY);
const legendItems = [[COL.power, 'VBAT — battery voltage (7.6V, 2S HV)'], [COL.reg5v, 'Regulated 5V (RX ESP32 + servo power, from FC/ESC onboard BEC)'], [COL.signal, 'Signal (SBUS, PWM)'], [wireless, 'ESP-NOW wireless link (2.4GHz WiFi, no physical connection)']];
let ly = legendY + 18;
for (const [color, label] of legendItems) {
  doc.moveTo(40, ly).lineTo(65, ly).lineWidth(2.5).stroke(color);
  doc.fontSize(8).font('Helvetica').fillColor(COL.text).text(label, 72, ly - 5, { width: 450 });
  ly += 18;
}

doc.fontSize(7.5).font('Helvetica-Oblique').fillColor('#888')
  .text('GND is common between battery, FC/ESC, motors, RX ESP32, and servo (single ground reference — no separate ground lines shown, standard practice for a build this small). Motor phase wires are soldered directly; no bullet connectors needed at this current level. 5V and PWM/SBUS signal wires run from the FC/ESC board\'s onboard BEC and servo pad respectively. The handheld TX ESP32 is off-board, battery-powered separately (USB power bank), and reaches the RX ESP32 only wirelessly via ESP-NOW — it has no wired connection to the drone.',
    40, ly + 8, { width: W - 80 });

doc.end();
console.log('Wiring diagram written:', process.argv[2]);
