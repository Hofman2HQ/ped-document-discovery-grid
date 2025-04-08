
import React from 'react';
import { Execution } from '@/types';
import { Card } from '@/components/ui/card';
import { Pie, Column } from '@ant-design/plots';
import styled from 'styled-components';

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const ChartContainer = styled.div`
  height: 250px;
  width: 100%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

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
    { type: 'Completed', value: completedCount },
    { type: 'Running', value: runningCount }
  ];
  
  const pieConfig = {
    data: statusData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'bottom'
    },
    color: ['#4ade80', '#60a5fa'],
  };

  // Prepare document count data for bar chart
  const documentCountData = executions
    .filter(exec => exec.isCompleted)
    .map(exec => ({
      query: exec.query || `Query #${exec.queryId}`,
      documents: exec.foundDocuments
    }))
    .sort((a, b) => b.documents - a.documents)
    .slice(0, 5); // Show top 5

  const columnConfig = {
    data: documentCountData,
    xField: 'query',
    yField: 'documents',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
        autoEllipsis: true,
      },
    },
    meta: {
      query: {
        alias: 'Query',
      },
      documents: {
        alias: 'Documents Found',
      },
    },
    color: '#8884d8',
  };

  return (
    <StatsGrid>
      {/* Status Distribution */}
      <Card>
        <CardContent>
          <CardTitle>Execution Status</CardTitle>
          <ChartContainer>
            <Pie {...pieConfig} />
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Documents Found Chart */}
      <Card>
        <CardContent>
          <CardTitle>Top 5 Queries by Documents Found</CardTitle>
          <ChartContainer>
            <Column {...columnConfig} />
          </ChartContainer>
        </CardContent>
      </Card>
    </StatsGrid>
  );
};

export default ExecutionStats;
