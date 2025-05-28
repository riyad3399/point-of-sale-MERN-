// components/SalesOverviewChart.tsx
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface SalesDataPoint {
  date: string;
  totalSale: number;
  totalDue: number;
  totalWholesale: number;
  totalRetail: number;
}

interface Props {
  data: SalesDataPoint[];
}

const SalesOverviewChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorWholesale" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRetail" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#888" />
          <YAxis stroke="#888" />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />

          <Area
            type="monotone"
            dataKey="totalSale"
            stroke="#4f46e5"
            fill="url(#colorTotal)"
            name="Total Sale"
          />
          <Area
            type="monotone"
            dataKey="totalDue"
            stroke="#f59e0b"
            fill="url(#colorDue)"
            name="Total Due"
          />
          <Area
            type="monotone"
            dataKey="totalWholesale"
            stroke="#10b981"
            fill="url(#colorWholesale)"
            name="Wholesale"
          />
          <Area
            type="monotone"
            dataKey="totalRetail"
            stroke="#ec4899"
            fill="url(#colorRetail)"
            name="Retail"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesOverviewChart;
