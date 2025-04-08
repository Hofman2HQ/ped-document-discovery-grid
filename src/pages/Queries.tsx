
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  PlayCircleOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  LoadingOutlined 
} from '@ant-design/icons';
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
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  Drawer, 
  Progress, 
  Typography 
} from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import EmptyState from '@/components/EmptyState';

const { Title } = Typography;
const { TextArea } = Input;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

type QueryFormData = {
  query: string;
};

const Queries = () => {
  const [editingQuery, setEditingQuery] = useState<PedCollectorQuery | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState<number | null>(null);
  const [executingQueryId, setExecutingQueryId] = useState<number | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

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
      setDrawerOpen(false);
      toast.success('New query has been created successfully');
    },
    onError: (error) => {
      console.error('Error creating query:', error);
      toast.error('Failed to create query');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, query }: { id: number; query: string }) => updateQuery(id, query),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
      setDrawerOpen(false);
      toast.success('Query has been updated successfully');
    },
    onError: (error) => {
      console.error('Error updating query:', error);
      toast.error('Failed to update query');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteQuery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
      setDeleteModalOpen(false);
      toast.success('Query has been deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting query:', error);
      toast.error('Failed to delete query');
    }
  });

  const executeMutation = useMutation({
    mutationFn: (id: number) => executeQuery(id),
    onMutate: (id) => {
      setExecutingQueryId(id);
      setProgressValue(0);
      // Start progress animation
      const interval = setInterval(() => {
        setProgressValue(prevValue => {
          const newValue = prevValue + 5;
          if (newValue >= 95) {
            clearInterval(interval);
            return 95; // Keep at 95% until completion
          }
          return newValue;
        });
      }, 100);
      
      return { interval };
    },
    onSuccess: (data) => {
      setProgressValue(100);
      setTimeout(() => {
        setProgressValue(0);
        setExecutingQueryId(null);
        queryClient.invalidateQueries({ queryKey: ['queries'] });
        toast.success(`Query executed successfully at ${moment(data.executedAt).format('LLL')}`);
      }, 500); // Show 100% complete for a brief moment
    },
    onError: (error, variables, context) => {
      console.error('Error executing query:', error);
      // Clear the interval if it exists
      if (context && 'interval' in context) {
        clearInterval(context.interval as NodeJS.Timeout);
      }
      setProgressValue(0);
      setExecutingQueryId(null);
      toast.error('Failed to execute query');
    },
    onSettled: (data, error, variables, context) => {
      // Clear the interval if it exists
      if (context && 'interval' in context) {
        clearInterval(context.interval as NodeJS.Timeout);
      }
    }
  });

  const handleExecute = (id: number) => {
    executeMutation.mutate(id);
  };

  const showDeleteConfirm = (id: number) => {
    setQueryToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (queryToDelete !== null) {
      deleteMutation.mutate(queryToDelete);
    }
  };

  const handleEdit = (query: PedCollectorQuery) => {
    setEditingQuery(query);
    form.setFieldsValue({
      query: query.query,
    });
    setDrawerOpen(true);
  };

  const handleAddNew = () => {
    setEditingQuery(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const onFinish = (values: QueryFormData) => {
    if (editingQuery) {
      updateMutation.mutate({ id: editingQuery.id, query: values.query });
    } else {
      createMutation.mutate(values.query);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Query',
      dataIndex: 'query',
      key: 'query',
      ellipsis: true,
    },
    {
      title: 'Created',
      dataIndex: 'insertDatetime',
      key: 'insertDatetime',
      render: (text: string) => moment(text).format('LLL'),
    },
    {
      title: 'Last Updated',
      dataIndex: 'updateDatetime',
      key: 'updateDatetime',
      render: (text: string) => moment(text).format('LLL'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PedCollectorQuery) => (
        <Space size="small">
          {executingQueryId === record.id ? (
            <div style={{ width: '100%' }}>
              <Button
                type="default"
                icon={<LoadingOutlined />}
                disabled
                size="small"
              />
              <Progress percent={progressValue} size="small" status="active" />
            </div>
          ) : (
            <Button
              type="default"
              icon={<PlayCircleOutlined />}
              onClick={() => handleExecute(record.id)}
              title="Run Query"
              disabled={executeMutation.isPending}
              size="small"
            />
          )}
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Edit Query"
            size="small"
          />
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
            title="Delete Query"
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <Header>
        <Title level={2}>PED Collector Queries</Title>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
        >
          Add New Query
        </Button>
      </Header>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <LoadingOutlined style={{ fontSize: 24 }} />
          <p>Loading queries...</p>
        </div>
      ) : isError ? (
        <EmptyState message="There was an error loading queries. Please try again later." />
      ) : queries.length === 0 ? (
        <EmptyState message="No queries found. Add your first query to get started." />
      ) : (
        <Table 
          dataSource={queries} 
          columns={columns} 
          rowKey="id"
          bordered
          pagination={{ pageSize: 10 }}
        />
      )}

      {/* Form Drawer */}
      <Drawer
        title={editingQuery ? 'Edit Query' : 'Create New Query'}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="query"
            label="Query Text"
            rules={[{ required: true, message: 'Please enter query text' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Enter search query text"
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingQuery ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Collector Query"
        open={deleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ 
          danger: true, 
          loading: deleteMutation.isPending 
        }}
      >
        <p>Are you sure you want to delete this query? This action cannot be undone.</p>
      </Modal>
    </Container>
  );
};

export default Queries;
