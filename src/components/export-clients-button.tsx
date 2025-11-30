"use client";

import { exportClients } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";

export function ExportClientsButton() {
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const handleExport = async () => {
    setLoading(true);
    let lang = language;
    if (lang !== "en" && lang !== "pt") {
      lang = "en";
    }
    const result = await exportClients(lang);
    setLoading(false);

    if (!result.success) {
      alert("Erro ao exportar clientes.");
      return;
    }

    const link = document.createElement("a");
    link.href =
      "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
      result.file;
    link.download = "clientes.xlsx";
    link.click();
  };

  return (
    <Button onClick={handleExport} disabled={loading}>
      <FileDown className="w-4 h-4 mr-2" />
      {loading ? "A exportar..." : "Exportar Excel"}
    </Button>
  );
}
