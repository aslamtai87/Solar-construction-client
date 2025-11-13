"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { useLabourerTimeLogs } from "@/hooks/ReactQuery/useProductionLog";
import { Loader2, Users, Wrench, Activity, Cloud, MapPin } from "lucide-react";
import { DailyProductionLog } from "@/lib/types/dailyProductionLog";

interface ViewProductionLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productionLog: DailyProductionLog | null;
}

export const ViewProductionLogDialog: React.FC<ViewProductionLogDialogProps> = ({
  open,
  onOpenChange,
  productionLog,
}) => {
  const { data: labourerLogsData, isLoading: isLoadingLabourers } = useLabourerTimeLogs({
    productionLogId: productionLog?.id,
  });

  const labourerLogs = labourerLogsData?.data?.result || [];

  const formatTime = (isoTime: string) => {
    try {
      const date = parseISO(isoTime);
      return format(date, "h:mm a");
    } catch {
      return isoTime;
    }
  };

  const calculateDuration = (entryTime: string, exitTime: string) => {
    try {
      const entry = parseISO(entryTime);
      const exit = parseISO(exitTime);
      const diffMs = exit.getTime() - entry.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch {
      return "N/A";
    }
  };

  if (!productionLog) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Production Log - {format(parseISO(productionLog.date), "MMM dd, yyyy")}</span>
            <Badge variant="outline" className="ml-2">
              Read Only
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Weather Information */}
          {productionLog.weatherCondition && productionLog.temperature && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Weather & Location
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Condition</p>
                  <p className="font-medium">{productionLog.weatherCondition}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Temperature</p>
                  <p className="font-medium">{productionLog.temperature}°C</p>
                </div>
                {productionLog.humidity && (
                  <div>
                    <p className="text-muted-foreground">Humidity</p>
                    <p className="font-medium">{productionLog.humidity}%</p>
                  </div>
                )}
                {productionLog.windSpeed && (
                  <div>
                    <p className="text-muted-foreground">Wind Speed</p>
                    <p className="font-medium">{productionLog.windSpeed} km/h</p>
                  </div>
                )}
              </div>
              {productionLog.location && (
                <div className="mt-3 flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground">{productionLog.location}</p>
                </div>
              )}
            </div>
          )}

          {/* Tabs for different log types */}
          <Tabs defaultValue="labour" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="labour" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Labour ({productionLog._count?.labourerLogs || 0})
              </TabsTrigger>
              <TabsTrigger value="equipment" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Equipment ({productionLog._count?.equipmentLogs || 0})
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activities ({productionLog._count?.activityLogs || 0})
              </TabsTrigger>
            </TabsList>

            {/* Labour Logs Tab */}
            <TabsContent value="labour" className="space-y-4">
              {isLoadingLabourers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading labour logs...</span>
                </div>
              ) : labourerLogs.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No labour logs found for this date.
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Worker Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Entry Time</TableHead>
                        <TableHead>Exit Time</TableHead>
                        <TableHead>Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {labourerLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">
                            {log.worker?.fullName || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {log.worker?.labourerProfile?.name || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatTime(log.entryTime)}</TableCell>
                          <TableCell>{formatTime(log.exitTime)}</TableCell>
                          <TableCell className="font-medium">
                            {calculateDuration(log.entryTime, log.exitTime)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            {/* Equipment Logs Tab */}
            <TabsContent value="equipment" className="space-y-4">
              <div className="text-center text-muted-foreground py-8">
                {productionLog._count?.equipmentLogs
                  ? `${productionLog._count.equipmentLogs} equipment log(s) recorded`
                  : "No equipment logs found for this date."}
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-4">
              <div className="text-center text-muted-foreground py-8">
                {productionLog._count?.activityLogs
                  ? `${productionLog._count.activityLogs} activity log(s) recorded`
                  : "No activity logs found for this date."}
              </div>
            </TabsContent>
          </Tabs>

          {/* Notes if available */}
          {productionLog.notes && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{productionLog.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
