// CSV download for the internal area (semicolon separated, UTF-8 with BOM so Excel opens accents correctly).

export function downloadCSV(fileName, rows) {
  if (!rows.length) return;
  const columns = Object.keys(rows[0]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [columns.join(";"), ...rows.map((row) => columns.map((col) => esc(row[col])).join(";"))].join("\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
