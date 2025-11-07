"use client";

import React, { useState, useEffect } from "react";
import { Clock, LogIn, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

interface TimeEntry {
  id: string;
  date: string;
  entryTime: string;
  exitTime?: string;
  totalHours?: number;
  loggedByRole: "labourer" | "contractor";
}

interface InteractiveTimeEntryProps {
  currentUserId: string;
  currentUserName: string;
  todayLog?: TimeEntry;
  onLogTime: (type: "entry" | "exit", time: string) => void;
}

export const InteractiveTimeEntry: React.FC<InteractiveTimeEntryProps> = ({
  currentUserId,
  currentUserName,
  todayLog,
  onLogTime,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoggingEntry, setIsLoggingEntry] = useState(false);
  const [isLoggingExit, setIsLoggingExit] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogEntry = () => {
    setIsLoggingEntry(true);
    const timeString = format(new Date(), "HH:mm");
    setTimeout(() => {
      onLogTime("entry", timeString);
      setIsLoggingEntry(false);
    }, 800);
  };

  const handleLogExit = () => {
    setIsLoggingExit(true);
    const timeString = format(new Date(), "HH:mm");
    setTimeout(() => {
      onLogTime("exit", timeString);
      setIsLoggingExit(false);
    }, 800);
  };

  const calculateDuration = () => {
    if (!todayLog?.entryTime || !todayLog?.exitTime) return null;
    
    const [entryHour, entryMinute] = todayLog.entryTime.split(":").map(Number);
    const [exitHour, exitMinute] = todayLog.exitTime.split(":").map(Number);
    
    const entryInMinutes = entryHour * 60 + entryMinute;
    const exitInMinutes = exitHour * 60 + exitMinute;
    
    const diffInMinutes = exitInMinutes - entryInMinutes;
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    return { hours, minutes };
  };

  const duration = calculateDuration();
  const hasLoggedIn = !!todayLog?.entryTime;
  const hasLoggedOut = !!todayLog?.exitTime;

  return (
    <div className="space-y-6">
      {/* Live Clock Display */}
      <Card className="border-2 border-green-200 bg-linear-to-br from-green-50 to-white">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Live Time</span>
            </div>
            <div className="text-7xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {format(currentTime, "HH:mm:ss")}
            </div>
            <p className="text-lg text-gray-600">
              {format(currentTime, "EEEE, MMMM dd, yyyy")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Time Logging Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Clock In */}
        <Card className={`transition-all duration-300 ${hasLoggedIn ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-green-200 hover:shadow-lg'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <LogIn className={`h-6 w-6 ${hasLoggedIn ? 'text-green-600' : 'text-gray-600'}`} />
              Clock In
            </CardTitle>
            <CardDescription>
              {hasLoggedIn ? "You've clocked in for today" : "Start your work day"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasLoggedIn ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
                  <span className="text-sm text-gray-600">Entry Time</span>
                  <span className="text-2xl font-bold text-green-600">{todayLog.entryTime}</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Logged In</span>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleLogEntry}
                disabled={isLoggingEntry}
                size="lg"
                className="w-full h-14 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg font-semibold"
              >
                {isLoggingEntry ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging In...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Clock In Now
                  </div>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Clock Out */}
        <Card className={`transition-all duration-300 ${hasLoggedOut ? 'border-blue-300 bg-blue-50' : hasLoggedIn ? 'border-gray-200 hover:border-blue-200 hover:shadow-lg' : 'border-gray-200 opacity-60'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <LogOut className={`h-6 w-6 ${hasLoggedOut ? 'text-blue-600' : 'text-gray-600'}`} />
              Clock Out
            </CardTitle>
            <CardDescription>
              {hasLoggedOut ? "You've clocked out for today" : "End your work day"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasLoggedOut ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                  <span className="text-sm text-gray-600">Exit Time</span>
                  <span className="text-2xl font-bold text-blue-600">{todayLog.exitTime}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Logged Out</span>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleLogExit}
                disabled={!hasLoggedIn || isLoggingExit}
                size="lg"
                className="w-full h-14 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg font-semibold disabled:opacity-50"
              >
                {isLoggingExit ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging Out...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    Clock Out Now
                  </div>
                )}
              </Button>
            )}
            {!hasLoggedIn && (
              <p className="text-xs text-gray-500 text-center">Please clock in first</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Duration Summary */}
      {hasLoggedIn && (
        <Card className="border-2 border-purple-200 bg-linear-to-br from-purple-50 to-white">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Today's Work Duration</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {duration ? `${duration.hours}h ${duration.minutes}m` : hasLoggedOut ? "Completed" : "In Progress..."}
                  </p>
                </div>
              </div>
              {!hasLoggedOut && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Active</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
