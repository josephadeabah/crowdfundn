import {
  FormattedTransferLockInfo,
  TransferLockInfo,
} from '../types/auth.login.types';

export const checkUserTransferStatus = async (token: string | null) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/transfer_status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error checking transfer status:', error);
  }

  return { transfer_locked: false, can_make_transfers: true };
};

export const formatTransferLockInfo = (
  lockInfo: TransferLockInfo | null | undefined,
): FormattedTransferLockInfo | null => {
  if (!lockInfo) return null;

  return {
    locked: true,
    reason: lockInfo.reason || 'No reason provided',
    lockedBy: lockInfo.locked_by || 'System',
    lockedAt: lockInfo.locked_at ? new Date(lockInfo.locked_at) : null,
  };
};
