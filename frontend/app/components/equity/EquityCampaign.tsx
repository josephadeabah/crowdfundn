'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Settings, FileText } from 'lucide-react';
import { CampaignTemplate } from '@/app/lib/campaign-templates';
import { toast } from 'sonner';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import CampaignHeader from '@/app/components/campaign/CampaignHeader';
import CampaignDetails from '@/app/components/campaign/CampaignDetails';
import CampaignTips from '@/app/components/campaign/CampaignTips';
import CampaignEditor from '@/app/components/campaign/CampaignEditor';
import CampaignSidebar from '@/app/components/campaign/CampaignSidebar';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useUserContext } from '@/app/context/users/UserContext';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { categories } from '@/app/utils/helpers/categories';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'CAD', symbol: '$' },
  { code: 'AUD', symbol: '$' },
  { code: 'CHF', symbol: 'Fr' },
  { code: 'CNY', symbol: '¥' },
  { code: 'INR', symbol: '₹' },
  { code: 'BRL', symbol: 'R$' },
  { code: 'GHS', symbol: '₵' },
  { code: 'KES', symbol: 'KSh' },
  { code: 'NGN', symbol: '₦' },
  { code: 'SZL', symbol: 'E' },
  { code: 'ZAR', symbol: 'R' },
];

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo?: File | string;
}

interface FeaturedInvestor {
  name: string;
  logo?: File | string;
  description: string;
}

interface Perk {
  title: string;
  description: string;
  minimumInvestment: number;
}

interface DiscoverabilitySettings {
  featured: boolean;
  promoted: boolean;
  seoOptimized: boolean;
}

interface Extras {
  videoPitch?: File | string;
  faq: Array<{ question: string; answer: string }>;
}

interface CampaignData {
  title: string;
  content: string;
  startDate?: Date | string;
  endDate?: Date | string;
  activeTab: string;
  selectedTemplate: CampaignTemplate | null;
  editorActiveTab: string;
  goalAmount: string;
  category: string;
  currencyCode: string;
  location: string;
  image: string;
  // Equity-specific fields
  highlights: string;
  teamMembers: TeamMember[];
  featuredInvestors: FeaturedInvestor[];
  contractTerms: string;
  perks: Perk[];
  discoverabilitySettings: DiscoverabilitySettings;
  extras: Extras;
}

export interface FormErrors {
  title: string;
  content: string;
  startDate?: string;
  endDate?: string;
  goalAmount: string;
  category: string;
  currencyCode: string;
  location: string;
  image: string;
  highlights?: string;
  contractTerms?: string;
}

