// app/components/financials/FinancialStatementsManager.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import {
  FiFileText,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUpload,
  FiEye,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from '@/app/components/ui/sonner';
import { Skeleton } from '../../ui/Skeleton';
import { financialManagementService } from '../services/financial-management.service';
import Modal from '@/app/components/modal/Modal';
import { Button } from '../../ui/button';
import { useAuth } from '@/app/context/auth/AuthContext';

interface FinancialStatementsManagerProps {
  campaignId: number;
}

const FinancialStatementsManager: React.FC<FinancialStatementsManagerProps> = ({
  campaignId,
}) => {
  const { token, user } = useAuth();
  const [financials, setFinancials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFinancial, setSelectedFinancial] = useState<any>(null);
  const [formData, setFormData] = useState({
    period_type: 'monthly',
    period_start: '',
    period_end: '',
    revenue: '',
    expenses: '',
    assets: '',
    liabilities: '',
    cash_flow: '',
    status: 'draft',
  });

  // Set token in service
  useEffect(() => {
    if (token) {
      financialManagementService.setToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchFinancials();
    }
  }, [campaignId, token]);

  const fetchFinancials = async () => {
    try {
      setLoading(true);
      const response =
        await financialManagementService.getFinancialStatements(campaignId);
      if (response.success) {
        setFinancials(response.financials || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load financial statements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const data = {
        period_type: formData.period_type,
        period_start: formData.period_start,
        period_end: formData.period_end,
        revenue: parseFloat(formData.revenue),
        expenses: parseFloat(formData.expenses),
        assets: formData.assets ? parseFloat(formData.assets) : undefined,
        liabilities: formData.liabilities
          ? parseFloat(formData.liabilities)
          : undefined,
        cash_flow: formData.cash_flow
          ? parseFloat(formData.cash_flow)
          : undefined,
        status: formData.status,
      };

      const response =
        await financialManagementService.createFinancialStatement(
          campaignId,
          data,
        );

      if (response.success) {
        toast.success('Financial statement created successfully');
        setIsCreateModalOpen(false);
        resetForm();
        fetchFinancials();
      } else {
        toast.error(
          response.errors?.join(', ') || 'Failed to create financial statement',
        );
      }
    } catch (error: any) {
      toast.error(error.message || 'Error creating financial statement');
    }
  };

  const handleUpdate = async () => {
    if (!selectedFinancial) return;

    try {
      const data = {
        period_type: formData.period_type,
        period_start: formData.period_start,
        period_end: formData.period_end,
        revenue: parseFloat(formData.revenue),
        expenses: parseFloat(formData.expenses),
        assets: formData.assets ? parseFloat(formData.assets) : undefined,
        liabilities: formData.liabilities
          ? parseFloat(formData.liabilities)
          : undefined,
        cash_flow: formData.cash_flow
          ? parseFloat(formData.cash_flow)
          : undefined,
        status: formData.status,
      };

      const response =
        await financialManagementService.updateFinancialStatement(
          campaignId,
          selectedFinancial.id,
          data,
        );

      if (response.success) {
        toast.success('Financial statement updated successfully');
        setIsEditModalOpen(false);
        resetForm();
        fetchFinancials();
      } else {
        toast.error(
          response.errors?.join(', ') || 'Failed to update financial statement',
        );
      }
    } catch (error: any) {
      toast.error(error.message || 'Error updating financial statement');
    }
  };

  const handleDelete = async (financialId: number) => {
    if (!confirm('Are you sure you want to delete this financial statement?')) {
      return;
    }

    try {
      const response =
        await financialManagementService.deleteFinancialStatement(
          campaignId,
          financialId,
        );

      if (response.success) {
        toast.success('Financial statement deleted successfully');
        fetchFinancials();
      } else {
        toast.error('Failed to delete financial statement');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error deleting financial statement');
    }
  };

  const handlePublish = async (financialId: number) => {
    try {
      const response =
        await financialManagementService.publishFinancialStatement(
          campaignId,
          financialId,
        );

      if (response.success) {
        toast.success('Financial statement published successfully');
        fetchFinancials();
      } else {
        toast.error('Failed to publish financial statement');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error publishing financial statement');
    }
  };

  const handleEdit = (financial: any) => {
    setSelectedFinancial(financial);
    setFormData({
      period_type: financial.period_type,
      period_start: format(new Date(financial.period_start), 'yyyy-MM-dd'),
      period_end: format(new Date(financial.period_end), 'yyyy-MM-dd'),
      revenue: financial.revenue.toString(),
      expenses: financial.expenses.toString(),
      assets: financial.assets?.toString() || '',
      liabilities: financial.liabilities?.toString() || '',
      cash_flow: financial.cash_flow?.toString() || '',
      status: financial.status,
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      period_type: 'monthly',
      period_start: '',
      period_end: '',
      revenue: '',
      expenses: '',
      assets: '',
      liabilities: '',
      cash_flow: '',
      status: 'draft',
    });
    setSelectedFinancial(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Published
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Draft
          </Badge>
        );
      case 'archived':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Archived
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-1/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="mb-2 sm:mb-0">
          <h2 className="text-2xl font-bold text-gray-900">
            Financial Statements
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage and publish financial statements for investors
          </p>
        </div>
        <Button
          variant="success"
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto whitespace-nowrap"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add Financial Statement
        </Button>
      </div>

      {financials.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FiFileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Financial Statements
            </h3>
            <p className="text-gray-500 mb-6">
              Start by creating your first financial statement to share with
              investors
            </p>
            <Button
              variant="success"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Create First Statement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {financials.map((financial) => (
            <Card key={financial.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {financial.period_type.charAt(0).toUpperCase() +
                          financial.period_type.slice(1)}{' '}
                        Statement
                      </h3>
                      {getStatusBadge(financial.status)}
                    </div>
                    <p className="text-gray-600">
                      {format(new Date(financial.period_start), 'MMM dd, yyyy')}{' '}
                      - {format(new Date(financial.period_end), 'MMM dd, yyyy')}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>
                        Revenue: {user?.currency?.toUpperCase()}
                        {financial.revenue.toLocaleString()}
                      </span>
                      <span>
                        Expenses: {user?.currency?.toUpperCase()}
                        {financial.expenses.toLocaleString()}
                      </span>
                      <span>
                        Net Income: {user?.currency?.toUpperCase()}
                        {(
                          financial.revenue - financial.expenses
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {financial.source_file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(financial.source_file_url, '_blank')
                        }
                      >
                        <FiEye className="mr-2 h-4 w-4" />
                        View File
                      </Button>
                    )}
                    {financial.status === 'draft' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(financial)}
                        >
                          <FiEdit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePublish(financial.id)}
                        >
                          <FiUpload className="mr-2 h-4 w-4" />
                          Publish
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(financial.id)}
                    >
                      <FiTrash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create Financial Statement"
        size="xlarge"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period_type">Period Type</Label>
              <Select
                value={formData.period_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, period_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period_start">Period Start</Label>
              <Input
                id="period_start"
                type="date"
                value={formData.period_start}
                onChange={(e) =>
                  setFormData({ ...formData, period_start: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="period_end">Period End</Label>
              <Input
                id="period_end"
                type="date"
                value={formData.period_end}
                onChange={(e) =>
                  setFormData({ ...formData, period_end: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue">
                Revenue ({user?.currency?.toUpperCase()})
              </Label>
              <Input
                id="revenue"
                type="number"
                step="0.01"
                value={formData.revenue}
                onChange={(e) =>
                  setFormData({ ...formData, revenue: e.target.value })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenses">
                Expenses ({user?.currency?.toUpperCase()})
              </Label>
              <Input
                id="expenses"
                type="number"
                step="0.01"
                value={formData.expenses}
                onChange={(e) =>
                  setFormData({ ...formData, expenses: e.target.value })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assets">
                Assets ({user?.currency?.toUpperCase()})
              </Label>
              <Input
                id="assets"
                type="number"
                step="0.01"
                value={formData.assets}
                onChange={(e) =>
                  setFormData({ ...formData, assets: e.target.value })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liabilities">
                Liabilities ({user?.currency?.toUpperCase()})
              </Label>
              <Input
                id="liabilities"
                type="number"
                step="0.01"
                value={formData.liabilities}
                onChange={(e) =>
                  setFormData({ ...formData, liabilities: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button variant="success" onClick={handleCreate}>
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit Financial Statement"
        size="xlarge"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_period_type">Period Type</Label>
              <Select
                value={formData.period_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, period_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_period_start">Period Start</Label>
              <Input
                id="edit_period_start"
                type="date"
                value={formData.period_start}
                onChange={(e) =>
                  setFormData({ ...formData, period_start: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_period_end">Period End</Label>
              <Input
                id="edit_period_end"
                type="date"
                value={formData.period_end}
                onChange={(e) =>
                  setFormData({ ...formData, period_end: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_revenue">
                Revenue ({user?.currency?.toUpperCase()})
              </Label>
              <Input
                id="edit_revenue"
                type="number"
                step="0.01"
                value={formData.revenue}
                onChange={(e) =>
                  setFormData({ ...formData, revenue: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_expenses">
                Expenses ({user?.currency?.toUpperCase()})
              </Label>
              <Input
                id="edit_expenses"
                type="number"
                step="0.01"
                value={formData.expenses}
                onChange={(e) =>
                  setFormData({ ...formData, expenses: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button variant="success" onClick={handleUpdate}>
              Update
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FinancialStatementsManager;
