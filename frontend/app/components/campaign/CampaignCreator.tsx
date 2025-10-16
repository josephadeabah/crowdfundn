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

// Add stock types and funding rounds constants
const STOCK_TYPES = [
  // Core share classes
  { value: 'common', label: 'Common Stock (Ordinary Shares)' },
  { value: 'preferred', label: 'Preferred Stock (Investor Shares)' },
  { value: 'common_non_voting', label: 'Common Stock (Non-Voting)' },

  // Subtypes of common
  { value: 'founder', label: 'Founder Shares' },
  { value: 'employee_common', label: 'Employee Common Shares (ESOP Pool)' },
  // Stock option plans
  { value: 'iso', label: 'Incentive Stock Options (ISO)' },
  { value: 'nso', label: 'Non-Qualified Stock Options (NSO)' },
  { value: 'esop', label: 'Employee Stock Option Plan (ESOP)' },
  { value: 'rsu', label: 'Restricted Stock Units (RSU)' },
  { value: 'rsa', label: 'Restricted Stock Awards (RSA)' },
  {
    value: 'phantom',
    label: 'Phantom Stock / Stock Appreciation Rights (SAR)',
  },
  // Preferred sub-series (for funding rounds)
  { value: 'series_seed', label: 'Series Seed Preferred' },
  { value: 'series_a', label: 'Series A Preferred' },
  { value: 'series_b', label: 'Series B Preferred' },
  { value: 'series_c', label: 'Series C Preferred' },
  { value: 'series_d', label: 'Series D Preferred' },
  { value: 'mezzanine', label: 'Mezzanine / Convertible Preferred' },
  // Convertible / hybrid instruments
  { value: 'convertible_note', label: 'Convertible Note (Debt to Equity)' },
  { value: 'safe', label: 'SAFE (Simple Agreement for Future Equity)' },
  // Synthetic / alternative equity
  { value: 'profit_interest', label: 'Profit Interest Units (for LLCs)' },
  { value: 'tracking_stock', label: 'Tracking Stock (Division-based)' },
];

const FUNDING_ROUNDS = [
  { value: 'seed', label: 'Seed Round' },
  { value: 'series_a', label: 'Series A' },
  { value: 'series_b', label: 'Series B' },
  { value: 'series_c', label: 'Series C' },
  { value: 'series_d', label: 'Series D' },
  { value: 'growth', label: 'Growth Round' },
  { value: 'mezzanine', label: 'Mezzanine Financing' },
];

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
  valuation?: string;
  equityOffered?: string;
  companyName?: string;
  companyDescription?: string;
  minRaise?: string;
  maxRaise?: string;
  contractType?: string;
  pitchDocuments?: string;
  contractDocuments?: string;
  teamMembers?: string;
  minimumTarget?: string;
  pricePerShare?: string;
  minShares?: string;
  maxShares?: string;
  sharesOffered?: string;
  stockType?: string;
  fundingRound?: string;
}

interface CompanyInfo {
  name: string;
  description: string;
  headquarters: string;
  website: string;
  contract_term?: string;
}

interface CampaignData {
  title: string;
  content: string;
  activeTab: string;
  selectedTemplate: CampaignTemplate | null;
  editorActiveTab: string;
  goalAmount: string;
  category: string;
  currencyCode: string;
  location: string;
  image: string;
  startDate?: string | Date;
  endDate?: string | Date;
  companyInfo: CompanyInfo;
  contractType: string;
  minRaise: string;
  maxRaise: string;
  valuation: string;
  equityOffered: string;
  // New equity offering fields (only essential ones for creation)
  minimumTarget: string;
  pricePerShare: string;
  minShares: string;
  maxShares: string;
  sharesOffered: string;
  stockType: string;
  fundingRound: string;
  // SEC filing fields REMOVED from creation
}

