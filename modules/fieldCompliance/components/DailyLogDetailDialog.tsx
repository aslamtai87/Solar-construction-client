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
  address: string;
  weather: {
    condition: string;
    temperature: string;
    windSpeed: string;
    humidity: string;
  };
  equipment: {
    name: string;
    quantity: number;
    activities: {
      activity: string;
      quantity: number;
    }[];
  }[];
  workers: {
    name: string;
    labourerType: string;
    timeIn: string;
    timeOut: string;
    totalHours: number;
  }[];
  workCompleted: {
    activity: string;
    completedUnit: number;
    remainingUnit: number;
  }[];
}

interface DailyLogDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logData?: DailyLogData | null;
  siteName?: string;
  isLoading?: boolean;
}

export const DailyLogDetailsDialog = ({ open, onOpenChange, logData, siteName, isLoading }: DailyLogDetailsDialogProps) => {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Loading details...</span>
          </div>
        )}

        {!isLoading && !logData && (
          <div className="text-center text-muted-foreground py-12">
            No data available
          </div>
        )}

        {!isLoading && logData && (
          <>
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
                {siteName && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Site Name:</span>
                    <p className="text-sm text-gray-900">{siteName}</p>
                  </div>
                )}
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
              {logData.equipment.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No equipment logged
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Activities</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logData.equipment.map((equipment, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{equipment.name}</TableCell>
                        <TableCell>{equipment.quantity}</TableCell>
                        <TableCell>
                          {equipment.activities.length > 0 ? (
                            <div className="space-y-1">
                              {equipment.activities.map((activity, actIndex) => (
                                <div key={actIndex} className="text-sm">
                                  <Badge variant="outline" className="mr-2">
                                    {activity.activity}
                                  </Badge>
                                  <span className="text-muted-foreground">
                                    Qty: {activity.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">No activities</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
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
              {logData.workers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No workers logged
                </p>
              ) : (
                <>
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
                            <Badge variant="outline">{worker.labourerType}</Badge>
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
                </>
              )}
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
              {logData.workCompleted.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No work completed logged
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Remaining</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logData.workCompleted.map((work, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{work.activity}</TableCell>
                        <TableCell>
                          <span className="text-lg font-bold text-green-600">{work.completedUnit}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{work.remainingUnit}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
};