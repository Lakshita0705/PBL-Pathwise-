
import React from 'react';
import { DailyProgress } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressChartProps {
  data: DailyProgress[];
  title: string;
  dataKey: 'hoursSpent' | 'itemsCompleted';
  color: string;
}

const formatDate = (timestamp: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp));
};

const ProgressChart: React.FC<ProgressChartProps> = ({ data, title, dataKey, color }) => {
  // Prepare chart data and format dates
  const chartData = data.map(item => ({
    ...item,
    date: formatDate(item.date),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
              tickMargin={10}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} ${dataKey === 'hoursSpent' ? 'hours' : 'items'}`, '']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
