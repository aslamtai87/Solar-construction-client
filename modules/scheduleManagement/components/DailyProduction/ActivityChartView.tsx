import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ActivitySummary } from "./types";
import { CustomTooltip } from "./CustomTooltip";
import { ActivitySummaryCards } from "./ActivitySummaryCards";

interface ActivityChartViewProps {
  activityChartData: ActivitySummary[];
  onActivitySelect: (activityId: string) => void;
}

export const ActivityChartView = ({
  activityChartData,
  onActivitySelect,
}: ActivityChartViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Performance by Activity</CardTitle>
        <CardDescription>
          Click on any activity card to view crew-level details
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
                onActivitySelect(data.activePayload[0].payload.id);
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

        <ActivitySummaryCards
          activityChartData={activityChartData}
          onActivitySelect={onActivitySelect}
        />
      </CardContent>
    </Card>
  );
};
