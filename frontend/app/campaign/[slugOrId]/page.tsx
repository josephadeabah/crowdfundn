'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useDonationsContext } from '@/app/context/account/donations/DonationsContext';
import SuggestedCampaignsComponent from '@/app/components/suggestedCampaigns/SuggestedCampaigns';
import SingleCampaignLoader from '@/app/loaders/SingleCampaignLoader';
import Modal from '@/app/components/modal/Modal';
import ToastComponent from '@/app/components/toast/Toast';
import ContactFundraiserForm from '@/app/components/contactfundraiserform/ContactFundraiserForm';
import CampaignDetails from '../CampaignDetails';
import CampaignDonate from '../CampaignDonate';
import CampaignUpdates from '../CampaignUpdates';
import CampaignComments from '../CampaignComments';
import CampaignBackers from '../CampaignBackers';
import CampaignSidebar from '../CampaignSidebar';
import CampaignTabs from '../CampaignTabs';
import CampaignHeader from '../CampaignHeader';

const SingleCampaignPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<
    'details' | 'donate' | 'updates' | 'comments' | 'backers'
  >('details');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });
  const [localLoading, setLocalLoading] = useState(true);

  const tabsRef = useRef<HTMLDivElement>(null);
  const { slugOrId } = useParams() as { slugOrId: string };
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const { currentCampaign, fetchCampaignById, loading, resetCurrentCampaign } =
    useCampaignContext();
  const { user } = useAuth();
  const { fetchPublicDonations } = useDonationsContext();

  const showToast = useCallback(
    (
      title: string,
      description: string,
      type: 'success' | 'error' | 'warning',
    ) => {
      setToast({
        isOpen: true,
        title,
        description,
        type,
      });
    },
    [],
  );

  useEffect(() => {
    if (tabParam === 'donate') {
      setSelectedTab('donate');
    }
  }, [tabParam]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!slugOrId) return;

      setLocalLoading(true);
      try {
        await Promise.all([
          fetchCampaignById(slugOrId),
          fetchPublicDonations(slugOrId, 1, 10),
        ]);

        if (isMounted) {
          setLocalLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setLocalLoading(false);
          showToast('Error', 'Failed to load campaign data', 'error');
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      // Reset campaign when component unmounts
      resetCurrentCampaign?.();
    };
  }, [
    slugOrId,
    fetchCampaignById,
    fetchPublicDonations,
    resetCurrentCampaign,
    showToast,
  ]);

  if (loading || localLoading) return <SingleCampaignLoader />;

  const isEquityCampaign = currentCampaign?.type === 'EquityCampaign';

  return (
    <div key={slugOrId} className="min-h-screen w-full bg-white">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
      <div className="max-w-7xl mx-auto px-2 py-8">
        <Modal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          size="medium"
          closeOnBackdropClick={false}
        >
          <ContactFundraiserForm campaignId={slugOrId} />
        </Modal>
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          {/* Main Content Column */}
          <div className="lg:w-2/3">
            <div className="bg-white p-2 md:px-5 rounded-lg">
              <CampaignHeader campaign={currentCampaign} />

              <CampaignTabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabsRef={tabsRef}
                campaign={currentCampaign}
                isEquityCampaign={isEquityCampaign}
              />

              {/* Tab Content - Only render when not loading */}
              {!loading && selectedTab === 'details' && (
                <CampaignDetails
                  campaign={currentCampaign}
                  isEquityCampaign={isEquityCampaign}
                  showToast={showToast}
                  setIsContactModalOpen={setIsContactModalOpen}
                  user={user}
                />
              )}
              {!loading && selectedTab === 'donate' && (
                <CampaignDonate
                  campaign={currentCampaign}
                  isEquityCampaign={isEquityCampaign}
                />
              )}
              {!loading && selectedTab === 'updates' && (
                <CampaignUpdates campaign={currentCampaign} />
              )}
              {!loading && selectedTab === 'comments' && (
                <CampaignComments campaign={currentCampaign} />
              )}
              {!loading && selectedTab === 'backers' && (
                <CampaignBackers
                  campaign={currentCampaign}
                  isEquityCampaign={isEquityCampaign}
                />
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:w-1/3 border border-gray-700">
            {!loading && <CampaignSidebar campaign={currentCampaign} />}
          </div>
        </div>
        {!loading && (
          <SuggestedCampaignsComponent
            currentCategory={currentCampaign?.category}
          />
        )}
      </div>
    </div>
  );
};

export default SingleCampaignPage;
