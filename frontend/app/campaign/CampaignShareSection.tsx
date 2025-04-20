import React, { useState } from 'react';
import { FaShare, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Button } from '@/app/components/button/Button';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';
import { LoginUserType } from '../types/auth.login.types';

interface CampaignShareSectionProps {
  campaign: SingleCampaignResponseDataType | null;
  showToast: (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning',
  ) => void;
  user: LoginUserType | null;
}

const CampaignShareSection: React.FC<CampaignShareSectionProps> = ({
  campaign,
  showToast,
  user,
}) => {
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const stripHtmlTags = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return `${text.slice(0, maxLength)}...`;
    }
    return text;
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    const campaignTitle = campaign?.title || 'Fundraising Campaign';
    const rawDescription = campaign?.description?.body
      ? stripHtmlTags(campaign.description.body)
      : '';
    const campaignDescription = truncateText(rawDescription, 100);

    if (navigator.share) {
      return navigator
        .share({
          title: `Fundraising Details - ${campaignTitle}`,
          text: `Check out my fundraising details for "${campaignTitle}": ${campaignDescription}`,
          url: currentUrl,
        })
        .catch((error) => {
          setError('Error sharing fundraising details');
        });
    } else {
      return navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          setCopyButtonText('Copied');
          setTimeout(() => setCopyButtonText('Copy'), 2000);
        })
        .catch(() => {
          setError('Error copying the link');
        });
    }
  };

  const handleCopy = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setCopyButtonText('Copied');
      setTimeout(() => setCopyButtonText('Copy'), 2000);
    } catch {
      setError('Error copying the link');
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      handleUnfavorite(String(campaign?.id));
    } else {
      handleFavorite(String(campaign?.id));
    }
  };

  const handleFavorite = async (campaignId: string) => {
    if (!user) {
      showToast(
        'Error',
        'You must log in first to add to your favorite and track campaign progress.',
        'error',
      );
      return;
    }
    setIsFavorite(true);
    showToast('Success', 'Campaign added to favorites', 'success');
  };

  const handleUnfavorite = async (campaignId: string) => {
    if (!user) {
      showToast(
        'Error',
        'You must log in first to add to your favorite and track campaign progress.',
        'error',
      );
      return;
    }
    setIsFavorite(false);
    showToast('Success', 'Campaign removed from favorites', 'success');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Share this fundraiser
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            onClick={handleShare}
            className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 active:scale-95 shadow-none"
          >
            <FaShare className="mr-2" />
            {campaign?.total_shares || 0} Shares
          </Button>
          <Button
            onClick={handleCopy}
            variant="outline"
            className="flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all transform hover:scale-105 active:scale-95 shadow-none"
          >
            {copyButtonText}
          </Button>
          <Button
            onClick={toggleFavorite}
            variant="outline"
            className="flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all transform hover:scale-105 active:scale-95 shadow-none"
          >
            {isFavorite ? (
              <FaBookmark className="mr-2 text-emerald-500" />
            ) : (
              <FaRegBookmark className="mr-2" />
            )}
            Watch For Updates
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default CampaignShareSection;
