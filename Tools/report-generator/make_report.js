const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const bomData = require('./bom_data');
const tpData = require('./testplan_data');

const PROJECT_DIR = 'C:/Users/hasee/OneDrive/Desktop/Drone Project';
const OUT = process.argv[2];

function readMd(rel) { return fs.readFileSync(path.join(PROJECT_DIR, rel), 'utf8'); }

const doc = new PDFDocument({ size: 'letter', margin: 50, bufferPages: true, autoFirstPage: false });
doc.pipe(fs.createWriteStream(OUT));
const MARGIN = 50;
const sectionPageMap = [];

function newPage(opts) { doc.addPage(opts); doc.font('Helvetica').fontSize(9.5).fillColor('#1a1a1a'); return doc.bufferedPageRange().count; }
function ensureSpace(h) { if (doc.y + h > doc.page.height - MARGIN) newPage(); }
function stripInline(s) {
  return s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1 ($2)').replace(/^#+\s*/, '');
}
function h1SectionStart(num, title) {
  const p = newPage();
  sectionPageMap.push({ num, title, page: p });
  doc.rect(0, 0, doc.page.width, 66).fill('#1f3a5f');
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10).text(`SECTION ${num}`, MARGIN, 18);
  doc.fontSize(17).text(title, MARGIN, 33, { width: doc.page.width - MARGIN * 2 });
  doc.y = 86;
  doc.fillColor('#1a1a1a').font('Helvetica').fontSize(9.5);
}
function h2(text) { doc.x = MARGIN; ensureSpace(28); doc.moveDown(0.5); doc.font('Helvetica-Bold').fontSize(12).fillColor('#1f3a5f').text(stripInline(text), MARGIN, doc.y, { width: doc.page.width - MARGIN * 2 }); doc.font('Helvetica').fontSize(9.5).fillColor('#1a1a1a'); doc.x = MARGIN; doc.moveDown(0.12); }
function h3(text) { doc.x = MARGIN; ensureSpace(20); doc.moveDown(0.35); doc.font('Helvetica-Bold').fontSize(10).fillColor('#2c3e50').text(stripInline(text), MARGIN, doc.y, { width: doc.page.width - MARGIN * 2 }); doc.font('Helvetica').fontSize(9.5).fillColor('#1a1a1a'); doc.x = MARGIN; doc.moveDown(0.08); }
function para(text) {
  const clean = stripInline(text);
  if (!clean.trim()) { doc.moveDown(0.25); return; }
  doc.x = MARGIN; ensureSpace(13);
  doc.font('Helvetica').fontSize(9.5).fillColor('#1a1a1a').text(clean, MARGIN, doc.y, { width: doc.page.width - MARGIN * 2, lineGap: 2 });
  doc.x = MARGIN; doc.moveDown(0.2);
}
function bullet(text) {
  doc.x = MARGIN;
  const clean = stripInline(text); ensureSpace(13);
  const w = doc.page.width - MARGIN * 2 - 14; const x0 = MARGIN;
  doc.font('Helvetica').fontSize(9.5).fillColor('#1a1a1a');
  doc.text('•', x0, doc.y, { width: 12 });
  doc.text(clean, x0 + 14, doc.y - doc.currentLineHeight(), { width: w, lineGap: 2 });
  doc.x = MARGIN; doc.moveDown(0.1);
}
function numbered(n, text) {
  doc.x = MARGIN;
  const clean = stripInline(text); ensureSpace(13);
  const w = doc.page.width - MARGIN * 2 - 20; const x0 = MARGIN;
  doc.font('Helvetica-Bold').fontSize(9.5).text(`${n}.`, x0, doc.y, { width: 20 });
  doc.font('Helvetica').fontSize(9.5).text(clean, x0 + 20, doc.y - doc.currentLineHeight(), { width: w, lineGap: 2 });
  doc.x = MARGIN; doc.moveDown(0.1);
}
function blockquote(text) {
  doc.x = MARGIN;
  const clean = stripInline(text); ensureSpace(18);
  const x0 = MARGIN; const w = doc.page.width - MARGIN * 2 - 16;
  const h = doc.heightOfString(clean, { width: w }) + 8;
  doc.rect(x0, doc.y, 3, h).fill('#1f3a5f');
  doc.fillColor('#444').font('Helvetica-Oblique').fontSize(9.5).text(clean, x0 + 14, doc.y + 4, { width: w, lineGap: 2 });
  doc.fillColor('#1a1a1a').font('Helvetica'); doc.x = MARGIN; doc.moveDown(0.35);
}
function drawTable(headers, rows, colWidths, opts) {
  opts = opts || {}; const fontSize = opts.fontSize || 8;
  const totalW = colWidths.reduce((a, b) => a + b, 0); const x0 = MARGIN;
  function drawHeader() {
    ensureSpace(20); const y0 = doc.y; doc.font('Helvetica-Bold').fontSize(fontSize);
    let rowH = 0;
    for (let i = 0; i < headers.length; i++) rowH = Math.max(rowH, doc.heightOfString(headers[i], { width: colWidths[i] - 6 }));
    rowH += 6;
    doc.rect(x0, y0, totalW, rowH).fill('#1f3a5f');
    let cx = x0; doc.fillColor('#ffffff');
    for (let i = 0; i < headers.length; i++) { doc.text(headers[i], cx + 3, y0 + 3, { width: colWidths[i] - 6 }); cx += colWidths[i]; }
    doc.y = y0 + rowH; doc.fillColor('#1a1a1a').font('Helvetica');
  }
  drawHeader(); let stripe = false;
  for (const row of rows) {
    doc.font('Helvetica').fontSize(fontSize); let rowH = 0;
    for (let i = 0; i < row.length; i++) rowH = Math.max(rowH, doc.heightOfString(String(row[i] == null ? '' : row[i]), { width: colWidths[i] - 6 }));
    rowH += 6;
    if (doc.y + rowH > doc.page.height - MARGIN) { newPage(opts.pageOpts); drawHeader(); }
    const y0 = doc.y;
    if (stripe) doc.rect(x0, y0, totalW, rowH).fill('#f2f5fa');
    stripe = !stripe;
    let cx = x0; doc.fillColor('#1a1a1a');
    for (let i = 0; i < row.length; i++) { doc.text(String(row[i] == null ? '' : row[i]), cx + 3, y0 + 3, { width: colWidths[i] - 6 }); cx += colWidths[i]; }
    doc.rect(x0, y0, totalW, rowH).lineWidth(0.3).stroke('#ccc');
    doc.y = y0 + rowH;
  }
  doc.x = MARGIN; doc.moveDown(0.35);
}
function renderMd(text) {
  const lines = text.split('\n'); let i = 0; let numCounter = 0;
  while (i < lines.length) {
    let line = lines[i];
    if (/^\s*$/.test(line)) { doc.moveDown(0.15); i++; numCounter = 0; continue; }
    if (/^---+\s*$/.test(line)) { doc.moveDown(0.25); i++; continue; }
    if (/^```/.test(line)) {
      const code = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) { code.push(lines[i]); i++; }
      i++;
      const text2 = code.join('\n'); const w = doc.page.width - MARGIN * 2 - 16;
      const h = doc.heightOfString(text2, { width: w, font: 'Courier', fontSize: 7.5 }) + 12;
      doc.x = MARGIN; ensureSpace(h + 6); const x0 = MARGIN, y0 = doc.y;
      doc.rect(x0, y0, doc.page.width - MARGIN * 2, h).fillAndStroke('#f4f4f4', '#ccc');
      doc.fillColor('#1a1a1a').font('Courier').fontSize(7.5).text(text2, x0 + 8, y0 + 6, { width: w });
      doc.font('Helvetica').fontSize(9.5); doc.y = y0 + h + 8;
      continue;
    }
    if (/^#\s+/.test(line)) { i++; continue; }
    if (/^##\s+/.test(line)) { h2(line.replace(/^##\s+/, '')); i++; continue; }
    if (/^###\s+/.test(line)) { h3(line.replace(/^###\s+/, '')); i++; continue; }
    if (/^>\s?/.test(line)) {
      const bq = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { bq.push(lines[i].replace(/^>\s?/, '')); i++; }
      blockquote(bq.join(' ')); continue;
    }
    if (/^\s*\|/.test(line)) {
      const tblLines = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) { tblLines.push(lines[i]); i++; }
      if (tblLines.length >= 2) {
        const parseRow = l => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => stripInline(c.trim()));
        const headers = parseRow(tblLines[0]); const dataRows = tblLines.slice(2).map(parseRow);
        const availW = doc.page.width - MARGIN * 2;
        const raw = headers.map(h => Math.max(h.length, 6)); const sum = raw.reduce((a, b) => a + b, 0);
        const norm = raw.map(r => availW * (r / sum));
        drawTable(headers, dataRows, norm, { fontSize: 7.5 });
      }
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) { bullet(line.replace(/^\s*[-*]\s+/, '')); i++; continue; }
    if (/^\s*\d+\.\s+/.test(line)) { numCounter++; numbered(numCounter, line.replace(/^\s*\d+\.\s+/, '')); i++; continue; }
    const paraLines = [line]; i++;
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,3}\s|\s*\||\s*[-*]\s|\s*\d+\.\s|```|>|---+\s*$)/.test(lines[i])) { paraLines.push(lines[i]); i++; }
    para(paraLines.join(' '));
  }
}
function readMdSectionSlice(relPath, startHeader, endHeader) {
  const text = readMd(relPath); const lines = text.split('\n');
  let startIdx = 0;
  if (startHeader) { startIdx = lines.findIndex(l => l.trim().startsWith(startHeader.trim())); if (startIdx === -1) { console.warn('WARN start not found', relPath, startHeader); startIdx = 0; } }
  let endIdx = lines.length;
  if (endHeader) { const f = lines.findIndex((l, idx) => idx > startIdx && l.trim().startsWith(endHeader.trim())); if (f !== -1) endIdx = f; else console.warn('WARN end not found', relPath, endHeader); }
  return lines.slice(startIdx, endIdx).join('\n');
}

