import { Card } from '@/app/components/ui/card';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { motion } from 'framer-motion';

interface MemberData {
  member_name: string;
  contribution_share: number;
  total_contributed: number;
  estimated_portfolio_value: number;
  engagement_level: string;
}

interface MembersOverviewProps {
  data?: {
    members: MemberData[];
    summary_stats?: {
      average_share: number;
      concentration_gini: number;
      top_contributor: MemberData;
    };
  };
}

export const MembersOverview = ({ data }: MembersOverviewProps) => {
  // Use real data or fallback to empty array
  const members = data?.members || [];

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (members.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-4 md:p-6 border border-gray-200">
          <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-800">
            Member Contributions
          </h3>
          <div className="text-center py-8">
            <p className="text-gray-500">No member data available</p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-4 md:p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-800">
            Member Contributions
          </h3>
          {data?.summary_stats && (
            <span className="text-sm text-gray-500">
              {members.length} members
            </span>
          )}
        </div>
        <div className="space-y-4">
          {members.slice(0, 5).map((member, index) => (
            <motion.div
              key={member.member_name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-4"
            >
              <Avatar>
                <AvatarFallback className="bg-emerald-500 text-white">
                  {getInitials(member.member_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {member.member_name}
                </p>
                <p className="text-sm text-gray-500">
                  {member.contribution_share.toFixed(1)}% of total
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(member.total_contributed)}
                </p>
                <p className="text-xs text-gray-500">
                  {member.engagement_level}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary stats if available */}
        {data?.summary_stats && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <p className="font-medium text-gray-900">
                  {data.summary_stats.average_share.toFixed(1)}%
                </p>
                <p className="text-gray-500">Avg Share</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">
                  {data.summary_stats.concentration_gini.toFixed(2)}
                </p>
                <p className="text-gray-500">Concentration</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
