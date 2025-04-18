// app/components/campaign/CampaignTeamDocuments.tsx
'use client';
import React, { useState } from 'react';
import {
  FiPlus,
  FiUsers,
  FiFileText,
  FiFile,
  FiTrash2,
  FiAlertCircle,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useEquityCampaignContext } from '@/app/context/account/campaign/EquityCampaignContext';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { CampaignTeamMember } from '@/app/types/equityCampaigns.types';

interface TeamDocumentsProps {
  campaignId: string;
}

const CampaignTeamDocuments: React.FC<TeamDocumentsProps> = ({
  campaignId,
}) => {
  const { campaigns } = useCampaignContext();
  const {
    addTeamMember,
    createDocument,
    fetchTeamMembers,
    fetchDocuments,
    removeTeamMember,
    deleteDocument,
  } = useEquityCampaignContext();

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

  // Form states
  const [teamMember, setTeamMember] = useState<Omit<CampaignTeamMember, 'id'>>({
    name: '',
    email: '',
    role: 'founder',
    title: '',
    equity_percentage: 0,
  });
  const [pitchFiles, setPitchFiles] = useState<File[]>([]);
  const [contractFiles, setContractFiles] = useState<File[]>([]);

  const handleAddTeamMember = async () => {
    try {
      await addTeamMember(campaignId, teamMember);
      await fetchTeamMembers(campaignId);
      setActiveModal(null);
      setTeamMember({
        name: '',
        email: '',
        role: 'founder',
        title: '',
        equity_percentage: 0,
      });
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
          } else {
            await deleteDocument(campaignId, Number(id));
            await fetchDocuments(campaignId);
          }
          setIsAlertOpen(false);
          setItemToDelete(null);
        } catch (error) {
          setAlertConfig({
            title: 'Deletion Failed',
            message: 'There was an error deleting the item. Please try again.',
            onConfirm: () => setIsAlertOpen(false),
            onCancel: () => setIsAlertOpen(false),
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
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FiPlus className="mr-1" /> Add
            </button>
          </div>

          <div className="space-y-2">
            {campaigns.find((c) => c.id === Number(campaignId))?.team_members
              ?.length ? (
              campaigns
                .find((c) => c.id === Number(campaignId))
                ?.team_members?.map((member) => (
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
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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

      {/* Modals */}
      <AnimatePresence>
        {/* Team Member Modal */}
        {activeModal === 'team' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Add Team Member</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={teamMember.name}
                    onChange={(e) =>
                      setTeamMember({ ...teamMember, name: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={teamMember.email}
                    onChange={(e) =>
                      setTeamMember({ ...teamMember, email: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>

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

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={teamMember.title}
                    onChange={(e) =>
                      setTeamMember({ ...teamMember, title: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
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
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTeamMember}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Member
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Pitch Documents Modal */}
        {activeModal === 'pitch' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Upload Pitch Documents</h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setPitchFiles(Array.from(e.target.files || []))
                  }
                  className="hidden"
                  id="pitch-upload"
                />
                <label htmlFor="pitch-upload" className="cursor-pointer block">
                  <FiFileText className="mx-auto text-3xl mb-2" />
                  <p>Click to upload files or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF, DOCX, PPTX (Max 10MB each)
                  </p>
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
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadPitchDocuments}
                  disabled={pitchFiles.length === 0}
                  className={`px-4 py-2 rounded-lg ${pitchFiles.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  Upload Documents
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Contract Documents Modal */}
        {activeModal === 'contract' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">
                Upload Contract Documents
              </h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setContractFiles(Array.from(e.target.files || []))
                  }
                  className="hidden"
                  id="contract-upload"
                />
                <label
                  htmlFor="contract-upload"
                  className="cursor-pointer block"
                >
                  <FiFile className="mx-auto text-3xl mb-2" />
                  <p>Click to upload files or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF, DOCX (Max 10MB each)
                  </p>
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
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadContractDocuments}
                  disabled={contractFiles.length === 0}
                  className={`px-4 py-2 rounded-lg ${contractFiles.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  Upload Documents
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampaignTeamDocuments;
