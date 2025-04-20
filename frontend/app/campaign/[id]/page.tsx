'use client';
import React, { useEffect, useState, useRef } from 'react';
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

  const tabsRef = useRef<HTMLDivElement>(null);
  const { id } = useParams() as { id: string };
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const { currentCampaign, fetchCampaignById, loading } = useCampaignContext();
  const { user } = useAuth();
  const { fetchPublicDonations } = useDonationsContext();

  const showToast = (
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
  };

  useEffect(() => {
    if (tabParam === 'donate') {
      setSelectedTab('donate');
    }
  }, [tabParam]);

  useEffect(() => {
    if (id) {
      fetchCampaignById(id);
      fetchPublicDonations(id, 1, 10);
    }
  }, [id, fetchCampaignById, fetchPublicDonations]);

  if (loading) return <SingleCampaignLoader />;

  const isEquityCampaign = currentCampaign?.type === 'EquityCampaign';

  return (
    <div className="min-h-screen w-full bg-white">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
      <div className="max-w-7xl mx-auto px-2 py-8 mb-12">
        <Modal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          size="medium"
          closeOnBackdropClick={false}
        >
          <ContactFundraiserForm campaignId={id} />
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

              {/* Tab Content */}
              {selectedTab === 'details' && (
                <CampaignDetails
                  campaign={currentCampaign}
                  isEquityCampaign={isEquityCampaign}
                  showToast={showToast}
                  setIsContactModalOpen={setIsContactModalOpen}
                  user={user}
                />
              )}
              {selectedTab === 'donate' && (
                <CampaignDonate campaign={currentCampaign} />
              )}
              {selectedTab === 'updates' && (
                <CampaignUpdates campaign={currentCampaign} />
              )}
              {selectedTab === 'comments' && (
                <CampaignComments campaign={currentCampaign} />
              )}
              {selectedTab === 'backers' && (
                <CampaignBackers
                  campaign={currentCampaign}
                  isEquityCampaign={isEquityCampaign}
                />
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:w-1/3 border border-gray-700">
            <CampaignSidebar campaign={currentCampaign} />
          </div>
        </div>
        <SuggestedCampaignsComponent
          currentCategory={currentCampaign?.category}
        />
      </div>
    </div>
  );
};

export default SingleCampaignPage;
