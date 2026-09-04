const ExcelJS = require('exceljs');
const { rows, priceCAD, USD_TO_CAD } = require('./bom_data');

function computeTotals() {
  let recommended = 0;
  for (const r of rows) {
    const [category, part, qty, spec, price, supplier, link, university, required, tier] = r;
    if (tier === 'Recommended') recommended += priceCAD(price) * qty;
  }
  const fcRec = rows.find(r => r[0] === 'Flight controller' && r[9] === 'Recommended');
  const motRec = rows.find(r => r[0] === 'Motors' && r[9] === 'Recommended');
  const fcAlt = rows.find(r => r[0].includes('Flight controller') && r[9] === 'Minimum');
  const motAlt = rows.find(r => r[0].includes('Motors') && r[9] === 'Minimum');
  const minimum = recommended - priceCAD(fcRec[4]) * fcRec[2] - priceCAD(motRec[4]) * motRec[2]
    + priceCAD(fcAlt[4]) * fcAlt[2] + priceCAD(motAlt[4]) * motAlt[2];
  let maxAdd = 0;
  for (const r of rows) if (r[9] === 'Maximum') maxAdd += priceCAD(r[4]) * r[2];
  const maximum = recommended + maxAdd;
  return {
    Minimum: Math.round(minimum * 100) / 100,
    Recommended: Math.round(recommended * 100) / 100,
    Maximum: Math.round(maximum * 100) / 100,
  };
}

async function main() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('BOM');
  ws.columns = [
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Part', key: 'part', width: 32 },
    { header: 'Qty', key: 'qty', width: 6 },
    { header: 'Specification', key: 'spec', width: 42 },
    { header: 'Cost (CAD)', key: 'costCAD', width: 12 },
    { header: 'Supplier', key: 'supplier', width: 26 },
    { header: 'Link', key: 'link', width: 45 },
    { header: 'University Available?', key: 'university', width: 20 },
    { header: 'Required?', key: 'required', width: 10 },
    { header: 'Tier', key: 'tier', width: 12 },
    { header: 'Component Type', key: 'componentType', width: 20 },
    { header: 'Verification', key: 'verified', width: 45 },
  ];
  ws.getRow(1).font = { bold: true };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
  ws.autoFilter = { from: 'A1', to: 'L1' };

  for (const r of rows) {
    const [category, part, qty, spec, price, supplier, link, university, required, tier, componentType, verified] = r;
    const unit = priceCAD(price);
    ws.addRow({ category, part, qty, spec, costCAD: unit * qty, supplier, link, university, required, tier, componentType, verified });
  }
  ws.getColumn('costCAD').numFmt = '$#,##0.00';

  const totals = computeTotals();
  ws.addRow({});
  const r1 = ws.addRow({ category: 'TOTAL — Minimum (cheapest flying config, brushed motors)', costCAD: totals.Minimum });
  const r2 = ws.addRow({ category: 'TOTAL — Recommended (brushless, meets 100-300g/20-100g payload target)', costCAD: totals.Recommended });
  const r3 = ws.addRow({ category: 'TOTAL — Maximum (Recommended + spares + charger/bag)', costCAD: totals.Maximum });
  [r1, r2, r3].forEach(r => { r.font = { bold: true }; r.getCell('costCAD').numFmt = '$#,##0.00'; });

  ws.addRow({});
  ws.addRow({ category: `Note: USD->CAD at 1 USD = ${USD_TO_CAD} CAD (2026-08-30). "University Available?" = CHECK INVENTORY items are shown at their real purchase price above but should be excluded from your actual out-of-pocket cost if available through U of C inventory. Minimum tier substitutes brushed motors + a brushed AIO FC for the Recommended tier's brushless motors + FC/ESC, per Electrical_Architecture.md; it cannot meet the 20-100g payload target.` });

  await wb.xlsx.writeFile(process.argv[2]);
  console.log('BOM written:', process.argv[2]);
  console.log('Totals (CAD):', totals);
}
main().catch(e => { console.error(e); process.exit(1); });
