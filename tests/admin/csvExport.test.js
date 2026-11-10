// CSV backups of the internal area. Names typed in the public reminder form reach these files, so a cell that a
// spreadsheet would run as a formula must open as plain text (CSV formula injection).
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCsvText, downloadCSV, escapeCsvCell, neutralizeCsvFormula } from "../../src/admin/csvExport.js";

describe("neutralizeCsvFormula", () => {
  it("adds a single quote before text that starts with =, +, -, @, a tab or a carriage return", () => {
    expect(neutralizeCsvFormula("=1+1")).toBe("'=1+1");
    expect(neutralizeCsvFormula("+5517999999999")).toBe("'+5517999999999");
    expect(neutralizeCsvFormula("-2+3")).toBe("'-2+3");
    expect(neutralizeCsvFormula("@SUM(A1:A9)")).toBe("'@SUM(A1:A9)");
    expect(neutralizeCsvFormula("\t=1+1")).toBe("'\t=1+1");
    expect(neutralizeCsvFormula("\r=1+1")).toBe("'\r=1+1");
  });

  it("keeps ordinary text, even with those characters after the first position", () => {
    expect(neutralizeCsvFormula("Maria Silva")).toBe("Maria Silva");
    expect(neutralizeCsvFormula("AVCB = renovação")).toBe("AVCB = renovação");
    expect(neutralizeCsvFormula("maria@exemplo.com")).toBe("maria@exemplo.com");
    expect(neutralizeCsvFormula("")).toBe("");
  });
});

describe("escapeCsvCell", () => {
  it("quotes every cell and doubles the quotes inside it", () => {
    expect(escapeCsvCell('Loja "Central"')).toBe('"Loja ""Central"""');
  });

  it("writes empty cells for null and undefined, and numbers and booleans as text", () => {
    expect(escapeCsvCell(null)).toBe('""');
    expect(escapeCsvCell(undefined)).toBe('""');
    expect(escapeCsvCell(36)).toBe('"36"');
    expect(escapeCsvCell(false)).toBe('"false"');
  });

  it("neutralizes a formula before quoting it", () => {
    expect(escapeCsvCell('=HYPERLINK("http://exemplo.com","Clique")')).toBe(
      '"\'=HYPERLINK(""http://exemplo.com"",""Clique"")"'
    );
  });
});

describe("buildCsvText", () => {
  it("writes the header and one line per row, separated by semicolons", () => {
    const csv = buildCsvText([
      { nome: "Ana", cidade: "Ibirá" },
      { nome: "Bruno", cidade: "Catanduva" },
    ]);
    expect(csv).toBe('nome;cidade\n"Ana";"Ibirá"\n"Bruno";"Catanduva"');
  });

  it("protects the reminder requests sent from the public site (lembretes_site)", () => {
    const csv = buildCsvText([
      { nome: "=cmd|' /C calc'!A0", whatsapp: "5517999999999", documento: "@AVCB", consentimento: true, tratado: false },
    ]);
    expect(csv.split("\n")[0]).toBe("nome;whatsapp;documento;consentimento;tratado");
    expect(csv.split("\n")[1]).toBe(`"'=cmd|' /C calc'!A0";"5517999999999";"'@AVCB";"true";"false"`);
  });

  it("uses every column found in the rows, so no field is lost when a record lacks one", () => {
    const csv = buildCsvText([{ nome: "Ana" }, { nome: "Bruno", email: "bruno@exemplo.com" }]);
    expect(csv).toBe('nome;email\n"Ana";""\n"Bruno";"bruno@exemplo.com"');
  });
});

describe("downloadCSV", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("downloads the file with a BOM, so Excel shows the accents", async () => {
    const link = { click: vi.fn() };
    vi.stubGlobal("document", { createElement: vi.fn(() => link) });
    const createObjectURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:csv");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    downloadCSV("lembretes_site.csv", [{ nome: "=1+1" }]);

    const blob = createObjectURL.mock.calls[0][0];
    expect(link.download).toBe("lembretes_site.csv");
    expect(link.click).toHaveBeenCalledOnce();
    expect(blob.type).toBe("text/csv;charset=utf-8");
    const text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await blob.arrayBuffer());
    expect(text).toBe("﻿nome\n\"'=1+1\"");
  });

  it("does nothing for an empty table", () => {
    const createElement = vi.fn();
    vi.stubGlobal("document", { createElement });
    downloadCSV("clientes.csv", []);
    expect(createElement).not.toHaveBeenCalled();
  });
});
