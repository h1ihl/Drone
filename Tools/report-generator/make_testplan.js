const ExcelJS = require('exceljs');
const { tests, kpis } = require('./testplan_data');

async function main() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Test Plan');
  ws.columns = [
    { header: 'Test', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 26 },
    { header: 'Procedure', key: 'procedure', width: 55 },
    { header: 'Measured / Success Criteria', key: 'criteria', width: 45 },
    { header: 'Result (fill in during testing)', key: 'result', width: 45 },
  ];
  ws.getRow(1).font = { bold: true };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
  ws.autoFilter = { from: 'A1', to: 'E1' };
  for (const t of tests) {
    const [id, name, procedure, criteria, result] = t;
    ws.addRow({ id, name, procedure, criteria, result });
  }

  const ws2 = wb.addWorksheet('KPI Summary');
  ws2.columns = [
    { header: 'KPI', key: 'kpi', width: 34 },
    { header: 'Pre-Test Value', key: 'pre', width: 45 },
    { header: 'Measured', key: 'meas', width: 34 },
  ];
  ws2.getRow(1).font = { bold: true };
  ws2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
  for (const k of kpis) ws2.addRow({ kpi: k[0], pre: k[1], meas: k[2] });

  await wb.xlsx.writeFile(process.argv[2]);
  console.log('Test plan written:', process.argv[2]);
}
main().catch(e => { console.error(e); process.exit(1); });