const EquityCampaign = () => {
  const { userAccountData } = useUserContext();
  const initialCampaignData: CampaignData = {
    title: '',
    content: '',
    activeTab: 'details',
    selectedTemplate: null,
    editorActiveTab: 'editor',
    goalAmount: '',
    category: '',
    currencyCode: '',
    location: '',
    image: '',
    highlights: '',
    teamMembers: [],
    featuredInvestors: [],
    contractTerms: '',
    perks: [],
    discoverabilitySettings: {
      featured: false,
      promoted: false,
      seoOptimized: true,
    },
    extras: {
      faq: [],
    },
  };

  const [campaignData, setCampaignData] = useLocalStorage<CampaignData>(
    'equity-campaign-draft',
    initialCampaignData,
  );
  const [error, setError] = useState<FormErrors>({
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    goalAmount: '',
    category: '',
    currencyCode: '',
    location: '',
    image: '',
    highlights: '',
    contractTerms: '',
  });
  const { addCampaign, loading } = useCampaignContext();
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<React.ReactNode>('');
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentAmount, setCurrentAmount] = useState('0');
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedImage(acceptedFiles[0]);
    }
  }, []);

  // General setters
  const setTitle = (value: string) =>
    setCampaignData({ ...campaignData, title: value });
  const setContent = (value: string) =>
    setCampaignData({ ...campaignData, content: value });
  const setStartDate = (value: Date | string | undefined) =>
    setCampaignData({ ...campaignData, startDate: value });
  const setEndDate = (value: Date | string | undefined) =>
    setCampaignData({ ...campaignData, endDate: value });
  const setActiveTab = (value: string) =>
    setCampaignData({ ...campaignData, activeTab: value });
  const setSelectedTemplate = (value: CampaignTemplate | null) =>
    setCampaignData({ ...campaignData, selectedTemplate: value });
  const setEditorActiveTab = (value: string) =>
    setCampaignData({ ...campaignData, editorActiveTab: value });
  const setGoalAmount = (value: string) =>
    setCampaignData({ ...campaignData, goalAmount: value });
  const setCategory = (value: string) =>
    setCampaignData({ ...campaignData, category: value });
  const setCurrencyCode = (value: string) =>
    setCampaignData({ ...campaignData, currencyCode: value });
  const setLocation = (value: string) =>
    setCampaignData({ ...campaignData, location: value });

  // Equity-specific setters
  const setHighlights = (value: string) =>
    setCampaignData({ ...campaignData, highlights: value });
  const setTeamMembers = (value: TeamMember[]) =>
    setCampaignData({ ...campaignData, teamMembers: value });
  const setFeaturedInvestors = (value: FeaturedInvestor[]) =>
    setCampaignData({ ...campaignData, featuredInvestors: value });
  const setContractTerms = (value: string) =>
    setCampaignData({ ...campaignData, contractTerms: value });
  const setPerks = (value: Perk[]) =>
    setCampaignData({ ...campaignData, perks: value });
  const setDiscoverabilitySettings = (value: DiscoverabilitySettings) =>
    setCampaignData({ ...campaignData, discoverabilitySettings: value });
  const setExtras = (value: Extras) =>
    setCampaignData({ ...campaignData, extras: value });

  useEffect(() => {
    const hasSavedData = Object.values(campaignData).some(
      (value) =>
        value !== null &&
        value !== '' &&
        !(value instanceof Object && Object.keys(value).length === 0),
    );

    if (
      hasSavedData &&
      JSON.stringify(campaignData) !== JSON.stringify(initialCampaignData)
    ) {
      toast.info('Your draft equity campaign has been restored', {
        description: 'Continue where you left off',
        duration: 3000,
      });
    }
  }, [campaignData]);

  useEffect(() => {
    if (userAccountData) {
      setCampaignData((prevData) => ({
        ...prevData,
        category: prevData.category || userAccountData.category || '',
        location: userAccountData.country || '',
        currencyCode: (
          prevData.currencyCode ||
          userAccountData.currency ||
          ''
        ).toUpperCase(),
      }));
    }
    setCurrentAmount('0');
  }, [userAccountData, setCampaignData]);

  const validateForm = (): boolean => {
    const formErrors: FormErrors = {
      title: '',
      content: '',
      startDate: '',
      endDate: '',
      goalAmount: '',
      category: '',
      currencyCode: '',
      location: '',
      image: '',
      highlights: '',
      contractTerms: '',
    };

    if (!campaignData.title.trim()) formErrors.title = 'Title is required';
    if (!campaignData.content.trim())
      formErrors.content = 'Content is required';
    if (!campaignData.startDate)
      formErrors.startDate = 'Start date is required';
    if (!campaignData.endDate) formErrors.endDate = 'End date is required';
    if (!campaignData.goalAmount)
      formErrors.goalAmount = 'Goal amount is required';
    if (!campaignData.category) formErrors.category = 'Category is required';
    if (!campaignData.currencyCode)
      formErrors.currencyCode = 'Currency is required';
    if (!campaignData.location) formErrors.location = 'Location is required';
    if (!selectedImage) {
      formErrors.image = 'An image is required for the campaign';
    }
    if (!campaignData.highlights.trim()) {
      formErrors.highlights = 'Highlights are required';
    }
    if (!campaignData.contractTerms.trim()) {
      formErrors.contractTerms = 'Contract terms are required';
    }

    if (
      campaignData.startDate &&
      campaignData.endDate &&
      new Date(campaignData.startDate) > new Date(campaignData.endDate)
    ) {
      formErrors.endDate = 'End date must be after start date';
    }

    setError(formErrors);
    return Object.values(formErrors).every((err) => !err);
  };

  const handleSelectTemplate = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    setTitle(template.title);
    setContent(template.content);
    toast.success(`Applied "${template.name}" template`);
  };

  const onConfirmAction = () => {
    setAlertOpen(false);
    setAlertMessage('');
    setAlertTitle('');
    window.location.href = '/account#Campaigns';
  };

  const handleSaveCampaign = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const formData = new FormData();
    // Basic campaign data
    formData.append('campaign[title]', campaignData.title);
    formData.append('campaign[description]', campaignData.content);
    formData.append(
      'campaign[current_amount]',
      parseFloat(currentAmount).toString(),
    );
    formData.append('campaign[goal_amount]', campaignData.goalAmount);
    formData.append('campaign[start_date]', campaignData.startDate as string);
    formData.append('campaign[end_date]', campaignData.endDate as string);
    formData.append('campaign[category]', campaignData.category);
    formData.append('campaign[location]', campaignData.location);
    formData.append('campaign[currency]', campaignData.currencyCode);

    // Equity-specific data
    formData.append('campaign[highlights]', campaignData?.highlights);
    formData.append('campaign[contract_terms]', campaignData?.contractTerms);
    formData.append(
      'campaign[discoverability_settings]',
      JSON.stringify(campaignData?.discoverabilitySettings),
    );
    formData.append(
      'campaign[team_members]',
      JSON.stringify(campaignData?.teamMembers),
    );
    formData.append(
      'campaign[featured_investors]',
      JSON.stringify(campaignData?.featuredInvestors),
    );
    formData.append('campaign[perks]', JSON.stringify(campaignData?.perks));
    formData.append('campaign[extras]', JSON.stringify(campaignData?.extras));

    if (selectedImage) {
      formData.append('campaign[media]', selectedImage);
    }

    try {
      const createdCampaign = await addCampaign(formData);
      setAlertTitle('Equity campaign created successfully');
      setAlertMessage(
        <a href="/account#Campaigns" className="text-gray-700 underline">
          View created campaign in the "Campaigns" tab
        </a>,
      );
      setCampaignData(initialCampaignData);
      localStorage.removeItem('equity-campaign-draft');
    } catch (err) {
      setAlertTitle('Failed to create equity campaign');
      setAlertMessage(
        <div>
          {Object.values(error).map((errMsg, index) => (
            <p key={index} className="text-red-500">
              {errMsg}
            </p>
          ))}
        </div>,
      );
    } finally {
      setAlertOpen(true);
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <CampaignHeader />

          <div className="mb-6">
            <Tabs
              defaultValue={campaignData.activeTab}
              value={campaignData.activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-500"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Campaign Details
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-500"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Editor Pane
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 space-y-6 animate-slide-up">
                    <CampaignDetails
                      title={campaignData.title}
                      setTitle={setTitle}
                      category={campaignData.category}
                      setCategory={setCategory}
                      location={campaignData.location}
                      setLocation={setLocation}
                      currencyCode={campaignData.currencyCode}
                      setCurrencyCode={setCurrencyCode}
                      goalAmount={campaignData.goalAmount}
                      setGoalAmount={setGoalAmount}
                      startDate={campaignData.startDate}
                      setStartDate={setStartDate}
                      endDate={campaignData.endDate}
                      setEndDate={setEndDate}
                      content={campaignData.content}
                      setContent={setContent}
                      onContinue={() => setActiveTab('content')}
                      currencies={CURRENCIES}
                      categories={categories}
                      // Equity-specific props
                      // highlights={campaignData?.highlights}
                      // setHighlights={setHighlights}
                      // teamMembers={campaignData?.teamMembers}
                      // setTeamMembers={setTeamMembers}
                      // featuredInvestors={campaignData?.featuredInvestors}
                      // setFeaturedInvestors={setFeaturedInvestors}
                      // contractTerms={campaignData?.contractTerms}
                      // setContractTerms={setContractTerms}
                      // perks={campaignData?.perks}
                      // setPerks={setPerks}
                      // discoverabilitySettings={
                      //   campaignData?.discoverabilitySettings
                      // }
                      // setDiscoverabilitySettings={setDiscoverabilitySettings}
                      // extras={campaignData?.extras}
                      // setExtras={setExtras}
                      // showEquitySections={true}
                    />
                  </div>

                  <div
                    className="lg:col-span-4 space-y-6 animate-slide-up"
                    style={{ animationDelay: '0.2s' }}
                  >
                    <CampaignTips />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div
                    className="lg:col-span-8 space-y-6 animate-slide-up"
                    style={{ animationDelay: '0.1s' }}
                  >
                    <CampaignEditor
                      title={campaignData.title}
                      setTitle={setTitle}
                      content={campaignData.content}
                      setContent={setContent}
                      selectedTemplate={campaignData.selectedTemplate}
                      setSelectedTemplate={setSelectedTemplate}
                      onSave={handleSaveCampaign}
                      onSelectTemplate={handleSelectTemplate}
                      selectedImage={selectedImage}
                      setSelectedImage={setSelectedImage}
                      category={campaignData.category}
                      location={campaignData.location}
                      goalAmount={campaignData.goalAmount}
                      currencyCode={campaignData.currencyCode}
                      currencies={CURRENCIES}
                      startDate={campaignData.startDate}
                      endDate={campaignData.endDate}
                      loading={loading}
                      error={error}
                    />
                  </div>

                  <div
                    className="lg:col-span-4 space-y-6 animate-slide-up"
                    style={{ animationDelay: '0.2s' }}
                  >
                    <CampaignSidebar
                      title={campaignData.title}
                      category={campaignData.category}
                      goalAmount={campaignData.goalAmount}
                      currencyCode={campaignData.currencyCode}
                      startDate={campaignData.startDate}
                      endDate={campaignData.endDate}
                      content={campaignData.content}
                      onViewFullPreview={() => {
                        setActiveTab('content');
                        setEditorActiveTab('preview');
                      }}
                      currencies={CURRENCIES}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <AlertPopup
        title={alertTitle}
        message={alertMessage}
        isOpen={alertOpen}
        setIsOpen={setAlertOpen}
        onConfirm={onConfirmAction}
        icon={
          alertTitle === 'Equity campaign created successfully' ? (
            <FaCheck className="w-6 h-6 text-green-600" />
          ) : (
            <FaExclamationTriangle className="w-6 h-6 text-red-600" />
          )
        }
      />
    </>
  );
};

export default EquityCampaign;
