import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';
import moment from 'moment';

type DonationsChartProps = {
  currentCampaign: SingleCampaignResponseDataType | null;
};

const DonationsChart = ({ currentCampaign }: DonationsChartProps) => {
  if (!currentCampaign?.donations_over_time) {
    return (
      <p className="text-gray-500 text-sm text-center">
        No{' '}
        {currentCampaign?.type === 'EquityCampaign' ? 'investment' : 'donation'}{' '}
        data available
      </p>
    );
  }

  const isEquityCampaign = currentCampaign?.type === 'EquityCampaign';
  const currency =
    currentCampaign?.fundraiser?.currency_symbol ||
    currentCampaign?.currency?.toUpperCase();

  // Transform donations_over_time directly
  const donationData = Object.entries(currentCampaign.donations_over_time).map(
    ([date, amount]) => ({
      date: moment(date).format('MMM D'), // Format date for better readability
      amount: parseFloat(amount as string), // Ensure amount is a number
    }),
  );

  return (
    <div className="bg-white rounded-lg mt-6">
      <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
        {isEquityCampaign ? 'Investments' : 'Donations'} in{' '}
        {moment().format('MMMM')}
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={donationData}
          margin={{
            top: 20,
            right: 2,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${currency} ${value}`}
          />
          <Tooltip
            formatter={(value) => [
              `${currency} ${value}`,
              isEquityCampaign ? 'Investment' : 'Donation',
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={isEquityCampaign ? '#f97316' : '#22c55e'} // Orange for equity, green for donations
            strokeWidth={2}
            name={isEquityCampaign ? 'Investment' : 'Donation'}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonationsChart;
