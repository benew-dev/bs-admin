"use client";

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

export default function ComparisonChart({ title, data }) {
  // data format: [{ name: 'Semaine 1', thisWeek: 100, lastWeek: 80 }, ...]

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: "12px" }} />
          <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "none",
              borderRadius: "8px",
              color: "#FFF",
            }}
            formatter={(value) => `${value.toLocaleString()} FDj`}
          />
          <Legend />
          <Bar
            dataKey="current"
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
            name="Période actuelle"
          />
          <Bar
            dataKey="previous"
            fill="#9CA3AF"
            radius={[8, 8, 0, 0]}
            name="Période précédente"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
