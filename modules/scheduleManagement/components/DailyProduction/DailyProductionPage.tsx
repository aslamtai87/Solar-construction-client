import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Table,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DailyProduction {
  date: string;
  forecasted: number;
  actual: number;
}

interface CrewProduction {
  crewName: string;
  dailyProduction: DailyProduction[];
}

interface ActivityProduction {
  activityId: string;
  activityName: string;
  type: "activity" | "sub-activity";
  crews: CrewProduction[];
}

export const DailyProductionTracking = () => {
  const [selectedWeek, setSelectedWeek] = useState("2025-01-05");
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  // Mock data - this would come from the production planning and actual data entry
  const productionData: ActivityProduction[] = [
    {
      activityId: "act-001",
      activityName: "Foundation & Structural Work",
      type: "activity",
      crews: [
        {
          crewName: "Crew A (Pile Drivers)",
          dailyProduction: [
            { date: "2025-01-05", forecasted: 80, actual: 75 },
            { date: "2025-01-06", forecasted: 95, actual: 90 },
            { date: "2025-01-07", forecasted: 100, actual: 105 },
            { date: "2025-01-08", forecasted: 100, actual: 98 },
            { date: "2025-01-09", forecasted: 100, actual: 102 },
          ],
        },
        {
          crewName: "Crew B (Support)",
          dailyProduction: [
            { date: "2025-01-05", forecasted: 40, actual: 38 },
            { date: "2025-01-06", forecasted: 48, actual: 45 },
            { date: "2025-01-07", forecasted: 50, actual: 52 },
            { date: "2025-01-08", forecasted: 50, actual: 49 },
            { date: "2025-01-09", forecasted: 50, actual: 51 },
          ],
        },
      ],
    },
    {
      activityId: "act-002",
      activityName: "Module Installation",
      type: "activity",
      crews: [
        {
          crewName: "Crew A (Module Installers)",
          dailyProduction: [
            { date: "2025-01-16", forecasted: 200, actual: 185 },
            { date: "2025-01-17", forecasted: 235, actual: 220 },
            { date: "2025-01-18", forecasted: 250, actual: 245 },
            { date: "2025-01-19", forecasted: 250, actual: 255 },
            { date: "2025-01-20", forecasted: 250, actual: 248 },
          ],
        },
        {
          crewName: "Crew B (Module Installers)",
          dailyProduction: [
            { date: "2025-01-16", forecasted: 200, actual: 195 },
            { date: "2025-01-17", forecasted: 235, actual: 240 },
            { date: "2025-01-18", forecasted: 250, actual: 250 },
            { date: "2025-01-19", forecasted: 250, actual: 245 },
            { date: "2025-01-20", forecasted: 250, actual: 252 },
          ],
        },
      ],
    },
  ];

  const updateActual = (
    activityId: string,
    crewName: string,
    date: string,
    value: number
  ) => {
    // This would update the actual production data
    console.log("Updating actual:", { activityId, crewName, date, value });
  };

  const getVariance = (forecasted: number, actual: number) => {
    const variance = actual - forecasted;
    const percentVariance =
      forecasted > 0 ? ((variance / forecasted) * 100).toFixed(1) : "0.0";
    return { variance, percentVariance };
  };

  const getDates = (crews: CrewProduction[]) => {
    if (crews.length === 0 || crews[0].dailyProduction.length === 0) return [];
    return crews[0].dailyProduction.map((d) => d.date);
  };

  // Aggregate activity-level data for chart
  const getActivityChartData = () => {
    return productionData
      .filter((activity) => activity.crews.length > 0)
      .map((activity) => {
        let totalForecasted = 0;
        let totalActual = 0;

        activity.crews.forEach((crew) => {
          crew.dailyProduction.forEach((day) => {
            totalForecasted += day.forecasted;
            totalActual += day.actual;
          });
        });

        const variance = totalActual - totalForecasted;
        const percentVariance =
          totalForecasted > 0 ? (variance / totalForecasted) * 100 : 0;

        return {
          id: activity.activityId,
          name: activity.activityName,
          forecasted: totalForecasted,
          actual: totalActual,
          variance: variance,
          percentVariance: percentVariance.toFixed(1),
        };
      });
  };

  // Get crew-level data for selected activity
  const getCrewChartData = (activityId: string) => {
    const activity = productionData.find((a) => a.activityId === activityId);
    if (!activity) return [];

    return activity.crews.map((crew) => {
      let totalForecasted = 0;
      let totalActual = 0;

      crew.dailyProduction.forEach((day) => {
        totalForecasted += day.forecasted;
        totalActual += day.actual;
      });

      const variance = totalActual - totalForecasted;
      const percentVariance =
        totalForecasted > 0 ? (variance / totalForecasted) * 100 : 0;

      return {
        name: crew.crewName,
        forecasted: totalForecasted,
        actual: totalActual,
        variance: variance,
        percentVariance: percentVariance.toFixed(1),
      };
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const forecasted = payload[0].value;
      const actual = payload[1].value;
      const variance = actual - forecasted;
      const percentVariance =
        forecasted > 0 ? ((variance / forecasted) * 100).toFixed(1) : "0.0";

      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          <p className="text-sm text-blue-600">Forecasted: {forecasted}</p>
          <p className="text-sm text-green-600">Actual: {actual}</p>
          <p
            className={`text-sm font-semibold ${
              variance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            Variance: {variance >= 0 ? "+" : ""}
            {variance} ({percentVariance}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const activityChartData = getActivityChartData();
  const selectedActivityData = productionData.find(
    (a) => a.activityId === selectedActivity
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Daily Production Tracking
          </h2>
          <p className="text-gray-500 mt-1">
            Forecasted vs Actual production by crew and activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      <Tabs
        value={viewMode}
        onValueChange={(v) => setViewMode(v as "chart" | "table")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chart">
            <BarChart3 className="h-4 w-4 mr-2" />
            Executive View
          </TabsTrigger>
          <TabsTrigger value="table">
            <Table className="h-4 w-4 mr-2" />
            Detailed Table
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-6 mt-6">
          {/* Executive Chart View */}
          {selectedActivity ? (
            // Crew-level drill down
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedActivity(null)}
                      className="mr-2"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back to Activities
                    </Button>
                    <CardTitle className="text-xl">
                      {selectedActivityData?.activityName}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription>Performance by Crew</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getCrewChartData(selectedActivity)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="forecasted"
                      fill="#3b82f6"
                      name="Forecasted"
                    />
                    <Bar dataKey="actual" fill="#10b981" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>

                {/* Crew Performance Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {getCrewChartData(selectedActivity).map((crew, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">{crew.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Forecasted:</span>
                            <span className="font-semibold text-blue-600">
                              {crew.forecasted}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Actual:</span>
                            <span className="font-semibold text-green-600">
                              {crew.actual}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm border-t pt-2">
                            <span className="text-gray-500">Variance:</span>
                            <div
                              className={`font-bold flex items-center gap-1 ${
                                crew.variance >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {crew.variance >= 0 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              {crew.variance >= 0 ? "+" : ""}
                              {crew.variance} ({crew.percentVariance}%)
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            // Activity-level overview
            <Card>
              <CardHeader>
                <CardTitle>Production Performance by Activity</CardTitle>
                <CardDescription>
                  Click on any activity to view crew-level details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={activityChartData}
                    onClick={(data) => {
                      //@ts-ignore
                      if (data && data.activePayload) {
                        //@ts-ignore
                        setSelectedActivity(data.activePayload[0].payload.id);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="forecasted"
                      fill="#3b82f6"
                      name="Forecasted"
                      cursor="pointer"
                    />
                    <Bar
                      dataKey="actual"
                      fill="#10b981"
                      name="Actual"
                      cursor="pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>

                {/* Activity Performance Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {activityChartData.map((activity, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedActivity(activity.id)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">
                          {activity.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Forecasted:</span>
                            <span className="font-semibold text-blue-600">
                              {activity.forecasted}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Actual:</span>
                            <span className="font-semibold text-green-600">
                              {activity.actual}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm border-t pt-2">
                            <span className="text-gray-500">Variance:</span>
                            <div
                              className={`font-bold flex items-center gap-1 ${
                                activity.variance >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {activity.variance >= 0 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              {activity.variance >= 0 ? "+" : ""}
                              {activity.variance} ({activity.percentVariance}%)
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          {/* Detailed Table View */}
          <div className="space-y-4">
            {productionData.map((activity) => {
              if (activity.crews.length === 0) {
                return (
                  <Card key={activity.activityId} className="bg-blue-50/30">
                    <CardHeader className="py-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs">
                          {activity.type}
                        </Badge>
                        <CardTitle className="text-lg">
                          {activity.activityName}
                        </CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                );
              }

              const dates = getDates(activity.crews);

              return (
                <Card key={activity.activityId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            activity.type === "activity" ? "default" : "outline"
                          }
                          className="text-xs"
                        >
                          {activity.type}
                        </Badge>
                        <CardTitle className="text-lg">
                          {activity.activityName}
                        </CardTitle>
                      </div>
                      <div className="text-sm text-gray-500">
                        {dates.length} days tracked
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="p-2 text-left font-semibold text-sm sticky left-0 bg-white min-w-[200px]">
                              Crew
                            </th>
                            <th className="p-2 text-center font-semibold text-sm w-20">
                              Type
                            </th>
                            {dates.map((date) => (
                              <th
                                key={date}
                                className="p-2 text-center font-semibold text-sm min-w-[100px]"
                              >
                                {new Date(date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </th>
                            ))}
                            <th className="p-2 text-center font-semibold text-sm min-w-[100px]">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {activity.crews.map((crew) => {
                            const totalForecasted = crew.dailyProduction.reduce(
                              (sum, d) => sum + d.forecasted,
                              0
                            );
                            const totalActual = crew.dailyProduction.reduce(
                              (sum, d) => sum + d.actual,
                              0
                            );
                            const totalVariance = getVariance(
                              totalForecasted,
                              totalActual
                            );

                            return (
                              <>
                                {/* Forecasted Row */}
                                <tr
                                  key={`${crew.crewName}-forecast`}
                                  className="border-b hover:bg-gray-50"
                                >
                                  <td
                                    className="p-2 sticky left-0 bg-white font-medium"
                                    rowSpan={2}
                                  >
                                    {crew.crewName}
                                  </td>
                                  <td className="p-2 text-center text-xs">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      Forecast
                                    </Badge>
                                  </td>
                                  {crew.dailyProduction.map((day) => (
                                    <td
                                      key={`${day.date}-forecast`}
                                      className="p-2 text-center"
                                    >
                                      <div className="text-sm font-medium text-blue-600">
                                        {day.forecasted}
                                      </div>
                                    </td>
                                  ))}
                                  <td className="p-2 text-center font-semibold text-blue-600">
                                    {totalForecasted}
                                  </td>
                                </tr>

                                {/* Actual Row */}
                                <tr
                                  key={`${crew.crewName}-actual`}
                                  className="border-b hover:bg-gray-50"
                                >
                                  <td className="p-2 text-center text-xs">
                                    <Badge
                                      variant="default"
                                      className="text-xs"
                                    >
                                      Actual
                                    </Badge>
                                  </td>
                                  {crew.dailyProduction.map((day) => {
                                    const { variance, percentVariance } =
                                      getVariance(day.forecasted, day.actual);
                                    const isPositive = variance >= 0;

                                    return (
                                      <td
                                        key={`${day.date}-actual`}
                                        className="p-2"
                                      >
                                        <div className="flex flex-col items-center gap-1">
                                          <Input
                                            type="number"
                                            value={day.actual}
                                            onChange={(e) =>
                                              updateActual(
                                                activity.activityId,
                                                crew.crewName,
                                                day.date,
                                                Number(e.target.value)
                                              )
                                            }
                                            className="w-20 h-8 text-center text-sm"
                                          />
                                          <div
                                            className={`text-xs flex items-center gap-1 ${
                                              isPositive
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }`}
                                          >
                                            {isPositive ? (
                                              <TrendingUp className="h-3 w-3" />
                                            ) : (
                                              <TrendingDown className="h-3 w-3" />
                                            )}
                                            {percentVariance}%
                                          </div>
                                        </div>
                                      </td>
                                    );
                                  })}
                                  <td className="p-2 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                      <div className="font-semibold text-sm">
                                        {totalActual}
                                      </div>
                                      <div
                                        className={`text-xs flex items-center gap-1 ${
                                          totalVariance.variance >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        {totalVariance.variance >= 0 ? (
                                          <TrendingUp className="h-3 w-3" />
                                        ) : (
                                          <TrendingDown className="h-3 w-3" />
                                        )}
                                        {totalVariance.percentVariance}%
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyProductionTracking;
