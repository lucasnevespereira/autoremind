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
import { Loader2, Upload, FileSpreadsheet } from "lucide-react";
import { normalize } from "path";
import { normalizePhone } from "@/lib/import-utils";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";

export function ImportClientsDialog() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // skip header row

        const name = row.getCell(1).value?.toString() || "";
        const car = row.getCell(2).value?.toString() || "";
        const phone = row.getCell(3).value?.toString() || "";
        const revisionDate = row.getCell(4).value;
        const formattedPhone = normalizePhone(phone);
        console.log({ name, car, phone, formattedPhone, revisionDate });

        if (!name || !formattedPhone || !car || !revisionDate) return;

        rows.push({
          name,
          phone: formattedPhone,
          car,
          revisionDate,
        });
      });

      const result = await importClients(rows);

      if (!result.success) {
        setError(t("errorImportingClients"));
      } else {
        toast({
          title: t("success"),
          description: `${rows.length} ${t("clientsImportedSuccess")}`,
        });
        setOpen(false);
        setSelectedFile(null);
      }
    } catch (err) {
      console.error(err);
      setError(t("errorReadingFile"));
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

          <div className="space-y-4 mt-4">
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
