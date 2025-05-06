import React from 'react';
import {
  LineChart,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface LineChartProps {
  data: any[];
  dataKey: string;
  stroke?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}

export const LineChartComponent: React.FC<LineChartProps> = ({
  data,
  dataKey,
  stroke = '#8884d8',
  showGrid = true,
  showLegend = true,
  showTooltip = true,
}) => (
  <LineChart data={data}>
    {showGrid && <CartesianGrid strokeDasharray="3 3" />}
    <XAxis dataKey="name" />
    <YAxis />
    {showTooltip && <Tooltip />}
    {showLegend && <Legend />}
    <Line
      type="monotone"
      dataKey={dataKey}
      stroke={stroke}
      strokeWidth={2}
      activeDot={{ r: 6 }}
    />
  </LineChart>
);

interface BarChartProps {
  data: any[];
  dataKey: string;
  fill?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}

export const BarChartComponent: React.FC<BarChartProps> = ({
  data,
  dataKey,
  fill = '#8884d8',
  showGrid = true,
  showLegend = true,
  showTooltip = true,
}) => (
  <BarChart data={data}>
    {showGrid && <CartesianGrid strokeDasharray="3 3" />}
    <XAxis dataKey="name" />
    <YAxis />
    {showTooltip && <Tooltip />}
    {showLegend && <Legend />}
    <Bar dataKey={dataKey} fill={fill} />
  </BarChart>
);

interface PieChartProps {
  data: any[];
  dataKey: string;
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
}

export const PieChartComponent: React.FC<PieChartProps> = ({
  data,
  dataKey,
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c'],
  showLegend = true,
  showTooltip = true,
}) => (
  <PieChart>
    {showTooltip && <Tooltip />}
    {showLegend && <Legend />}
    <Pie
      data={data}
      dataKey={dataKey}
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      fill="#8884d8"
      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
      ))}
    </Pie>
  </PieChart>
);

// Main ChartComponent that uses the individual chart components
interface ChartComponentProps {
  type: 'line' | 'bar' | 'pie';
  data: any[];
  dataKey?: string;
  color?: string;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  title?: string;
  className?: string;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  type,
  data,
  dataKey = 'value',
  color = '#8884d8',
  colors,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  title,
  className = '',
}) => {
  if (!data || data.length === 0) {
    return <div className={className}>No data available</div>;
  }

  const chartProps = {
    data,
    dataKey,
    showGrid,
    showLegend,
    showTooltip,
  };

  return (
    <div className={className} style={{ width: '100%', height: 300 }}>
      {title && <h3>{title}</h3>}
      {/* <ResponsiveContainer> */}
        {type === 'line' && <LineChartComponent {...chartProps} stroke={color} />}
        {type === 'bar' && <BarChartComponent {...chartProps} fill={color} />}
        {type === 'pie' && <PieChartComponent {...chartProps} colors={colors} />}
      {/* </ResponsiveContainer> */}
    </div>
  );
};