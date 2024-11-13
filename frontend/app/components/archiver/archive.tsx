import { useEffect } from 'react';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext'; // Adjust the import path

const AutoArchiveCampaignsBackground = () => {
  const { scheduleArchiveCampaigns, error } = useCampaignContext();

  useEffect(() => {
    // Run the function immediately on mount
    const runArchiveCampaigns = async () => {
      try {
        await scheduleArchiveCampaigns();
      } catch (err) {
        console.error("Error scheduling archive campaigns:", err);
      }
    };

    runArchiveCampaigns();

    // Set up an interval to call the function every 2 minutes
    const intervalId = setInterval(runArchiveCampaigns, 120000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [scheduleArchiveCampaigns]);

  // Optionally show a global error message if needed
  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return null; // This component doesn't render anything visually
};

export default AutoArchiveCampaignsBackground;
