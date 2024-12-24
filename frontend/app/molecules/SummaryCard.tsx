'use client';

import React, { useEffect } from 'react';

const SummaryCard: React.FC = () => {
  // useEffect(() => {
  //   const lastLoaded = localStorage.getItem('surveyMonkeyLastLoaded');
  //   const currentTime = new Date().getTime();
  //   // Check if the script was loaded within the last 24 hours
  //   if (
  //     !lastLoaded ||
  //     currentTime - parseInt(lastLoaded) >= 24 * 60 * 60 * 1000
  //   ) {
  //     // Dynamically create and insert the SurveyMonkey script into the document
  //     const script = document.createElement('script');
  //     script.type = 'text/javascript';
  //     script.async = true;
  //     script.id = 'smcx-sdk';
  //     script.src =
  //       'https://widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgd49YS4rryGNzeLvxp2jzCxpDbJgT8pmCb6alk9fI1p26.js';
  //     const scriptTag = document.getElementsByTagName('script')[0];
  //     scriptTag.parentNode?.insertBefore(script, scriptTag);

  //     // Store the time when the script was loaded
  //     localStorage.setItem('surveyMonkeyLastLoaded', currentTime.toString());
  //   } else {
  //     console.log('SurveyMonkey script not loaded due to 24-hour condition.');
  //   }
  // }, []);

  return (
    <div
      className="w-full bg-green-50 text-green-600 dark:bg-gray-800 dark:text-green-400 py-4"
      style={{ pointerEvents: 'auto', position: 'relative' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex Container */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:space-x-8 space-y-4 md:space-y-0">
          {/* Left Section */}
          <div className="flex-1 text-center md:text-left md:max-w-[60%]">
            <h2 className="text-green-600 dark:text-green-400 font-bold leading-tight">
              Support, Empower, Thrive with Bantu Hive
            </h2>
            <h3 className="mt-1 text-gray-700 dark:text-gray-200">
              Raise money when you need, fund, or support causes you care about.
              Reach donors, and make a difference.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
