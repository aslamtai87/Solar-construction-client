"use client";

import React, { useState } from "react";
import { Calendar, Cloud, Users, Wrench, Activity, ChevronRight, Loader2, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { useProductionLogs, useProductionLogId } from "@/hooks/ReactQuery/useProductionLog";
import { useProjectStore } from "@/store/projectStore";
import { ViewProductionLogDialog } from "./ViewProductionLogDialog";
import { DailyProductionLog } from "@/lib/types/dailyProductionLog";

interface ContractorLogsHistoryProps {
  onSelectDate: (date: string) => void;
}

export const ContractorLogsHistory: React.FC<ContractorLogsHistoryProps> = ({
  onSelectDate,
}) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const { selectedProject } = useProjectStore();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Dialog state for viewing past logs
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<DailyProductionLog | null>(null);

  // Fetch production logs list
  const { data: logsData, isLoading, error } = useProductionLogs(selectedProject?.id || "");
  
  // Fetch today's log
  const { data: todayLogData } = useProductionLogId(selectedProject?.id || "", timeZone);

  const logs = logsData?.data?.result || [];
  const todayLog = todayLogData?.data;

  const handleViewLog = (log: DailyProductionLog, logDate: string) => {
    const isToday = logDate === today;
    
    if (isToday) {
      // Navigate to detail page for today
      onSelectDate(logDate);
    } else {
      // Open dialog for past logs
      setSelectedLog(log);
      setViewDialogOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Daily Production Logs</CardTitle>
                <CardDescription>Manage equipment and activity logs</CardDescription>
              </div>
            </div>
            <Button
              variant="default"
              onClick={() => onSelectDate(today)}
              className="gap-2"
            >
              <Activity className="h-4 w-4" />
              Log Today
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading production logs...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              Failed to load production logs. Please try again.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Weather</TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Labour</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Wrench className="h-4 w-4" />
                        <span>Equipment</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Activity className="h-4 w-4" />
                        <span>Activities</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No logs found. Click "Log Today" to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => {
                      const logDate = format(parseISO(log.date), "yyyy-MM-dd");
                      const isToday = logDate === today;
                      const hasData = (log._count?.labourerLogs || 0) > 0 || 
                                      (log._count?.equipmentLogs || 0) > 0 || 
                                      (log._count?.activityLogs || 0) > 0;
                      const isComplete = hasData && log.weatherCondition && log.temperature;
                      
                      return (
                        <TableRow key={log.id} className={isToday ? "bg-primary/5" : ""}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {format(parseISO(log.date), "MMM dd, yyyy")}
                              {isToday && (
                                <Badge variant="default" className="ml-2">Today</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {log.weatherCondition && log.temperature ? (
                              <div className="flex items-center gap-2 text-sm">
                                <Cloud className="h-4 w-4 text-muted-foreground" />
                                <span>{log.temperature}°C</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{log.weatherCondition}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {log._count?.labourerLogs || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {log._count?.equipmentLogs || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {log._count?.activityLogs || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewLog(log, logDate)}
                              className="text-primary hover:text-primary"
                            >
                              {isToday ? (
                                <>
                                  {isComplete ? "View" : "Continue"}
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Production Log Dialog */}
      <ViewProductionLogDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        productionLog={selectedLog}
      />
    </div>
  );
};
