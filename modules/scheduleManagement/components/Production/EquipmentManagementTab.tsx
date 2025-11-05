"use client";

import React, { useState } from "react";
import { Plus, Wrench, Trash2, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Equipment } from "@/lib/types/production";

const equipmentSchema = z.object({
  name: z.string().min(1, "Equipment name is required"),
  pricePerDay: z.number().min(0, "Price must be positive"),
});

type EquipmentForm = z.infer<typeof equipmentSchema>;

interface EquipmentManagementProps {
  equipment: Equipment[];
  onAddEquipment: (equipment: Omit<Equipment, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  onDeleteEquipment: (id: string) => void;
}

export const EquipmentManagement: React.FC<EquipmentManagementProps> = ({
  equipment,
  onAddEquipment,
  onUpdateEquipment,
  onDeleteEquipment,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const form = useForm<EquipmentForm>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: "",
      pricePerDay: 0,
    },
  });

  const handleOpenDialog = (equip?: Equipment) => {
    if (equip) {
      setEditingEquipment(equip);
      form.reset({
        name: equip.name,
        pricePerDay: equip.pricePerDay,
      });
    } else {
      setEditingEquipment(null);
      form.reset({
        name: "",
        pricePerDay: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEquipment(null);
    form.reset();
  };

  const handleSubmit = (data: EquipmentForm) => {
    if (editingEquipment) {
      onUpdateEquipment(editingEquipment.id, data);
    } else {
      onAddEquipment(data);
    }
    handleCloseDialog();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Equipment Types</h3>
          <p className="text-sm text-muted-foreground">
            Manage equipment with their daily rental rates
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment Name</TableHead>
                <TableHead className="text-right">Price Per Day</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Wrench className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No equipment added yet</p>
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Equipment
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                equipment.map((equip) => (
                  <TableRow key={equip.id}>
                    <TableCell className="font-medium">{equip.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">${equip.pricePerDay.toFixed(2)}/day</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(equip)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteEquipment(equip.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEquipment ? "Edit Equipment" : "Add Equipment"}</DialogTitle>
            <DialogDescription>Enter equipment name and daily rental rate</DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormFieldWrapper name="name" control={form.control} label="Equipment Name" placeholder="e.g., Scaffolding, Crane, Generator" />
            <FormFieldWrapper name="pricePerDay" control={form.control} label="Price Per Day ($)" type="number" placeholder="150.00" min={0} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit">{editingEquipment ? "Update" : "Add"} Equipment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
