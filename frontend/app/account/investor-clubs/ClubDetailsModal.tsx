// app/account/investor-clubs/ClubDetailsModal.tsx
'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Club, Member } from './clubTypes';

interface ClubDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club;
  members: Member[];
}

// ======================
// MODAL COMPONENT
// ======================
const ClubDetailsModal: React.FC<ClubDetailsModalProps> = ({
  isOpen,
  onClose,
  club,
  members,
}) => {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getMemberInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-4 overflow-hidden max-h-[90vh] flex flex-col"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-semibold text-emerald-900">
                  {club.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{club.mission}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Club Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  About
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {club.mission || 'No description available.'}
                </p>
              </div>

              {/* Club Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Club Balance</div>
                  <div className="text-xl font-bold text-emerald-700">
                    {formatCurrency(club.financials.current_balance)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">
                    Minimum Contribution
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(club.minimum_monthly_contribution)}/month
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Members</div>
                  <div className="text-xl font-bold text-gray-900">
                    {club.current_members_count}/{club.max_members}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Club Type</div>
                  <div className="text-xl font-bold text-gray-900 capitalize">
                    {club.access_type}
                  </div>
                </div>
              </div>

              {/* Members Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Members ({members.length})
                </h3>
                <div className="border border-gray-200 rounded-lg divide-y">
                  {members.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No members found
                    </div>
                  ) : (
                    members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold text-sm">
                            {getMemberInitials(member.user.full_name)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {member.user.full_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  member.role === 'creator'
                                    ? 'bg-purple-100 text-purple-800'
                                    : member.role === 'admin'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {formatRole(member.role)}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  member.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : member.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {member.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(member.total_contributed)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.current_share.toFixed(1)}% share
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Additional Club Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Investment Focus
                </h4>
                <p className="text-gray-700">
                  {club.investment_focus || 'General investments'}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                >
                  Close
                </button>
                {club.is_admin && (
                  <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium transition-colors">
                    Manage Club
                  </button>
                )}
                {!club.is_member && (
                  <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium transition-colors">
                    Join Club
                  </button>
                )}
                {club.is_member && (
                  <button className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-medium transition-colors">
                    Make Contribution
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClubDetailsModal;
