"use client";

import React, { useState } from "react";
import { Plus, Wrench, Trash2, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import { FormSelectField } from "@/components/global/Form/FormSelectField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Equipment,
  EquipmentPricingPeriod,
  GetEquipment,
} from "@/lib/types/production";
import {
  useUpdateEquipment,
  useCreateEquipment,
  useGetEquipment,
  useDeleteEquipment,
} from "@/hooks/ReactQuery/useSchedule";
import { useProjectStore } from "@/store/projectStore";
import { GenericTable } from "@/components/global/Table/GenericTable";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import { useDebounce } from "@/hooks/useDebounce";
import { useDialog } from "@/hooks/useDialog";
import DeleteDialog from "@/components/global/DeleteDialog";

const equipmentSchema = z.object({
  name: z.string().min(1, "Equipment name is required"),
  price: z.number("Price must be a valid number").min(0.01, "Price must be greater than 0"),
  pricingType: z.enum(EquipmentPricingPeriod),
});

type EquipmentForm = z.infer<typeof equipmentSchema>;

const pricingPeriodLabels: Record<EquipmentPricingPeriod, string> = {
  [EquipmentPricingPeriod.PER_DAY]: "Per Day",
  [EquipmentPricingPeriod.PER_WEEK]: "Per Week",
  [EquipmentPricingPeriod.PER_MONTH]: "Per Month",
};

export const EquipmentManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<GetEquipment | null>(
    null
  );
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

  const { mutate: onAddEquipment } = useCreateEquipment();
  const { mutate: onUpdateEquipment } = useUpdateEquipment();
  const { mutate: onDeleteEquipment } = useDeleteEquipment();
  const { dialog: deleteDialog, openEditDialog: openDeleteDialog, closeDialog } = useDialog<GetEquipment>();
  const { data: equipmentData, isLoading } = useGetEquipment({
    limit: 10,
    projectId: selectedProject?.id || "",
    cursor: cursor || undefined,
    search: debouncedSearch || undefined,
  });

  const form = useForm<EquipmentForm>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: "",
      price: undefined,
      pricingType: EquipmentPricingPeriod.PER_DAY,
    },
  });

  const handleOpenDialog = (equip?: GetEquipment) => {
    if (equip) {
      setEditingEquipment(equip);
      form.reset({
        name: equip.name,
        price: Number(equip.price),
        pricingType: equip.pricingType as EquipmentPricingPeriod,
      });
    } else {
      setEditingEquipment(null);
      form.reset({
        name: "",
        price: undefined,
        pricingType: EquipmentPricingPeriod.PER_DAY,
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
      onUpdateEquipment({ id: editingEquipment.id, data });
    } else {
      if (!selectedProject) {
        handleCloseDialog();
        return;
      }
      onAddEquipment({
        ...data,
        projectId: selectedProject.id,
        description: "",
      });
    }
    handleCloseDialog();
  };

  const columns = [
    {
      key: "name",
      header: "Equipment Name",
      render: (item: GetEquipment) => (
        <div className="px-6 py-4 font-medium">{item.name}</div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (item: GetEquipment) => (
        <div className="px-6 py-4 ">
          <Badge variant="secondary">${item.price}</Badge>
        </div>
      ),
    },
    {
      key: "pricingType",
      header: "Pricing Period",
      render: (item: GetEquipment) => (
        <div className="px-6 py-4">
          <Badge variant="outline">
            {pricingPeriodLabels[item.pricingType as EquipmentPricingPeriod]}
          </Badge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: GetEquipment) => (
        <div className="px-4 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenDialog(item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDeleteDialog(item)}
            >
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
        data={equipmentData?.data.result || []}
        columns={columns}
        tableName="Equipment Types"
        tableDescription="Manage equipment with their daily rental rates"
        isLoading={isLoading}
        emptyMessage="No equipment added yet"
        searchText={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        searchPlaceholder="Search equipment..."
        showSearch={true}
        pagination={true}
        paginationData={equipmentData?.data.pagination}
        currentPageIndex={currentPageIndex}
        onNextPage={() => handleNextPage(equipmentData?.data.pagination.nextCursor || null)}
        onPreviousPage={handlePreviousPage}
        onFirstPage={handleFirstPage}
        hasNextPage={hasPrevPage(equipmentData?.data.pagination)}
        hasPreviousPage={hasPreviousPage}
        onAdd={() => handleOpenDialog()}
        addButtonText="Add Equipment"
        addButtonIcon={<Plus className="h-4 w-4" />}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEquipment ? "Edit Equipment" : "Add Equipment"}
            </DialogTitle>
            <DialogDescription>
              Enter equipment name and daily rental rate
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormFieldWrapper
              name="name"
              control={form.control}
              label="Equipment Name"
              placeholder="e.g., Scaffolding, Crane, Generator"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormFieldWrapper
                name="price"
                control={form.control}
                label="Price ($)"
                type="number"
                placeholder="150.00"
              />

              <FormSelectField
                name="pricingType"
                control={form.control}
                label="Pricing Period"
                placeholder="Select period"
                options={Object.entries(pricingPeriodLabels).map(
                  ([value, label]) => ({
                    value,
                    label,
                  })
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingEquipment ? "Update" : "Add"} Equipment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteDialog.open}
        onClose={closeDialog}
        onConfirm={() => {
          onDeleteEquipment(deleteDialog.data?.id!);
          closeDialog();
        }}
        title="Delete Equipment"
        description="Are you sure you want to delete this equipment? This action cannot be undone."
      />
    </div>
  );
};
