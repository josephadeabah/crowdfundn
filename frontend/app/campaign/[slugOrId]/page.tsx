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
  const [isSticky, setIsSticky] = useState(false);

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

  // Sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Modal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          size="medium"
          closeOnBackdropClick={false}
        >
          <ContactFundraiserForm campaignId={slugOrId} />
        </Modal>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <CampaignHeader campaign={currentCampaign} />
            </div>

            {/* Sticky Tabs Navigation */}
            <div 
              ref={tabsRef}
              className={`bg-white rounded-lg border border-gray-200 ${
                isSticky 
                  ? 'sticky top-4 z-40 shadow-sm bg-white' 
                  : ''
              }`}
            >
              <CampaignTabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabsRef={tabsRef}
                campaign={currentCampaign}
                isEquityCampaign={isEquityCampaign}
              />
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {!loading && selectedTab === 'details' && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <CampaignDetails
                    campaign={currentCampaign}
                    isEquityCampaign={isEquityCampaign}
                    showToast={showToast}
                    setIsContactModalOpen={setIsContactModalOpen}
                    user={user}
                  />
                </div>
              )}
              
              {!loading && selectedTab === 'donate' && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <CampaignDonate
                    campaign={currentCampaign}
                    isEquityCampaign={isEquityCampaign}
                  />
                </div>
              )}
              
              {!loading && selectedTab === 'updates' && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <CampaignUpdates campaign={currentCampaign} />
                </div>
              )}
              
              {!loading && selectedTab === 'comments' && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <CampaignComments campaign={currentCampaign} />
                </div>
              )}
              
              {!loading && selectedTab === 'backers' && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <CampaignBackers
                    campaign={currentCampaign}
                    isEquityCampaign={isEquityCampaign}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {!loading && <CampaignSidebar campaign={currentCampaign} />}
              </div>
              
              {/* Additional sidebar content */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about this campaign? Our support team is here to help.
                </p>
                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full bg-white text-gray-700 border border-gray-300 font-medium py-2.5 px-4 rounded-lg"
                >
                  Contact Fundraiser
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Campaigns */}
        {!loading && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
              <p className="text-gray-600 mt-2">Discover similar campaigns that need your support</p>
            </div>
            <SuggestedCampaignsComponent
              currentCategory={currentCampaign?.category}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleCampaignPage;