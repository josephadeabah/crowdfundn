'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClubDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: {
    name: string;
    description: string;
    balanceLabel: string;
    members: Array<{
      initials: string;
      name: string;
      role: string;
      contributionLabel: string;
    }>;
    investments?: Array<{ title: string; amountLabel: string; status: string }>;
  };
}

export interface Club {
  name: string;
  description: string;
  members: number;
  minContributionLabel: string;
  balanceLabel: string;
}

export interface Member {
  initials: string;
  name: string;
  role: string;
  contributionLabel: string;
}

// ======================
// MODAL COMPONENT
// ======================
const ClubDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  club: Club;
  members: Member[];
}> = ({ isOpen, onClose, club, members }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-4 overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-emerald-900">
              {club.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-gray-700">{club.description}</p>
            <div className="text-sm text-gray-500">
              <strong className="text-emerald-700">Balance:</strong>{' '}
              {club.balanceLabel}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                Members
              </h3>
              <div className="border border-gray-100 rounded-lg divide-y">
                {members.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                        {m.initials}
                      </div>
                      <div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-gray-500">{m.role}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {m.contributionLabel}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Close
            </button>
            <button className="px-4 py-2 rounded-md bg-emerald-700 text-white hover:bg-emerald-800">
              Invest
            </button>
            <button className="px-4 py-2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">
              Vote
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ClubDetailsModal;
