
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Play, Plus, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PedCollectorQuery } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllQueries,
  createQuery,
  updateQuery,
  deleteQuery,
  executeQuery
} from '@/api/queries';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import EmptyState from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';

type QueryFormData = {
  query: string;
};

const Queries = () => {
  const [editingQuery, setEditingQuery] = useState<PedCollectorQuery | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<QueryFormData>({
    defaultValues: {
      query: '',
    }
  });

  const { data: queries = [], isLoading, isError } = useQuery({
    queryKey: ['queries'],
    queryFn: getAllQueries,
    retry: 1,
    refetchOnWindowFocus: false
  });

  console.log("Queries data:", queries);
  console.log("isLoading:", isLoading);
  console.log("isError:", isError);

  const createMutation = useMutation({
    mutationFn: (data: string) => createQuery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
      setSheetOpen(false);
      toast({
        title: 'Query Created',
        description: 'New query has been created successfully',
      });
    },
    onError: (error) => {
      console.error('Error creating query:', error);
      toast({
        title: 'Error',
        description: 'Failed to create query',
        variant: 'destructive'
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, query }: { id: number; query: string }) => updateQuery(id, query),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
      setSheetOpen(false);
      toast({
        title: 'Query Updated',
        description: 'Query has been updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating query:', error);
      toast({
        title: 'Error',
        description: 'Failed to update query',
        variant: 'destructive'
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteQuery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
      toast({
        title: 'Query Deleted',
        description: 'Query has been deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting query:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete query',
        variant: 'destructive'
      });
    }
  });

  const executeMutation = useMutation({
    mutationFn: (id: number) => executeQuery(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
      toast({
        title: 'Query Executed',
        description: `Query executed successfully at ${new Date(data.executedAt).toLocaleString()}`,
      });
    },
    onError: (error) => {
      console.error('Error executing query:', error);
      toast({
        title: 'Error',
        description: 'Failed to execute query',
        variant: 'destructive'
      });
    }
  });

  const handleExecute = (id: number) => {
    executeMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (query: PedCollectorQuery) => {
    setEditingQuery(query);
    form.reset({
      query: query.query,
    });
    setSheetOpen(true);
  };

  const handleAddNew = () => {
    setEditingQuery(null);
    form.reset({
      query: '',
    });
    setSheetOpen(true);
  };

  const onSubmit = (data: QueryFormData) => {
    if (editingQuery) {
      updateMutation.mutate({ id: editingQuery.id, query: data.query });
    } else {
      createMutation.mutate(data.query);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderSkeletonRows = () => {
    return Array(5).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
        <TableCell><Skeleton className="h-4 w-64" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">PED Collector Queries</h1>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Query
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>
                {editingQuery ? 'Edit Query' : 'Create New Query'}
              </SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Query Text</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter search query text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setSheetOpen(false)} variant="outline" className="mr-2">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingQuery ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black font-semibold">ID</TableHead>
                <TableHead className="text-black font-semibold">Query</TableHead>
                <TableHead className="text-black font-semibold">Created</TableHead>
                <TableHead className="text-black font-semibold">Last Updated</TableHead>
                <TableHead className="text-black font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderSkeletonRows()}
            </TableBody>
          </Table>
        </div>
      ) : isError ? (
        <EmptyState message="There was an error loading queries. Please try again later." />
      ) : queries.length === 0 ? (
        <EmptyState message="No queries found. Add your first query to get started." />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black font-semibold">ID</TableHead>
                <TableHead className="text-black font-semibold">Query</TableHead>
                <TableHead className="text-black font-semibold">Created</TableHead>
                <TableHead className="text-black font-semibold">Last Updated</TableHead>
                <TableHead className="text-black font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queries.map((query) => (
                <TableRow key={query.id}>
                  <TableCell className="text-black">{query.id}</TableCell>
                  <TableCell className="max-w-md truncate text-black">
                    {query.query}
                  </TableCell>
                  <TableCell className="text-black">{formatDate(query.insertDatetime)}</TableCell>
                  <TableCell className="text-black">{formatDate(query.updateDatetime)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExecute(query.id)}
                        title="Run Query"
                        disabled={executeMutation.isPending}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(query)}
                        title="Edit Query"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Delete Query"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Collector Query
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this query? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(query.id)}
                              disabled={deleteMutation.isPending}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Queries;
