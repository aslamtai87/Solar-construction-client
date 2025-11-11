import React from "react";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { EquipmentManagement } from "@/modules/scheduleManagement/components/Production1/EquipmentManagementTab";
import { LabourerManagement } from "@/modules/scheduleManagement/components/Production1/LabourerManagement";
import ActivityList  from "@/modules/scheduleManagement/components/Production1/ActivityList";

const ProductionPlanningPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="labourers" className="space-y-4">
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
          <ActivityList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionPlanningPage;
