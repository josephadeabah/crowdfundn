import React from 'react';
import {
  FaBook,
  FaSeedling,
  FaPaw,
  FaPalette,
  FaMusic,
  FaBirthdayCake,
  FaHandHoldingHeart,
  FaTree,
  FaChild,
  FaHandsHelping,
  FaLightbulb,
  FaTint,
  FaCloudSunRain,
  FaUsers,
  FaHeartbeat,
  FaHandHoldingUsd,
  FaMonument,
  FaHome,
  FaBalanceScale,
  FaFirstAid,
  FaMicroscope,
  FaBriefcase,
  FaTractor,
  FaFish,
  FaRing,
  FaBrain,
  FaRecycle,
  FaBus,
  FaSolarPanel,
  FaCity,
  FaFootballBall,
  FaTruck,
  FaLaptop,
  FaBuilding,
  FaUserShield,
  FaWater,
  FaFemale,
  FaMoneyBillWave,
  FaWheelchair,
  FaHandshake,
  FaLeaf,
  FaShieldAlt,
} from 'react-icons/fa';

export type Category = {
  value: string;
  label: string;
  icon?: React.ReactNode; // Icon is optional
};

// Helper function to slugify a label into a value
const slugify = (label: string): string => {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9']+/g, '-') // Allow apostrophes and replace other non-alphanumeric characters with hyphens
    .replace(/(^-|-$)+/g, ''); // Remove leading or trailing hyphens
};

// Array of category labels
const categoryLabels = [
  'Access to Education',
  'Agriculture Innovation',
  'Animal Welfare',
  'Arts and Culture',
  'Arts Education',
  'Birthday Celebration',
  'Bereavement Support',
  'Carbon Footprint Reduction',
  'Child Protection',
  'Charity',
  'Civic Engagement',
  'Clean Energy',
  'Clean Water',
  'Climate Change',
  'Community Empowerment',
  'Community Health',
  'Community Support',
  'Crisis Response',
  'Cultural Preservation',
  'Digital Literacy',
  'Disability Support',
  'Disaster Preparedness',
  'Eco-Tourism',
  'Economic Development',
  'Education',
  'Elderly Care',
  'Energy Efficiency',
  'Environment',
  'Environmental Justice',
  'Family Services',
  'Financial Literacy',
  'Food Security',
  'Forestry Management',
  'Gender Equality',
  'Green Architecture',
  'Health',
  'Honor & Memorial',
  'Housing and Homelessness',
  'Human Rights',
  'Humanitarian Aid',
  'Innovation and Research',
  'Innovation in Education',
  'Job Creation',
  'Local Business Support',
  'Local Farmers Support',
  'Marine Conservation',
  'Marriage',
  'Mental Health',
  'Microfinance',
  'Organic Farming',
  'Peer Support',
  'Plastic Recycling',
  'Poverty Reduction',
  'Public Health',
  'Public Safety',
  'Public Transport',
  'Renewable Energy',
  'Rural Development',
  'Social Enterprise',
  'Sports and Recreation',
  'Sustainable Agriculture',
  'Sustainable Transport',
  'Technology',
  'Urban Development',
  'Urban Farming',
  'Veterans Support',
  'Water and Sanitation',
  'Wildlife Conservation',
  "Women’s Empowerment",
  'Youth Development',
];