const CampaignCreator = () => {
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
    companyInfo: {
      name: '',
      description: '',
      headquarters: '',
      website: '',
      contract_term: '',
    },
    contractType: '',
    minRaise: '',
    maxRaise: '',
    valuation: '',
    equityOffered: '',
    startDate: undefined,
    endDate: undefined,
    // New equity offering fields
    minimumTarget: '',
    pricePerShare: '',
    minShares: '',
    maxShares: '',
    sharesOffered: '',
    stockType: '',
    fundingRound: '',
  };

  const [campaignData, setCampaignData] = useLocalStorage<CampaignData>(
    'campaign-draft',
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

  // State setters
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
  const setCompanyInfo = (value: CompanyInfo) => {
    setCampaignData({ ...campaignData, companyInfo: value });
  };
  const setContractType = (value: string) =>
    setCampaignData({ ...campaignData, contractType: value });
  const setMinRaise = (value: string) =>
    setCampaignData({ ...campaignData, minRaise: value });
  const setMaxRaise = (value: string) =>
    setCampaignData({ ...campaignData, maxRaise: value });
  const setValuation = (value: string) =>
    setCampaignData({ ...campaignData, valuation: value });
  const setEquityOffered = (value: string) =>
    setCampaignData({ ...campaignData, equityOffered: value });

  // New equity offering field setters (only essential ones)
  const setMinimumTarget = (value: string) =>
    setCampaignData({ ...campaignData, minimumTarget: value });
  const setPricePerShare = (value: string) =>
    setCampaignData({ ...campaignData, pricePerShare: value });
  const setMinShares = (value: string) =>
    setCampaignData({ ...campaignData, minShares: value });
  const setMaxShares = (value: string) =>
    setCampaignData({ ...campaignData, maxShares: value });
  const setSharesOffered = (value: string) =>
    setCampaignData({ ...campaignData, sharesOffered: value });
  const setStockType = (value: string) =>
    setCampaignData({ ...campaignData, stockType: value });
  const setFundingRound = (value: string) =>
    setCampaignData({ ...campaignData, fundingRound: value });

  // SEC filing setters REMOVED

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
      content: '',
      startDate: '',
      endDate: '',
      goalAmount: '',
      category: '',
      currencyCode: '',
      location: '',
      image: '',
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

    if (
      campaignData.startDate &&
      campaignData.endDate &&
      new Date(campaignData.startDate) > new Date(campaignData.endDate)
    ) {
      formErrors.endDate = 'End date must be after start date';
    }

    const isEquityCampaign =
      campaignData.companyInfo.name ||
      campaignData.minRaise ||
      campaignData.maxRaise ||
      campaignData.valuation ||
      campaignData.equityOffered ||
      campaignData.contractType;

    if (isEquityCampaign) {
      // Company info validation
      if (!campaignData.companyInfo.name.trim()) {
        formErrors.companyName = 'Company name is required';
      }
      if (!campaignData.companyInfo.description.trim()) {
        formErrors.companyDescription = 'Company description is required';
      }

      // Investment range validation
      if (campaignData.minRaise && campaignData.maxRaise) {
        const min = parseFloat(campaignData.minRaise);
        const max = parseFloat(campaignData.maxRaise);
        if (min > max) {
          formErrors.maxRaise = 'Maximum must be greater than minimum';
        }
      }

      // Contract type validation
      if (!campaignData.contractType) {
        formErrors.contractType = 'Contract type is required';
      }

      // Valuation and equity validation
      if (!campaignData.valuation || parseFloat(campaignData.valuation) <= 0) {
        formErrors.valuation = 'Valuation must be greater than 0';
      }
      if (
        !campaignData.equityOffered ||
        parseFloat(campaignData.equityOffered) <= 0
      ) {
        formErrors.equityOffered = 'Equity offered must be greater than 0%';
      } else if (parseFloat(campaignData.equityOffered) > 100) {
        formErrors.equityOffered = 'Equity offered cannot exceed 100%';
      }
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

  const handleSaveCampaign: () => Promise<void> = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const formData = new FormData();
    const isEquityCampaign =
      campaignData.companyInfo.name ||
      campaignData.minRaise ||
      campaignData.maxRaise ||
      campaignData.valuation ||
      campaignData.equityOffered ||
      campaignData.contractType;

    const rootKey = isEquityCampaign ? 'equity_campaign' : 'campaign';

    // Common fields
    formData.append(`${rootKey}[title]`, campaignData.title);
    formData.append(`${rootKey}[description]`, campaignData.content);
    formData.append(`${rootKey}[current_amount]`, currentAmount);
    formData.append(`${rootKey}[goal_amount]`, campaignData.goalAmount);
    formData.append(`${rootKey}[start_date]`, campaignData.startDate as string);
    formData.append(`${rootKey}[end_date]`, campaignData.endDate as string);
    formData.append(`${rootKey}[category]`, campaignData.category);
    formData.append(`${rootKey}[location]`, campaignData.location);
    formData.append(`${rootKey}[currency]`, campaignData.currencyCode);

    if (selectedImage) {
      formData.append(`${rootKey}[media]`, selectedImage);
    }

    // Equity-specific fields
    if (isEquityCampaign) {
      formData.append(
        `${rootKey}[company_name]`,
        campaignData.companyInfo.name,
      );
      formData.append(
        `${rootKey}[company_description]`,
        campaignData.companyInfo.description,
      );
      formData.append(
        `${rootKey}[company_headquarters]`,
        campaignData.companyInfo.headquarters,
      );
      formData.append(
        `${rootKey}[company_website]`,
        campaignData.companyInfo.website,
      );
      if (campaignData.companyInfo.contract_term) {
        formData.append(
          `${rootKey}[contract_term]`,
          campaignData.companyInfo.contract_term,
        );
      }

      formData.append(`${rootKey}[valuation]`, campaignData.valuation);
      formData.append(`${rootKey}[equity_offered]`, campaignData.equityOffered);
      formData.append(`${rootKey}[contract_term]`, campaignData.contractType);
      formData.append(`${rootKey}[minimum_investment]`, campaignData.minRaise);
      formData.append(`${rootKey}[maximum_investment]`, campaignData.maxRaise);

      // New equity offering fields (only essential ones)
      if (campaignData.minimumTarget) {
        formData.append(
          `${rootKey}[minimum_target]`,
          campaignData.minimumTarget,
        );
      }
      if (campaignData.stockType) {
        formData.append(`${rootKey}[stock_type]`, campaignData.stockType);
      }
      if (campaignData.fundingRound) {
        formData.append(`${rootKey}[funding_round]`, campaignData.fundingRound);
      }
    }

    try {
      // First create the campaign
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
                      onContinue={() => setActiveTab('content')}
                      currencies={CURRENCIES}
                      categories={categories}
                      companyInfo={
                        campaignData.companyInfo ||
                        initialCampaignData.companyInfo
                      }
                      onCompanyInfoChange={setCompanyInfo}
                      contractType={campaignData.contractType}
                      setContractType={setContractType}
                      minRaise={campaignData.minRaise}
                      setMinRaise={setMinRaise}
                      maxRaise={campaignData.maxRaise}
                      setMaxRaise={setMaxRaise}
                      valuation={campaignData.valuation}
                      setValuation={setValuation}
                      equityOffered={campaignData.equityOffered}
                      setEquityOffered={setEquityOffered}
                      // New equity offering fields (only essential ones)
                      minimumTarget={campaignData.minimumTarget}
                      setMinimumTarget={setMinimumTarget}
                      sharesOffered={campaignData.sharesOffered}
                      setSharesOffered={setSharesOffered}
                      stockType={campaignData.stockType}
                      setStockType={setStockType}
                      fundingRound={campaignData.fundingRound}
                      setFundingRound={setFundingRound}
                      stockTypes={STOCK_TYPES}
                      fundingRounds={FUNDING_ROUNDS}
                      showEquitySections={true}
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
