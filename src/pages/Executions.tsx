
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Check, Clock, FileSearch } from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Execution } from "@/types";
import { getAllExecutions } from "@/api/executions";

const ExecutionStatusBadge = ({ isCompleted }: { isCompleted: boolean }) => {
  return isCompleted ? (
    <Badge className="bg-green-500 hover:bg-green-600">
      <Check className="mr-1 h-3 w-3" />
      Completed
    </Badge>
  ) : (
    <Badge className="bg-orange-500 hover:bg-orange-600">
      <Clock className="mr-1 h-3 w-3" />
      In Progress
    </Badge>
  );
};

const Executions = () => {
  const { toast } = useToast();
  
  const { 
    data: executions, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['executions'],
    queryFn: getAllExecutions,
    onError: (error) => {
      console.error("Failed to fetch executions:", error);
      toast({
        title: "Error",
        description: "Failed to load executions. Please try again later.",
        variant: "destructive",
      });
    }
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return format(new Date(date), "MMM d, yyyy HH:mm:ss");
  };

  return (
    <div className="container py-8 mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">Query Executions</h1>
        <p className="text-muted-foreground mt-2">
          Track all execution runs for collector queries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary inline" />
              ) : executions ? (
                executions.length
              ) : (
                "0"
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary inline" />
              ) : executions ? (
                executions.filter(exec => exec.isCompleted).length
              ) : (
                "0"
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary inline" />
              ) : executions ? (
                executions.filter(exec => !exec.isCompleted).length
              ) : (
                "0"
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading executions...</span>
        </div>
      ) : error ? (
        <div className="text-destructive text-center p-4">
          Failed to load executions. Please try again later.
        </div>
      ) : executions && executions.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Execution ID</TableHead>
                  <TableHead>Query</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Found Documents</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executions.map((execution) => (
                  <TableRow key={execution.id} className="animate-fade-in">
                    <TableCell className="font-medium">{execution.id}</TableCell>
                    <TableCell>{execution.query || `Query #${execution.queryId}`}</TableCell>
                    <TableCell>{formatDate(execution.startDate)}</TableCell>
                    <TableCell>{formatDate(execution.endDate)}</TableCell>
                    <TableCell>
                      <ExecutionStatusBadge isCompleted={execution.isCompleted} />
                    </TableCell>
                    <TableCell>
                      {execution.isCompleted ? (
                        <span className="font-semibold">{execution.foundDocuments}</span>
                      ) : (
                        <span className="text-muted-foreground italic">In progress</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-muted/30 rounded-lg border border-dashed">
          <FileSearch className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No Executions Found</h3>
          <p className="text-muted-foreground">
            There are no query executions to display
          </p>
        </div>
      )}
    </div>
  );
};

export default Executions;
