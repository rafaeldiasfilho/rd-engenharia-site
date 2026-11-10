// CSV download for the internal area (semicolon separated, UTF-8 with BOM so Excel opens accents correctly).
// CSV formula injection: names and documents typed in the public reminder form reach these files, and a
// spreadsheet runs any cell that starts with =, +, -, @, a tab or a carriage return as a formula.
// Such cells get a leading single quote, so they open as plain text.

import { downloadTextFile } from "./fileDownload.js";

const CSV_FORMULA_FIRST_CHARACTER = /^[=+\-@\t\r]/;

export function neutralizeCsvFormula(text) {
  return CSV_FORMULA_FIRST_CHARACTER.test(text) ? `'${text}` : text;
}

export function escapeCsvCell(value) {
  return `"${neutralizeCsvFormula(String(value ?? "")).replace(/"/g, '""')}"`;
}

// Header with every column found in the rows (demo records may lack some), then one line per row.
// Column names come from the database, never from visitors, so the header is not quoted.
export function buildCsvText(rows) {
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const lines = rows.map((row) => columns.map((column) => escapeCsvCell(row[column])).join(";"));
  return [columns.join(";"), ...lines].join("\n");
}

export function downloadCSV(fileName, rows) {
  if (!rows.length) return;
  downloadTextFile(fileName, "﻿" + buildCsvText(rows), "text/csv;charset=utf-8");
}
