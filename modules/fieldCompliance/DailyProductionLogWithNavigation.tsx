"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LabourerTimeHistory } from "./components/LabourerTimeHistory";
import { ContractorLogsHistory } from "./components/ContractorLogsHistory";
import { TodayDetailPage } from "./components/TodayDetailPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const DailyProductionLogWithNavigation: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"labourer" | "contractor">(
    "labourer"
  );

  // Initialize from search params
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const viewParam = searchParams.get("view");
    const dateParam = searchParams.get("date");
    
    if (tabParam === "labourer" || tabParam === "contractor") {
      setActiveTab(tabParam);
    }
    
    if (viewParam === "detail" && dateParam) {
      setViewMode("detail");
      setSelectedDate(dateParam);
    } else {
      setViewMode("list");
      setSelectedDate(null);
    }
  }, [searchParams]);

  // Update search params when tab changes
  const handleTabChange = (value: string) => {
    const newTab = value as "labourer" | "contractor";
    setActiveTab(newTab);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.push(`?${params.toString()}`, { scroll: false });
  };
  const userRole: "labourer" | "contractor" = activeTab; // Simulating different roles per tab


  // Handlers
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setViewMode("detail");
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "detail");
    params.set("date", date);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedDate(null);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete("view");
    params.delete("date");
    params.delete("detailTab");
    router.push(`?${params.toString()}`, { scroll: false });
  };




  return (
    <div className="space-y-4 p-6">
      {/* show navigation url to return to list */}

      {viewMode === "list" ? (
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-10">
            <TabsTrigger value="labourer" className="text-sm">
              My Time Logs
            </TabsTrigger>
            <TabsTrigger value="contractor" className="text-sm">
              Production Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="labourer" className="space-y-4 mt-4">
            <LabourerTimeHistory />
          </TabsContent>

          <TabsContent value="contractor" className="space-y-4 mt-4">
            <ContractorLogsHistory
              onSelectDate={handleSelectDate}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <TodayDetailPage
          selectedDate={selectedDate!}
          userRole={userRole}
          onBack={handleBack}
        />
      )}
    </div>
  );
};