// ================= COVER =================
newPage();
doc.rect(0, 0, doc.page.width, doc.page.height).fill('#1f3a5f');
doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9).text('ENGINEERING DESIGN REPORT', MARGIN, 90, { characterSpacing: 2 });
doc.fontSize(26).text('Custom 3D-Printed Micro Quadrotor', MARGIN, 140, { width: doc.page.width - MARGIN * 2 });
doc.fontSize(26).text('with Servo Payload Release', MARGIN, undefined, { width: doc.page.width - MARGIN * 2 });
doc.font('Helvetica').fontSize(12).fillColor('#cfd8e6').text('Drone Project — Redesigned Small-Scale Hobby/Engineering Build', MARGIN, 230);
doc.fontSize(11).fillColor('#ffffff');
doc.text('Prepared for: University of Calgary — Engineering Student Hobby Project', MARGIN, 440);
doc.text('Prepared by: Undergraduate Engineering Student (haseebsyed2006@gmail.com)', MARGIN, 460);
doc.text('Date: September 4, 2026', MARGIN, 480);
doc.text('Revision: B — adds a custom ESP32 RC link, replacing the FlySky TX/RX pair (see Design_Journal.md)', MARGIN, 500, { width: doc.page.width - MARGIN * 2 });
doc.fontSize(8.5).fillColor('#aab4c4').text(
  'All values are labeled Manufacturer-specified, Calculated, Estimated, or Measured. No test, thrust, or flight result is fabricated — unmeasured KPIs are marked TARGET until actually tested.',
  MARGIN, 555, { width: doc.page.width - MARGIN * 2 });

// ================= TOC =================
const tocPage = newPage();
doc.font('Helvetica-Bold').fontSize(16).fillColor('#1f3a5f').text('Table of Contents', MARGIN, MARGIN);
doc.moveDown(1);
const tocStartY = doc.y;

// ================= SECTIONS =================
h1SectionStart(2, 'Executive Summary');
para('This report documents the redesigned scope of a small, affordable hobby quadcopter project: a custom 3D-printed 2.5-3 inch micro quadrotor with a servo-actuated payload-release mechanism. This design deliberately replaces an earlier, much larger autonomous-UAV concept (formerly archived in an _Archive_v1_Oversized_UAV/ folder, since removed from the repo) that was well beyond the intended scope, budget, and timeline for this project.');
para('The selected frame concept is a modular-arm design (Concept C of three compared), chosen for repairability during iterative testing. The propulsion system is a real, sourced 2S brushless setup (SPARKHOBBY XSPEED 1103 11000KV motors, 65mm props, an AIO flight controller/ESC board) running Betaflight - no custom flight-stabilization firmware. A servo-actuated latch mechanism (SG90) delivers a 20-100 g payload.');
para('RC control is a self-written link between two ESP32 boards (ESP-NOW wireless protocol, a custom SBUS encoder, and a failsafe watchdog on the onboard receiver) instead of a stock FlySky transmitter/receiver pair - a deliberate scope choice to demonstrate embedded programming alongside the mechanical work, at close to the same purchased cost. This is a real added engineering/schedule risk relative to a proven off-the-shelf receiver, and is documented honestly as such (Section 12).');
para('Real, verified component pricing pushes the fully-capable build (meeting the stated 100-300 g mass / 20-100 g payload target) to approximately $112.42 CAD, just above the original $100 CAD target - this is presented honestly as a real market constraint, not hidden. This figure reflects two rounds of more thorough AliExpress price comparison, on the motors and then the RC-link ESP32 boards, that found the same specs for well under the price initially budgeted (Section 16). I have some willingness to stretch the budget; a cheaper brushed-motor fallback (~$119.15 CAD) is also documented, at reduced payload capacity.');
para('Nothing has been physically built or tested yet. Every quantitative claim in this report is labeled Calculated, Estimated, or Manufacturer-specified - never a fabricated measurement. Target timeline is 3-8 weeks of part-time work.');

