export type Category = {
  value: string;
  label: string;
};

// Helper function to slugify a label into a value
const slugify = (label: string): string => {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// Array of category labels
const categoryLabels = [
  'Access to Education',
  'Agriculture Innovation',
  'Animal Welfare',
  'Arts and Culture',
  'Arts Education',
  'Carbon Footprint Reduction',
  'Child Protection',
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
  'Disaster Relief',
  'Disaster Relief Infrastructure',
  'Disaster Response',
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
  'Housing and Homelessness',
  'Human Rights',
  'Humanitarian Aid',
  'Innovation and Research',
  'Innovation in Education',
  'Job Creation',
  'Local Business Support',
  'Local Farmers Support',
  'Marine Conservation',
  'Mental Health',
  'Mental Health Advocacy',
  'Mental Wellness',
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
  'Transportation',
  'Urban Development',
  'Urban Farming',
  'Veterans Support',
  'Water and Sanitation',
  'Wildlife Conservation',
  "Women's Empowerment",
  'Youth Development',
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