export const categoriesWithIcons: Category[] = [
  {
    label: 'Access to Education',
    value: slugify('Access to Education'),
    icon: <FaBook className="w-4 h-4 text-blue-500" />,
  },
  {
    label: 'Agriculture Innovation',
    value: slugify('Agriculture Innovation'),
    icon: <FaSeedling className="w-4 h-4 text-green-500" />,
  },
  {
    label: 'Animal Welfare',
    value: slugify('Animal Welfare'),
    icon: <FaPaw className="w-4 h-4 text-orange-500" />,
  },
  {
    label: 'Arts and Culture',
    value: slugify('Arts and Culture'),
    icon: <FaPalette className="w-4 h-4 text-purple-500" />,
  },
  {
    label: 'Arts Education',
    value: slugify('Arts Education'),
    icon: <FaMusic className="w-4 h-4 text-pink-500" />,
  },
  {
    label: 'Birthday Celebration',
    value: slugify('Birthday Celebration'),
    icon: <FaBirthdayCake className="w-4 h-4 text-red-500" />,
  },
  {
    label: 'Bereavement Support',
    value: slugify('Bereavement Support'),
    icon: <FaHandHoldingHeart className="w-4 h-4 text-gray-500" />,
  },
  {
    label: 'Carbon Footprint Reduction',
    value: slugify('Carbon Footprint Reduction'),
    icon: <FaTree className="w-4 h-4 text-emerald-500" />,
  },
  {
    label: 'Child Protection',
    value: slugify('Child Protection'),
    icon: <FaChild className="w-4 h-4 text-yellow-500" />,
  },
  {
    label: 'Charity',
    value: slugify('Charity'),
    icon: <FaHandsHelping className="w-4 h-4 text-teal-500" />,
  },
  {
    label: 'Civic Engagement',
    value: slugify('Civic Engagement'),
    icon: <FaUsers className="w-4 h-4 text-indigo-500" />,
  },
  {
    label: 'Clean Energy',
    value: slugify('Clean Energy'),
    icon: <FaLightbulb className="w-4 h-4 text-yellow-400" />,
  },
  {
    label: 'Clean Water',
    value: slugify('Clean Water'),
    icon: <FaTint className="w-4 h-4 text-blue-400" />,
  },
  {
    label: 'Climate Change',
    value: slugify('Climate Change'),
    icon: <FaCloudSunRain className="w-4 h-4 text-gray-400" />,
  },
  {
    label: 'Community Empowerment',
    value: slugify('Community Empowerment'),
    icon: <FaHandshake className="w-4 h-4 text-green-400" />,
  },
  {
    label: 'Community Health',
    value: slugify('Community Health'),
    icon: <FaHeartbeat className="w-4 h-4 text-red-400" />,
  },
  {
    label: 'Community Support',
    value: slugify('Community Support'),
    icon: <FaHandHoldingHeart className="w-4 h-4 text-pink-400" />,
  },
  {
    label: 'Crisis Response',
    value: slugify('Crisis Response'),
    icon: <FaFirstAid className="w-4 h-4 text-red-600" />,
  },
  {
    label: 'Cultural Preservation',
    value: slugify('Cultural Preservation'),
    icon: <FaMonument className="w-4 h-4 text-amber-500" />,
  },
  {
    label: 'Digital Literacy',
    value: slugify('Digital Literacy'),
    icon: <FaLaptop className="w-4 h-4 text-blue-600" />,
  },
  {
    label: 'Disability Support',
    value: slugify('Disability Support'),
    icon: <FaWheelchair className="w-4 h-4 text-gray-600" />,
  },
  {
    label: 'Disaster Preparedness',
    value: slugify('Disaster Preparedness'),
    icon: <FaBriefcase className="w-4 h-4 text-gray-700" />,
  },
  {
    label: 'Eco-Tourism',
    value: slugify('Eco-Tourism'),
    icon: <FaTree className="w-4 h-4 text-green-600" />,
  },
  {
    label: 'Economic Development',
    value: slugify('Economic Development'),
    icon: <FaCity className="w-4 h-4 text-purple-600" />,
  },
  {
    label: 'Education',
    value: slugify('Education'),
    icon: <FaBook className="w-4 h-4 text-blue-700" />,
  },
  {
    label: 'Elderly Care',
    value: slugify('Elderly Care'),
    icon: <FaUserShield className="w-4 h-4 text-gray-700" />,
  },
  {
    label: 'Energy Efficiency',
    value: slugify('Energy Efficiency'),
    icon: <FaSolarPanel className="w-4 h-4 text-yellow-600" />,
  },
  {
    label: 'Environment',
    value: slugify('Environment'),
    icon: <FaLeaf className="w-4 h-4 text-green-700" />,
  },
  {
    label: 'Environmental Justice',
    value: slugify('Environmental Justice'),
    icon: <FaRecycle className="w-4 h-4 text-green-500" />,
  },
  {
    label: 'Family Services',
    value: slugify('Family Services'),
    icon: <FaHandsHelping className="w-4 h-4 text-teal-600" />,
  },
  {
    label: 'Financial Literacy',
    value: slugify('Financial Literacy'),
    icon: <FaMoneyBillWave className="w-4 h-4 text-green-800" />,
  },
  {
    label: 'Food Security',
    value: slugify('Food Security'),
    icon: <FaFish className="w-4 h-4 text-blue-800" />,
  },
  {
    label: 'Forestry Management',
    value: slugify('Forestry Management'),
    icon: <FaTree className="w-4 h-4 text-green-800" />,
  },
  {
    label: 'Gender Equality',
    value: slugify('Gender Equality'),
    icon: <FaFemale className="w-4 h-4 text-pink-600" />,
  },
  {
    label: 'Green Architecture',
    value: slugify('Green Architecture'),
    icon: <FaBuilding className="w-4 h-4 text-green-900" />,
  },
  {
    label: 'Health',
    value: slugify('Health'),
    icon: <FaHeartbeat className="w-4 h-4 text-red-700" />,
  },
  {
    label: 'Honor & Memorial',
    value: slugify('Honor & Memorial'),
    icon: <FaRing className="w-4 h-4 text-gray-800" />,
  },
  {
    label: 'Housing and Homelessness',
    value: slugify('Housing and Homelessness'),
    icon: <FaHome className="w-4 h-4 text-blue-900" />,
  },
  {
    label: 'Human Rights',
    value: slugify('Human Rights'),
    icon: <FaBalanceScale className="w-4 h-4 text-gray-900" />,
  },
  {
    label: 'Humanitarian Aid',
    value: slugify('Humanitarian Aid'),
    icon: <FaFirstAid className="w-4 h-4 text-red-800" />,
  },
  {
    label: 'Innovation and Research',
    value: slugify('Innovation and Research'),
    icon: <FaMicroscope className="w-4 h-4 text-purple-800" />,
  },
  {
    label: 'Innovation in Education',
    value: slugify('Innovation in Education'),
    icon: <FaLightbulb className="w-4 h-4 text-yellow-700" />,
  },
  {
    label: 'Job Creation',
    value: slugify('Job Creation'),
    icon: <FaBriefcase className="w-4 h-4 text-gray-800" />,
  },
  {
    label: 'Local Business Support',
    value: slugify('Local Business Support'),
    icon: <FaBuilding className="w-4 h-4 text-purple-900" />,
  },
  {
    label: 'Local Farmers Support',
    value: slugify('Local Farmers Support'),
    icon: <FaTractor className="w-4 h-4 text-green-900" />,
  },
  {
    label: 'Marine Conservation',
    value: slugify('Marine Conservation'),
    icon: <FaFish className="w-4 h-4 text-blue-900" />,
  },
  {
    label: 'Marriage',
    value: slugify('Marriage'),
    icon: <FaRing className="w-4 h-4 text-pink-700" />,
  },
  {
    label: 'Mental Health',
    value: slugify('Mental Health'),
    icon: <FaBrain className="w-4 h-4 text-indigo-700" />,
  },
  {
    label: 'Microfinance',
    value: slugify('Microfinance'),
    icon: <FaMoneyBillWave className="w-4 h-4 text-green-700" />,
  },
  {
    label: 'Organic Farming',
    value: slugify('Organic Farming'),
    icon: <FaSeedling className="w-4 h-4 text-green-700" />,
  },
  {
    label: 'Peer Support',
    value: slugify('Peer Support'),
    icon: <FaUsers className="w-4 h-4 text-blue-700" />,
  },
  {
    label: 'Plastic Recycling',
    value: slugify('Plastic Recycling'),
    icon: <FaRecycle className="w-4 h-4 text-green-600" />,
  },
  {
    label: 'Poverty Reduction',
    value: slugify('Poverty Reduction'),
    icon: <FaHandsHelping className="w-4 h-4 text-teal-700" />,
  },
  {
    label: 'Public Health',
    value: slugify('Public Health'),
    icon: <FaHeartbeat className="w-4 h-4 text-red-700" />,
  },
  {
    label: 'Public Safety',
    value: slugify('Public Safety'),
    icon: <FaShieldAlt className="w-4 h-4 text-gray-700" />,
  },
  {
    label: 'Public Transport',
    value: slugify('Public Transport'),
    icon: <FaBus className="w-4 h-4 text-blue-700" />,
  },
  {
    label: 'Renewable Energy',
    value: slugify('Renewable Energy'),
    icon: <FaSolarPanel className="w-4 h-4 text-yellow-700" />,
  },
  {
    label: 'Rural Development',
    value: slugify('Rural Development'),
    icon: <FaTractor className="w-4 h-4 text-green-700" />,
  },
  {
    label: 'Social Enterprise',
    value: slugify('Social Enterprise'),
    icon: <FaBuilding className="w-4 h-4 text-purple-700" />,
  },
  {
    label: 'Sports and Recreation',
    value: slugify('Sports and Recreation'),
    icon: <FaFootballBall className="w-4 h-4 text-orange-700" />,
  },
  {
    label: 'Sustainable Agriculture',
    value: slugify('Sustainable Agriculture'),
    icon: <FaSeedling className="w-4 h-4 text-green-700" />,
  },
  {
    label: 'Sustainable Transport',
    value: slugify('Sustainable Transport'),
    icon: <FaBus className="w-4 h-4 text-blue-700" />,
  },
  {
    label: 'Technology',
    value: slugify('Technology'),
    icon: <FaLaptop className="w-4 h-4 text-blue-700" />,
  },
  {
    label: 'Urban Development',
    value: slugify('Urban Development'),
    icon: <FaCity className="w-4 h-4 text-purple-700" />,
  },
  {
    label: 'Urban Farming',
    value: slugify('Urban Farming'),
    icon: <FaSeedling className="w-4 h-4 text-green-700" />,
  },
  {
    label: 'Veterans Support',
    value: slugify('Veterans Support'),
    icon: <FaUserShield className="w-4 h-4 text-gray-700" />,
  },
  {
    label: 'Water and Sanitation',
    value: slugify('Water and Sanitation'),
    icon: <FaWater className="w-4 h-4 text-blue-700" />,
  },
  {
    label: 'Wildlife Conservation',
    value: slugify('Wildlife Conservation'),
    icon: <FaPaw className="w-4 h-4 text-orange-700" />,
  },
  {
    label: "Women's Empowerment",
    value: slugify("Women’s Empowerment"),
    icon: <FaFemale className="w-4 h-4 text-pink-700" />,
  },
  {
    label: 'Youth Development',
    value: slugify('Youth Development'),
    icon: <FaChild className="w-4 h-4 text-yellow-700" />,
  },
];

// Generate categories using the slugify function
export const categories: Category[] = categoryLabels.map((label) => ({
  label,
  value: slugify(label),
}));

// Helper function to convert a slug into a normal label
export const deslugify = (slug: string): string => {
  return slug
    .split('-') // Split the slug by hyphens
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' ') // Join the words with spaces
    .replace(/ S /g, "’s "); // Replace " S " with "’s " to handle apostrophes correctly
};
