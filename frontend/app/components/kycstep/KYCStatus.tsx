// app/components/kyc/KYCStatus.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Calendar,
  UserCheck,
  Building2,
  TrendingUp,
  RefreshCw,
  ArrowUpCircle,
} from 'lucide-react';
import Link from 'next/link';

interface KYCStatusProps {
  compact?: boolean;
  showActions?: boolean;
}

const KYCStatus: React.FC<KYCStatusProps> = ({
  compact = false,
  showActions = true,
}) => {
  const { user, token } = useAuth();
  const [upgradeEligibility, setUpgradeEligibility] = useState<{
    can_upgrade: boolean;
    current_type?: string;
    upgrade_type?: string;
    message?: string;
  } | null>(null);
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);

  useEffect(() => {
    const checkUpgradeEligibility = async () => {
      if (!user?.kyc_status_info?.verified) return;

      setLoadingUpgrade(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/upgrade_status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setUpgradeEligibility(data);
        }
      } catch (error) {
        console.error('Failed to check upgrade eligibility:', error);
      } finally {
        setLoadingUpgrade(false);
      }
    };

    checkUpgradeEligibility();
  }, [user]);

  if (!user) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-0">
        <CardContent className="p-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            Please sign in to view your KYC status
          </div>
        </CardContent>
      </Card>
    );
  }

  const kycInfo = user.kyc_status_info;
  const hasKYC = kycInfo?.has_kyc;
  const isVerified = kycInfo?.verified;
  const isExpired = kycInfo?.is_expired;
  const kycType = kycInfo?.kyc_type;
  const status = kycInfo?.status;
  const verifiedAt = kycInfo?.verified_at;
  const expiresAt = kycInfo?.expires_at;

  const getStatusIcon = () => {
    if (isVerified && !isExpired) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    } else if (isExpired) {
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    } else if (status === 'pending' || status === 'in_review') {
      return <Clock className="h-6 w-6 text-blue-500" />;
    } else if (status === 'rejected') {
      return <XCircle className="h-6 w-6 text-red-500" />;
    }
    return <AlertTriangle className="h-6 w-6 text-gray-500" />;
  };

  const getStatusBadge = () => {
    if (isVerified && !isExpired) {
      return (
        <Badge className="bg-green-100 text-green-800 border-0 dark:bg-green-900/20 dark:text-green-300">
          Verified
        </Badge>
      );
    } else if (isExpired) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-0 dark:bg-yellow-900/20 dark:text-yellow-300">
          Expired
        </Badge>
      );
    } else if (status === 'pending') {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-0 dark:bg-blue-900/20 dark:text-blue-300">
          Pending
        </Badge>
      );
    } else if (status === 'in_review') {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-0 dark:bg-purple-900/20 dark:text-purple-300">
          In Review
        </Badge>
      );
    } else if (status === 'rejected') {
      return (
        <Badge className="bg-red-100 text-red-800 border-0 dark:bg-red-900/20 dark:text-red-300">
          Rejected
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-800 border-0 dark:bg-gray-900/20 dark:text-gray-300">
        Not Started
      </Badge>
    );
  };

  const getKYCTypeIcon = () => {
    switch (kycType) {
      case 'investor':
        return <TrendingUp className="h-4 w-4 mr-1" />;
      case 'issuer':
        return <Building2 className="h-4 w-4 mr-1" />;
      case 'both':
        return <UserCheck className="h-4 w-4 mr-1" />;
      default:
        return <UserCheck className="h-4 w-4 mr-1" />;
    }
  };

  const getKYCTypeText = () => {
    switch (kycType) {
      case 'investor':
        return 'Investor';
      case 'issuer':
        return 'Fundraiser';
      case 'both':
        return 'Full Platform Access';
      default:
        return 'Not Specified';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (compact) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <p className="text-sm font-medium">KYC Status</p>
                <div className="flex items-center space-x-2">
                  {getStatusBadge()}
                  {kycType && (
                    <Badge variant="outline" className="flex items-center">
                      {getKYCTypeIcon()}
                      {getKYCTypeText()}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {showActions && (
              <Link href="/kyc">
                <Button variant="outline" size="sm">
                  {hasKYC ? 'View Details' : 'Start KYC'}
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-gray-800 border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            KYC Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Status Overview */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <div>
                  <p className="text-sm font-medium">Verification Status</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusBadge()}
                    {kycType && (
                      <Badge variant="outline" className="flex items-center">
                        {getKYCTypeIcon()}
                        {getKYCTypeText()}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {showActions && (
                <Link href="/kyc">
                  <Button>
                    {hasKYC ? 'Manage KYC' : 'Start Verification'}
                  </Button>
                </Link>
              )}
            </div>

            {/* Status Details */}
            {hasKYC && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Verification Details</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Status:
                      </span>
                      <span className="font-medium">{status}</span>
                    </div>
                    {verifiedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Verified:
                        </span>
                        <span className="font-medium">
                          {formatDate(verifiedAt)}
                        </span>
                      </div>
                    )}
                    {expiresAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Expires:
                        </span>
                        <span className="font-medium">
                          {formatDate(expiresAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Permissions</h4>
                  <div className="text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Can Invest:
                      </span>
                      <Badge
                        variant={user?.can_invest ? 'default' : 'secondary'}
                        className={
                          user.can_invest
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {user.can_invest ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Can Fundraise:
                      </span>
                      <Badge
                        variant={
                          user.can_create_campaign ? 'default' : 'secondary'
                        }
                        className={
                          user.can_create_campaign
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {user.can_create_campaign ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upgrade Eligibility Banner */}
            {upgradeEligibility?.can_upgrade && (
              <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 dark:from-blue-900/20 dark:to-purple-900/20 dark:border-blue-800">
                <ArrowUpCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 dark:text-blue-200">
                  Free Upgrade Available!
                </AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-300">
                  You can upgrade from {upgradeEligibility.current_type} to Full
                  Platform Access to get both investing and fundraising
                  capabilities.
                </AlertDescription>
              </Alert>
            )}

            {/* Status Alerts */}
            {!hasKYC && (
              <Alert
                variant="default"
                className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Verification Required</AlertTitle>
                <AlertDescription>
                  Complete KYC verification to access investment opportunities
                  and fundraising features.
                </AlertDescription>
              </Alert>
            )}

            {isExpired && (
              <Alert
                variant="destructive"
                className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Verification Expired</AlertTitle>
                <AlertDescription>
                  Your KYC verification has expired. Please renew your
                  verification to continue using platform features.
                </AlertDescription>
              </Alert>
            )}

            {status === 'rejected' && (
              <Alert
                variant="destructive"
                className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
              >
                <XCircle className="h-4 w-4" />
                <AlertTitle>Verification Rejected</AlertTitle>
                <AlertDescription>
                  Your KYC submission was rejected. Please review the
                  requirements and submit again.
                </AlertDescription>
              </Alert>
            )}

            {status === 'pending' && (
              <Alert
                variant="default"
                className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
              >
                <Clock className="h-4 w-4" />
                <AlertTitle>Pending Review</AlertTitle>
                <AlertDescription>
                  Your KYC submission is pending review. This usually takes 1-2
                  business days.
                </AlertDescription>
              </Alert>
            )}

            {status === 'in_review' && (
              <Alert
                variant="default"
                className="bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800"
              >
                <RefreshCw className="h-4 w-4" />
                <AlertTitle>Under Review</AlertTitle>
                <AlertDescription>
                  Your KYC submission is currently being reviewed by our team.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {showActions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!hasKYC && (
            <Card className="bg-white dark:bg-gray-800 border-0">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Get Started</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Begin your KYC verification process to unlock all platform
                  features.
                </p>
                <Link href="/kyc">
                  <Button className="w-full">Start Verification</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {isExpired && (
            <Card className="bg-white dark:bg-gray-800 border-0">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Renew Verification</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Your verification has expired. Click below to renew it.
                </p>
                <Link href="/kyc">
                  <Button className="w-full">Renew KYC</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {status === 'rejected' && (
            <Card className="bg-white dark:bg-gray-800 border-0">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Resubmit Application</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Review the requirements and submit your KYC application again.
                </p>
                <Link href="/kyc">
                  <Button className="w-full">Resubmit KYC</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {upgradeEligibility?.can_upgrade && (
            <Card className="bg-white dark:bg-gray-800 border-0">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Upgrade Access</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Upgrade to Full Platform Access for both investing and
                  fundraising capabilities.
                </p>
                <Link href="/kyc">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Upgrade Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {isVerified && !isExpired && !upgradeEligibility?.can_upgrade && (
            <Card className="bg-white dark:bg-gray-800 border-0">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Verification Details</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  View your verification details and download certificates.
                </p>
                <Link href="/kyc">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default KYCStatus;
