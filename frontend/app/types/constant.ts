import {
  UserGroupIcon,
  SquaresPlusIcon,
  SunIcon,
  LightBulbIcon,
  PhoneIcon,
  BanknotesIcon,
  CreditCardIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { DropdownLinks } from './navbar.types';

export const dropdownLinks: DropdownLinks = {
  About: [
    {
      label: 'Who We Are',
      href: '/about-us',
      icon: UserGroupIcon,
      description: 'Learn more about our mission and vision.',
    },
    {
      label: 'Why Is This Right For You?',
      href: '/articles/is-crowdfunding-right-for-you',
      icon: SunIcon,
      description: 'Discover why crowdfunding is the right choice for you.',
    },
    {
      label: 'Who Can Fundraise?',
      href: '/articles/who-can-fundraise',
      icon: UserIcon,
      description: 'Find out who can start a fundraising campaign.',
    },
  ],
  Guides: [
    {
      label: 'How To Get Started',
      href: '/articles/how-to-get-started',
      icon: LightBulbIcon,
      description: 'Step-by-step guide to launching your campaign.',
    },
    {
      label: 'How To Withdraw Funds Safely',
      href: '/articles/how-to-withdraw-funds',
      icon: CreditCardIcon,
      description: 'Learn how to securely withdraw your funds.',
    },
    {
      label: 'Pricing',
      href: '/pricing',
      icon: BanknotesIcon,
      description: 'Understand our pricing structure.',
    },
  ],
  Contact: [
    {
      label: 'Ghana',
      href: '/contactus',
      icon: PhoneIcon,
      description: 'Reach out to our Ghana office.',
    },
    {
      label: 'Eswatini',
      href: '/contactus',
      icon: PhoneIcon,
      description: 'Reach out to our Eswatini office.',
    },
  ],
  Donate: [
    {
      label: 'By Category',
      href: '/explore/category',
      icon: SquaresPlusIcon,
      description: 'Donate to campaigns by category.',
    },
    {
      label: 'By Advance Filtering',
      href: '/explore/advance',
      icon: SquaresPlusIcon,
      description: 'Use advanced filters to find campaigns.',
    },
  ],
  Leaderboard: [
    {
      label: 'Backers',
      href: '/leaderboard/backers',
      icon: UserGroupIcon,
      description: 'See the top backers on our platform.',
    },
    {
      label: 'Fundraisers',
      href: '/leaderboard/fundraisers',
      icon: UserGroupIcon,
      description: 'See the top fundraisers on our platform.',
    },
  ],
} as const;

export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
}
