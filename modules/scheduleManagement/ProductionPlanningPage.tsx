"use client";

import React, { useState } from "react";
import { Settings, Plus } from "lucide-react";
import ConfigureProductionDialog from "@/modules/scheduleManagement/components/Production/ConfigureProductionDialog";
import { LabourerManagement } from "@/modules/scheduleManagement/components/Production/LabourerManagement";
import { EquipmentManagement } from "@/modules/scheduleManagement/components/Production/EquipmentManagementTab";
import {
  Crew,
  ProductionConfiguration,
  Labourer,
  Equipment,
} from "@/lib/types/production";
import { Activity as ActivityType } from "@/lib/types/schedule";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatProductionMethod,
  calculateDailyProduction,
} from "@/lib/utils/productionCalculator";
import {
  useGetActivity,
  useGetEquipment,
  useGetLabourers
} from "@/hooks/ReactQuery/useSchedule";
import { useProjectStore } from "@/store/projectStore";
import { GenericTable } from "@/components/global/Table/GenericTable";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import { useDebounce } from "@/hooks/useDebounce";

const ProductionPlanningPage = () => {
  const {selectedProject} = useProjectStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const {
    cursor,
    currentPageIndex,
    handleNextPage,
    handlePreviousPage,
    handleFirstPage,
    hasNextPage: hasPrevPage,
    hasPreviousPage,
  } = useCursorPagination();

  // Master Data - Labourers
  const { data: equipmentData } = useGetEquipment({
    limit: 50,
  });
  const { data: activities, isLoading } = useGetActivity({
    limit: 2,
    projectId: selectedProject?.id || "",
    cursor: cursor || undefined,
    search: debouncedSearch || undefined,
  });
  const { data: labourers } = useGetLabourers({
    limit: 50,
    projectId: selectedProject?.id || "",
  });

  const [productionConfigs, setProductionConfigs] = useState<
    ProductionConfiguration[]
  >([]);
  const [configuringActivity, setConfiguringActivity] =
    useState<ActivityType | null>(null);

  const handleConfigureActivity = (activity: ActivityType) => {
    setConfiguringActivity(activity);
  };

  const handleSaveConfiguration = (data: any) => {
    const targetItem = configuringActivity;
    if (!targetItem) return;

    const config: any = {};

    let dailyProduction: any[] = [];

    // Only calculate production forecast if units are available
    if (targetItem.targetUnit && targetItem.targetUnit > 0) {
      if (data.method === "constant") {
        config.unitsPerDay = targetItem.targetUnit / data.duration;
      }

      dailyProduction = calculateDailyProduction(
        data.method,
        targetItem.targetUnit,
        data.duration,
        targetItem.startDate,
        config
      );
    }

    const newConfig: ProductionConfiguration = {
      id: `prod-config-${Date.now()}`,
      activityId: data.activityId,
      activityName: targetItem.name,
      totalUnits: targetItem.targetUnit || 0,
      duration: data.duration,
      method: data.method,
      crews: data.crews || [],
      equipment: data.equipment || [],
      dailyProduction,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Replace existing config if found, otherwise add new
    const existingIndex = productionConfigs.findIndex(
      (c) => c.activityId === data.activityId
    );

    if (existingIndex >= 0) {
      const updated = [...productionConfigs];
      updated[existingIndex] = newConfig;
      setProductionConfigs(updated);
    } else {
      setProductionConfigs([...productionConfigs, newConfig]);
    }

    setConfiguringActivity(null);
  };

  const getActivityConfig = (activityId: string) => {
    return productionConfigs.find((c) => c.activityId === activityId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Production Planning
        </h1>
        <p className="text-muted-foreground">
          Manage labourers, equipment, and configure production methods for
          activities
        </p>
      </div>

      {/* Tabs for Labourers, Equipment, and Activities */}
      <Tabs defaultValue="activities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="labourers">Labourers</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        {/* Labourers Tab */}
        <TabsContent value="labourers" className="space-y-4">
          <LabourerManagement />
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-4">
          <EquipmentManagement />
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <GenericTable
            data={activities?.data.result || []}
            columns={[
              {
                key: "name",
                header: "Activity Name",
                render: (item: ActivityType) => (
                  <div className="px-6 py-4 font-medium min-w-[250px]">{item.name}</div>
                ),
              },
              {
                key: "phase",
                header: "Phase",
                render: (item: ActivityType) => (
                  <div className="px-6 py-4 min-w-[120px]">{item.phase.name || "-"}</div>
                ),
              },
              {
                key: "units",
                header: "Units",
                render: (item: ActivityType) => (
                  <div className="px-6 py-4 text-center min-w-[100px]">
                    {item.targetUnit && item.targetUnit > 0
                      ? item.targetUnit.toLocaleString()
                      : "NaN"}
                  </div>
                ),
                className: "text-center",
              },
              {
                key: "duration",
                header: "Duration",
                render: (item: ActivityType) => (
                  <div className="px-6 py-4 text-center min-w-[100px]">
                    {item.duration} days
                  </div>
                ),
                className: "text-center",
              },
              {
                key: "method",
                header: "Production Method",
                render: (item: ActivityType) => {
                  const activityConfig = getActivityConfig(item.id);
                  return (
                    <div className="px-6 py-4 min-w-[150px]">
                      {activityConfig ? (
                        <Badge variant="outline">
                          {formatProductionMethod(activityConfig.method)}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Not configured
                        </span>
                      )}
                    </div>
                  );
                },
              },
              {
                key: "crews",
                header: "Crews",
                render: (item: ActivityType) => {
                  const activityConfig = getActivityConfig(item.id);
                  return (
                    <div className="px-6 py-4 min-w-[120px]">
                      {activityConfig?.crews && activityConfig.crews.length > 0 ? (
                        <Badge variant="secondary">
                          {activityConfig.crews.length}{" "}
                          {activityConfig.crews.length === 1 ? "crew" : "crews"}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">No crews</span>
                      )}
                    </div>
                  );
                },
              },
              {
                key: "equipment",
                header: "Equipment",
                render: (item: ActivityType) => {
                  const activityConfig = getActivityConfig(item.id);
                  return (
                    <div className="px-6 py-4 min-w-[120px]">
                      {activityConfig?.equipment && activityConfig.equipment.length > 0 ? (
                        <Badge variant="secondary">
                          {activityConfig.equipment.length}{" "}
                          {activityConfig.equipment.length === 1 ? "item" : "items"}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">No equipment</span>
                      )}
                    </div>
                  );
                },
              },
              {
                key: "actions",
                header: "Actions",
                render: (item: ActivityType) => {
                  const activityConfig = getActivityConfig(item.id);
                  return (
                    <div className="px-6 py-4 text-center min-w-[150px]">
                      <Button
                        size="sm"
                        variant={activityConfig ? "outline" : "default"}
                        onClick={() => handleConfigureActivity(item)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {activityConfig ? "Reconfigure" : "Configure"}
                      </Button>
                    </div>
                  );
                },
                className: "text-center",
              },
            ]}
            tableName="Activities"
            tableDescription="Configure production planning for each activity"
            isLoading={isLoading}
            emptyMessage="No activities available"
            searchText={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            searchPlaceholder="Search activities..."
            showSearch={true}
            pagination={true}
            paginationData={activities?.data.pagination}
            currentPageIndex={currentPageIndex}
            onNextPage={() => handleNextPage(activities?.data.pagination.nextCursor || null)}
            onPreviousPage={handlePreviousPage}
            onFirstPage={handleFirstPage}
            hasNextPage={hasPrevPage(activities?.data.pagination)}
            hasPreviousPage={hasPreviousPage}
          />
        </TabsContent>
      </Tabs>

      {/* Production Configuration Dialog */}
      <ConfigureProductionDialog
        open={!!configuringActivity}
        onClose={() => {
          setConfiguringActivity(null);
        }}
        onSubmit={handleSaveConfiguration}
        activity={configuringActivity}
        availableLabourers={labourers?.data.result || []}
        availableEquipment={equipmentData?.data.result || []}
      />
    </div>
  );
};

export default ProductionPlanningPage;
