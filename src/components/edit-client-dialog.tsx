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
import { updateClient } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState, FormEvent } from "react";
import { Edit } from "lucide-react";

interface EditClientDialogProps {
  client: {
    id: number;
    name: string;
    phone: string;
    car: string;
    revisionDate: Date;
  };
}

export function EditClientDialog({ client }: EditClientDialogProps) {
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
    if (!name?.trim()) newErrors.name = "Name is required";
    if (!phone?.trim()) newErrors.phone = "Phone is required";
    if (!car?.trim()) newErrors.car = "Car is required";
    if (!revisionDate) newErrors.revisionDate = "Date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await updateClient(client.id, formData);
    setLoading(false);

    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
      setOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  }

  // Format date for input (YYYY-MM-DD)
  const formattedDate = client.revisionDate.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4 text-gray-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>
            Update the client details
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
              defaultValue={client.name}
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
              defaultValue={client.phone}
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
              defaultValue={client.car}
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
              defaultValue={formattedDate}
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
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
