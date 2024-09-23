import React, { useState } from 'react';
import data from '../../data.json';

export default function Archive() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="p-6 bg-gray-100 dark:bg-neutral-900 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Archive
      </h2>
      <p className="text-gray-500 dark:text-neutral-400 mb-6">
        Browse through past fundraising campaigns and share updates with your
        backers.
      </p>
      {/* Archive Accordion */}
      <div className="hs-accordion-group" data-hs-accordion-always-open="">
        {data.pastCampaigns.map((campaign, index) => (
          <div
            className={`hs-accordion ${activeIndex === index ? 'active' : ''}`}
            id={`hs-basic-always-open-heading-${index + 1}`}
            key={campaign.id}
          >
            <button
              onClick={() => setActiveIndex(index === activeIndex ? -1 : index)} // Toggle logic
              className="hs-accordion-toggle hs-accordion-active:text-blue-600 py-3 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 rounded-lg dark:hs-accordion-active:text-blue-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
              aria-expanded={activeIndex === index}
              aria-controls={`hs-basic-always-open-collapse-${index + 1}`}
            >
              <svg
                className="hs-accordion-active:hidden block size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              <svg
                className="hs-accordion-active:block hidden size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
              </svg>
              {campaign.title}
            </button>
            <div
              id={`hs-basic-always-open-collapse-${index + 1}`}
              className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${activeIndex === index ? '' : 'hidden'}`}
              role="region"
              aria-labelledby={`hs-basic-always-open-heading-${index + 1}`}
            >
              <p className="text-gray-800 dark:text-neutral-200">
                <strong>Date:</strong> {campaign.date}
                <br />
                <strong>Description:</strong> {campaign.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
