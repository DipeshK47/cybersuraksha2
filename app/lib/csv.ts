/** Prefix spreadsheet formulas so student names and titles remain text in Excel. */
export function csvText(rows: (string | number)[][]) {
  return rows.map(row => row.map(value => {
    const text = String(value);
    const safe = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  }).join(",")).join("\r\n");
}

export function downloadCsv(name: string, rows: (string | number)[][]) {
  const url = URL.createObjectURL(new Blob(["\uFEFF", csvText(rows)], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
