interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
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