h1SectionStart(3, 'Requirements');
renderMd(readMd(path.join('Requirements', 'Requirements.md')));

h1SectionStart(4, 'Research');
para('Real, web-researched small/budget quadcopter projects, replacing the original research aimed at a much larger autonomous UAV. Focus question: what is the best small, inexpensive quadcopter project that still has meaningful engineering design work?');
renderMd(readMdSectionSlice(path.join('Research', 'Existing_Projects.md'), '| # | Project', '## Synthesis'));
h2('Synthesis');
renderMd(readMdSectionSlice(path.join('Research', 'Existing_Projects.md'), '## Synthesis', null));

h1SectionStart(5, 'Concept Comparison');
renderMd(readMdSectionSlice(path.join('Research', 'Concept_Comparison.md'), '## Comparison Table', '## Selected Concept'));

h1SectionStart(6, 'Selected Design');
renderMd(readMdSectionSlice(path.join('Research', 'Concept_Comparison.md'), '## Selected Concept', null));

h1SectionStart(7, 'System Architecture');
para('The system is deliberately simple (per the Requirements doc, Section 4): a single flight-controller/ESC board running Betaflight handles all stabilization and motor control; a self-written ESP32-to-ESP32 RC link (ESP-NOW wireless, custom SBUS output) provides manual pilot control in place of a stock receiver; a payload servo, triggered from a spare AUX channel carried over that link, handles payload release. No companion computer, no autonomy stack, no custom PCB.');
h2('Block Diagram');
para('Battery -> FC/ESC (AIO board) -> 4x brushless motors (thrust/attitude control). Handheld TX ESP32 --ESP-NOW (wireless)--> onboard RX ESP32 -> FC/ESC (SBUS, pilot control). FC/ESC -> Payload servo (PWM, AUX-channel triggered release). Full labeled wiring diagram: Section 13.');
h2('Subsystem Ownership');
drawTable(
  ['Subsystem', 'Owner document'],
  [
    ['Mechanical structure (frame, arms, payload mount)', 'Mechanical/CAD_Architecture.md, Frame_Design.md'],
    ['Propulsion & structural calculations', 'Mechanical/Frame_Design.md'],
    ['Payload mechanism', 'Mechanical/Payload_Mechanism.md'],
    ['Manufacturing', 'Mechanical/Manufacturing_Plan.md'],
    ['Simple FEA', 'Mechanical/FEA_Plan.md'],
    ['Electronics/wiring', 'Electrical/Electrical_Architecture.md, Wiring_Diagram.pdf'],
    ['RC-link firmware (ESP-NOW, SBUS, failsafe)', 'Electrical/Electrical_Architecture.md §1a'],
    ['Bill of materials', 'BOM/BOM.xlsx'],
    ['Testing', 'Testing/Test_Plan.xlsx'],
  ],
  [(doc.page.width - MARGIN * 2) * 0.45, (doc.page.width - MARGIN * 2) * 0.55]
);

