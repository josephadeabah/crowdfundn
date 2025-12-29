// app/components/investor-reporting/NotificationPreferencesModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Mail,
  BellRing,
  Clock,
  CheckCircle,
  AlertCircle,
  Volume2,
  Smartphone,
  Inbox,
  Shield,
  Zap,
  Globe,
  Moon,
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
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Separator } from '@/app/components/ui/separator';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { InvestorReportingService } from './services/investor-reporting.service';
import { Skeleton } from '../ui/Skeleton';

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationPreferences {
  financial_statements: boolean;
  valuation_updates: boolean;
  monthly_reports: boolean;
  quarterly_reports: boolean;
  annual_reports: boolean;
  campaign_updates: boolean;
  portfolio_updates: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  in_app_notifications: boolean;
  summary_frequency: string;
  preferred_time: string;
}

const NotificationPreferencesModal: React.FC<
  NotificationPreferencesModalProps
> = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    financial_statements: true,
    valuation_updates: true,
    monthly_reports: true,
    quarterly_reports: true,
    annual_reports: true,
    campaign_updates: true,
    portfolio_updates: true,
    email_notifications: true,
    push_notifications: true,
    in_app_notifications: true,
    summary_frequency: 'weekly',
    preferred_time: '09:00',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalPreferences, setOriginalPreferences] =
    useState<NotificationPreferences | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPreferences();
    }
  }, [isOpen]);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const service = new InvestorReportingService();
      const response = await service.getNotificationPreferences();

      if (response?.success) {
        setPreferences(response?.preferences ?? {
          financial_statements: true,
          valuation_updates: true,
          monthly_reports: true,
          quarterly_reports: true,
          annual_reports: true,
          campaign_updates: true,
          portfolio_updates: true,
          email_notifications: true,
          push_notifications: true,
          in_app_notifications: true,
          summary_frequency: 'weekly',
          preferred_time: '09:00',
        });
        setOriginalPreferences(response?.preferences ?? null);
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (
    key: keyof NotificationPreferences,
    value: any,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const service = new InvestorReportingService();
      const response = await service.updateNotificationPreferences(preferences);

      if (response?.success) {
        toast.success('Notification preferences updated successfully');
        setOriginalPreferences(preferences);
        setHasChanges(false);
      } else {
        toast.error('Failed to update preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save notification preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalPreferences) {
      setPreferences(originalPreferences);
      setHasChanges(false);
    }
  };

  const notificationTypes = [
    {
      id: 'financial_statements',
      label: 'Financial Statements',
      description: 'Get notified when new financial statements are published',
      icon: <Bell className="h-4 w-4" />,
      default: true,
    },
    {
      id: 'valuation_updates',
      label: 'Valuation Updates',
      description: 'Receive updates when company valuations change',
      icon: <Zap className="h-4 w-4" />,
      default: true,
    },
    {
      id: 'monthly_reports',
      label: 'Monthly Reports',
      description: 'Monthly performance reports from portfolio companies',
      icon: <BellRing className="h-4 w-4" />,
      default: true,
    },
    {
      id: 'quarterly_reports',
      label: 'Quarterly Reports',
      description: 'Quarterly financial and operational reports',
      icon: <Globe className="h-4 w-4" />,
      default: true,
    },
    {
      id: 'annual_reports',
      label: 'Annual Reports',
      description: 'Comprehensive annual performance reviews',
      icon: <CheckCircle className="h-4 w-4" />,
      default: true,
    },
    {
      id: 'campaign_updates',
      label: 'Campaign Updates',
      description: 'Important updates from individual campaigns',
      icon: <AlertCircle className="h-4 w-4" />,
      default: true,
    },
    {
      id: 'portfolio_updates',
      label: 'Portfolio Updates',
      description: 'Overall portfolio performance and insights',
      icon: <Shield className="h-4 w-4" />,
      default: true,
    },
  ];

  const deliveryMethods = [
    {
      id: 'email_notifications',
      label: 'Email',
      description: 'Receive notifications via email',
      icon: <Mail className="h-4 w-4" />,
      default: true,
    },
    {
      id: 'push_notifications',
      label: 'Push',
      description: 'Receive push notifications on your device',
      icon: <Smartphone className="h-4 w-4" />,
      default: true,
    },
    {
      id: 'in_app_notifications',
      label: 'In-App',
      description: 'See notifications within the platform',
      icon: <Inbox className="h-4 w-4" />,
      default: true,
    },
  ];

  const summaryFrequencies = [
    {
      value: 'daily',
      label: 'Daily',
      description: 'Receive daily portfolio summaries',
    },
    {
      value: 'weekly',
      label: 'Weekly',
      description: 'Receive weekly portfolio summaries',
    },
    {
      value: 'monthly',
      label: 'Monthly',
      description: 'Receive monthly portfolio summaries',
    },
    {
      value: 'none',
      label: 'Never',
      description: 'Do not receive summary emails',
    },
  ];

  const timeSlots = [
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xxxlarge"
      closeOnBackdropClick={true}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Notification Preferences</h2>
            <p className="text-muted-foreground">
              Control how and when you receive updates about your investments
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Button variant="outline" onClick={handleReset}>
                Reset Changes
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              variant="success"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            {/* Notification Types */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
                <CardDescription>
                  Choose which types of notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {notificationTypes.map((type) => (
                    <div
                      key={type?.id}
                      className="flex items-start justify-between"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="mt-1">
                          <div className="p-2 rounded-full bg-muted">
                            {type?.icon}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={type?.id} className="font-medium">
                            {type?.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {type?.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        id={type?.id}
                        checked={
                          preferences?.[
                            type?.id as keyof NotificationPreferences
                          ] as boolean
                        }
                        onCheckedChange={(checked) =>
                          handlePreferenceChange(
                            type?.id as keyof NotificationPreferences,
                            checked,
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Methods</CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {deliveryMethods.map((method) => (
                    <div
                      key={method?.id}
                      className="flex items-start justify-between"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="mt-1">
                          <div className="p-2 rounded-full bg-muted">
                            {method?.icon}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={method?.id} className="font-medium">
                            {method?.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {method?.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        id={method?.id}
                        checked={
                          preferences?.[
                            method?.id as keyof NotificationPreferences
                          ] as boolean
                        }
                        onCheckedChange={(checked) =>
                          handlePreferenceChange(
                            method?.id as keyof NotificationPreferences,
                            checked,
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Summary Frequency</CardTitle>
                  <CardDescription>
                    How often you want to receive portfolio summaries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={preferences?.summary_frequency}
                    onValueChange={(value) =>
                      handlePreferenceChange('summary_frequency', value)
                    }
                    className="space-y-3"
                  >
                    {summaryFrequencies.map((freq) => (
                      <div
                        key={freq?.value}
                        className="flex items-center space-x-3"
                      >
                        <RadioGroupItem
                          value={freq?.value}
                          id={`freq-${freq?.value}`}
                        />
                        <Label
                          htmlFor={`freq-${freq?.value}`}
                          className="cursor-pointer"
                        >
                          <div className="font-medium">{freq?.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {freq?.description}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferred Time</CardTitle>
                  <CardDescription>
                    Choose when you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label htmlFor="preferred-time">
                          Daily Notification Time
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Select your preferred time for daily notifications
                        </p>
                      </div>
                    </div>

                    <Select
                      value={preferences?.preferred_time}
                      onValueChange={(value) =>
                        handlePreferenceChange('preferred_time', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-3">
                        <Moon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Quiet Hours</div>
                          <p className="text-sm text-muted-foreground">
                            No notifications between 10 PM and 6 AM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your notification settings quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-4"
                    onClick={() => {
                      const allOn = {
                        financial_statements: true,
                        valuation_updates: true,
                        monthly_reports: true,
                        quarterly_reports: true,
                        annual_reports: true,
                        campaign_updates: true,
                        portfolio_updates: true,
                        email_notifications: true,
                        push_notifications: true,
                        in_app_notifications: true,
                        summary_frequency: 'weekly',
                        preferred_time: '09:00',
                      };
                      setPreferences(allOn);
                      setHasChanges(true);
                    }}
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Enable All</div>
                      <div className="text-xs text-muted-foreground">
                        Turn on all notifications
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto py-4"
                    onClick={() => {
                      const allOff = {
                        financial_statements: false,
                        valuation_updates: false,
                        monthly_reports: false,
                        quarterly_reports: false,
                        annual_reports: false,
                        campaign_updates: false,
                        portfolio_updates: false,
                        email_notifications: false,
                        push_notifications: false,
                        in_app_notifications: false,
                        summary_frequency: 'none',
                        preferred_time: '09:00',
                      };
                      setPreferences(allOff);
                      setHasChanges(true);
                    }}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Mute All</div>
                      <div className="text-xs text-muted-foreground">
                        Turn off all notifications
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto py-4"
                    onClick={() => {
                      const businessHours = {
                        ...preferences,
                        preferred_time: '09:00',
                      };
                      setPreferences(businessHours);
                      setHasChanges(true);
                    }}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Business Hours</div>
                      <div className="text-xs text-muted-foreground">
                        Set to 9 AM business hours
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Settings Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Current Settings Summary</CardTitle>
                <CardDescription>
                  Overview of your current notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="font-medium">Enabled Notifications</div>
                      <div className="flex flex-wrap gap-2">
                        {notificationTypes
                          ?.filter(
                            (type) =>
                              preferences?.[
                                type?.id as keyof NotificationPreferences
                              ],
                          )
                          ?.map((type) => (
                            <Badge key={type?.id} variant="secondary">
                              {type?.label}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="font-medium">Delivery Methods</div>
                      <div className="flex flex-wrap gap-2">
                        {deliveryMethods
                          ?.filter(
                            (method) =>
                              preferences?.[
                                method?.id as keyof NotificationPreferences
                              ],
                          )
                          ?.map((method) => (
                            <Badge key={method?.id} variant="outline">
                              {method?.label}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium">Summary Frequency</div>
                      <div className="text-muted-foreground">
                        {summaryFrequencies?.find(
                          (f) => f?.value === preferences?.summary_frequency,
                        )?.label || 'Not set'}
                      </div>
                    </div>

                    <div>
                      <div className="font-medium">Preferred Time</div>
                      <div className="text-muted-foreground">
                        {preferences?.preferred_time || 'Not set'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {hasChanges ? (
              <span className="text-orange-600">You have unsaved changes</span>
            ) : (
              'All changes saved'
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              variant="success"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationPreferencesModal;