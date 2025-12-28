// app/components/investor-reporting/PortfolioStatementModal.tsx
'use client';

import React, { useState } from 'react';
import {
  Download,
  Calendar,
  FileText,
  Printer,
  Share2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  PieChart,
  BarChart3,
} from 'lucide-react';
import Modal from '@/app/components/modal/Modal';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { toast } from 'sonner';
// Add missing Label import
import { Label } from '@/app/components/ui/label';
// Add missing Mail import
import { Mail } from 'lucide-react';
import { formatDate } from '@/app/utils/helpers/formatters';

interface PortfolioStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

const PortfolioStatementModal: React.FC<PortfolioStatementModalProps> = ({
  isOpen,
  onClose,
  onDownload,
}) => {
  const [period, setPeriod] = useState('current');
  const [format, setFormat] = useState('pdf');
  const [generating, setGenerating] = useState(false);

  const handleGenerateStatement = async () => {
    try {
      setGenerating(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Portfolio statement generated successfully');

      // Trigger download
      onDownload();
    } catch (error) {
      console.error('Error generating statement:', error);
      toast.error('Failed to generate portfolio statement');
    } finally {
      setGenerating(false);
    }
  };

  const periods = [
    {
      value: 'current',
      label: 'Current Month',
      description: 'Statement for current month',
    },
    {
      value: 'last_month',
      label: 'Last Month',
      description: 'Statement for previous month',
    },
    {
      value: 'quarter',
      label: 'This Quarter',
      description: 'Q1 2024 statement',
    },
    {
      value: 'year',
      label: 'Year to Date',
      description: 'January 2024 to present',
    },
    {
      value: 'custom',
      label: 'Custom Period',
      description: 'Select custom dates',
    },
  ];

  const formats = [
    { value: 'pdf', label: 'PDF', description: 'Standard PDF format' },
    { value: 'excel', label: 'Excel', description: 'Spreadsheet for analysis' },
    { value: 'csv', label: 'CSV', description: 'Comma-separated values' },
    {
      value: 'print',
      label: 'Print Format',
      description: 'Optimized for printing',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xlarge"
      closeOnBackdropClick={true}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Portfolio Statement</h2>
            <p className="text-muted-foreground">
              Generate and download your investment portfolio statement
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Statement Configuration</CardTitle>
            <CardDescription>
              Customize your portfolio statement before generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2">
                    Statement Period
                  </Label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger>
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          <div>
                            <div className="font-medium">{p.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {p.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2">
                    Statement Format
                  </Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <FileText className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          <div>
                            <div className="font-medium">{f.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {f.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2">
                    Include Sections
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">Portfolio Summary</div>
                        <div className="text-sm text-muted-foreground">
                          Investment overview and totals
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">Performance Analysis</div>
                        <div className="text-sm text-muted-foreground">
                          ROI, returns, and growth metrics
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">Campaign Details</div>
                        <div className="text-sm text-muted-foreground">
                          Individual investment breakdowns
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Statement Preview</CardTitle>
            <CardDescription>
              Preview of what your statement will include
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">
                    INVESTMENT PORTFOLIO STATEMENT
                  </h3>
                </div>
                <div className="text-sm text-muted-foreground">
                  Generated on {formatDate(new Date().toISOString())} | Period:{' '}
                  {periods.find((p) => p.value === period)?.label ||
                    'Current Month'}
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">
                    Total Invested
                  </div>
                  <div className="text-2xl font-bold">₵125,000</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">
                    Current Value
                  </div>
                  <div className="text-2xl font-bold">₵145,250</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">
                    Total Returns
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ₵20,250
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div>
                <h4 className="font-medium mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Return on Investment (ROI)</span>
                    <span className="font-medium text-green-600">16.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">
                      Internal Rate of Return (IRR)
                    </span>
                    <span className="font-medium">12.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">
                      Multiple on Invested Capital (MOIC)
                    </span>
                    <span className="font-medium">1.16x</span>
                  </div>
                </div>
              </div>

              {/* Campaigns */}
              <div>
                <h4 className="font-medium mb-3">Portfolio Holdings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>TechStart Inc.</span>
                    <span>₵45,000 (36%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GreenEnergy Solutions</span>
                    <span>₵35,000 (28%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>HealthTech Innovations</span>
                    <span>₵25,000 (20%)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t text-center text-sm text-muted-foreground">
                This is a preview. The full statement will include detailed
                breakdowns and analysis.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generation Options */}
        <Card>
          <CardHeader>
            <CardTitle>Generation Options</CardTitle>
            <CardDescription>
              Choose how you want to generate your statement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex-col gap-3"
                onClick={() => {
                  toast.info('Email delivery feature coming soon');
                }}
              >
                <Mail className="h-8 w-8" />
                <div>
                  <div className="font-medium">Email Delivery</div>
                  <div className="text-xs text-muted-foreground">
                    Receive via email
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex-col gap-3"
                onClick={handleGenerateStatement}
                disabled={generating}
              >
                {generating ? (
                  <Clock className="h-8 w-8 animate-spin" />
                ) : (
                  <Download className="h-8 w-8" />
                )}
                <div>
                  <div className="font-medium">Download Now</div>
                  <div className="text-xs text-muted-foreground">
                    Direct download
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex-col gap-3"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer className="h-8 w-8" />
                <div>
                  <div className="font-medium">Print Directly</div>
                  <div className="text-xs text-muted-foreground">
                    Send to printer
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Statements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Statements</CardTitle>
            <CardDescription>
              Access your previously generated statements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  date: '2024-03-01',
                  period: 'February 2024',
                  format: 'PDF',
                  size: '1.2 MB',
                },
                {
                  date: '2024-02-01',
                  period: 'January 2024',
                  format: 'PDF',
                  size: '1.1 MB',
                },
                {
                  date: '2024-01-01',
                  period: 'Q4 2023',
                  format: 'PDF',
                  size: '2.3 MB',
                },
              ].map((stmt, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <div className="font-medium">{stmt.period} Statement</div>
                      <div className="text-sm text-muted-foreground">
                        Generated {formatDate(stmt.date)} • {stmt.format} •{' '}
                        {stmt.size}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Statements are generated in real-time with the latest available data
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleGenerateStatement} disabled={generating}>
              {generating ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Statement
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PortfolioStatementModal;