h1SectionStart(8, 'Propulsion Selection');
renderMd(readMdSectionSlice(path.join('Mechanical', 'Frame_Design.md'), '## 2. Thrust Requirement', '## 3. Battery'));
h2('Component Selection');
renderMd(readMdSectionSlice(path.join('Electrical', 'Electrical_Architecture.md'), '## 1. Component Selection', '## 2. Minimum-Budget Fallback'));

h1SectionStart(9, 'Mechanical Design');
renderMd(readMd(path.join('Mechanical', 'CAD_Architecture.md')));

h1SectionStart(10, 'Frame Calculations');
renderMd(readMdSectionSlice(path.join('Mechanical', 'Frame_Design.md'), '## 1. Weight Budget', '## 5. Brushed-Motor Fallback'));
h2('Simple FEA');
renderMd(readMd(path.join('Mechanical', 'FEA_Plan.md')));

h1SectionStart(11, 'Payload Mechanism');
renderMd(readMd(path.join('Mechanical', 'Payload_Mechanism.md')));

h1SectionStart(12, 'Electrical Architecture');
renderMd(readMd(path.join('Electrical', 'Electrical_Architecture.md')));

h1SectionStart(13, 'Wiring Diagram');
para('The wiring diagram below shows every component, connector, and signal line in the system, with VBAT/5V/GND/PWM/SBUS clearly labeled, matching the Electrical Architecture doc, Section 5. This is a genuinely simple electrical system - one page is enough. The handheld TX ESP32 is off-board and reaches the onboard RX ESP32 wirelessly (ESP-NOW), not by wire, so it is shown separately from the wired onboard system below it.');
drawWiring();

h1SectionStart(14, 'CAD / Manufacturing');
renderMd(readMd(path.join('Mechanical', 'Manufacturing_Plan.md')));

h1SectionStart(15, 'Bill of Materials');
para('Full line-item BOM below (also BOM/BOM.xlsx). All prices in CAD, converted from USD at 1 USD = ' + bomData.USD_TO_CAD + ' CAD (2026-08-30). Items marked CHECK INVENTORY should be excluded from your real out-of-pocket cost if available through university resources.');
{
  const headers = ['Category', 'Part', 'Qty', 'Cost (CAD)', 'Univ.?', 'Tier'];
  const dataRows = bomData.rows.map(r => {
    const [category, part, qty, spec, price, supplier, link, university, required, tier] = r;
    const unit = bomData.priceCAD(price);
    return [category, part, qty, `$${(unit * qty).toFixed(2)}`, university, tier];
  });
  const availW = doc.page.width - MARGIN * 2;
  const colWidths = [0.15, 0.30, 0.06, 0.13, 0.20, 0.16].map(f => f * availW);
  drawTable(headers, dataRows, colWidths, { fontSize: 7.3 });
}

