// app/hooks/useKyc.ts
import { useKyc } from '@/app/context/kyc/KycContext';

export const useKycHook = () => {
  const {
    kycs,
    currentKyc,
    loading,
    error,
    fetchKycs,
    fetchKyc,
    createKyc,
    updateKyc,
    deleteKyc,
    submitKyc,
    verifyKyc,
    rejectKyc,
    fetchKycDocuments,
    uploadDocument,
  } = useKyc();

  return {
    kycs,
    currentKyc,
    loading,
    error,
    fetchKycs,
    fetchKyc,
    createKyc,
    updateKyc,
    deleteKyc,
    submitKyc,
    verifyKyc,
    rejectKyc,
    fetchKycDocuments,
    uploadDocument,
  };
};
