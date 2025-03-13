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
import { useRouter } from 'next/navigation'; // Import useRouter

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

interface CampaignData {
  title: string;
  description: string;
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
}

interface FormErrors {
  title: string;
  description: string;
  content: string;
  startDate?: string;
  endDate?: string;
  goalAmount: string;
  category: string;
  currencyCode: string;
  location: string;
}

const CampaignCreator = () => {
  const { userAccountData } = useUserContext();
  const initialCampaignData: CampaignData = {
    title: '',
    description: '',
    content: '',
    activeTab: 'details',
    selectedTemplate: null,
    editorActiveTab: 'editor',
    goalAmount: '',
    category: '',
    currencyCode: '',
    location: '',
  };

  const [campaignData, setCampaignData] = useLocalStorage<CampaignData>(
    'campaign-draft',
    initialCampaignData,
  );
  const [error, setError] = useState<FormErrors>({
    title: '',
    description: '',
    content: '',
    startDate: '',
    endDate: '',
    goalAmount: '',
    category: '',
    currencyCode: '',
    location: '',
  });
  const { addCampaign, loading } = useCampaignContext();
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<React.ReactNode>('');
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentAmount, setCurrentAmount] = useState('0');
  const router = useRouter(); // Initialize useRouter

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedImage(acceptedFiles[0]);
    }
  }, []);

  const setTitle = (value: string) =>
    setCampaignData({ ...campaignData, title: value });
  const setDescription = (value: string) =>
    setCampaignData({ ...campaignData, description: value });
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

  useEffect(() => {
    const hasSavedData = Object.values(campaignData).some(
      (value) =>
        value !== null &&
        value !== '' &&
        !(value instanceof Object && Object.keys(value).length === 0),
    );

    if (hasSavedData && campaignData !== initialCampaignData) {
      toast.info('Your draft campaign has been restored', {
        description: 'Continue where you left off',
        duration: 3000,
      });
    }
  }, [campaignData, initialCampaignData]);

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
  }, [userAccountData]);

  const validateForm = (): boolean => {
    const formErrors: FormErrors = {
      title: '',
      description: '',
      content: '',
      startDate: '',
      endDate: '',
      goalAmount: '',
      category: '',
      currencyCode: '',
      location: '',
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

  const handleSaveCampaign = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const formData = new FormData();
    formData.append('campaign[title]', campaignData.title);
    formData.append('campaign[description]', campaignData.description);
    formData.append('campaign[content]', campaignData.content);
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
    if (selectedImage) {
      formData.append('campaign[media]', selectedImage);
    }

    try {
      const createdCampaign = await addCampaign(formData);
      setAlertTitle('Campaign created successfully');
      setAlertMessage(
        <a href="/account#Campaigns" className="text-gray-700 underline">
          View created campaign in the "Campaigns" tab
        </a>,
      );
      setCampaignData(initialCampaignData);
      localStorage.removeItem('campaign-draft');
    } catch (err) {
      setAlertTitle('Failed to create campaign');
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
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
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
                  className="data-[state=active]:bg-emerald-900 data-[state=active]:text-primary-foreground"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Campaign Details
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="data-[state=active]:bg-emerald-900 data-[state=active]:text-primary-foreground"
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
                      description={campaignData.description}
                      setDescription={setDescription}
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
                      onContinue={() => setActiveTab('content')}
                      currencies={CURRENCIES}
                      categories={categories}
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
                      description={campaignData.description}
                      category={campaignData.category}
                      location={campaignData.location}
                      goalAmount={campaignData.goalAmount}
                      currencyCode={campaignData.currencyCode}
                      currencies={CURRENCIES}
                      startDate={campaignData.startDate}
                      endDate={campaignData.endDate}
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
        onConfirm={() => {
          setAlertOpen(false); // Close the popup
          if (alertTitle === 'Campaign created successfully') {
            router.push('/account#Campaigns'); // Navigate to /account#Campaigns
          }
        }}
        icon={
          alertTitle === 'Campaign created successfully' ? (
            <FaCheck className="w-6 h-6 text-green-600" />
          ) : (
            <FaExclamationTriangle className="w-6 h-6 text-red-600" />
          )
        }
      />
    </>
  );
};

export default CampaignCreator;
