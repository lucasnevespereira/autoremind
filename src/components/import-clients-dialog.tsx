"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ExcelJS from "exceljs";
import { importClients } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { normalize } from "path";
import { normalizePhone } from "@/lib/import-utils";

export function ImportClientsDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        setError("Erro ao importar clientes.");
      } else {
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao ler o ficheiro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Importar Excel
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar clientes de Excel</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
              className="border rounded p-2 w-full"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="ghost">
              Cancelar
            </Button>

            <Button disabled>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "A importar..." : "A importar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
