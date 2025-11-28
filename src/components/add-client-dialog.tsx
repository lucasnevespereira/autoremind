"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addClient } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState, FormEvent } from "react";
import { Plus } from "lucide-react";

export function AddClientDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const car = formData.get("car") as string;
    const revisionDate = formData.get("revisionDate") as string;

    // Validate
    const newErrors: Record<string, string> = {};
    if (!name?.trim()) newErrors.name = "Nome é obrigatório";
    if (!phone?.trim()) newErrors.phone = "Telemóvel é obrigatório";
    if (!car?.trim()) newErrors.car = "Carro é obrigatório";
    if (!revisionDate) newErrors.revisionDate = "Data é obrigatória";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await addClient(formData);
    setLoading(false);

    if (result.success) {
      toast({
        title: "Sucesso!",
        description: result.message,
      });
      setOpen(false);
      // Reset form
      (e.target as HTMLFormElement).reset();
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: result.error,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Enter client details to schedule maintenance reminders
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Client Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. John Smith"
              className={errors.name ? "border-red-300 focus-visible:ring-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-600">Name is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g. +351912345678"
              className={errors.phone ? "border-red-300 focus-visible:ring-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-600">Phone is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="car" className="text-sm font-medium">
              Car Model
            </Label>
            <Input
              id="car"
              name="car"
              type="text"
              placeholder="e.g. Toyota Camry 2020"
              className={errors.car ? "border-red-300 focus-visible:ring-red-500" : ""}
            />
            {errors.car && <p className="text-sm text-red-600">Car is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="revisionDate" className="text-sm font-medium">
              Maintenance Date
            </Label>
            <Input
              id="revisionDate"
              name="revisionDate"
              type="date"
              className={errors.revisionDate ? "border-red-300 focus-visible:ring-red-500" : ""}
            />
            {errors.revisionDate && <p className="text-sm text-red-600">Date is required</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Saving..." : "Save Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
