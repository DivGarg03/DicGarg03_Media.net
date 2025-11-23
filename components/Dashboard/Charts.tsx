import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface Props {
  data: any[];
}

export const SpendChart: React.FC<Props> = ({ data }) => {
  // Transform dailySpend array into object array for Recharts
  // Assuming data passed is campaign.metrics
  const chartData = data.map((val, idx) => ({
      day: `Day ${idx + 1}`,
      spend: val
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
          />
          <Area type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};