import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  CheckCircle,
  Briefcase,
} from 'lucide-react';
import { stats } from './dealRoomData';

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
};

const statItems = [
  {
    label: 'Total Deals',
    value: stats.totalDeals,
    icon: Briefcase,
    suffix: '',
  },
  {
    label: 'Active Deals',
    value: stats.activeDeals,
    icon: Target,
    suffix: '',
  },
  {
    label: 'Total Raised',
    value: formatCurrency(stats.totalRaised),
    icon: DollarSign,
    suffix: '',
    isFormatted: true,
  },
  {
    label: 'Avg Deal Size',
    value: formatCurrency(stats.avgDealSize),
    icon: TrendingUp,
    suffix: '',
    isFormatted: true,
  },
  {
    label: 'Success Rate',
    value: stats.successRate,
    icon: CheckCircle,
    suffix: '%',
  },
  {
    label: 'Active Investors',
    value: stats.investorCount.toLocaleString(),
    icon: Users,
    suffix: '',
    isFormatted: true,
  },
];

export function StatsOverview() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-white p-4 shadow hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <stat.icon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stat.isFormatted ? stat.value : stat.value}
            {stat.suffix}
          </p>
          <p className="text-sm text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}