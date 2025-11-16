"use client";

import React from "react";
import { ProductionReportsList } from "@/modules/fieldCompliance/components/ProductionReportsList";
import { ProductionReportDetailsDialog } from "@/modules/fieldCompliance/components/ProductionReportDetailsDialog";
import { useProductionLogs } from "@/hooks/ReactQuery/useProductionLog";
import { useProjectStore } from "@/store/projectStore";
import { useDialog } from "@/hooks/useDialog";
import { DailyProductionLog } from "@/lib/types/dailyProductionLog";
import { Loader2 } from "lucide-react";

const ProductionReportsPage = () => {
  const { selectedProject } = useProjectStore();
  const { dialog, openEditDialog, closeDialog } = useDialog<DailyProductionLog>();

  const { data: productionLogsData, isLoading } = useProductionLogs(
    selectedProject?.id || ""
  );

  const productionLogs = productionLogsData?.data?.result || [];

  const handleViewDetails = (log: DailyProductionLog) => {
    openEditDialog(log);
  };

  if (!selectedProject) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Please select a project</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Recent Daily Reports
        </h1>
        <p className="text-muted-foreground">
          Field activity logs and progress updates
        </p>
      </div>

      {/* Production Reports List */}
      <ProductionReportsList
        productionLogs={productionLogs}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
      />

      {/* Details Dialog */}
      <ProductionReportDetailsDialog
        open={dialog.open}
        onOpenChange={closeDialog}
        productionLog={dialog.data}
      />
    </div>
  );
};

export default ProductionReportsPage;