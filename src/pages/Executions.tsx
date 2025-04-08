
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { fetchExecutions } from '@/api/executions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Execution } from '@/types';
import ExecutionStats from '@/components/ExecutionStats';

const Executions = () => {
  const { toast } = useToast();

  // Fetch executions data
  const { data: executions, isLoading, error } = useQuery({
    queryKey: ['executions'],
    queryFn: fetchExecutions,
    meta: {
      onError: (err: Error) => {
        console.error('Error fetching executions:', err);
        toast({
          title: 'Error',
          description: 'Failed to load executions. Please try again.',
          variant: 'destructive',
        });
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading executions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-destructive">
        <AlertCircle className="h-10 w-10 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Failed to load executions</h3>
        <p>Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">Query Executions</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage all query executions
        </p>
      </div>

      {/* Stats Section */}
      {executions && executions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Execution Statistics</h2>
          <ExecutionStats executions={executions} />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Executions</CardTitle>
        </CardHeader>
        <CardContent>
          {executions && executions.length > 0 ? (
            <Table>
              <TableCaption>A list of recent query executions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Query</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Documents Found</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executions.map((execution: Execution) => (
                  <TableRow key={execution.id}>
                    <TableCell className="font-medium">{execution.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {execution.query || `Query #${execution.queryId}`}
                    </TableCell>
                    <TableCell>
                      {format(new Date(execution.startDate), 'MMM d, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      {execution.endDate 
                        ? format(new Date(execution.endDate), 'MMM d, yyyy HH:mm') 
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={execution.isCompleted ? 'default' : 'secondary'}
                        className="flex w-fit items-center gap-1"
                      >
                        {execution.isCompleted ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Completed</span>
                          </>
                        ) : (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Running</span>
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {execution.foundDocuments}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No executions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Executions;
