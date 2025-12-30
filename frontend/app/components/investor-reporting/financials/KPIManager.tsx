// app/components/financials/KPIManager.tsx - Add these functions
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/button/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import {
  FiTrendingUp,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiBarChart2,
  FiTarget,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { toast } from '@/app/components/ui/sonner';
import { Skeleton } from '../../ui/Skeleton';
import { financialManagementService } from '../services/financial-management.service';

interface KPIManagerProps {
  campaignId: number;
}

const KPIManager: React.FC<KPIManagerProps> = ({ campaignId }) => {
  const [kpis, setKpis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddValueDialogOpen, setIsAddValueDialogOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    kpi_type: 'financial',
    description: '',
    unit: 'number',
    target_value: '',
    target_period: 'monthly',
    is_primary: false,
    is_public: true,
  });
  const [valueFormData, setValueFormData] = useState({
    period_date: '',
    value: '',
    is_actual: true,
    data_source: '',
  });

  useEffect(() => {
    fetchKPIs();
  }, [campaignId]);

  // ADD THIS FUNCTION
  const resetForm = () => {
    setFormData({
      name: '',
      kpi_type: 'financial',
      description: '',
      unit: 'number',
      target_value: '',
      target_period: 'monthly',
      is_primary: false,
      is_public: true,
    });
  };

  // ADD THIS FUNCTION
  const resetValueForm = () => {
    setValueFormData({
      period_date: '',
      value: '',
      is_actual: true,
      data_source: '',
    });
    setSelectedKpi(null);
  };

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      const response = await financialManagementService.getKPIs(campaignId);
      if (response.success) {
        setKpis(response.kpis || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load KPIs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const data = {
        name: formData.name,
        kpi_type: formData.kpi_type,
        description: formData.description,
        unit: formData.unit,
        target_value: parseFloat(formData.target_value),
        target_period: formData.target_period,
        is_primary: formData.is_primary,
        is_public: formData.is_public,
      };

      const response = await financialManagementService.createKPI(
        campaignId,
        data,
      );

      if (response.success) {
        toast.success('KPI created successfully');
        setIsCreateDialogOpen(false);
        resetForm();
        fetchKPIs();
      } else {
        toast.error(response.errors?.join(', ') || 'Failed to create KPI');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error creating KPI');
    }
  };

  const handleAddValue = async () => {
    if (!selectedKpi) return;

    try {
      const data = {
        period_date: valueFormData.period_date,
        value: parseFloat(valueFormData.value),
        is_actual: valueFormData.is_actual,
        data_source: valueFormData.data_source,
      };

      const response = await financialManagementService.addKPIValue(
        campaignId,
        selectedKpi.id,
        data,
      );

      if (response.success) {
        toast.success('KPI value added successfully');
        setIsAddValueDialogOpen(false);
        resetValueForm();
        fetchKPIs();
      } else {
        toast.error(response.errors?.join(', ') || 'Failed to add KPI value');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error adding KPI value');
    }
  };

  const getKpiTypeColor = (type: string) => {
    switch (type) {
      case 'financial':
        return 'bg-blue-100 text-blue-800';
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'growth':
        return 'bg-purple-100 text-purple-800';
      case 'engagement':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatValue = (value: number, unit: string) => {
    switch (unit) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      default:
        return value.toLocaleString();
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Key Performance Indicators
          </h2>
          <p className="text-gray-600">
            Track and manage important metrics for your campaign
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FiPlus className="mr-2 h-4 w-4" />
              Add KPI
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New KPI</DialogTitle>
              <DialogDescription>
                Define a key performance indicator to track
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">KPI Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Monthly Recurring Revenue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpi_type">KPI Type</Label>
                  <Select
                    value={formData.kpi_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, kpi_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe what this KPI measures..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit of Measurement</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) =>
                      setFormData({ ...formData, unit: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="currency">Currency ($)</SelectItem>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="ratio">Ratio</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_value">Target Value</Label>
                  <Input
                    id="target_value"
                    type="number"
                    step="0.01"
                    value={formData.target_value}
                    onChange={(e) =>
                      setFormData({ ...formData, target_value: e.target.value })
                    }
                    placeholder="Enter target value"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target_period">Target Period</Label>
                  <Select
                    value={formData.target_period}
                    onValueChange={(value) =>
                      setFormData({ ...formData, target_period: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_primary" className="font-medium">
                      Primary KPI
                    </Label>
                    <p className="text-sm text-gray-500">
                      Show on dashboard as primary metric
                    </p>
                  </div>
                  <Switch
                    id="is_primary"
                    checked={formData.is_primary}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_primary: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_public" className="font-medium">
                      Public Visibility
                    </Label>
                    <p className="text-sm text-gray-500">Show to investors</p>
                  </div>
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_public: checked })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create KPI</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {kpis.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FiTrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No KPIs Defined
            </h3>
            <p className="text-gray-500 mb-6">
              Start by creating KPIs to track your campaign's performance
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <FiPlus className="mr-2 h-4 w-4" />
              Create First KPI
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi) => (
            <Card key={kpi.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {kpi.name}
                      </h3>
                      {kpi.is_primary && (
                        <Badge className="bg-blue-100 text-blue-800">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <Badge className={getKpiTypeColor(kpi.kpi_type)}>
                      {kpi.kpi_type}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedKpi(kpi);
                        setIsAddValueDialogOpen(true);
                      }}
                    >
                      <FiPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {kpi.description && (
                  <p className="text-sm text-gray-500 mb-4">
                    {kpi.description}
                  </p>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Current Value</span>
                    <span className="font-semibold text-lg">
                      {kpi.latest_value
                        ? formatValue(kpi.latest_value.value, kpi.unit)
                        : 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Target</span>
                    <span className="font-medium">
                      {formatValue(kpi.target_value, kpi.unit)}
                    </span>
                  </div>

                  {kpi.performance_vs_target && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Performance</span>
                      <span
                        className={`font-medium ${
                          kpi.performance_vs_target.percentage >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {kpi.performance_vs_target.percentage >= 0 ? '+' : ''}
                        {kpi.performance_vs_target.percentage}%
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Visibility</span>
                    <span className="flex items-center gap-1">
                      {kpi.is_public ? (
                        <>
                          <FiEye className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Public</span>
                        </>
                      ) : (
                        <>
                          <FiEyeOff className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Private</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Last updated</span>
                    <span>
                      {kpi.latest_value?.period_date
                        ? new Date(
                            kpi.latest_value.period_date,
                          ).toLocaleDateString()
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Value Dialog */}
      <Dialog
        open={isAddValueDialogOpen}
        onOpenChange={setIsAddValueDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add KPI Value</DialogTitle>
            <DialogDescription>
              Add a new value for {selectedKpi?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="period_date">Date</Label>
              <Input
                id="period_date"
                type="date"
                value={valueFormData.period_date}
                onChange={(e) =>
                  setValueFormData({
                    ...valueFormData,
                    period_date: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={valueFormData.value}
                onChange={(e) =>
                  setValueFormData({ ...valueFormData, value: e.target.value })
                }
                placeholder={`Enter value in ${selectedKpi?.unit}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_source">Data Source</Label>
              <Input
                id="data_source"
                value={valueFormData.data_source}
                onChange={(e) =>
                  setValueFormData({
                    ...valueFormData,
                    data_source: e.target.value,
                  })
                }
                placeholder="e.g., CRM, Analytics, Manual entry"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_actual"
                checked={valueFormData.is_actual}
                onChange={(e) =>
                  setValueFormData({
                    ...valueFormData,
                    is_actual: e.target.checked,
                  })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="is_actual" className="text-sm">
                Actual value (not projected)
              </Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddValueDialogOpen(false);
                resetValueForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddValue}>Add Value</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KPIManager;
