"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Users,
  Wrench,
  Zap,
  Eye,
  Loader2,
  MapPin,
} from "lucide-react";
import { DailyLogDetailsDialog } from "./components/DailyLogDetailDialog";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useProductionLogs, useDetailedProductionLog } from "@/hooks/ReactQuery/useProductionLog";
import { useProjectStore } from "@/store/projectStore";

const FieldCompliance = () => {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { selectedProject } = useProjectStore();
  const { data: logsData, isLoading, error } = useProductionLogs(selectedProject?.id || "");
  const { data: detailedData, isLoading: isLoadingDetails } = useDetailedProductionLog(selectedLogId || "");

  const dailyLogs = logsData?.data?.result || [];

  // Fetch detailed log for hover preview to get crew names
  const [previewLogId, setPreviewLogId] = useState<string | null>(null);
  const { data: previewData } = useDetailedProductionLog(previewLogId || "");

  const handleViewDetails = (logId: string) => {
    setSelectedLogId(logId);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Daily Reports</CardTitle>
          <CardDescription>
            Field activity logs and progress updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Loading production logs...</span>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 py-8">
              Failed to load production logs. Please try again.
            </div>
          )}

          {!isLoading && !error && dailyLogs.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No production logs found for this project.
            </div>
          )}

          {!isLoading && !error && dailyLogs.length > 0 && (
          <div className="space-y-4">
            {dailyLogs.map((log) => {
              const totalCrew = log._count?.labourerLogs || 0;
              const totalEquipment = log._count?.equipmentLogs || 0;
              const totalActivities = log._count?.activityLogs || 0;
              
              return (
              <div key={log.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-base">
                        {format(parseISO(log.date), "EEEE, MMM dd, yyyy")}
                      </span>
                    </div>
                    {log.weatherCondition && log.temperature !== null && (
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground ml-6">
                        <span>{log.weatherCondition}</span>
                        <span>•</span>
                        <span>{log.temperature}°F</span>
                        {log.humidity !== null && (
                          <>
                            <span>•</span>
                            <span>{log.humidity}% humidity</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(log.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-md p-2.5">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                      Workers on Site
                    </div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {totalCrew}
                    </div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950/20 rounded-md p-2.5">
                    <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">
                      Equipment Used
                    </div>
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {totalEquipment}
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-md p-2.5">
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
                      Activities Logged
                    </div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {totalActivities}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {log.weatherCondition && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-muted-foreground">
                        Daily Progress
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {totalActivities > 0 ? Math.min(100, (totalActivities * 15)) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={totalActivities > 0 ? Math.min(100, (totalActivities * 15)) : 0} 
                      className="h-2"
                    />
                  </div>
                )}

                {/* Location */}
                {log.location && (
                  <div className="mb-3 pb-3 border-b">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {log.location}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {log.notes && (
                  <div className="bg-muted/50 rounded-md p-2">
                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                      Notes
                    </span>
                    <p className="text-sm text-foreground line-clamp-2">
                      {log.notes}
                    </p>
                  </div>
                )}
              </div>
            )})}
          </div>
          )}
        </CardContent>
      </Card>
      <DailyLogDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        logData={detailedData?.data}
        siteName={selectedProject?.projectName}
        isLoading={isLoadingDetails}
      />
    </div>
  );
};

export default FieldCompliance;
