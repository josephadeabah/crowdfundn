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
        No donations data available
      </p>
    );
  }

  // Transform donations_over_time directly
  const donationData = Object.entries(currentCampaign.donations_over_time).map(
    ([date, amount]) => ({
      date: moment(date).format('MMM D'), // Format date for better readability
      amount: parseFloat(amount as string), // Ensure amount is a number
    }),
  );

  return (
    <div className="bg-white p-4 rounded-lg mt-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Donations Over Time</h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={donationData}
          margin={{
            top: 20, // Increase from 5 to 30
            right: 2,
            left: 2,
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
            tickFormatter={(value) =>
              `${currentCampaign?.currency?.toUpperCase()} ${value}`
            }
          />
          <Tooltip
            formatter={(value) => `${currentCampaign?.currency?.toUpperCase()} ${value}`}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#22c55e"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonationsChart;