h1SectionStart(16, 'Cost');
{
  function computeTotals() {
    let recommended = 0;
    for (const r of bomData.rows) if (r[9] === 'Recommended') recommended += bomData.priceCAD(r[4]) * r[2];
    const fcRec = bomData.rows.find(r => r[0] === 'Flight controller' && r[9] === 'Recommended');
    const motRec = bomData.rows.find(r => r[0] === 'Motors' && r[9] === 'Recommended');
    const fcAlt = bomData.rows.find(r => r[0].includes('Flight controller') && r[9] === 'Minimum');
    const motAlt = bomData.rows.find(r => r[0].includes('Motors') && r[9] === 'Minimum');
    const minimum = recommended - bomData.priceCAD(fcRec[4]) * fcRec[2] - bomData.priceCAD(motRec[4]) * motRec[2]
      + bomData.priceCAD(fcAlt[4]) * fcAlt[2] + bomData.priceCAD(motAlt[4]) * motAlt[2];
    let maxAdd = 0;
    for (const r of bomData.rows) if (r[9] === 'Maximum') maxAdd += bomData.priceCAD(r[4]) * r[2];
    return { Minimum: Math.round(minimum * 100) / 100, Recommended: Math.round(recommended * 100) / 100, Maximum: Math.round((recommended + maxAdd) * 100) / 100 };
  }
  const totals = computeTotals();
  drawTable(
    ['Configuration', 'Total (CAD)', 'Notes'],
    [
      ['Minimum', `$${totals.Minimum.toFixed(2)}`, 'Cheapest flying config; brushed motors; cannot meet 20-100g payload target'],
      ['Recommended', `$${totals.Recommended.toFixed(2)}`, 'Brushless; meets 100-300g mass / 20-100g payload target'],
      ['Maximum', `$${totals.Maximum.toFixed(2)}`, 'Recommended + spare motor/battery + charger/LiPo bag'],
    ],
    [(doc.page.width - MARGIN * 2) * 0.2, (doc.page.width - MARGIN * 2) * 0.15, (doc.page.width - MARGIN * 2) * 0.65]
  );
}
h2('Why the Budget Exceeds $100 CAD');
para('Real brushless FPV motor pricing was initially found at ~$51 USD (~$71 CAD) for a matched set of 4, confirmed at nearly the same price from a name-brand retailer and a generic AliExpress listing - the real cost floor found at that time for hardware meeting the stated mass/payload target, not a shopping oversight. A later, more thorough AliExpress price comparison (checked against several competing 1103/11000KV-class listings, verified for true per-motor cost rather than a misleading multi-pack headline price) found the identical motor spec - SPARKHOBBY XSPEED 1103 11000KV, 2-3S rated, 1.5mm shaft, Gemfan/HQprop 65mm compatible - at C$33.58 for a 4-pack, under half the original price. That swap brought the Recommended-tier total down from ~$155 CAD to ~$117.95 CAD. A second re-sourcing pass on the RX/TX ESP32 boards for the custom RC link (Section 12) found cheaper verified listings too (ESP32-C3 Super Mini at C$1.68, ESP32-WROOM-32 DevKitC at C$1.40), dropping the combined RX+TX cost from ~$11.67 CAD to ~$6.14 CAD and the Recommended-tier total further to ~$112.42 CAD. University-inventory availability (battery, hardware, filament) remains the main lever to reduce real out-of-pocket cost further below the totals above.');

h1SectionStart(17, 'Testing');
para('Full 10-test plan (also Testing/Test_Plan.xlsx). Results are intentionally blank - filled in during actual testing, never pre-filled with assumed outcomes.');
{
  const headers = ['Test', 'Name', 'Procedure', 'Success Criteria'];
  const dataRows = tpData.tests.map(t => [t[0], t[1], t[2], t[3]]);
  const availW = doc.page.width - MARGIN * 2;
  const colWidths = [0.08, 0.18, 0.42, 0.32].map(f => f * availW);
  drawTable(headers, dataRows, colWidths, { fontSize: 7.3 });
}
h2('KPI Summary');
drawTable(['KPI', 'Pre-Test Value'], tpData.kpis.map(k => [k[0], k[1]]), [(doc.page.width - MARGIN * 2) * 0.4, (doc.page.width - MARGIN * 2) * 0.6]);

h1SectionStart(18, 'Safety');
h2('Hazards & Mitigations');
bullet('Spinning propellers: always test motors with props OFF first (Tests 2-3); only spin props in a cleared area with no bystanders in the prop plane.');
bullet('LiPo battery hazards: charge only in a fireproof LiPo bag, never leave a charging battery unattended, inspect cells for swelling/damage before each use.');
bullet('Motor testing: secure the frame before any powered motor test; treat every powered-on vehicle as if props could spin.');
bullet('Electrical shorts: continuity-check wiring before first power-on (Test 1); insulate all exposed connections.');
bullet('Soldering: standard soldering safety - ventilation, iron rest, eye protection for wire trimming.');
bullet('Flight testing: escalate from bench (props off) to tethered/low-altitude to open manual flight; keep an RC kill-switch mapped and tested before every session.');
bullet('Payload release: bench-test the release mechanism (Test 8) before any in-flight release test, to confirm it won\'t release unexpectedly mid-flight.');
h2('Emergency Motor Shutdown');
para('The RC transmitter\'s arm/disarm switch is treated as the emergency stop - tested before every powered session, and the pilot keeps a thumb ready on it during all motor tests and flights. Disarming immediately cuts all motor output regardless of throttle position.');

