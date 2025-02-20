import React from 'react';
import { 
  FaBook, FaSeedling, FaPaw, FaPalette, FaMusic, FaBirthdayCake, FaHandHoldingHeart, 
  FaTree, FaChild, FaHandsHelping, FaLightbulb, FaTint, FaCloudSunRain, FaUsers, 
  FaHeartbeat, FaHandHoldingUsd, FaMonument, FaHome, FaBalanceScale, FaFirstAid, 
  FaMicroscope, FaBriefcase, FaTractor, FaFish, FaRing, FaBrain, FaRecycle, FaBus, 
  FaSolarPanel, FaCity, FaFootballBall, FaTruck, FaLaptop, FaBuilding, FaUserShield, 
  FaWater, FaFemale, 
  FaMoneyBillWave,
  FaWheelchair,
  FaHandshake,
  FaLeaf,
  FaShieldAlt
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
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, ''); // Remove leading or trailing hyphens
};

// Array of category labels
const categoryLabels = [
  'Access to Education', 'Agriculture Innovation', 'Animal Welfare', 'Arts and Culture', 
  'Arts Education', 'Birthday Celebration', 'Bereavement Support', 'Carbon Footprint Reduction',
  'Child Protection', 'Charity', 'Civic Engagement', 'Clean Energy', 'Clean Water', 'Climate Change',
  'Community Empowerment', 'Community Health', 'Community Support', 'Crisis Response', 
  'Cultural Preservation', 'Digital Literacy', 'Disability Support', 'Disaster Preparedness', 
  'Eco-Tourism', 'Economic Development', 'Education', 'Elderly Care', 'Energy Efficiency', 
  'Environment', 'Environmental Justice', 'Family Services', 'Financial Literacy', 'Food Security',
  'Forestry Management', 'Gender Equality', 'Green Architecture', 'Health', 'Honor & Memorial',
  'Housing and Homelessness', 'Human Rights', 'Humanitarian Aid', 'Innovation and Research',
  'Innovation in Education', 'Job Creation', 'Local Business Support', 'Local Farmers Support',
  'Marine Conservation', 'Marriage', 'Mental Health', 'Microfinance', 'Organic Farming', 
  'Peer Support', 'Plastic Recycling', 'Poverty Reduction', 'Public Health', 'Public Safety', 
  'Public Transport', 'Renewable Energy', 'Rural Development', 'Social Enterprise', 'Sports and Recreation',
  'Sustainable Agriculture', 'Sustainable Transport', 'Technology', 'Urban Development', 'Urban Farming',
  'Veterans Support', 'Water and Sanitation', 'Wildlife Conservation', "Women's Empowerment", 
  'Youth Development'
];

