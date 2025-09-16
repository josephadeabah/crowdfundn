'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  FiPlus,
  FiUsers,
  FiFileText,
  FiFile,
  FiTrash2,
  FiAlertCircle,
  FiImage,
  FiLoader,
  FiDollarSign,
  FiBriefcase,
} from 'react-icons/fi';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useEquityCampaignContext } from '@/app/context/account/campaign/EquityCampaignContext';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { CampaignTeamMember } from '@/app/types/equityCampaigns.types';
import Modal from '@/app/components/modal/Modal';
import { Button } from '../ui/button';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';

interface TeamDocumentsProps {
  campaignId: string;
  userCampaigns: CampaignResponseDataType[] | null;
}

const CampaignTeamDocuments: React.FC<TeamDocumentsProps> = ({
  campaignId,
  userCampaigns,
}) => {
  const {
    loading,
    error,
    teamMembers,
    documents,
    addTeamMember,
    createDocument,
    fetchTeamMembers,
    fetchDocuments,
    removeTeamMember,
    deleteDocument,
  } = useEquityCampaignContext();
  const { fetchUserCampaigns } = useCampaignContext();

  const [activeModal, setActiveModal] = useState<
    'team' | 'pitch' | 'contract' | 'financial' | 'business_plan' | null
  >(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'team' | 'pitch' | 'contract' | 'financial' | 'business_plan';
    id: string;
  } | null>(null);
  const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set());

  // Get the current campaign to calculate available equity
  const currentCampaign = userCampaigns?.find(
    (camp) => camp.id === Number(campaignId),
  ) as CampaignResponseDataType | undefined;

  // Replace the equity calculation lines with this:
  const campaignEquityOffered = Number(currentCampaign?.equity_offered) || 0;

  // Calculate total allocated equity to team members
  const totalAllocatedEquity =
    teamMembers?.reduce(
      (total, member) => total + (Number(member.equity_percentage) || 0),
      0,
    ) || 0;

  // Calculate available equity for team members
  const availableEquity = Math.max(0, 100 - campaignEquityOffered);
  const remainingEquity = Math.max(0, availableEquity - totalAllocatedEquity);

  // Helper function to safely format numbers
  const formatPercentage = (value: number): string => {
    return (typeof value === 'number' ? value : 0).toFixed(1);
  };

  // Helper function to get delete error message
  const getDeleteErrorMessage = (type: string): string => {
    switch (type) {
      case 'team':
        return 'Failed to remove team member';
      case 'pitch':
        return 'Failed to delete pitch document';
      case 'contract':
        return 'Failed to delete contract document';
      case 'financial':
        return 'Failed to delete financial statement';
      case 'business_plan':
        return 'Failed to delete business plan';
      default:
        return 'Failed to delete item';
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetchTeamMembers(campaignId);
      fetchDocuments(campaignId);
    }
  }, [campaignId, fetchTeamMembers, fetchDocuments]);

  // Form states
  const [teamMember, setTeamMember] = useState<
    Omit<CampaignTeamMember, 'id'> & { avatar?: File }
  >({
    name: '',
    email: '',
    role: 'founder',
    title: '',
    equity_percentage: 0,
    description: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pitchFiles, setPitchFiles] = useState<File[]>([]);
  const [contractFiles, setContractFiles] = useState<File[]>([]);
  const [financialFiles, setFinancialFiles] = useState<File[]>([]);
  const [businessPlanFiles, setBusinessPlanFiles] = useState<File[]>([]);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setAlertConfig({
          title: 'Invalid File Type',
          message: 'Please upload an image file (JPEG, PNG, GIF)',
          onConfirm: () => setIsAlertOpen(false),
          onCancel: () => setIsAlertOpen(false),
        });
        setIsAlertOpen(true);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setAlertConfig({
          title: 'File Too Large',
          message: 'Please upload an image smaller than 5MB',
          onConfirm: () => setIsAlertOpen(false),
          onCancel: () => setIsAlertOpen(false),
        });
        setIsAlertOpen(true);
        return;
      }

      setTeamMember({ ...teamMember, avatar: file });

      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAvatarInput = () => {
    avatarInputRef.current?.click();
  };

  const handleAddTeamMember = async () => {
    try {
      if (!teamMember.name || !teamMember.avatar) {
        setAlertConfig({
          title: 'Missing Information',
          message: teamMember.avatar
            ? 'Name is required'
            : 'Avatar is required',
          onConfirm: () => setIsAlertOpen(false),
          onCancel: () => setIsAlertOpen(false),
        });
        setIsAlertOpen(true);
        return;
      }

      // Check if the equity allocation exceeds available equity
      if (teamMember.equity_percentage > remainingEquity) {
        setAlertConfig({
          title: 'Insufficient Equity',
          message: `You cannot allocate more than ${remainingEquity}% equity. Only ${remainingEquity}% is available for team members.`,
          onConfirm: () => setIsAlertOpen(false),
          onCancel: () => setIsAlertOpen(false),
        });
        setIsAlertOpen(true);
        return;
      }

      const formData = new FormData();
      formData.append('campaign_team_member[name]', teamMember.name);
      formData.append('campaign_team_member[email]', teamMember.email);
      formData.append('campaign_team_member[role]', teamMember.role);
      formData.append('campaign_team_member[title]', teamMember.title);
      formData.append(
        'campaign_team_member[equity_percentage]',
        teamMember.equity_percentage.toString(),
      );
      formData.append(
        'campaign_team_member[description]',
        teamMember.description || '',
      );
      if (teamMember.avatar) {
        formData.append('campaign_team_member[avatar]', teamMember.avatar);
      }

      await addTeamMember(campaignId, formData);
      await fetchTeamMembers(campaignId);
      await fetchUserCampaigns();

      setActiveModal(null);
      setTeamMember({
        name: '',
        email: '',
        role: 'founder',
        title: '',
        equity_percentage: 0,
        description: '',
      });
      setAvatarPreview(null);
    } catch (error) {
      setAlertConfig({
        title: 'Failed to add team member',
        message: 'There was an error adding the team member. Please try again.',
        onConfirm: () => setIsAlertOpen(false),
        onCancel: () => setIsAlertOpen(false),
      });
      setIsAlertOpen(true);
    }
  };

  const handleUploadPitchDocuments = async () => {
    try {
      if (pitchFiles.length > 0) {
        await createDocument(campaignId, 'pitch', pitchFiles);
        await fetchDocuments(campaignId);
        await fetchUserCampaigns();
        setActiveModal(null);
        setPitchFiles([]);
      }
    } catch (error) {
      setAlertConfig({
        title: 'Failed to upload pitch documents',
        message:
          'There was an error uploading the pitch documents. Please try again.',
        onConfirm: () => setIsAlertOpen(false),
        onCancel: () => setIsAlertOpen(false),
      });
      setIsAlertOpen(true);
    }
  };

  const handleUploadContractDocuments = async () => {
    try {
      if (contractFiles.length > 0) {
        await createDocument(campaignId, 'contract', contractFiles);
        await fetchDocuments(campaignId);
        await fetchUserCampaigns();
        setActiveModal(null);
        setContractFiles([]);
      }
    } catch (error) {
      setAlertConfig({
        title: 'Failed to upload contract documents',
        message:
          'There was an error uploading the contract documents. Please try again.',
        onConfirm: () => setIsAlertOpen(false),
        onCancel: () => setIsAlertOpen(false),
      });
      setIsAlertOpen(true);
    }
  };

  const handleUploadFinancialDocuments = async () => {
    try {
      if (financialFiles.length > 0) {
        await createDocument(campaignId, 'financial_statement', financialFiles);
        await fetchDocuments(campaignId);
        await fetchUserCampaigns();
        setActiveModal(null);
        setFinancialFiles([]);
      }
    } catch (error) {
      setAlertConfig({
        title: 'Failed to upload financial documents',
        message:
          'There was an error uploading the financial documents. Please try again.',
        onConfirm: () => setIsAlertOpen(false),
        onCancel: () => setIsAlertOpen(false),
      });
      setIsAlertOpen(true);
    }
  };

  const handleUploadBusinessPlanDocuments = async () => {
    try {
      if (businessPlanFiles.length > 0) {
        await createDocument(campaignId, 'business_plan', businessPlanFiles);
        await fetchDocuments(campaignId);
        await fetchUserCampaigns();
        setActiveModal(null);
        setBusinessPlanFiles([]);
      }
    } catch (error) {
      setAlertConfig({
        title: 'Failed to upload business plan documents',
        message:
          'There was an error uploading the business plan documents. Please try again.',
        onConfirm: () => setIsAlertOpen(false),
        onCancel: () => setIsAlertOpen(false),
      });
      setIsAlertOpen(true);
    }
  };

  const openDeleteConfirmation = (
    type: 'team' | 'pitch' | 'contract' | 'financial' | 'business_plan',
    id: string,
  ) => {
    setItemToDelete({ type, id });
    setAlertConfig({
      title: 'Confirm Deletion',
      message:
        'Are you sure you want to delete this item? This action cannot be undone.',
      onConfirm: async () => {
        setDeletingItems((prev) => new Set(prev).add(`${type}-${id}`));
        try {
          if (type === 'team') {
            await removeTeamMember(campaignId, Number(id));
            await fetchTeamMembers(campaignId);
          } else {
            await deleteDocument(campaignId, Number(id));
            await fetchDocuments(campaignId);
          }

          // Show success message
          setAlertConfig({
            title: 'Success',
            message: 'Item deleted successfully',
            onConfirm: () => setIsAlertOpen(false),
            onCancel: () => setIsAlertOpen(false),
          });
        } catch (error) {
          // Show error message
          setAlertConfig({
            title: 'Deletion Failed',
            message:
              error instanceof Error
                ? error.message
                : getDeleteErrorMessage(type),
            onConfirm: () => setIsAlertOpen(false),
            onCancel: () => setIsAlertOpen(false),
          });
        } finally {
          setIsAlertOpen(true);
          setItemToDelete(null);
          setDeletingItems((prev) => {
            const newSet = new Set(prev);
            newSet.delete(`${type}-${id}`);
            return newSet;
          });
        }
      },
      onCancel: () => {
        setIsAlertOpen(false);
        setItemToDelete(null);
      },
    });
    setIsAlertOpen(true);
  };

  const closeModal = () => {
    setActiveModal(null);
    setTeamMember({
      name: '',
      email: '',
      role: 'founder',
      title: '',
      equity_percentage: 0,
      description: '',
    });
    setAvatarPreview(null);
    setPitchFiles([]);
    setContractFiles([]);
    setFinancialFiles([]);
    setBusinessPlanFiles([]);
  };

  const isDeleting = (type: string, id: string): boolean => {
    return deletingItems.has(`${type}-${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <AlertPopup
        title={alertConfig.title}
        message={alertConfig.message}
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />

      <h2 className="text-2xl font-semibold mb-6">Team & Documents</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Team Members Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <FiUsers className="mr-2" /> Team Members
            </h3>
            <button
              onClick={() => setActiveModal('team')}
              className="flex items-center px-3 py-1 bg-fundify-primary text-white rounded-md hover:bg-fundify-primary"
            >
              <FiPlus className="mr-1" /> Add
            </button>
          </div>
          {/* Equity Allocation Status */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Equity Allocation</span>
              <span className="text-sm">
                {formatPercentage(totalAllocatedEquity)}% of{' '}
                {formatPercentage(availableEquity)}% allocated
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-fundify-primary h-2 rounded-full"
                style={{
                  width: `${availableEquity > 0 ? (totalAllocatedEquity / availableEquity) * 100 : 0}%`,
                  maxWidth: '100%',
                }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatPercentage(remainingEquity)}% remaining for team members
            </div>
            <span className="text-xs text-orange-800">
              Before launching your campaign, ensure team equity totals exactly{' '}
              {formatPercentage(availableEquity)}%
            </span>
          </div>

          <div className="space-y-2">
            {teamMembers?.length ? (
              teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{member.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {member.role}
                    </p>
                  </div>
                  <div className="flex items-center ml-2 flex-shrink-0">
                    <span className="text-sm mr-2 whitespace-nowrap">
                      {member.equity_percentage}%
                    </span>
                    {isDeleting('team', String(member.id)) ? (
                      <FiLoader className="animate-spin text-gray-500 flex-shrink-0" />
                    ) : (
                      <FiTrash2
                        className="cursor-pointer text-red-600 hover:text-red-800 flex-shrink-0"
                        onClick={() =>
                          openDeleteConfirmation('team', String(member.id))
                        }
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No team members added yet
              </p>
            )}
          </div>
        </div>

        {/* Pitch Documents Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <FiFileText className="mr-2" /> Pitch Documents
            </h3>
            <button
              onClick={() => setActiveModal('pitch')}
              className="flex items-center px-3 py-1 bg-fundify-primary text-white rounded-md hover:bg-fundify-primary"
            >
              <FiPlus className="mr-1" /> Upload
            </button>
          </div>

          <div className="space-y-2">
            {documents?.length ? (
              documents
                .filter((doc) => doc.document_type === 'pitch')
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.display_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {doc.files.length} file
                        {doc.files.length !== 1 ? 's' : ''}
                      </p>
                      <div className="space-y-1 mt-1">
                        {doc.files.map((file) => (
                          <div
                            key={file.uploaded_at}
                            className="text-sm text-gray-400 flex flex-wrap gap-2 items-center"
                          >
                            <span className="whitespace-nowrap">
                              {file.human_size}
                            </span>
                            <span className="truncate flex-1 min-w-0">
                              {file.filename}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {isDeleting('pitch', String(doc.id)) ? (
                        <FiLoader className="animate-spin text-gray-500" />
                      ) : (
                        <FiTrash2
                          className="cursor-pointer text-red-600 hover:text-red-800"
                          onClick={() =>
                            openDeleteConfirmation('pitch', String(doc.id))
                          }
                        />
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No pitch documents uploaded yet
              </p>
            )}
          </div>
        </div>

        {/* Contract Documents Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <FiFile className="mr-2" /> Contract Documents
            </h3>
            <button
              onClick={() => setActiveModal('contract')}
              className="flex items-center px-3 py-1 bg-fundify-primary text-white rounded-md hover:bg-fundify-primary"
            >
              <FiPlus className="mr-1" /> Upload
            </button>
          </div>

          <div className="space-y-2">
            {documents?.length ? (
              documents
                .filter((doc) => doc.document_type === 'contract')
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.display_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {doc.files.length} file
                        {doc.files.length !== 1 ? 's' : ''}
                      </p>
                      <div className="space-y-1 mt-1">
                        {doc.files.map((file) => (
                          <div
                            key={file.uploaded_at}
                            className="text-sm text-gray-400 flex flex-wrap gap-2 items-center"
                          >
                            <span className="whitespace-nowrap">
                              {file.human_size}
                            </span>
                            <span className="truncate flex-1 min-w-0">
                              {file.filename}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {isDeleting('contract', String(doc.id)) ? (
                        <FiLoader className="animate-spin text-gray-500" />
                      ) : (
                        <FiTrash2
                          className="cursor-pointer text-red-600 hover:text-red-800"
                          onClick={() =>
                            openDeleteConfirmation('contract', String(doc.id))
                          }
                        />
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No contract documents uploaded yet
              </p>
            )}
          </div>
        </div>

        {/* Financial Statements Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <FiDollarSign className="mr-2" /> Financial Statements
            </h3>
            <button
              onClick={() => setActiveModal('financial')}
              className="flex items-center px-3 py-1 bg-fundify-primary text-white rounded-md hover:bg-fundify-primary"
            >
              <FiPlus className="mr-1" /> Upload
            </button>
          </div>

          <div className="space-y-2">
            {documents?.length ? (
              documents
                .filter((doc) => doc.document_type === 'financial_statement')
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.display_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {doc.files.length} file
                        {doc.files.length !== 1 ? 's' : ''}
                      </p>
                      <div className="space-y-1 mt-1">
                        {doc.files.map((file) => (
                          <div
                            key={file.uploaded_at}
                            className="text-sm text-gray-400 flex flex-wrap gap-2 items-center"
                          >
                            <span className="whitespace-nowrap">
                              {file.human_size}
                            </span>
                            <span className="truncate flex-1 min-w-0">
                              {file.filename}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {isDeleting('financial', String(doc.id)) ? (
                        <FiLoader className="animate-spin text-gray-500" />
                      ) : (
                        <FiTrash2
                          className="cursor-pointer text-red-600 hover:text-red-800"
                          onClick={() =>
                            openDeleteConfirmation('financial', String(doc.id))
                          }
                        />
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No financial statements uploaded yet
              </p>
            )}
          </div>
        </div>

        {/* Business Plan Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <FiBriefcase className="mr-2" /> Business Plan
            </h3>
            <button
              onClick={() => setActiveModal('business_plan')}
              className="flex items-center px-3 py-1 bg-fundify-primary text-white rounded-md hover:bg-fundify-primary"
            >
              <FiPlus className="mr-1" /> Upload
            </button>
          </div>

          <div className="space-y-2">
            {documents?.length ? (
              documents
                .filter((doc) => doc.document_type === 'business_plan')
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.display_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {doc.files.length} file
                        {doc.files.length !== 1 ? 's' : ''}
                      </p>
                      <div className="space-y-1 mt-1">
                        {doc.files.map((file) => (
                          <div
                            key={file.uploaded_at}
                            className="text-sm text-gray-400 flex flex-wrap gap-2 items-center"
                          >
                            <span className="whitespace-nowrap">
                              {file.human_size}
                            </span>
                            <span className="truncate flex-1 min-w-0">
                              {file.filename}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {isDeleting('business_plan', String(doc.id)) ? (
                        <FiLoader className="animate-spin text-gray-500" />
                      ) : (
                        <FiTrash2
                          className="cursor-pointer text-red-600 hover:text-red-800"
                          onClick={() =>
                            openDeleteConfirmation(
                              'business_plan',
                              String(doc.id),
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No business plan documents uploaded yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Team Member Modal */}
      <Modal isOpen={activeModal === 'team'} onClose={closeModal} size="xlarge">
        <h3 className="text-xl font-bold mb-4">Add Team Member</h3>
        {/* Equity Allocation Info */}
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Available Equity</span>
            <span className="text-sm font-semibold">
              {formatPercentage(remainingEquity)}%
            </span>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-300">
            Campaign equity offered: {formatPercentage(campaignEquityOffered)}%
            | Total allocated to team: {formatPercentage(totalAllocatedEquity)}%
          </div>
        </div>
        <div className="space-y-4">
          {/* Avatar Upload - Full width */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Avatar</label>
            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-center space-x-4">
              <div
                onClick={triggerAvatarInput}
                className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiImage className="text-gray-400 text-xl" />
                )}
              </div>
              <button
                type="button"
                onClick={triggerAvatarInput}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                {avatarPreview ? 'Change' : 'Upload'} Avatar
              </button>
            </div>
          </div>

          {/* Grid for form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name - Left column */}
            <div>
              <label className="block text-sm font-medium mb-1">Name*</label>
              <input
                type="text"
                value={teamMember.name}
                onChange={(e) =>
                  setTeamMember({ ...teamMember, name: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Email - Right column */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={teamMember.email}
                onChange={(e) =>
                  setTeamMember({ ...teamMember, email: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Role - Left column */}
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={teamMember.role}
                onChange={(e) =>
                  setTeamMember({
                    ...teamMember,
                    role: e.target.value as any,
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="founder">Founder</option>
                <option value="advisor">Advisor</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            {/* Title - Right column */}
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={teamMember.title}
                onChange={(e) =>
                  setTeamMember({ ...teamMember, title: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            {/* Empty cell to maintain grid alignment */}
            <div></div>
          </div>

          {/* Equity Percentage - Left column */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Equity Percentage (Max: {formatPercentage(remainingEquity)}%)
            </label>
            <input
              type="number"
              value={teamMember.equity_percentage}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value <= remainingEquity) {
                  setTeamMember({
                    ...teamMember,
                    equity_percentage: value,
                  });
                }
              }}
              className="w-full p-2 border rounded"
              min="0"
              max={remainingEquity}
            />
            {teamMember.equity_percentage > remainingEquity && (
              <p className="text-red-500 text-sm mt-1">
                Cannot exceed available equity of {remainingEquity}%
              </p>
            )}
          </div>
          {/* Description - Full width below the grid */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={teamMember.description}
              onChange={(e) =>
                setTeamMember({
                  ...teamMember,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
        </div>

        {/* Action buttons - Full width */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={closeModal}
            className="px-4 py-2 border rounded-lg"
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddTeamMember}
            disabled={
              !teamMember.name ||
              !teamMember.avatar ||
              teamMember.equity_percentage > remainingEquity ||
              teamMember.equity_percentage <= 0
            }
            className={`px-4 py-2 rounded-lg ${
              !teamMember.name ||
              !teamMember.avatar ||
              teamMember.equity_percentage > remainingEquity ||
              teamMember.equity_percentage <= 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-fundify-primary text-white hover:bg-fundify-primary'
            }`}
            variant="secondary"
            size="lg"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Adding...
              </>
            ) : (
              'Add Member'
            )}
          </Button>
        </div>
      </Modal>

      {/* Pitch Documents Modal */}
      <Modal
        isOpen={activeModal === 'pitch'}
        onClose={closeModal}
        size="medium"
      >
        <h3 className="text-xl font-bold mb-4">Upload Pitch Documents</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            onChange={(e) => setPitchFiles(Array.from(e.target.files || []))}
            className="hidden"
            id="pitch-upload"
          />
          <label htmlFor="pitch-upload" className="cursor-pointer block">
            <FiFileText className="mx-auto text-3xl mb-2" />
            <p>Click to upload files or drag and drop</p>
            <p className="text-sm text-gray-500 mt-1">PDF (Max 10MB each)</p>
          </label>
        </div>

        {pitchFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {pitchFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-100 rounded"
              >
                <span>{file.name}</span>
                <span className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)}MB
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={closeModal}
            className="px-4 py-2 border rounded-lg"
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUploadPitchDocuments}
            disabled={pitchFiles.length === 0}
            className={`px-4 py-2 rounded-lg ${
              pitchFiles.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-fundify-primary text-white hover:bg-fundify-primary'
            }`}
            variant="secondary"
            size="lg"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Uploading...
              </>
            ) : (
              'Upload Documents'
            )}
          </Button>
        </div>
      </Modal>

      {/* Contract Documents Modal */}
      <Modal
        isOpen={activeModal === 'contract'}
        onClose={closeModal}
        size="medium"
      >
        <h3 className="text-xl font-bold mb-4">Upload Contract Documents</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            onChange={(e) => setContractFiles(Array.from(e.target.files || []))}
            className="hidden"
            id="contract-upload"
          />
          <label htmlFor="contract-upload" className="cursor-pointer block">
            <FiFile className="mx-auto text-3xl mb-2" />
            <p>Click to upload files or drag and drop</p>
            <p className="text-sm text-gray-500 mt-1">PDF (Max 10MB each)</p>
          </label>
        </div>

        {contractFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {contractFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-100 rounded"
              >
                <span>{file.name}</span>
                <span className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)}MB
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={closeModal}
            className="px-4 py-2 border rounded-lg"
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUploadContractDocuments}
            disabled={contractFiles.length === 0}
            className={`px-4 py-2 rounded-lg ${
              contractFiles.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-fundify-primary text-white hover:bg-fundify-primary'
            }`}
            variant="secondary"
            size="lg"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Uploading...
              </>
            ) : (
              'Upload Documents'
            )}
          </Button>
        </div>
      </Modal>

      {/* Financial Statements Modal */}
      <Modal
        isOpen={activeModal === 'financial'}
        onClose={closeModal}
        size="medium"
      >
        <h3 className="text-xl font-bold mb-4">Upload Financial Statements</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            onChange={(e) =>
              setFinancialFiles(Array.from(e.target.files || []))
            }
            className="hidden"
            id="financial-upload"
          />
          <label htmlFor="financial-upload" className="cursor-pointer block">
            <FiDollarSign className="mx-auto text-3xl mb-2" />
            <p>Click to upload files or drag and drop</p>
            <p className="text-sm text-gray-500 mt-1">PDF (Max 10MB each)</p>
          </label>
        </div>

        {financialFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {financialFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-100 rounded"
              >
                <span>{file.name}</span>
                <span className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)}MB
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={closeModal}
            className="px-4 py-2 border rounded-lg"
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUploadFinancialDocuments}
            disabled={financialFiles.length === 0}
            className={`px-4 py-2 rounded-lg ${
              financialFiles.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-fundify-primary text-white hover:bg-fundify-primary'
            }`}
            variant="secondary"
            size="lg"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Uploading...
              </>
            ) : (
              'Upload Documents'
            )}
          </Button>
        </div>
      </Modal>

      {/* Business Plan Modal */}
      <Modal
        isOpen={activeModal === 'business_plan'}
        onClose={closeModal}
        size="medium"
      >
        <h3 className="text-xl font-bold mb-4">Upload Business Plan</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            onChange={(e) =>
              setBusinessPlanFiles(Array.from(e.target.files || []))
            }
            className="hidden"
            id="business-plan-upload"
          />
          <label
            htmlFor="business-plan-upload"
            className="cursor-pointer block"
          >
            <FiBriefcase className="mx-auto text-3xl mb-2" />
            <p>Click to upload files or drag and drop</p>
            <p className="text-sm text-gray-500 mt-1">PDF (Max 10MB each)</p>
          </label>
        </div>

        {businessPlanFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {businessPlanFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-100 rounded"
              >
                <span>{file.name}</span>
                <span className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)}MB
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={closeModal}
            className="px-4 py-2 border rounded-lg"
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUploadBusinessPlanDocuments}
            disabled={businessPlanFiles.length === 0}
            className={`px-4 py-2 rounded-lg ${
              businessPlanFiles.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-fundify-primary text-white hover:bg-fundify-primary'
            }`}
            variant="secondary"
            size="lg"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Uploading...
              </>
            ) : (
              'Upload Documents'
            )}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignTeamDocuments;
