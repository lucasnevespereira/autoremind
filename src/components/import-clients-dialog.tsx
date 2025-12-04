"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ExcelJS from "exceljs";
import { importClients } from "@/app/actions";
import { Loader2, Upload, FileSpreadsheet, Info, ChevronDown, ChevronUp } from "lucide-react";
import {
  normalizePhone,
  normalizeHeader,
  normalizeRow,
} from "@/lib/import-utils";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";

export function ImportClientsDialog() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showExample, setShowExample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    try {
      setLoading(true);
      setError("");

      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);

      const sheet = workbook.worksheets[0];
      const rows: any[] = [];

      // Read header row to map column indexes
      const headerRow = sheet.getRow(1);
      const columnIndexes: Record<string, number> = {};

      headerRow.eachCell((cell, colNumber) => {
        const header = String(cell.value || "").trim();
        const normalized = normalizeHeader(header);
        if (normalized) {
          columnIndexes[normalized] = colNumber;
        }
      });

      console.log("Column indexes detected:", columnIndexes);

      // Process data rows
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // skip header row

        const normalizedRow = normalizeRow(row, columnIndexes);
        if (!normalizedRow) {
          console.log(`Row ${rowNumber} skipped - invalid data`);
          return;
        }

        console.log(`Row ${rowNumber} raw phone from Excel:`, normalizedRow.phone);
        const formattedPhone = normalizePhone(normalizedRow.phone);
        console.log(`Row ${rowNumber} formatted phone:`, formattedPhone);
        if (!formattedPhone) {
          console.log(`Row ${rowNumber} skipped - invalid phone`);
          return;
        }

        const rowData = {
          name: normalizedRow.name,
          email: normalizedRow.email,
          phone: formattedPhone,
          resource: normalizedRow.resource,
          reminderDate: normalizedRow.reminderDate,
        };

        console.log(`Row ${rowNumber}:`, rowData);
        rows.push(rowData);
      });

      console.log(`Total rows to import: ${rows.length}`);

      if (rows.length === 0) {
        setError(t("noValidRows"));
        setLoading(false);
        return;
      }

      const result = await importClients(rows);

      if (!result.success) {
        const errorMsg = result.errorKey
          ? t(result.errorKey as any)
          : t("errorImportingClients");
        setError(errorMsg);
        console.error("Import error:", result);
      } else {
        toast({
          title: t("success"),
          description: `${rows.length} ${t("clientsImportedSuccess")}`,
        });
        setOpen(false);
        setSelectedFile(null);
      }
    } catch (err) {
      console.error("Import exception:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`${t("errorReadingFile")}: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        {t("importExcel")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">{t("importClients")}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t("importFromExcel")}
            </DialogDescription>
          </DialogHeader>

          {/* Format Information - Compact */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mt-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-xs flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">
                    {t("excelFormatRequired")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowExample(!showExample)}
                    className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    <span className="text-[11px]">{showExample ? t("hideExample") : t("viewExample")}</span>
                    {showExample ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                </div>

                <p className="text-muted-foreground text-[11px]">
                  {t("excelFormatDescription")}
                </p>

                {showExample && (
                  <div className="pt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    {/* Example table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-[10px] border-collapse bg-card/50 rounded">
                        <thead>
                          <tr className="border-b border-primary/20">
                            <th className="px-2 py-1 text-left font-mono font-semibold text-primary">Nome</th>
                            <th className="px-2 py-1 text-left font-mono font-semibold text-primary/60">Email*</th>
                            <th className="px-2 py-1 text-left font-mono font-semibold text-primary">Telemóvel</th>
                            <th className="px-2 py-1 text-left font-mono font-semibold text-primary">Recurso</th>
                            <th className="px-2 py-1 text-left font-mono font-semibold text-primary">Data</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-primary/10">
                            <td className="px-2 py-1 text-muted-foreground">João Silva</td>
                            <td className="px-2 py-1 text-muted-foreground/60">joao@email.com</td>
                            <td className="px-2 py-1 text-muted-foreground">912345678</td>
                            <td className="px-2 py-1 text-muted-foreground">Toyota Camry</td>
                            <td className="px-2 py-1 text-muted-foreground">15/12/2025</td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 text-muted-foreground">Marie Dupont</td>
                            <td className="px-2 py-1 text-muted-foreground/60">-</td>
                            <td className="px-2 py-1 text-muted-foreground">0612345678</td>
                            <td className="px-2 py-1 text-muted-foreground">Audi A4</td>
                            <td className="px-2 py-1 text-muted-foreground">20/01/2026</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="text-[10px] text-muted-foreground/70 italic">
                      * {t("optional")} • {t("excelColumnFlexible")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              disabled={loading}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-colors hover:border-primary/50 hover:bg-accent/5
                ${loading ? "opacity-50 cursor-not-allowed" : ""}
                ${error ? "border-destructive" : "border-border/40"}
              `}
            >
              <div className="flex flex-col items-center gap-3">
                {selectedFile ? (
                  <>
                    <FileSpreadsheet className="h-10 w-10 text-primary" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {t("chooseFile")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        .xlsx, .xls
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("importing")}
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setSelectedFile(null);
                setError("");
              }}
              disabled={loading}
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleImport}
              disabled={!selectedFile || loading}
            >
              {loading ? t("importing") : t("importClients")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
