"use client";

import React, { useState } from "react";
import { Plus, Users, Trash2, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { GetLabourer } from "@/lib/types/production";
import { useGetLabourers, useCreateLabourer, useUpdateLabourers } from "@/hooks/ReactQuery/useSchedule";
import { useProjectStore } from "@/store/projectStore";
import { GenericTable } from "@/components/global/Table/GenericTable";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import { useDebounce } from "@/hooks/useDebounce";

const labourerSeparateSchema = z.object({
  type: z.string().min(1, "Labourer name is required"),
  baseRate: z.number("Base rate must be valid rate").min(0.01, "Base rate must be greater than 0"),
  fringeRate: z.number("Fringe rate must be valid rate").min(0, "Fringe rate cannot be negative"),
});

const labourerTotalSchema = z.object({
  type: z.string().min(1, "Labourer name is required"),
  totalRate: z.number("Total rate must be valid rate").min(0.01, "Total rate must be greater than 0"),
});

type LabourerSeparateForm = z.infer<typeof labourerSeparateSchema>;
type LabourerTotalForm = z.infer<typeof labourerTotalSchema>;

export const LabourerManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLabourer, setEditingLabourer] = useState<GetLabourer | null>(null);
  const [entryMode, setEntryMode] = useState<"separate" | "total">("separate");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { selectedProject } = useProjectStore();

  const {
    cursor,
    currentPageIndex,
    handleNextPage,
    handlePreviousPage,
    handleFirstPage,
    hasNextPage: hasPrevPage,
    hasPreviousPage,
  } = useCursorPagination();

  const { data: labourerData, isLoading } = useGetLabourers({
    limit: 10,
    projectId: selectedProject?.id || "",
    cursor: cursor || undefined,
    search: debouncedSearch || undefined,
  });
  const { mutate: onAddLabourer } = useCreateLabourer();
  const { mutate: onUpdateLabourer } = useUpdateLabourers();

  const separateForm = useForm<LabourerSeparateForm>({
    resolver: zodResolver(labourerSeparateSchema),
    defaultValues: {
      type: "",
      baseRate: undefined,
      fringeRate: undefined,
    },
  });

  const totalForm = useForm<LabourerTotalForm>({
    resolver: zodResolver(labourerTotalSchema),
    defaultValues: {
      type: "",
      totalRate: undefined,
    },
  });

  const handleOpenDialog = (labourer?: GetLabourer) => {
    if (labourer) {
      setEditingLabourer(labourer);
      const mode = Number(labourer.fringeRate) === 0 ? "total" : "separate";
      setEntryMode(mode);
      
      if (mode === "separate") {
        separateForm.reset({
          type: labourer.name,
          baseRate: Number(labourer.baseRate),
          fringeRate: Number(labourer.fringeRate),
        });
      } else {
        totalForm.reset({
          type: labourer.name,
          totalRate: Number(labourer.totalRate),
        });
      }
    } else {
      setEditingLabourer(null);
      setEntryMode("separate");
      separateForm.reset({ type: "", baseRate: undefined, fringeRate: undefined });
      totalForm.reset({ type: "", totalRate: undefined });
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
      onUpdateLabourer({ id: editingLabourer.id, data: labourerData });
    } else {
      onAddLabourer({
        name: data.type,
        baseRate: data.baseRate,
        fringeRate: data.fringeRate,
        totalRate: data.baseRate + data.fringeRate,
        projectId: selectedProject?.id || "",
      });
    }
    handleCloseDialog();
  };

  const handleSubmitTotal = (data: LabourerTotalForm) => {
    const labourerData = {
      name: data.type,
      baseRate: 0,
      fringeRate: 0,
      totalRate: data.totalRate,
    };

    if (editingLabourer) {
      onUpdateLabourer({ id: editingLabourer.id, data: labourerData });
    } else {
      onAddLabourer({
        name: data.type,
        baseRate: data.totalRate,
        fringeRate: 0,
        totalRate: data.totalRate,
        projectId: selectedProject?.id || "",
      });
    }
    handleCloseDialog();
  };

  const baseRate = separateForm.watch("baseRate");
  const fringeRate = separateForm.watch("fringeRate");
  const calculatedTotal = (baseRate || 0) + (fringeRate || 0);

  const columns = [
    {
      key: "name",
      header: "Labourer Type",
      render: (item: GetLabourer) => (
        <div className="px-6 py-4 font-medium">{item.name}</div>
      ),
    },
    {
      key: "baseRate",
      header: "Base Rate ($/hr)",
      render: (item: GetLabourer) => (
        <div className="py-4 px-6">${Number(item.baseRate).toFixed(2)}</div>
      ),
    },
    {
      key: "fringeRate",
      header: "Fringe ($/hr)",
      render: (item: GetLabourer) => (
        <div className="py-4 px-6">${Number(item.fringeRate).toFixed(2)}</div>
      ),
    },
    {
      key: "totalRate",
      header: "Total ($/hr)",
      render: (item: GetLabourer) => (
        <div className="py-4 px-6">
          <Badge variant="secondary">${Number(item.totalRate).toFixed(2)}</Badge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: GetLabourer) => (
        <div className="py-4 px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {}}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ),
      className: "text-center",
    },
  ];

  return (
    <div className="space-y-4">
      <GenericTable
        data={labourerData?.data.result || []}
        columns={columns}
        tableName="Labourer Types"
        tableDescription="Manage labourer types with their hourly wage rates"
        isLoading={isLoading}
        emptyMessage="No labourer types added yet"
        searchText={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        searchPlaceholder="Search labourers..."
        showSearch={true}
        pagination={true}
        paginationData={labourerData?.data.pagination}
        currentPageIndex={currentPageIndex}
        onNextPage={() => handleNextPage(labourerData?.data.pagination.nextCursor || null)}
        onPreviousPage={handlePreviousPage}
        onFirstPage={handleFirstPage}
        hasNextPage={hasPrevPage(labourerData?.data.pagination)}
        hasPreviousPage={hasPreviousPage}
        onAdd={() => handleOpenDialog()}
        addButtonText="Add Labourer Type"
        addButtonIcon={<Plus className="h-4 w-4" />}
      />

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
                <FormFieldWrapper name="baseRate" control={separateForm.control} label="Base Rate ($/hr)" type="number" placeholder="25.00" min={0.01} />
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
                <FormFieldWrapper name="totalRate" control={totalForm.control} label="Total Rate ($/hr)" type="number" placeholder="30.00" min={0.01} description="Total hourly rate including all costs" />

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
