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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Camera,
  FileText,
  CheckCircle,
  AlertTriangle,
  Users,
  Wrench,
  Zap,
  Upload,
  Download,
  Eye,
} from "lucide-react";
import { DailyLogDetailsDialog } from "./components/DailyLogDetailDialog";
import { useState } from "react";
import { de } from "date-fns/locale";

const FieldCompliance = () => {
  const [selectedLogIndex, setSelectedLogIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dailyLogs = [
    {
      date: "2024-01-15",
      weather: "Sunny, 72°F",
      crew: "Desert Civil Works - 8 workers",
      workCompleted: "Foundation Block 2A - 12 foundations poured",
      photos: 15,
      safetyIncidents: 0,
      progress: 85,
    },
    {
      date: "2024-01-14",
      weather: "Partly Cloudy, 68°F",
      crew: "Desert Civil Works - 8 workers, Phoenix Electric - 4 workers",
      workCompleted: "Foundation rebar installation, electrical rough-in",
      photos: 22,
      safetyIncidents: 1,
      progress: 82,
    },
    {
      date: "2024-01-13",
      weather: "Clear, 70°F",
      crew: "Desert Civil Works - 6 workers",
      workCompleted: "Site prep for Block 2B, equipment staging",
      photos: 8,
      safetyIncidents: 0,
      progress: 78,
    },
  ];
  const detailedLogData = [
    {
      date: "2024-01-15",
      siteName: "Desert Solar Farm Phase 1",
      address: "12345 Desert Valley Road, Phoenix, AZ 85001",
      weather: {
        condition: "Sunny",
        temperature: "72°F",
        windSpeed: "5 mph",
        humidity: "35%",
      },
      equipment: [
        {
          name: "Skid Loader",
          operator: "Mike Johnson",
          hours: 8,
          status: "Operational",
        },
        {
          name: "Crane (25 ton)",
          operator: "Sarah Martinez",
          hours: 6,
          status: "Operational",
        },
        {
          name: "Skid Steer",
          operator: "David Chen",
          hours: 7,
          status: "Operational",
        },
        {
          name: "Telehandler",
          operator: "Carlos Rodriguez",
          hours: 8,
          status: "Maintenance",
        },
      ],
      workers: [
        {
          name: "Mike Johnson",
          role: "Equipment Operator",
          timeIn: "06:00",
          timeOut: "14:30",
          totalHours: 8.5,
        },
        {
          name: "Sarah Martinez",
          role: "Crane Operator",
          timeIn: "07:00",
          timeOut: "15:00",
          totalHours: 8.0,
        },
        {
          name: "David Chen",
          role: "Foreman",
          timeIn: "06:00",
          timeOut: "15:00",
          totalHours: 9.0,
        },
        {
          name: "Carlos Rodriguez",
          role: "Equipment Operator",
          timeIn: "06:30",
          timeOut: "14:30",
          totalHours: 8.0,
        },
        {
          name: "James Wilson",
          role: "Laborer",
          timeIn: "07:00",
          timeOut: "15:30",
          totalHours: 8.5,
        },
        {
          name: "Lisa Brown",
          role: "Electrician",
          timeIn: "08:00",
          timeOut: "16:00",
          totalHours: 8.0,
        },
        {
          name: "Robert Davis",
          role: "Laborer",
          timeIn: "07:00",
          timeOut: "15:00",
          totalHours: 8.0,
        },
        {
          name: "Anna Garcia",
          role: "Safety Coordinator",
          timeIn: "06:00",
          timeOut: "14:00",
          totalHours: 8.0,
        },
      ],
      workCompleted: [
        {
          activity: "Piles Installed",
          quantity: 80,
          unit: "piles",
          location: "Block 2A",
        },
        {
          activity: "Panels Installed",
          quantity: 700,
          unit: "panels",
          location: "Block 1B",
        },
        {
          activity: "Tables Installed",
          quantity: 50,
          unit: "tables",
          location: "Block 1B",
        },
        {
          activity: "Trenching",
          quantity: 300,
          unit: "feet",
          location: "AC Collection",
        },
        {
          activity: "Transformer Pad",
          quantity: 1,
          unit: "pad",
          location: "Main Substation",
        },
      ],
      safetyIncidents: 0,
      photos: 15,
      progress: 85,
    },
    {
      date: "2024-01-14",
      siteName: "Desert Solar Farm Phase 1",
      address: "12345 Desert Valley Road, Phoenix, AZ 85001",
      weather: {
        condition: "Partly Cloudy",
        temperature: "68°F",
        windSpeed: "8 mph",
        humidity: "42%",
      },
      equipment: [
        {
          name: "Skid Loader",
          operator: "Mike Johnson",
          hours: 7,
          status: "Operational",
        },
        {
          name: "Crane (25 ton)",
          operator: "Sarah Martinez",
          hours: 8,
          status: "Operational",
        },
        {
          name: "Skid Steer",
          operator: "David Chen",
          hours: 6,
          status: "Operational",
        },
        {
          name: "Telehandler",
          operator: "Carlos Rodriguez",
          hours: 5,
          status: "Operational",
        },
      ],
      workers: [
        {
          name: "Mike Johnson",
          role: "Equipment Operator",
          timeIn: "06:00",
          timeOut: "14:00",
          totalHours: 8.0,
        },
        {
          name: "Sarah Martinez",
          role: "Crane Operator",
          timeIn: "07:00",
          timeOut: "15:30",
          totalHours: 8.5,
        },
        {
          name: "David Chen",
          role: "Foreman",
          timeIn: "06:00",
          timeOut: "15:00",
          totalHours: 9.0,
        },
        {
          name: "Carlos Rodriguez",
          role: "Equipment Operator",
          timeIn: "07:00",
          timeOut: "14:00",
          totalHours: 7.0,
        },
        {
          name: "James Wilson",
          role: "Laborer",
          timeIn: "07:00",
          timeOut: "15:00",
          totalHours: 8.0,
        },
        {
          name: "Lisa Brown",
          role: "Electrician",
          timeIn: "08:00",
          timeOut: "16:00",
          totalHours: 8.0,
        },
        {
          name: "Robert Davis",
          role: "Laborer",
          timeIn: "07:00",
          timeOut: "15:00",
          totalHours: 8.0,
        },
        {
          name: "Anna Garcia",
          role: "Safety Coordinator",
          timeIn: "06:30",
          timeOut: "14:30",
          totalHours: 8.0,
        },
        {
          name: "Tom Anderson",
          role: "Electrician",
          timeIn: "08:00",
          timeOut: "16:00",
          totalHours: 8.0,
        },
        {
          name: "Mark Thompson",
          role: "Laborer",
          timeIn: "07:30",
          timeOut: "15:30",
          totalHours: 8.0,
        },
        {
          name: "Jennifer Lee",
          role: "Quality Inspector",
          timeIn: "09:00",
          timeOut: "17:00",
          totalHours: 8.0,
        },
        {
          name: "Steve Miller",
          role: "Laborer",
          timeIn: "07:00",
          timeOut: "15:00",
          totalHours: 8.0,
        },
      ],
      workCompleted: [
        {
          activity: "Foundation Rebar",
          quantity: 45,
          unit: "foundations",
          location: "Block 2B",
        },
        {
          activity: "Electrical Rough-in",
          quantity: 150,
          unit: "feet",
          location: "DC Collection",
        },
        {
          activity: "Grounding Installation",
          quantity: 12,
          unit: "sections",
          location: "Block 1A",
        },
        {
          activity: "Conduit Installation",
          quantity: 200,
          unit: "feet",
          location: "AC Collection",
        },
      ],
      safetyIncidents: 1,
      photos: 22,
      progress: 82,
    },
    {
      date: "2024-01-13",
      siteName: "Desert Solar Farm Phase 1",
      address: "12345 Desert Valley Road, Phoenix, AZ 85001",
      weather: {
        condition: "Clear",
        temperature: "70°F",
        windSpeed: "3 mph",
        humidity: "38%",
      },
      equipment: [
        {
          name: "Skid Loader",
          operator: "Mike Johnson",
          hours: 6,
          status: "Operational",
        },
        {
          name: "Skid Steer",
          operator: "David Chen",
          hours: 8,
          status: "Operational",
        },
        {
          name: "Telehandler",
          operator: "Carlos Rodriguez",
          hours: 4,
          status: "Operational",
        },
      ],
      workers: [
        {
          name: "Mike Johnson",
          role: "Equipment Operator",
          timeIn: "07:00",
          timeOut: "15:00",
          totalHours: 8.0,
        },
        {
          name: "David Chen",
          role: "Foreman",
          timeIn: "06:00",
          timeOut: "15:00",
          totalHours: 9.0,
        },
        {
          name: "Carlos Rodriguez",
          role: "Equipment Operator",
          timeIn: "08:00",
          timeOut: "14:00",
          totalHours: 6.0,
        },
        {
          name: "James Wilson",
          role: "Laborer",
          timeIn: "07:00",
          timeOut: "15:00",
          totalHours: 8.0,
        },
        {
          name: "Robert Davis",
          role: "Laborer",
          timeIn: "07:00",
          timeOut: "15:00",
          totalHours: 8.0,
        },
        {
          name: "Anna Garcia",
          role: "Safety Coordinator",
          timeIn: "07:00",
          timeOut: "15:00",
          totalHours: 8.0,
        },
      ],
      workCompleted: [
        {
          activity: "Site Prep Block 2B",
          quantity: 1,
          unit: "section",
          location: "Block 2B",
        },
        {
          activity: "Equipment Staging",
          quantity: 1,
          unit: "area",
          location: "Staging Area",
        },
        {
          activity: "Material Delivery",
          quantity: 500,
          unit: "panels",
          location: "Laydown Yard",
        },
        {
          activity: "Access Road Maintenance",
          quantity: 200,
          unit: "feet",
          location: "Main Access",
        },
      ],
      safetyIncidents: 0,
      photos: 8,
      progress: 78,
    },
  ];

  const handleViewDetails = (index: number) => {
    setSelectedLogIndex(index);
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
          <div className="space-y-4">
            {dailyLogs.map((log, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">{log.date}</span>
                    <Badge variant="outline">{log.weather}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Camera className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {log.photos} photos
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Crew:{" "}
                    </span>
                    <span className="text-sm text-gray-600">{log.crew}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      Safety:{" "}
                    </span>
                    {log.safetyIncidents === 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-600">
                      {log.safetyIncidents} incidents
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Work Completed:{" "}
                  </span>
                  <span className="text-sm text-gray-600">
                    {log.workCompleted}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Progress
                      </span>
                      <span className="text-sm text-gray-600">
                        {log.progress}%
                      </span>
                    </div>
                    <Progress value={log.progress} className="h-2" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(index)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <DailyLogDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        logData={
          selectedLogIndex !== null ? detailedLogData[selectedLogIndex] : null
        }
      />
    </div>
  );
};

export default FieldCompliance;
