"use client";

import React, { useState } from "react";
import { Settings, Plus } from "lucide-react";
import ConfigureProductionDialog from "@/modules/scheduleManagement/components/Production/ConfigureProductionDialog";
import { LabourerManagement } from "@/modules/scheduleManagement/components/Production/LabourerManagement";
import { EquipmentManagement } from "@/modules/scheduleManagement/components/Production/EquipmentManagementTab";
import { Crew, ProductionConfiguration, Labourer, Equipment } from "@/lib/types/production";
import { Activity as ActivityType } from "@/lib/types/schedule";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatProductionMethod, calculateDailyProduction } from "@/lib/utils/productionCalculator";

const ProductionPlanningPage = () => {
  // Master Data - Labourers
  const [labourers, setLabourers] = useState<Labourer[]>([]);

  const handleAddLabourer = (labourer: Omit<Labourer, "id" | "createdAt" | "updatedAt">) => {
    const newLabourer: Labourer = {
      ...labourer,
      id: `labourer-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLabourers([...labourers, newLabourer]);
  };

  const handleUpdateLabourer = (id: string, updates: Partial<Labourer>) => {
    setLabourers(labourers.map(l => 
      l.id === id 
        ? { ...l, ...updates, updatedAt: new Date().toISOString() }
        : l
    ));
  };

  const handleDeleteLabourer = (id: string) => {
    setLabourers(labourers.filter(l => l.id !== id));
  };

  // Master Data - Equipment
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  const handleAddEquipment = (equip: Omit<Equipment, "id" | "createdAt" | "updatedAt">) => {
    const newEquipment: Equipment = {
      ...equip,
      id: `equipment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEquipment([...equipment, newEquipment]);
  };

  const handleUpdateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment(equipment.map(e => 
      e.id === id 
        ? { ...e, ...updates, updatedAt: new Date().toISOString() }
        : e
    ));
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipment(equipment.filter(e => e.id !== id));
  };

  // Sample activities data (would come from Schedule Management)
  const [activities] = useState<ActivityType[]>([
    {
      id: "act-1",
      phaseId: "1",
      phaseName: "Construction",
      name: "Panel Installation",
      units: 1000,
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      duration: 22,
      order: 1,
    },
  ]);

  const [productionConfigs, setProductionConfigs] = useState<ProductionConfiguration[]>([]);
  const [configuringActivity, setConfiguringActivity] = useState<ActivityType | null>(null);

  const handleConfigureActivity = (activity: ActivityType) => {
    setConfiguringActivity(activity);
  };

  const handleSaveConfiguration = (data: any) => {
    const targetItem = configuringActivity;
    if (!targetItem) return;

    const config: any = {};
    
    // Constant method auto-calculates: units ÷ duration
    if (data.method === "constant") {
      config.unitsPerDay = targetItem.units / data.duration;
    }

    const dailyProduction = calculateDailyProduction(
      data.method,
      targetItem.units,
      data.duration,
      targetItem.startDate,
      config
    );

    const newConfig: ProductionConfiguration = {
      id: `prod-config-${Date.now()}`,
      activityId: data.activityId,
      activityName: targetItem.name,
      totalUnits: targetItem.units,
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
        <h1 className="text-3xl font-bold tracking-tight">Production Planning</h1>
        <p className="text-muted-foreground">
          Manage labourers, equipment, and configure production methods for activities
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
          <LabourerManagement
            labourers={labourers}
            onAddLabourer={handleAddLabourer}
            onUpdateLabourer={handleUpdateLabourer}
            onDeleteLabourer={handleDeleteLabourer}
          />
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-4">
          <EquipmentManagement
            equipment={equipment}
            onAddEquipment={handleAddEquipment}
            onUpdateEquipment={handleUpdateEquipment}
            onDeleteEquipment={handleDeleteEquipment}
          />
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activities</CardTitle>
              <CardDescription>
                Configure production planning for each activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="min-w-[250px]">Activity Name</TableHead>
                        <TableHead className="min-w-[120px]">Phase</TableHead>
                        <TableHead className="min-w-[100px] text-center">Units</TableHead>
                        <TableHead className="min-w-[100px] text-center">Duration</TableHead>
                        <TableHead className="min-w-[150px]">Production Method</TableHead>
                        <TableHead className="min-w-[120px]">Crews</TableHead>
                        <TableHead className="min-w-[120px]">Equipment</TableHead>
                        <TableHead className="min-w-[150px] text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2">
                              <Settings className="h-12 w-12 text-muted-foreground/50" />
                              <p className="text-muted-foreground">No activities available</p>
                              <p className="text-sm text-muted-foreground">
                                Create activities in Schedule Management first
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        activities.map((activity) => {
                          const activityConfig = getActivityConfig(activity.id);
                          
                          return (
                            <TableRow key={activity.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{activity.name}</TableCell>
                              <TableCell>{activity.phaseName || "-"}</TableCell>
                              <TableCell className="text-center">{activity.units.toLocaleString()}</TableCell>
                              <TableCell className="text-center">{activity.duration} days</TableCell>
                              <TableCell>
                                {activityConfig ? (
                                  <Badge variant="outline">
                                    {formatProductionMethod(activityConfig.method)}
                                  </Badge>
                                ) : (
                                  <span className="text-sm text-muted-foreground">Not configured</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {activityConfig?.crews && activityConfig.crews.length > 0 ? (
                                  <Badge variant="secondary">
                                    {activityConfig.crews.length} {activityConfig.crews.length === 1 ? 'crew' : 'crews'}
                                  </Badge>
                                ) : (
                                  <span className="text-sm text-muted-foreground">No crews</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {activityConfig?.equipment && activityConfig.equipment.length > 0 ? (
                                  <Badge variant="secondary">
                                    {activityConfig.equipment.length} {activityConfig.equipment.length === 1 ? 'item' : 'items'}
                                  </Badge>
                                ) : (
                                  <span className="text-sm text-muted-foreground">No equipment</span>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  size="sm"
                                  variant={activityConfig ? "outline" : "default"}
                                  onClick={() => handleConfigureActivity(activity)}
                                >
                                  <Settings className="h-4 w-4 mr-2" />
                                  {activityConfig ? "Reconfigure" : "Configure"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
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
        availableLabourers={labourers}
        availableEquipment={equipment}
      />
    </div>
  );
};

export default ProductionPlanningPage;
