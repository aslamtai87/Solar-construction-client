"use client";

import React from "react";
import { Calendar, Cloud, Users, Wrench, Activity, ChevronRight } from "lucide-react";
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

interface DailyLogSummary {
  date: string;
  labourerCount: number;
  equipmentCount: number;
  activityCount: number;
  weatherSummary?: string;
  temperature?: number;
  isComplete: boolean;
}

interface ContractorLogsHistoryProps {
  logs: DailyLogSummary[];
  onSelectDate: (date: string) => void;
}

export const ContractorLogsHistory: React.FC<ContractorLogsHistoryProps> = ({
  logs,
  onSelectDate,
}) => {
  const today = format(new Date(), "yyyy-MM-dd");

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
                  <TableHead>Status</TableHead>
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
                    const isToday = log.date === today;
                    
                    return (
                      <TableRow key={log.date} className={isToday ? "bg-primary/5" : ""}>
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
                          {log.weatherSummary ? (
                            <div className="flex items-center gap-2 text-sm">
                              <Cloud className="h-4 w-4 text-muted-foreground" />
                              <span>{log.temperature}°C</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground">{log.weatherSummary}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {log.labourerCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {log.equipmentCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {log.activityCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {log.isComplete ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Complete
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              {isToday ? "In Progress" : "Incomplete"}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSelectDate(log.date)}
                            className="text-primary hover:text-primary"
                          >
                            {isToday && !log.isComplete ? "Continue" : "View"}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
