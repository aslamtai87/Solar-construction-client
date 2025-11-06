import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ChevronRight, Grid3x3, List } from "lucide-react";
import { ActivitySummary } from "./types";
import { useState } from "react";

interface ActivitySummaryCardsProps {
  activityChartData: ActivitySummary[];
  onActivitySelect: (activityId: string) => void;
}

export const ActivitySummaryCards = ({
  activityChartData,
  onActivitySelect,
}: ActivitySummaryCardsProps) => {
  const [cardViewMode, setCardViewMode] = useState<"grid" | "list">("grid");

  return (
    <>
      {/* View Mode Toggle */}
      <div className="flex justify-end mt-4 mb-2">
        <div className="flex gap-1 border rounded-md p-1">
          <Button
            variant={cardViewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setCardViewMode("list")}
            className="h-8 px-2"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={cardViewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setCardViewMode("grid")}
            className="h-8 px-2"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {cardViewMode === "list" ? (
        // Compact List View
        <div className="space-y-2">
          {activityChartData.map((activity, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
              onClick={() => onActivitySelect(activity.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-base group-hover:text-blue-600 transition-colors">
                        {activity.name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        Click to view crews
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">
                        Forecasted
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        {activity.forecasted}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Actual</div>
                      <div className="text-lg font-semibold text-green-600">
                        {activity.actual}
                      </div>
                    </div>

                    <div className="text-center min-w-[120px]">
                      <div className="text-xs text-gray-500 mb-1">Variance</div>
                      <div
                        className={`text-lg font-bold flex items-center justify-center gap-1 ${
                          activity.variance >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {activity.variance >= 0 ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                        {activity.variance >= 0 ? "+" : ""}
                        {activity.variance} ({activity.percentVariance}%)
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activityChartData.map((activity, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group relative"
              onClick={() => onActivitySelect(activity.id)}
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge variant="secondary" className="text-xs">
                  View Details
                </Badge>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm group-hover:text-blue-600 transition-colors">
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
                <div className="mt-3 pt-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs group-hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onActivitySelect(activity.id);
                    }}
                  >
                    View Crew Details
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};
