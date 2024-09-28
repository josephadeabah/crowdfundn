import React from 'react';
import {
  GlobeIcon,
  LockClosedIcon,
  PersonIcon,
  StarIcon,
  StackIcon,
} from '@radix-ui/react-icons';
import { Button } from '../components/button/Button';

const Cta = () => {
  return (
    <div className="w-full flex flex-col sm:flex-row">
      <div className="bg-white dark:bg-gray-950 flex-grow p-4 rounded-l-3xl">
        <div className="flex flex-col items-center mx-auto gap-y-8">
          <div className="text-center text-gray-950 dark:text-gray-50">
            <h2 className="text-3xl font-bold lg:text-4xl">
              Discover BantuHive
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {[
              {
                icon: <GlobeIcon className="text-green-500" />,
                title: 'Diaspora-Focused Donations',
                description:
                  'Empowering Africans abroad to invest back into their home communities and support local businesses.',
                borderColor: 'border-green-500',
              },
              {
                icon: <PersonIcon className="text-yellow-500" />,
                title: 'Community-Centric Approach',
                description:
                  'Creating a hive where communities can support each other and see tangible results.',
                borderColor: 'border-yellow-500',
              },
              {
                icon: <LockClosedIcon className="text-blue-400" />,
                title: 'Transparency & Trust',
                description:
                  'We use state-of-the-art technology to ensure transparency in donations and fraud prevention.',
                borderColor: 'border-blue-600',
              },
              {
                icon: <StarIcon className="text-amber-700" />,
                title: 'Gamified Donor Engagement',
                description:
                  'Keep donors engaged with leaderboards, badges, rewards, and recognition for recurring support.',
                borderColor: 'border-amber-700',
              },
              {
                icon: <StackIcon className="text-zinc-500" />,
                title: 'Recurring Revenue & Subscription Features',
                description:
                  'Unique subscription-based features that allow for recurring donations to support ongoing causes or businesses.',
                borderColor: 'border-zinc-500',
                colSpan: 'col-span-2 sm:col-span-1 lg:col-span-1 mb-5',
              },
            ].map(({ icon, title, description, borderColor, colSpan = '' }) => (
              <div className={`flex items-start gap-4 ${colSpan}`} key={title}>
                <Button
                  variant="outline"
                  size="icon"
                  className={`flex justify-center items-center mx-auto rounded-full border ${borderColor}`}
                >
                  {icon}
                </Button>
                <div>
                  <h4 className="mt-4 mb-2 text-gray-500 dark:text-gray-50 text-lg font-bold lg:text-xl">
                    {title}
                  </h4>
                  <p className="text-base text-gray-950 dark:text-gray-50">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dark:bg-gray-950">
        <div className="flex flex-col items-center mx-auto">
          <img
            src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="#"
            className="w-full h-auto object-cover rounded-t-3xl rounded-l-none rounded-r-none max-h-[30rem] lg:max-h-[40rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default Cta;
