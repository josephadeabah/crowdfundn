// app/components/campaign/CampaignTeamDocuments.tsx
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
} from 'react-icons/fi';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useEquityCampaignContext } from '@/app/context/account/campaign/EquityCampaignContext';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { CampaignTeamMember } from '@/app/types/equityCampaigns.types';
import Modal from '@/app/components/modal/Modal';

interface TeamDocumentsProps {
  campaignId: string;
}

const CampaignTeamDocuments: React.FC<TeamDocumentsProps> = ({
  campaignId,
}) => {
  const { campaigns } = useCampaignContext();
  const {
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
    'team' | 'pitch' | 'contract' | null
  >(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'team' | 'pitch' | 'contract';
    id: string;
  } | null>(null);

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

  const openDeleteConfirmation = (
    type: 'team' | 'pitch' | 'contract',
    id: string,
  ) => {
    setItemToDelete({ type, id });
    setAlertConfig({
      title: 'Confirm Deletion',
      message:
        'Are you sure you want to delete this item? This action cannot be undone.',
      onConfirm: async () => {
        try {
          if (type === 'team') {
            await removeTeamMember(campaignId, Number(id));
            await fetchTeamMembers(campaignId);
            // Show success message
            setAlertConfig({
              title: 'Success',
              message: 'Team member removed successfully',
              onConfirm: () => setIsAlertOpen(false),
              onCancel: () => setIsAlertOpen(false),
            });
          } else {
            await deleteDocument(campaignId, Number(id));
            await fetchDocuments(campaignId);
          }
        } catch (error) {
          setAlertConfig({
            title: 'Deletion Failed',
            message:
              error instanceof Error
                ? error.message
                : 'There was an error deleting the item.',
            onConfirm: () => setIsAlertOpen(false),
            onCancel: () => setIsAlertOpen(false),
          });
        } finally {
          setIsAlertOpen(true);
          setItemToDelete(null);
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

          <div className="space-y-2">
            {teamMembers?.length ? (
              teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {member.role}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">
                      {member.equity_percentage}%
                    </span>
                    <FiTrash2
                      className="cursor-pointer text-red-600"
                      onClick={() =>
                        openDeleteConfirmation('team', String(member.id))
                      }
                    />
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
            {campaigns
              .find((c) => String(c.id) === campaignId)
              ?.documents?.filter((doc) => doc.document_type === 'pitch')
              .length ? (
              campaigns
                .find((c) => c.id === Number(campaignId))
                ?.documents?.filter((doc) => doc.document_type === 'pitch')
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div>
                      <p className="font-medium">{doc.display_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {doc.files.length} file
                        {doc.files.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <FiTrash2
                      className="cursor-pointer text-red-600"
                      onClick={() =>
                        openDeleteConfirmation('pitch', String(doc.id))
                      }
                    />
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
            {campaigns
              .find((c) => c.id === Number(campaignId))
              ?.documents?.filter((doc) => doc.document_type === 'contract')
              .length ? (
              campaigns
                .find((c) => c.id === Number(campaignId))
                ?.documents?.filter((doc) => doc.document_type === 'contract')
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div>
                      <p className="font-medium">{doc.display_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {doc.files.length} file
                        {doc.files.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <FiTrash2
                      className="cursor-pointer text-red-600"
                      onClick={() =>
                        openDeleteConfirmation('contract', String(doc.id))
                      }
                    />
                  </div>
                ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No contract documents uploaded yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Team Member Modal */}
      <Modal isOpen={activeModal === 'team'} onClose={closeModal} size="xlarge">
        <h3 className="text-xl font-bold mb-4">Add Team Member</h3>
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
              Equity Percentage
            </label>
            <input
              type="number"
              value={teamMember.equity_percentage}
              onChange={(e) =>
                setTeamMember({
                  ...teamMember,
                  equity_percentage: Number(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
              min="0"
              max="100"
            />
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
          <button onClick={closeModal} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleAddTeamMember}
            disabled={!teamMember.name || !teamMember.avatar}
            className={`px-4 py-2 rounded-lg ${
              !teamMember.name || !teamMember.avatar
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-fundify-primary text-white hover:bg-fundify-primary'
            }`}
          >
            Add Member
          </button>
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
          <button onClick={closeModal} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleUploadPitchDocuments}
            disabled={pitchFiles.length === 0}
            className={`px-4 py-2 rounded-lg ${
              pitchFiles.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-fundify-primary text-white hover:bg-fundify-primary'
            }`}
          >
            Upload Documents
          </button>
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
          <button onClick={closeModal} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleUploadContractDocuments}
            disabled={contractFiles.length === 0}
            className={`px-4 py-2 rounded-lg ${
              contractFiles.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-fundify-primary text-white hover:bg-fundify-primary'
            }`}
          >
            Upload Documents
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignTeamDocuments;
