import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Props {
  clients: Array<{
    id: number;
    name: string;
    phone: string;
    car: string;
    revisionDate: Date;
    reminderSent: boolean;
    createdAt: Date;
  }>;
}

export function DownloadCSVButton({ clients }: Props) {
  function handleDownload() {
    const headers = [
      "ID",
      "Name",
      "Phone",
      "Car",
      "Revision Date",
      "Reminder Sent",
      "Created At",
    ];
    const rows = clients.map((c) => [
      c.id,
      c.name,
      c.phone,
      c.car,
      c.revisionDate instanceof Date
        ? c.revisionDate.toISOString()
        : c.revisionDate,
      c.reminderSent ? "Yes" : "No",
      c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    ]);
    const csvContent = [headers, ...rows]
      .map((r) =>
        r
          .map(String)
          .map((x) => `"${x.replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      className="gap-1"
    >
      <Download className="w-4 h-4" />
      Exportar CSV
    </Button>
  );
}
