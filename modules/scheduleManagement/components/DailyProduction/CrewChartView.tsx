import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeft, TrendingUp, TrendingDown } from "lucide-react";
import { CrewSummary } from "./types";
import { CustomTooltip } from "./CustomTooltip";

interface CrewChartViewProps {
  activityName: string;
  crewChartData: CrewSummary[];
  onBack: () => void;
}

export const CrewChartView = ({
  activityName,
  crewChartData,
  onBack,
}: CrewChartViewProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Activities
            </Button>
            <CardTitle className="text-xl">{activityName}</CardTitle>
          </div>
        </div>
        <CardDescription>Performance by Crew</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={crewChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="forecasted" fill="#3b82f6" name="Forecasted" />
            <Bar dataKey="actual" fill="#10b981" name="Actual" />
          </BarChart>
        </ResponsiveContainer>

        {/* Crew Performance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {crewChartData.map((crew, index) => (
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
  );
};
