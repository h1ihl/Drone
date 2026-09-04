# Report Generator

Node.js scripts (pdfkit + exceljs) that generate `Drone_Project_Guide.pdf`, `Electrical/Wiring_Diagram.pdf`, `BOM/BOM.xlsx`, and `Testing/Test_Plan.xlsx` from this repo's markdown source files. This is the actual source for those four files — edit the `.md` files (for the report/BOM/test-plan content) or `bom_data.js`/`testplan_data.js` (for BOM line items and test rows), then regenerate. Don't hand-edit the PDFs/xlsx directly; regenerate instead so they stay consistent with the markdown.

## Setup

```
npm install
```

## Regenerate everything

Run from this directory, writing output back to the project root:

```
node make_report.js   "../../Drone_Project_Guide.pdf"
node make_wiring.js   "../../Electrical/Wiring_Diagram.pdf"
node make_bom.js      "../../BOM/BOM.xlsx"
node make_testplan.js "../../Testing/Test_Plan.xlsx"
```

- `make_report.js` reads most of its content live from the project's `.md` files (Requirements, Research, Mechanical, Electrical, Resume, etc.) plus `bom_data.js`/`testplan_data.js` for the BOM/Testing tables. A few sections (Executive Summary, System Architecture, cost totals framing, wiring-diagram intro) are hand-written directly in the script and need manual updates when those change.
- `make_wiring.js` draws the standalone wiring diagram from scratch (no markdown source) — edit box labels/positions in the script directly.
- `bom_data.js` / `testplan_data.js` are the single source of truth for `BOM.xlsx` and `Test_Plan.xlsx`'s content — both the xlsx files and the report's BOM/Testing sections/cost totals are computed from these, so update them once and everything downstream stays consistent.

## Notes

- `PROJECT_DIR` at the top of `make_report.js` is hardcoded to this repo's path.
- pdfkit's standard fonts only support the WinAnsi/Latin-1 character set — avoid Unicode arrows (→ ↔), the approx sign (≈), or ≥/≤ in markdown that feeds the report; use ASCII (`->`, `<->`, `~`, `>=`, `<=`) instead, or they'll render as garbled glyphs.
