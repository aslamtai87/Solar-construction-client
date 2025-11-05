"use client";

import React, { useState } from "react";
import { Plus, Users, Trash2, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import { Labourer } from "@/lib/types/production";

const labourerSeparateSchema = z.object({
  type: z.string().min(1, "Labourer type is required"),
  baseRate: z.number().min(0, "Base rate must be positive"),
  fringeRate: z.number().min(0, "Fringe rate must be positive"),
});

const labourerTotalSchema = z.object({
  type: z.string().min(1, "Labourer type is required"),
  totalRate: z.number().min(0, "Total rate must be positive"),
});

type LabourerSeparateForm = z.infer<typeof labourerSeparateSchema>;
type LabourerTotalForm = z.infer<typeof labourerTotalSchema>;

interface LabourerManagementProps {
  labourers: Labourer[];
  onAddLabourer: (labourer: Omit<Labourer, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateLabourer: (id: string, labourer: Partial<Labourer>) => void;
  onDeleteLabourer: (id: string) => void;
}

export const LabourerManagement: React.FC<LabourerManagementProps> = ({
  labourers,
  onAddLabourer,
  onUpdateLabourer,
  onDeleteLabourer,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLabourer, setEditingLabourer] = useState<Labourer | null>(null);
  const [entryMode, setEntryMode] = useState<"separate" | "total">("separate");

  const separateForm = useForm<LabourerSeparateForm>({
    resolver: zodResolver(labourerSeparateSchema),
    defaultValues: {
      type: "",
      baseRate: 0,
      fringeRate: 0,
    },
  });

  const totalForm = useForm<LabourerTotalForm>({
    resolver: zodResolver(labourerTotalSchema),
    defaultValues: {
      type: "",
      totalRate: 0,
    },
  });

  const handleOpenDialog = (labourer?: Labourer) => {
    if (labourer) {
      setEditingLabourer(labourer);
      const mode = labourer.fringeRate === 0 ? "total" : "separate";
      setEntryMode(mode);
      
      if (mode === "separate") {
        separateForm.reset({
          type: labourer.type,
          baseRate: labourer.baseRate,
          fringeRate: labourer.fringeRate,
        });
      } else {
        totalForm.reset({
          type: labourer.type,
          totalRate: labourer.totalRate,
        });
      }
    } else {
      setEditingLabourer(null);
      setEntryMode("separate");
      separateForm.reset({ type: "", baseRate: 0, fringeRate: 0 });
      totalForm.reset({ type: "", totalRate: 0 });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingLabourer(null);
    separateForm.reset();
    totalForm.reset();
  };

  const handleSubmitSeparate = (data: LabourerSeparateForm) => {
    const labourerData = {
      type: data.type,
      baseRate: data.baseRate,
      fringeRate: data.fringeRate,
      totalRate: data.baseRate + data.fringeRate,
    };

    if (editingLabourer) {
      onUpdateLabourer(editingLabourer.id, labourerData);
    } else {
      onAddLabourer(labourerData);
    }
    handleCloseDialog();
  };

  const handleSubmitTotal = (data: LabourerTotalForm) => {
    const labourerData = {
      type: data.type,
      baseRate: data.totalRate,
      fringeRate: 0,
      totalRate: data.totalRate,
    };

    if (editingLabourer) {
      onUpdateLabourer(editingLabourer.id, labourerData);
    } else {
      onAddLabourer(labourerData);
    }
    handleCloseDialog();
  };

  const baseRate = separateForm.watch("baseRate");
  const fringeRate = separateForm.watch("fringeRate");
  const calculatedTotal = (baseRate || 0) + (fringeRate || 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Labourer Types</h3>
          <p className="text-sm text-muted-foreground">
            Manage labourer types with their hourly wage rates
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Labourer Type
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Labourer Type</TableHead>
                <TableHead className="text-right">Base Rate ($/hr)</TableHead>
                <TableHead className="text-right">Fringe ($/hr)</TableHead>
                <TableHead className="text-right">Total ($/hr)</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labourers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No labourer types added yet</p>
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Labourer Type
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                labourers.map((labourer) => (
                  <TableRow key={labourer.id}>
                    <TableCell className="font-medium">{labourer.type}</TableCell>
                    <TableCell className="text-right">${labourer.baseRate.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${labourer.fringeRate.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">${labourer.totalRate.toFixed(2)}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(labourer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteLabourer(labourer.id)}>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingLabourer ? "Edit Labourer Type" : "Add Labourer Type"}</DialogTitle>
            <DialogDescription>Enter wage information using separate rates or total rate</DialogDescription>
          </DialogHeader>

          <Tabs value={entryMode} onValueChange={(v) => setEntryMode(v as "separate" | "total")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="separate">Separate Rates</TabsTrigger>
              <TabsTrigger value="total">Total Rate</TabsTrigger>
            </TabsList>

            <TabsContent value="separate" className="space-y-4">
              <form onSubmit={separateForm.handleSubmit(handleSubmitSeparate)} className="space-y-4">
                <FormFieldWrapper name="type" control={separateForm.control} label="Labourer Type" placeholder="e.g., Electrician, Installer, Foreman" />
                <FormFieldWrapper name="baseRate" control={separateForm.control} label="Base Rate ($/hr)" type="number" placeholder="25.00" min={0} />
                <FormFieldWrapper name="fringeRate" control={separateForm.control} label="Fringe Rate ($/hr)" type="number" placeholder="5.00" min={0} description="Benefits, insurance, etc." />

                <div className="rounded-lg bg-muted p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Rate:</span>
                    <Badge variant="outline" className="text-base">${calculatedTotal.toFixed(2)}/hr</Badge>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                  <Button type="submit">{editingLabourer ? "Update" : "Add"} Labourer</Button>
                </DialogFooter>
              </form>
            </TabsContent>

            <TabsContent value="total" className="space-y-4">
              <form onSubmit={totalForm.handleSubmit(handleSubmitTotal)} className="space-y-4">
                <FormFieldWrapper name="type" control={totalForm.control} label="Labourer Type" placeholder="e.g., Electrician, Installer, Foreman" />
                <FormFieldWrapper name="totalRate" control={totalForm.control} label="Total Rate ($/hr)" type="number" placeholder="30.00" min={0} description="Total hourly rate including all costs" />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                  <Button type="submit">{editingLabourer ? "Update" : "Add"} Labourer</Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};