h1SectionStart(19, 'Development Timeline');
para('Target: 3-8 weeks part-time (NOT 5-8 months, per the corrected project scope).');
drawTable(
  ['Week', 'Focus'],
  [
    ['Week 1', 'Research + requirements (this report\'s Sections 3-6)'],
    ['Week 2', 'Component selection + CAD (frame, payload mount)'],
    ['Week 3', '3D printing + electronics sourcing/assembly + RC-link firmware bring-up (ESP-NOW, SBUS encoder, failsafe watchdog)'],
    ['Week 4', 'Assembly + bench testing (Tests 1-5, including RC-link range/failsafe validation)'],
    ['Week 5', 'Flight testing (Tests 6-7)'],
    ['Week 6', 'Payload mechanism + optimization (Tests 8-9)'],
    ['Week 7-8', 'Final testing + documentation (Test 10)'],
  ],
  [(doc.page.width - MARGIN * 2) * 0.2, (doc.page.width - MARGIN * 2) * 0.8]
);
para('Adjust based on parts-shipping time, which will likely dominate the schedule more than hands-on build time (estimated at 2-4 hours for printing/assembly alone, per Mechanical/Manufacturing_Plan.md).');

h1SectionStart(20, 'Resume Value');
renderMd(readMd(path.join('Resume', 'Resume_Bullets.md')));
h2('Interview Talking Points');
renderMd(readMd(path.join('Resume', 'Interview_Talking_Points.md')));

h1SectionStart(21, 'References');
renderReferences();

// ================= wiring diagram drawing =================
function drawWiring() {
  const W = doc.page.width;
  const COL = { power: '#c0392b', signal: '#2980b9', boxLine: '#2c3e50', text: '#1a1a1a' };
  function box(x, y, w, h, label, sublabel) {
    doc.rect(x, y, w, h).lineWidth(1.2).stroke(COL.boxLine);
    doc.fontSize(8.5).fillColor(COL.text).font('Helvetica-Bold');
    doc.text(label, x + 4, y + 5, { width: w - 8, align: 'center' });
    if (sublabel) { doc.font('Helvetica').fontSize(6.5); doc.text(sublabel, x + 4, y + h - 16, { width: w - 8, align: 'center' }); }
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  }
  function wire(x1, y1, x2, y2, color, label) {
    doc.moveTo(x1, y1).lineTo(x2, y2).lineWidth(1.6).stroke(color);
    if (label) { doc.fontSize(6).fillColor(color).font('Helvetica-Bold'); doc.text(label, (x1 + x2) / 2 - 32, (y1 + y2) / 2 - 8, { width: 64, align: 'center' }); }
  }
  const top = doc.y + 10;
  const battery = box(220, top, 110, 40, 'LiPo Battery', '2S 450mAh HV, 7.6V');
  const fc = box(200, top + 90, 150, 55, 'FC + ESC (AIO)', '2S F4 AIO, built-in 4-in-1 ESC');
  wire(battery.cx, battery.y + battery.h, fc.cx, fc.y, COL.power, 'VBAT 7.6V XT30');
  const positions = [[60, top + 90], [60, top + 190], [400, top + 90], [400, top + 190]];
  const labels = ['Motor 1', 'Motor 2', 'Motor 3', 'Motor 4'];
  const motors = positions.map((p, i) => box(p[0], p[1], 90, 38, labels[i], '1103 11000KV'));
  wire(fc.x, fc.cy - 8, motors[0].x + motors[0].w, motors[0].cy, COL.power, '3-phase');
  wire(fc.x, fc.cy + 8, motors[1].x + motors[1].w, motors[1].cy, COL.power, '3-phase');
  wire(fc.x + fc.w, fc.cy - 8, motors[2].x, motors[2].cy, COL.power, '3-phase');
  wire(fc.x + fc.w, fc.cy + 8, motors[3].x, motors[3].cy, COL.power, '3-phase');
  const rx = box(60, top + 290, 130, 45, 'RX ESP32 (onboard)', 'ESP32-C3 Super Mini, SBUS out');
  wire(fc.x + 20, fc.y + fc.h, rx.cx, rx.y, COL.signal, 'SBUS+5V+GND');
  const servo = box(290, top + 290, 130, 45, 'Payload Servo', 'SG90 9g, latch release');
  wire(fc.x + fc.w - 20, fc.y + fc.h, servo.cx, servo.y, COL.signal, 'PWM+5V+GND');
  const wireless = '#8e44ad';
  const tx = box(60, top + 365, 150, 45, 'TX ESP32 (handheld)', 'DevKit + sticks/switches, off-board');
  doc.save().dash(3, { space: 2 }).moveTo(tx.cx, tx.y).lineTo(rx.cx, rx.y + rx.h).lineWidth(1.6).stroke(wireless).undash().restore();
  doc.fontSize(6).fillColor(wireless).font('Helvetica-Bold').text('ESP-NOW (wireless)', tx.cx - 32, (tx.y + rx.y + rx.h) / 2 - 6, { width: 64, align: 'center' });
  const legendY = top + 430;
  doc.fontSize(8.5).font('Helvetica-Bold').fillColor(COL.text).text('Legend', 40, legendY);
  const items = [[COL.power, 'VBAT - battery voltage (7.6V, 2S HV)'], [COL.signal, 'Signal (SBUS, PWM) + regulated 5V from FC/ESC onboard BEC'], [wireless, 'ESP-NOW wireless link (2.4GHz WiFi, no physical connection)']];
  let ly = legendY + 16;
  for (const [c, l] of items) { doc.moveTo(40, ly).lineTo(62, ly).lineWidth(2.5).stroke(c); doc.fontSize(7.5).font('Helvetica').fillColor(COL.text).text(l, 68, ly - 4, { width: 420 }); ly += 15; }
  doc.fontSize(7).font('Helvetica-Oblique').fillColor('#888').text('GND is common across all wired components (single ground reference). Motor phase wires soldered direct - no bullet connectors needed at this current level. The TX ESP32 is powered separately (USB power bank), not from the drone battery.', 40, ly + 8, { width: W - 80 });
}

