
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Play, Plus, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PedCollectorQuery } from '@/types';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type QueryFormData = {
  query_text: string;
  target_country: string;
  target_document_type: string;
  is_active: boolean;
};

const Queries = () => {
  const [queries, setQueries] = useState<PedCollectorQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuery, setEditingQuery] = useState<PedCollectorQuery | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<QueryFormData>({
    defaultValues: {
      query_text: '',
      target_country: '',
      target_document_type: '',
      is_active: true
    }
  });

  const fetchQueries = async () => {
    try {
      setIsLoading(true);
      const data = await getAllQueries();
      setQueries(data);
    } catch (error) {
      console.error('Error fetching queries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load queries',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleExecute = async (id: number) => {
    try {
      const result = await executeQuery(id);
      toast({
        title: 'Query Executed',
        description: `Query executed successfully at ${new Date(result.executedAt).toLocaleString()}`,
      });
      fetchQueries(); // Refresh the queries list to update last_run_at
    } catch (error) {
      console.error('Error executing query:', error);
      toast({
        title: 'Error',
        description: 'Failed to execute query',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuery(id);
      toast({
        title: 'Query Deleted',
        description: 'Query has been deleted successfully',
      });
      fetchQueries();
    } catch (error) {
      console.error('Error deleting query:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete query',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (query: PedCollectorQuery) => {
    setEditingQuery(query);
    form.reset({
      query_text: query.query_text,
      target_country: query.target_country,
      target_document_type: query.target_document_type,
      is_active: query.is_active
    });
    setSheetOpen(true);
  };

  const handleAddNew = () => {
    setEditingQuery(null);
    form.reset({
      query_text: '',
      target_country: '',
      target_document_type: '',
      is_active: true
    });
    setSheetOpen(true);
  };

  const onSubmit = async (data: QueryFormData) => {
    try {
      if (editingQuery) {
        // Update existing query
        await updateQuery(editingQuery.id, data);
        toast({
          title: 'Query Updated',
          description: 'Query has been updated successfully',
        });
      } else {
        // Create new query
        await createQuery(data);
        toast({
          title: 'Query Created',
          description: 'New query has been created successfully',
        });
      }
      setSheetOpen(false);
      fetchQueries();
    } catch (error) {
      console.error('Error saving query:', error);
      toast({
        title: 'Error',
        description: 'Failed to save query',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString();
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
                    name="query_text"
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
                  <FormField
                    control={form.control}
                    name="target_country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Country</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. USA, Canada, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="target_document_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Type</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Passport, ID Card, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setSheetOpen(false)} variant="outline" className="mr-2">
                      Cancel
                    </Button>
                    <Button type="submit">
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
        <div className="text-center py-8">Loading queries...</div>
      ) : queries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">No queries found</p>
          <Button onClick={handleAddNew} className="mt-4">
            Add Your First Query
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Query</TableHead>
                <TableHead>Target Country</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queries.map((query) => (
                <TableRow key={query.id}>
                  <TableCell>{query.id}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {query.query_text}
                  </TableCell>
                  <TableCell>{query.target_country}</TableCell>
                  <TableCell>{query.target_document_type}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        query.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {query.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {query.last_run_at ? formatDate(query.last_run_at) : 'Never'}
                  </TableCell>
                  <TableCell>{formatDate(query.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExecute(query.id)}
                        title="Run Query"
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
