import React, { useEffect } from 'react';
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

const CATEGORIES = [
  'Technology',
  'Creative Arts',
  'Community Projects',
  'Education',
  'Environment',
  'Health',
  'Business',
  'Social Causes',
  'Sports',
  'Other',
];

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
];

interface CampaignData {
  title: string;
  description: string;
  content: string;
  startDate?: Date;
  endDate?: Date;
  activeTab: string;
  selectedTemplate: CampaignTemplate | null;
  editorActiveTab: string;
  goalAmount: string;
  category: string;
  currencyCode: string;
  location: string;
}

const CampaignCreator = () => {
  const initialCampaignData: CampaignData = {
    title: '',
    description: '',
    content: '',
    activeTab: 'details',
    selectedTemplate: null,
    editorActiveTab: 'editor',
    goalAmount: '',
    category: '',
    currencyCode: 'GHS',
    location: '',
  };

  const [campaignData, setCampaignData] = useLocalStorage<CampaignData>(
    'campaign-draft',
    initialCampaignData,
  );

  const setTitle = (value: string) =>
    setCampaignData({ ...campaignData, title: value });
  const setDescription = (value: string) =>
    setCampaignData({ ...campaignData, description: value });
  const setContent = (value: string) =>
    setCampaignData({ ...campaignData, content: value });
  const setStartDate = (value: Date | undefined) =>
    setCampaignData({ ...campaignData, startDate: value });
  const setEndDate = (value: Date | undefined) =>
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
  }, []);

  const handleMediaSelect = (url: string, type: 'image' | 'video') => {
    let htmlToInsert = '';

    if (type === 'image') {
      htmlToInsert = `<img src="${url}" alt="Campaign image" />`;
    } else if (type === 'video') {
      if (url.startsWith('data:video')) {
        htmlToInsert = `<video controls src="${url}" class="w-full"></video>`;
      } else {
        htmlToInsert = `<iframe src="${url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full aspect-video"></iframe>`;
      }
    }

    const newContent = campaignData.content + htmlToInsert;
    setContent(newContent);
  };

  const handleSelectTemplate = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    setTitle(template.title);
    setContent(template.content);
    toast.success(`Applied "${template.name}" template`);
  };

  const handleSaveCampaign = () => {
    if (!campaignData.title) {
      toast.error('Please add a title for your campaign');
      return;
    }

    if (!campaignData.content) {
      toast.error('Please add content to your campaign');
      return;
    }

    if (!campaignData.startDate || !campaignData.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (!campaignData.goalAmount) {
      toast.error('Please set a goal amount');
      return;
    }

    if (!campaignData.category) {
      toast.error('Please select a category');
      return;
    }

    toast.success('Campaign saved successfully!');

    setCampaignData(initialCampaignData);
    localStorage.removeItem('campaign-draft');

    console.log({
      title: campaignData.title,
      description: campaignData.description,
      content: campaignData.content,
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      goalAmount: campaignData.goalAmount,
      category: campaignData.category,
      currencyCode: campaignData.currencyCode,
      location: campaignData.location,
    });
  };

  return (
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
                <div
                  className="lg:col-span-8 space-y-6 animate-slide-up"
                  style={{ animationDelay: '0.1s' }}
                >
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
                    categories={CATEGORIES}
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
                    onMediaSelect={handleMediaSelect}
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
  );
};

export default CampaignCreator;
