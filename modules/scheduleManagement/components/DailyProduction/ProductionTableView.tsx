import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ActivityProduction } from "./types";
import { getVariance, getDates } from "./utils";

interface ProductionTableViewProps {
  productionData: ActivityProduction[];
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
                      <th className="p-2 text-left font-semibold text-sm sticky left-0 bg-red-700 min-w-[280px] max-w-[280px]">
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
                              <Badge variant="secondary" className="text-xs">
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
                              <Badge variant="default" className="text-xs">
                                Actual
                              </Badge>
                            </td>
                            {crew.dailyProduction.map((day) => {
                              const { variance, percentVariance } = getVariance(
                                day.forecasted,
                                day.actual
                              );
                              const isPositive = variance >= 0;

                              return (
                                <td key={`${day.date}-actual`} className="p-2">
                                  <div className="flex flex-col items-center gap-1">
                                    {/* <Input
                                      type="number"
                                      value={day.actual}
                                      onChange={(e) =>
                                        onUpdateActual(
                                          activity.activityId,
                                          crew.crewName,
                                          day.date,
                                          Number(e.target.value)
                                        )
                                      }
                                      className="w-20 h-8 text-center text-sm"
                                    /> */}
                                    {day.actual}
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
  );
};
