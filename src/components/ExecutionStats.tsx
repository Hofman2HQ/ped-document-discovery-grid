
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Execution } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExecutionStatsProps {
  executions: Execution[];
}

const ExecutionStats: React.FC<ExecutionStatsProps> = ({ executions }) => {
  // Skip rendering if no executions
  if (!executions || executions.length === 0) {
    return null;
  }

  // Calculate status breakdown for pie chart
  const completedCount = executions.filter(exec => exec.isCompleted).length;
  const runningCount = executions.length - completedCount;
  
  const statusData = [
    { name: 'Completed', value: completedCount },
    { name: 'Running', value: runningCount }
  ];
  
  const COLORS = ['#4ade80', '#60a5fa'];

  // Prepare document count data for bar chart
  const documentCountData = executions
    .filter(exec => exec.isCompleted)
    .map(exec => ({
      id: exec.id,
      query: exec.query || `Query #${exec.queryId}`,
      documents: exec.foundDocuments
    }))
    .sort((a, b) => b.documents - a.documents)
    .slice(0, 5); // Show top 5

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Execution Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Documents Found Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Queries by Documents Found</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={documentCountData}
                margin={{ top: 5, right: 30, left: 20, bottom: 55 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="query" 
                  angle={-45} 
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="documents" name="Documents Found" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutionStats;
