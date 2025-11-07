"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, X, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import * as z from "zod";

const equipmentLogFormSchema = z.object({
  equipmentId: z.string().min(1, "Equipment is required"),
  operatorId: z.string().min(1, "Operator is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

type EquipmentLogFormData = z.infer<typeof equipmentLogFormSchema>;

export interface EquipmentLogData {
  tempId?: string;
  equipmentId: string;
  equipmentName: string;
  operatorId?: string;
  operator: string;
  quantity: number;
}

interface EquipmentLogEditableRowProps {
  equipmentLog?: EquipmentLogData;
  equipment: { value: string; label: string }[];
  operators: { value: string; label: string }[];
  mode: "view" | "edit" | "create";
  onSave: (data: EquipmentLogFormData & { equipmentName: string; operator: string }) => void;
  onCancel: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const EquipmentLogEditableRow = ({
  equipmentLog,
  equipment,
  operators,
  mode,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: EquipmentLogEditableRowProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EquipmentLogFormData>({
    resolver: zodResolver(equipmentLogFormSchema),
    defaultValues: equipmentLog
      ? {
          equipmentId: equipmentLog.equipmentId,
          operatorId: equipmentLog.operatorId || "",
          quantity: equipmentLog.quantity,
        }
      : {
          equipmentId: "",
          operatorId: "",
          quantity: 1,
        },
  });

  const onSubmit = (data: EquipmentLogFormData) => {
    const selectedEquipment = equipment.find((eq) => eq.value === data.equipmentId);
    const selectedOperator = operators.find((op) => op.value === data.operatorId);
    
    onSave({
      ...data,
      equipmentName: selectedEquipment?.label || "",
      operator: selectedOperator?.label || "",
    });
  };

  if (mode === "view" && equipmentLog) {
    return (
      <TableRow className="hover:bg-muted/50">
        <TableCell className="font-medium">{equipmentLog.equipmentName}</TableCell>
        <TableCell>{equipmentLog.operator}</TableCell>
        <TableCell className="text-center">
          <Badge variant="outline" className="text-xs">
            {equipmentLog.quantity}
          </Badge>
        </TableCell>
        <TableCell className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  }

  // Edit or Create Mode
  return (
    <TableRow className="bg-primary/5 border-l-4 border-primary">
      <TableCell className="min-w-[200px]">
        <Select
          value={watch("equipmentId")}
          onValueChange={(value) => setValue("equipmentId", value)}
        >
          <SelectTrigger className={errors.equipmentId ? "border-destructive" : ""}>
            <SelectValue placeholder="Select equipment" />
          </SelectTrigger>
          <SelectContent>
            {equipment.map((eq) => (
              <SelectItem key={eq.value} value={eq.value}>
                {eq.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.equipmentId && (
          <p className="text-xs text-destructive mt-1">{errors.equipmentId.message}</p>
        )}
      </TableCell>

      <TableCell className="min-w-[200px]">
        <Select
          value={watch("operatorId")}
          onValueChange={(value) => setValue("operatorId", value)}
        >
          <SelectTrigger className={errors.operatorId ? "border-destructive" : ""}>
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            {operators.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.operatorId && (
          <p className="text-xs text-destructive mt-1">{errors.operatorId.message}</p>
        )}
      </TableCell>

      <TableCell className="min-w-[120px]">
        <Input
          {...register("quantity", {
            setValueAs: (val) => {
              const num = Number(val);
              return isNaN(num) ? 1 : num;
            },
          })}
          type="number"
          min="1"
          placeholder="1"
          className={errors.quantity ? "border-destructive" : ""}
        />
        {errors.quantity && (
          <p className="text-xs text-destructive mt-1">{errors.quantity.message}</p>
        )}
      </TableCell>

      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            className="h-8 gap-1"
          >
            <Check className="h-3 w-3" />
            Save
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="h-8 gap-1"
          >
            <X className="h-3 w-3" />
            Cancel
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EquipmentLogEditableRow;
