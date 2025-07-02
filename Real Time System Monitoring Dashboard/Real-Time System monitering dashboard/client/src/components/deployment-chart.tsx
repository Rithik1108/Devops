import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data for deployment trends
const data = [
  { name: "Mon", successful: 12, failed: 2 },
  { name: "Tue", successful: 8, failed: 1 },
  { name: "Wed", successful: 15, failed: 3 },
  { name: "Thu", successful: 10, failed: 2 },
  { name: "Fri", successful: 14, failed: 1 },
  { name: "Sat", successful: 6, failed: 0 },
  { name: "Sun", successful: 9, failed: 2 },
];

export function DeploymentChart() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6 text-white">Deployment Trends</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              stroke="#64748B"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748B"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F8FAFC'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="successful" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              name="Successful Deployments"
            />
            <Line 
              type="monotone" 
              dataKey="failed" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              name="Failed Deployments"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
