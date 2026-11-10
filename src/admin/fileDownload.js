// Browser download of a text file built in memory (CSV backups and the expiry calendar of the internal area).

export function downloadTextFile(fileName, text, mimeType) {
  const url = URL.createObjectURL(new Blob([text], { type: mimeType }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