// ================= references =================
function renderReferences() {
  const files = ['Research/Existing_Projects.md', 'Mechanical/Frame_Design.md', 'Mechanical/Payload_Mechanism.md', 'Electrical/Electrical_Architecture.md', 'Research/Concept_Comparison.md'];
  const seen = new Map();
  for (const f of files) {
    let text; try { text = readMd(f); } catch (e) { continue; }
    const re = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g; let m;
    while ((m = re.exec(text)) !== null) { const [, label, url] = m; if (!seen.has(url)) seen.set(url, label); }
  }
  const entries = Array.from(seen.entries());
  para(`${entries.length} unique real sources cited, found through online research on 2026-08-30.`);
  let n = 1;
  for (const [url, label] of entries) {
    ensureSpace(12);
    doc.font('Helvetica-Bold').fontSize(8).text(`[${n}] `, MARGIN, doc.y, { continued: true, width: 500 });
    doc.font('Helvetica').fillColor('#1a1a1a').text(`${label} - `, { continued: true });
    doc.fillColor('#1f5aa8').text(url, { link: url, underline: true });
    doc.fillColor('#1a1a1a'); doc.moveDown(0.1); n++;
  }
}

// ================= finalize =================
function finalize() {
  const range = doc.bufferedPageRange(); const total = range.count;
  for (let idx = 0; idx < total; idx++) {
    doc.switchToPage(idx);
    if (idx === 0) continue;
    const savedBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc.font('Helvetica').fontSize(8).fillColor('#888');
    doc.text(`Drone Project - Micro Quadrotor with Payload Release        Page ${idx + 1} of ${total}`, MARGIN, doc.page.height - 30, { width: doc.page.width - MARGIN * 2, align: 'center', lineBreak: false });
    doc.page.margins.bottom = savedBottom;
  }
  doc.switchToPage(tocPage - 1);
  doc.y = tocStartY;
  doc.font('Helvetica').fontSize(10).fillColor('#1a1a1a');
  for (const s of sectionPageMap) {
    const y0 = doc.y;
    doc.font('Helvetica-Bold').text(`${s.num}.`, MARGIN, y0, { width: 30 });
    doc.font('Helvetica').text(s.title, MARGIN + 32, y0, { width: doc.page.width - MARGIN * 2 - 100 });
    doc.font('Helvetica').text(String(s.page), doc.page.width - MARGIN - 40, y0, { width: 40, align: 'right' });
    doc.moveDown(0.6);
  }
  for (const s of sectionPageMap) doc.outline.addItem(`${s.num}. ${s.title}`, { pageNumber: s.page - 1 });
  doc.end();
  console.log('Report written:', OUT, '| pages:', total, '| sections:', sectionPageMap.length);
}
finalize();
