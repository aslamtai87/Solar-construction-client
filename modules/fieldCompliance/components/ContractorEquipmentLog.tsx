"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wrench, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import { SearchableSelect } from "@/components/global/SearchableSelect";
import { EquipmentLog } from "@/lib/types/dailyProductionLog";
import { Equipment } from "@/lib/types/production";
import { format } from "date-fns";

const equipmentLogSchema = z.object({
  equipmentId: z.string().min(1, "Equipment is required"),
  operator: z.string().min(1, "Operator name is required"),
  operatorId: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  hoursUsed: z.number().min(0).optional(),
  notes: z.string().optional(),
});

type EquipmentLogForm = z.infer<typeof equipmentLogSchema>;

interface EquipmentLogRow extends EquipmentLogForm {
  tempId: string;
}

interface ContractorEquipmentLogProps {
  equipment: Equipment[];
  operators: { value: string; label: string }[]; // List of labourers/staff
  projectId: string;
  date: string;
  onSave: (logs: EquipmentLogForm[]) => Promise<void>;
  existingLogs?: EquipmentLog[];
}

export const ContractorEquipmentLog: React.FC<ContractorEquipmentLogProps> = ({
  equipment,
  operators,
  projectId,
  date,
  onSave,
  existingLogs = [],
}) => {
  const [equipmentRows, setEquipmentRows] = useState<EquipmentLogRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [operatorSearchQuery, setOperatorSearchQuery] = useState<{ [key: string]: string }>({});

  const form = useForm<EquipmentLogForm>({
    resolver: zodResolver(equipmentLogSchema),
    defaultValues: {
      equipmentId: "",
      operator: "",
      operatorId: "",
      quantity: 1,
      hoursUsed: 0,
      notes: "",
    },
  });

  const equipmentOptions = equipment.map((eq) => ({
    value: eq.id,
    label: `${eq.name} - $${eq.price} ${eq.pricingPeriod}`,
  }));

  const handleAddEquipmentRow = () => {
    const tempId = `temp-${Date.now()}`;
    setEquipmentRows([
      ...equipmentRows,
      {
        tempId,
        equipmentId: "",
        operator: "",
        operatorId: "",
        quantity: 1,
        hoursUsed: 0,
        notes: "",
      },
    ]);
  };

  const handleRemoveRow = (tempId: string) => {
    setEquipmentRows(equipmentRows.filter((row) => row.tempId !== tempId));
  };

  const handleRowChange = (tempId: string, field: keyof EquipmentLogForm, value: any) => {
    setEquipmentRows(
      equipmentRows.map((row) =>
        row.tempId === tempId ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSaveAll = async () => {
    try {
      // Validate all rows
      const validRows = equipmentRows.filter(
        (row) => row.equipmentId && row.operator && row.quantity > 0
      );

      if (validRows.length === 0) {
        alert("Please add at least one equipment log with valid data");
        return;
      }

      await onSave(validRows);
      setEquipmentRows([]); // Clear form after save
      setOperatorSearchQuery({});
    } catch (error) {
      console.error("Error saving equipment logs:", error);
      alert("Failed to save equipment logs");
    }
  };

  const getEquipmentName = (equipmentId: string) => {
    const eq = equipment.find((e) => e.id === equipmentId);
    return eq ? eq.name : "";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Equipment Daily Log
              </CardTitle>
              <CardDescription>
                Log equipment usage for {format(new Date(date), "MMMM dd, yyyy")}
              </CardDescription>
            </div>
            <Button onClick={handleAddEquipmentRow} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Existing Logs Table */}
          {existingLogs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Saved Logs for Today</h3>
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Hours Used</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {existingLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.equipmentName}</TableCell>
                        <TableCell>{log.operator}</TableCell>
                        <TableCell>{log.quantity}</TableCell>
                        <TableCell>{log.hoursUsed || "-"}</TableCell>
                        <TableCell className="max-w-xs truncate">{log.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* New Equipment Rows */}
          {equipmentRows.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">New Equipment Logs</h3>
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Equipment *</TableHead>
                      <TableHead className="w-[200px]">Operator *</TableHead>
                      <TableHead className="w-[100px]">Quantity *</TableHead>
                      <TableHead className="w-[120px]">Hours Used</TableHead>
                      <TableHead className="w-[200px]">Notes</TableHead>
                      <TableHead className="w-20">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipmentRows.map((row) => (
                      <TableRow key={row.tempId}>
                        <TableCell>
                          <SearchableSelect
                            options={equipmentOptions}
                            value={row.equipmentId}
                            onChange={(value) => handleRowChange(row.tempId, "equipmentId", value)}
                            placeholder="Select equipment"
                            searchPlaceholder="Search equipment..."
                            onSearchChange={setSearchQuery}
                            searchQuery={searchQuery}
                            hasError={!row.equipmentId}
                          />
                        </TableCell>
                        <TableCell>
                          <SearchableSelect
                            options={operators}
                            value={row.operator}
                            onChange={(value) => {
                              const selectedOperator = operators.find((op) => op.value === value);
                              handleRowChange(row.tempId, "operator", selectedOperator?.label || value);
                              handleRowChange(row.tempId, "operatorId", value);
                            }}
                            placeholder="Select or enter"
                            searchPlaceholder="Search operator..."
                            onSearchChange={(query) =>
                              setOperatorSearchQuery({ ...operatorSearchQuery, [row.tempId]: query })
                            }
                            searchQuery={operatorSearchQuery[row.tempId] || ""}
                            allowCustomInput={true}
                            customInputLabel="Use custom operator:"
                            hasError={!row.operator}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) =>
                              handleRowChange(row.tempId, "quantity", parseInt(e.target.value) || 0)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={row.hoursUsed || ""}
                            onChange={(e) =>
                              handleRowChange(row.tempId, "hoursUsed", parseFloat(e.target.value) || 0)
                            }
                            placeholder="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            value={row.notes || ""}
                            onChange={(e) => handleRowChange(row.tempId, "notes", e.target.value)}
                            placeholder="Optional notes..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRow(row.tempId)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEquipmentRows([]);
                    setOperatorSearchQuery({});
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveAll}>Save All Equipment Logs</Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No equipment logs added yet</p>
              <p className="text-sm">Click "Add Equipment" to start logging</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