export const categoriesWithIcons: Category[] = [
  { label: 'Access to Education', value: slugify('Access to Education'), icon: <FaBook /> },
  { label: 'Agriculture Innovation', value: slugify('Agriculture Innovation'), icon: <FaSeedling /> },
  { label: 'Animal Welfare', value: slugify('Animal Welfare'), icon: <FaPaw /> },
  { label: 'Arts and Culture', value: slugify('Arts and Culture'), icon: <FaPalette /> },
  { label: 'Arts Education', value: slugify('Arts Education'), icon: <FaMusic /> },
  { label: 'Birthday Celebration', value: slugify('Birthday Celebration'), icon: <FaBirthdayCake /> },
  { label: 'Bereavement Support', value: slugify('Bereavement Support'), icon: <FaHandHoldingHeart /> },
  { label: 'Carbon Footprint Reduction', value: slugify('Carbon Footprint Reduction'), icon: <FaTree /> },
  { label: 'Child Protection', value: slugify('Child Protection'), icon: <FaChild /> },
  { label: 'Charity', value: slugify('Charity'), icon: <FaHandsHelping /> },
  { label: 'Civic Engagement', value: slugify('Civic Engagement'), icon: <FaUsers /> },
  { label: 'Clean Energy', value: slugify('Clean Energy'), icon: <FaLightbulb /> },
  { label: 'Clean Water', value: slugify('Clean Water'), icon: <FaTint /> },
  { label: 'Climate Change', value: slugify('Climate Change'), icon: <FaCloudSunRain /> },
  { label: 'Community Empowerment', value: slugify('Community Empowerment'), icon: <FaHandshake /> },
  { label: 'Community Health', value: slugify('Community Health'), icon: <FaHeartbeat /> },
  { label: 'Community Support', value: slugify('Community Support'), icon: <FaHandHoldingHeart /> },
  { label: 'Crisis Response', value: slugify('Crisis Response'), icon: <FaFirstAid /> },
  { label: 'Cultural Preservation', value: slugify('Cultural Preservation'), icon: <FaMonument /> },
  { label: 'Digital Literacy', value: slugify('Digital Literacy'), icon: <FaLaptop /> },
  { label: 'Disability Support', value: slugify('Disability Support'), icon: <FaWheelchair /> },
  { label: 'Disaster Preparedness', value: slugify('Disaster Preparedness'), icon: <FaBriefcase /> },
  { label: 'Eco-Tourism', value: slugify('Eco-Tourism'), icon: <FaTree /> },
  { label: 'Economic Development', value: slugify('Economic Development'), icon: <FaCity /> },
  { label: 'Education', value: slugify('Education'), icon: <FaBook /> },
  { label: 'Elderly Care', value: slugify('Elderly Care'), icon: <FaUserShield /> },
  { label: 'Energy Efficiency', value: slugify('Energy Efficiency'), icon: <FaSolarPanel /> },
  { label: 'Environment', value: slugify('Environment'), icon: <FaLeaf /> },
  { label: 'Environmental Justice', value: slugify('Environmental Justice'), icon: <FaRecycle /> },
  { label: 'Family Services', value: slugify('Family Services'), icon: <FaHandsHelping /> },
  { label: 'Financial Literacy', value: slugify('Financial Literacy'), icon: <FaMoneyBillWave /> },
  { label: 'Food Security', value: slugify('Food Security'), icon: <FaFish /> },
  { label: 'Forestry Management', value: slugify('Forestry Management'), icon: <FaTree /> },
  { label: 'Gender Equality', value: slugify('Gender Equality'), icon: <FaFemale /> },
  { label: 'Green Architecture', value: slugify('Green Architecture'), icon: <FaBuilding /> },
  { label: 'Health', value: slugify('Health'), icon: <FaHeartbeat /> },
  { label: 'Honor & Memorial', value: slugify('Honor & Memorial'), icon: <FaRing /> },
  { label: 'Housing and Homelessness', value: slugify('Housing and Homelessness'), icon: <FaHome /> },
  { label: 'Human Rights', value: slugify('Human Rights'), icon: <FaBalanceScale /> },
  { label: 'Humanitarian Aid', value: slugify('Humanitarian Aid'), icon: <FaFirstAid /> },
  { label: 'Innovation and Research', value: slugify('Innovation and Research'), icon: <FaMicroscope /> },
  { label: 'Innovation in Education', value: slugify('Innovation in Education'), icon: <FaLightbulb /> },
  { label: 'Job Creation', value: slugify('Job Creation'), icon: <FaBriefcase /> },
  { label: 'Local Business Support', value: slugify('Local Business Support'), icon: <FaBuilding /> },
  { label: 'Local Farmers Support', value: slugify('Local Farmers Support'), icon: <FaTractor /> },
  { label: 'Marine Conservation', value: slugify('Marine Conservation'), icon: <FaFish /> },
  { label: 'Marriage', value: slugify('Marriage'), icon: <FaRing /> },
  { label: 'Mental Health', value: slugify('Mental Health'), icon: <FaBrain /> },
  { label: 'Microfinance', value: slugify('Microfinance'), icon: <FaMoneyBillWave /> },
  { label: 'Organic Farming', value: slugify('Organic Farming'), icon: <FaSeedling /> },
  { label: 'Peer Support', value: slugify('Peer Support'), icon: <FaUsers /> },
  { label: 'Plastic Recycling', value: slugify('Plastic Recycling'), icon: <FaRecycle /> },
  { label: 'Poverty Reduction', value: slugify('Poverty Reduction'), icon: <FaHandsHelping /> },
  { label: 'Public Health', value: slugify('Public Health'), icon: <FaHeartbeat /> },
  { label: 'Public Safety', value: slugify('Public Safety'), icon: <FaShieldAlt /> },
  { label: 'Public Transport', value: slugify('Public Transport'), icon: <FaBus /> },
  { label: 'Renewable Energy', value: slugify('Renewable Energy'), icon: <FaSolarPanel /> },
  { label: 'Rural Development', value: slugify('Rural Development'), icon: <FaTractor /> },
  { label: 'Social Enterprise', value: slugify('Social Enterprise'), icon: <FaBuilding /> },
  { label: 'Sports and Recreation', value: slugify('Sports and Recreation'), icon: <FaFootballBall /> },
  { label: 'Sustainable Agriculture', value: slugify('Sustainable Agriculture'), icon: <FaSeedling /> },
  { label: 'Sustainable Transport', value: slugify('Sustainable Transport'), icon: <FaBus /> },
  { label: 'Technology', value: slugify('Technology'), icon: <FaLaptop /> },
  { label: 'Urban Development', value: slugify('Urban Development'), icon: <FaCity /> },
  { label: 'Urban Farming', value: slugify('Urban Farming'), icon: <FaSeedling /> },
  { label: 'Veterans Support', value: slugify('Veterans Support'), icon: <FaUserShield /> },
  { label: 'Water and Sanitation', value: slugify('Water and Sanitation'), icon: <FaWater /> },
  { label: 'Wildlife Conservation', value: slugify('Wildlife Conservation'), icon: <FaPaw /> },
  { label: "Women's Empowerment", value: slugify("Women's Empowerment"), icon: <FaFemale /> },
  { label: 'Youth Development', value: slugify('Youth Development'), icon: <FaChild /> },
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
    .join(' '); // Join the words with spaces
};
