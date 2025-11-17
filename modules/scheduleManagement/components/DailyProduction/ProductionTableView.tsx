import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ActivityProductionWithParent } from "./types";
import { getVariance } from "./utils";

interface ProductionTableViewProps {
  productionData: ActivityProductionWithParent[];
  onUpdateActual: (
    activityId: string,
    crewName: string,
    date: string,
    value: number
  ) => void;
}

export const ProductionTableView = ({
  productionData,
  onUpdateActual,
}: ProductionTableViewProps) => {
  return (
    <div className="space-y-4">
      {productionData.map((activity) => {
        const dates = activity.activityLevelProduction.map((p) => p.date);

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

        // Calculate totals for activity level
        const totalForecasted = activity.activityLevelProduction.reduce(
          (sum, d) => sum + d.forecasted,
          0
        );
        const totalActual = activity.activityLevelProduction.reduce(
          (sum, d) => sum + d.totalActual,
          0
        );
        const totalVariance = getVariance(totalForecasted, totalActual);

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
                      <th className="p-2 text-left font-semibold text-sm sticky left-0 bg-white min-w-[280px] max-w-[280px]">
                        Crew / Type
                      </th>
                      <th className="p-2 text-center font-semibold text-sm w-20">
                        Row
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
                    {/* Activity-Level Forecast Row */}
                    <tr className="border-b bg-blue-50/50">
                      <td className="p-2 sticky left-0 bg-blue-50/50 font-semibold">
                        Activity Forecast
                      </td>
                      <td className="p-2 text-center text-xs">
                        <Badge variant="secondary" className="text-xs">
                          Forecast
                        </Badge>
                      </td>
                      {activity.activityLevelProduction.map((day) => (
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

                    {/* Activity-Level Total Actual with Variance */}
                    <tr className="border-b bg-blue-50/50">
                      <td className="p-2 sticky left-0 bg-blue-50/50 font-semibold">
                        Total Actual
                      </td>
                      <td className="p-2 text-center text-xs">
                        <Badge variant="default" className="text-xs">
                          Actual
                        </Badge>
                      </td>
                      {activity.activityLevelProduction.map((day) => {
                        const { variance, percentVariance } = getVariance(
                          day.forecasted,
                          day.totalActual
                        );
                        const isPositive = variance >= 0;

                        return (
                          <td key={`${day.date}-total`} className="p-2">
                            <div className="flex flex-col items-center gap-1">
                              <div className="text-sm font-semibold">
                                {day.totalActual}
                              </div>
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

                    {/* Spacer Row */}
                    <tr className="h-2">
                      <td colSpan={dates.length + 3}></td>
                    </tr>

                    {/* Individual Crew Rows */}
                    {activity.crews.map((crew) => {
                      const crewTotal = crew.dailyProduction.reduce(
                        (sum, d) => sum + d.actual,
                        0
                      );
                      const crewPercentage = totalActual > 0
                        ? ((crewTotal / totalActual) * 100).toFixed(1)
                        : "0.0";

                      return (
                        <tr
                          key={crew.crewName}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-2 sticky left-0 bg-white">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {crew.crewName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {crewPercentage}% of total
                              </span>
                            </div>
                          </td>
                          <td className="p-2 text-center text-xs">
                            <Badge variant="outline" className="text-xs">
                              Crew
                            </Badge>
                          </td>
                          {crew.dailyProduction.map((day) => {
                            // Find matching activity day to get total for percentage
                            const activityDay = activity.activityLevelProduction.find(
                              (p) => p.date === day.date
                            );
                            const dayPercentage = activityDay && activityDay.totalActual > 0
                              ? ((day.actual / activityDay.totalActual) * 100).toFixed(0)
                              : "0";

                            return (
                              <td
                                key={`${crew.crewName}-${day.date}`}
                                className="p-2 text-center"
                              >
                                <div className="flex flex-col items-center gap-1">
                                  <div className="text-sm">{day.actual}</div>
                                  <div className="text-xs text-gray-500">
                                    {dayPercentage}%
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                          <td className="p-2 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <div className="font-medium text-sm">
                                {crewTotal}
                              </div>
                              <div className="text-xs text-gray-500">
                                {crewPercentage}%
                              </div>
                            </div>
                          </td>
                        </tr>
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
  );
};
