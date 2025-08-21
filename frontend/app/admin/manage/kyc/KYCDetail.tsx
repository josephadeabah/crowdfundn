// app/components/admin/kyc/KYCDetail.tsx
'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useKycReview } from '@/app/context/kyc/KycReviewContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/seperator';
import {
  User,
  Building,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IdCard,
} from 'lucide-react';
import { format } from 'date-fns';

const KYCDetail = () => {
  const params = useParams();
  const { currentReview, loading, error, fetchReview, updateReview } =
    useKycReview();
  const kycId = parseInt(params.id as string);

  useEffect(() => {
    if (kycId) {
      fetchReview(kycId);
    }
  }, [kycId, fetchReview]);

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !currentReview) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              {error || 'KYC application not found'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: Clock },
      in_review: { variant: 'default', icon: Clock },
      verified: { variant: 'success', icon: CheckCircle },
      rejected: { variant: 'destructive', icon: XCircle },
      expired: { variant: 'outline', icon: Clock },
    };

    const config =
      statusConfig[currentReview.status as keyof typeof statusConfig] ||
      statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge
        variant={config.variant as any}
        className="flex items-center gap-1"
      >
        <Icon className="h-3 w-3" />
        {currentReview.status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getKycTypeIcon = () => {
    const icons = {
      investor: User,
      issuer: Building,
      both: FileText,
    };

    const Icon = icons[currentReview.kyc_type as keyof typeof icons] || User;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">KYC Application Details</h1>
          <p className="text-muted-foreground">
            Reference: {currentReview.reference}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(currentReview.status)}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Documents
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Name
                </div>
                <div className="font-medium">{currentReview.user_name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Email
                </div>
                <div className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {currentReview.user_email}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Personal Details
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">
                    Date of Birth
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {currentReview.date_of_birth
                      ? format(
                          new Date(currentReview.date_of_birth),
                          'MMM dd, yyyy',
                        )
                      : 'Not provided'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Nationality
                  </div>
                  <div>{currentReview.nationality || 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Occupation
                  </div>
                  <div>{currentReview.occupation || 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Source of Funds
                  </div>
                  <div>{currentReview.source_of_funds || 'Not provided'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getKycTypeIcon()}
              KYC Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  KYC Type
                </div>
                <div className="font-medium capitalize">
                  {currentReview.kyc_type}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  ID Type
                </div>
                <div className="font-medium capitalize">
                  {currentReview.verification_type.replace('_', ' ')}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  ID Number
                </div>
                <div className="font-mono">{currentReview.id_number}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  ID Expiry
                </div>
                <div>
                  {currentReview.id_expiry_date
                    ? format(
                        new Date(currentReview.id_expiry_date),
                        'MMM dd, yyyy',
                      )
                    : 'Not provided'}
                </div>
              </div>
            </div>

            <Separator />

            {currentReview.kyc_type !== 'investor' && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Business Information
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Business Name
                    </div>
                    <div>{currentReview.business_name || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Registration Number
                    </div>
                    <div>
                      {currentReview.business_registration_number ||
                        'Not provided'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Tax ID</div>
                    <div>{currentReview.business_tax_id || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Industry
                    </div>
                    <div>
                      {currentReview.business_industry || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Established
                    </div>
                    <div>
                      {currentReview.business_established_date
                        ? format(
                            new Date(currentReview.business_established_date),
                            'MMM dd, yyyy',
                          )
                        : 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Uploaded verification documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">ID Document</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download ID
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Proof of Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Proof
                  </Button>
                </CardContent>
              </Card>
              {currentReview.kyc_type !== 'investor' && (
                <>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        Business Registration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Registration
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Tax Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Tax Docs
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Audit Trail */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Audit Trail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Application Created</div>
                  <div className="text-sm text-muted-foreground">
                    {format(
                      new Date(currentReview.created_at),
                      'MMM dd, yyyy HH:mm',
                    )}
                  </div>
                </div>
              </div>

              {currentReview.verified_at && (
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Verified</div>
                    <div className="text-sm text-muted-foreground">
                      {format(
                        new Date(currentReview.verified_at),
                        'MMM dd, yyyy HH:mm',
                      )}
                    </div>
                    {currentReview.verified_by && (
                      <div className="text-xs text-muted-foreground">
                        By: {currentReview.verified_by}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentReview.rejection_reason && (
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Rejection Reason</div>
                    <div className="text-sm text-muted-foreground">
                      {currentReview.rejection_reason}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Last Updated</div>
                  <div className="text-sm text-muted-foreground">
                    {format(
                      new Date(currentReview.updated_at),
                      'MMM dd, yyyy HH:mm',
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {(currentReview.status === 'pending' ||
        currentReview.status === 'in_review') && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  // Implement verify action
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Implement reject action
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Request Information
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KYCDetail;
