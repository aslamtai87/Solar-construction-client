"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityTrackerPage } from "./components/ActivityTracker/ActivityTrackerPage";

const ScheduleOverviewPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Schedule Overview</h1>
        <p className="text-muted-foreground">
          Track activities and monitor daily production progress
        </p>
      </div>

      {/* Tabs for Activity Tracker and Daily Production */}
      <Tabs defaultValue="activity-tracker" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity-tracker">Activity Tracker</TabsTrigger>
          <TabsTrigger value="daily-production">Daily Production</TabsTrigger>
        </TabsList>

        {/* Activity Tracker Tab */}
        {/* <TabsContent value="activity-tracker">
          <ActivityTrackerPage />
        </TabsContent> */}

        {/* Daily Production Tab */}
        <TabsContent value="daily-production">
          <div className="bg-white rounded-lg border p-12 text-center">
            <p className="text-muted-foreground">Daily Production view coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleOverviewPage;