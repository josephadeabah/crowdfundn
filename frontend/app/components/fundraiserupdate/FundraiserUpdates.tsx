import React from 'react';
import Avatar from '@/app/components/avatar/Avatar';

interface Update {
  id: number;
  created_at: string;
  content: string;
}

interface FundraiserUpdatesProps {
  updates: Update[];
  fundraiserName?: string;
}

const FundraiserUpdates: React.FC<FundraiserUpdatesProps> = ({
  updates,
  fundraiserName,
}) => {
  return (
    <div className="max-h-96 overflow-y-auto [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
      {updates.length ? (
        updates.map((update) => (
          <div
            key={update.id}
            className="bg-white dark:bg-gray-800 rounded-sm shadow p-4 mb-4 flex items-start"
          >
            <div className="flex-shrink-0">
              <Avatar name={String(fundraiserName)} size="sm" />
            </div>
            <div className="ml-3">
              <div className="font-semibold text-sm text-gray-600 dark:text-gray-300">
                {new Date(update.created_at).toLocaleString()}
              </div>
              <p className="text-gray-800 dark:text-gray-200 break-words">
                {update.content}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="py-2">No update on this fundraiser yet.</div>
      )}
    </div>
  );
};

export default FundraiserUpdates;
