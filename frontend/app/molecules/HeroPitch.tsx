import React from 'react';
import { Globe, Users, TrendingUp, Target, Zap, Award } from 'lucide-react';

const HeroPitch = () => {
  const valueProps = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "For Investors",
      description: "Be more than a bank. Become a partner in growth with direct access to curated deals.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "For Founders",
      description: "Move beyond traditional loans. Raise capital from a network that offers mentorship and market access.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Our Promise",
      description: "A secure, transparent, and community-driven ecosystem built for African growth.",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const impactStats = [
    {
      value: "90%",
      label: "of African businesses",
      description: "are SMEs - the backbone of the economy"
    },
    {
      value: "$330B",
      label: "funding gap",
      description: "for African SMEs we're helping to close"
    },
    {
      value: "80%",
      label: "of employment",
      description: "comes from the SME sector"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Globe className="h-4 w-4" />
            Made for Africa's Growth
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Join the Movement Funding<br className="hidden lg:block" />
            <span className="text-blue-600">Africa's Backbone</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-10 leading-relaxed">
            We connect the continent's most promising SMEs with a global community of investors. 
            Together, we're closing the $330 billion funding gap and building the future from the ground up.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Start Investing →
            </button>
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition duration-300 shadow-lg hover:shadow-xl">
              Raise Capital
            </button>
          </div>
        </div>

        {/* Value Propositions */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {valueProps.map((prop, index) => (
            <div 
              key={index}
              className={`${prop.bgColor} p-8 rounded-2xl border border-gray-200 hover:border-${prop.color.split('-')[1]}-300 transition duration-300 hover:shadow-xl`}
            >
              <div className={`${prop.color} mb-4`}>
                {prop.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{prop.title}</h3>
              <p className="text-gray-700">{prop.description}</p>
            </div>
          ))}
        </div>

        {/* Impact Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Powering Africa's Economic Engine
            </h2>
            <p className="text-gray-600">
              The numbers that drive our mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  {stat.label}
                </div>
                <div className="text-gray-600 text-sm">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10 pt-8 border-t border-gray-100">
            <div className="inline-flex items-center gap-3 text-gray-700">
              <Users className="h-5 w-5" />
              <span className="font-medium">Join 500+ investors and 1,200+ SMEs already building with us</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPitch;