import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  MapPin,
  Cloud,
  Users,
  Wrench,
  Clock,
  CheckCircle,
  Calendar
} from "lucide-react";

interface DailyLogData {
  date: string;
  siteName: string;
  address: string;
  weather: {
    condition: string;
    temperature: string;
    windSpeed: string;
    humidity: string;
  };
  equipment: {
    name: string;
    operator: string;
    hours: number;
    status: string;
  }[];
  workers: {
    name: string;
    role: string;
    timeIn: string;
    timeOut: string;
    totalHours: number;
  }[];
  workCompleted: {
    activity: string;
    quantity: number;
    unit: string;
    location: string;
  }[];
  safetyIncidents: number;
  photos: number;
  progress: number;
}

interface DailyLogDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logData: DailyLogData | null;
}

export const DailyLogDetailsDialog = ({ open, onOpenChange, logData }: DailyLogDetailsDialogProps) => {
  if (!logData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Daily Log Details - {logData.date}</span>
          </DialogTitle>
          <DialogDescription>
            Comprehensive field activity report and documentation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Site Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Site Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Site Name:</span>
                  <p className="text-sm text-gray-900">{logData.siteName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Address:</span>
                  <p className="text-sm text-gray-900">{logData.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cloud className="h-5 w-5" />
                <span>Weather Conditions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Condition:</span>
                  <p className="text-sm text-gray-900">{logData.weather.condition}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Temperature:</span>
                  <p className="text-sm text-gray-900">{logData.weather.temperature}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Wind Speed:</span>
                  <p className="text-sm text-gray-900">{logData.weather.windSpeed}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Humidity:</span>
                  <p className="text-sm text-gray-900">{logData.weather.humidity}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment on Field */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>Equipment on Field</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Hours Operated</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logData.equipment.map((equipment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{equipment.name}</TableCell>
                      <TableCell>{equipment.operator}</TableCell>
                      <TableCell>{equipment.hours} hrs</TableCell>
                      <TableCell>
                        <Badge variant={equipment.status === 'Operational' ? 'default' : 'secondary'}>
                          {equipment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Worker Time Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Worker Time Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Time In</TableHead>
                    <TableHead>Time Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logData.workers.map((worker, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{worker.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{worker.role}</Badge>
                      </TableCell>
                      <TableCell>{worker.timeIn}</TableCell>
                      <TableCell>{worker.timeOut}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{worker.totalHours} hrs</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Man Hours:</span>
                <span className="text-lg font-bold text-blue-600">
                  {logData.workers.reduce((total, worker) => total + worker.totalHours, 0)} hours
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Work Completed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Work Completed</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logData.workCompleted.map((work, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{work.activity}</TableCell>
                      <TableCell>
                        <span className="text-lg font-bold text-green-600">{work.quantity}</span>
                      </TableCell>
                      <TableCell>{work.unit}</TableCell>
                      <TableCell>{work.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{logData.photos}</div>
                  <div className="text-sm text-gray-600">Photos Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{logData.safetyIncidents}</div>
                  <div className="text-sm text-gray-600">Safety Incidents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{logData.progress}%</div>
                  <div className="text-sm text-gray-600">Overall Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};