// app/components/admin/kyc/KYCDetail.tsx
'use client';
import React, { useEffect, useState } from 'react';
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
import { Textarea } from '@/app/components/ui/textarea';
import {
  User,
  Building,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Calendar,
  MapPin,
  FileQuestion,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';

const KYCDetail = () => {
  const params = useParams();
  const { currentReview, loading, error, fetchReview, updateReview } =
    useKycReview();
  const kycId = parseInt(params.id as string);

  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'verify' | 'reject' | 'request_info' | null;
  }>({ open: false, action: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  // Alert states
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState<React.ReactNode>('');
  const [alertError, setAlertError] = useState<string | null>(null);
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertAction, setAlertAction] = useState<() => void>(() => {});

  useEffect(() => {
    if (kycId) {
      fetchReview(kycId);
    }
  }, [kycId, fetchReview]);

  const showAlert = (
    title: string,
    message: React.ReactNode,
    action: () => void,
    error?: string,
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertError(error || null);
    setAlertAction(() => action);
    setAlertOpen(true);
  };

  const handleAction = async () => {
    if (!currentReview || !actionDialog.action) return;

    try {
      setAlertLoading(true);
      await updateReview(currentReview.id, {
        action: actionDialog.action,
        rejection_reason:
          actionDialog.action === 'reject' ? rejectionReason : undefined,
        review_notes: // Changed from 'notes' to 'review_notes'
          actionDialog.action === 'verify' ? reviewNotes : undefined,
      });

      showAlert(
        'Success',
        `KYC has been ${actionDialog.action}ed successfully`,
        () => {
          setActionDialog({ open: false, action: null });
          setRejectionReason('');
          setReviewNotes('');
        },
      );
    } catch (error: any) {
      showAlert(
        'Error',
        'Failed to update KYC review',
        () => setActionDialog({ open: false, action: null }),
        error.message,
      );
    } finally {
      setAlertLoading(false);
    }
  };

  const handleDownloadDocument = (documentType: string) => {
    const document = currentReview?.documents?.find(
      (doc: any) => doc.document_type === documentType,
    );

    if (document?.file_url) {
      window.open(document.file_url, '_blank');
    } else {
      showAlert(
        'Error',
        'Document not available for download',
        () => {},
        'The document may not have been uploaded or processed yet.',
      );
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: Clock },
      in_review: { variant: 'default', icon: Clock },
      verified: { variant: 'success', icon: CheckCircle },
      rejected: { variant: 'destructive', icon: XCircle },
      expired: { variant: 'outline', icon: Clock },
    };

    const config =
      statusConfig[currentReview?.status as keyof typeof statusConfig] ||
      statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge
        variant={config.variant as any}
        className="flex items-center gap-1"
      >
        <Icon className="h-3 w-3" />
        {currentReview?.status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getKycTypeIcon = () => {
    const icons = {
      investor: User,
      issuer: Building,
      both: FileText,
    };

    const Icon = icons[currentReview?.kyc_type as keyof typeof icons] || User;
    return <Icon className="h-5 w-5" />;
  };

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

  const residentialAddress = currentReview.addresses?.find(
    (addr: any) => addr.address_type === 'residential',
  );

  return (
    <div className="p-6 space-y-6">
      {/* Alert Popup */}
      <AlertPopup
        title={alertTitle}
        message={alertMessage}
        isOpen={alertOpen}
        setIsOpen={setAlertOpen}
        onConfirm={alertAction}
        error={alertError}
        loading={alertLoading}
        confirmText="OK"
        confirmButtonClass="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
      />

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
                <div className="font-medium">
                  {currentReview.user?.full_name}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Email
                </div>
                <div className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {currentReview.user?.email}
                </div>
              </div>
            </div>

            <Separator />

            {residentialAddress && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Address
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  {residentialAddress.street}, {residentialAddress.city},{' '}
                  {residentialAddress.country}
                  {residentialAddress.postal_code &&
                    `, ${residentialAddress.postal_code}`}
                </div>
              </div>
            )}

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
              {currentReview.documents?.map((document: any) => (
                <Card key={document.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm capitalize">
                      {document.document_type.replace('_', ' ')}
                    </CardTitle>
                    <CardDescription>
                      Status: {document.verification_status}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        File: {document.file_name || 'No file uploaded'}
                      </div>
                      {document.file_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDownloadDocument(document.document_type)
                          }
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {document.rejection_reason && (
                        <div className="text-sm text-red-500">
                          Reason: {document.rejection_reason}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                onClick={() =>
                  setActionDialog({ open: true, action: 'verify' })
                }
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setActionDialog({ open: true, action: 'reject' })
                }
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setActionDialog({ open: true, action: 'request_info' })
                }
              >
                <FileQuestion className="h-4 w-4 mr-2" />
                Request Information
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Dialogs */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) => setActionDialog({ open, action: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === 'verify' && 'Verify KYC Application'}
              {actionDialog.action === 'reject' && 'Reject KYC Application'}
              {actionDialog.action === 'request_info' &&
                'Request Additional Information'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === 'verify' &&
                'Are you sure you want to verify this KYC application?'}
              {actionDialog.action === 'reject' &&
                'Please provide a reason for rejecting this KYC application.'}
              {actionDialog.action === 'request_info' &&
                'Request additional information from the user.'}
            </DialogDescription>
          </DialogHeader>

          {actionDialog.action === 'verify' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Add review notes (optional)"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
              />
            </div>
          )}

          {actionDialog.action === 'reject' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Reason for rejection *"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </div>
          )}

          {actionDialog.action === 'request_info' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                An email will be sent to the user requesting additional
                information.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ open: false, action: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={
                actionDialog.action === 'reject' && !rejectionReason.trim()
              }
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KYCDetail;