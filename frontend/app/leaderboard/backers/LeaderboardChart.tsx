'use client';
import { useUserContext } from '@/app/context/users/UserContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Customized Dot for Score (Green/Red based on score)
const CustomizedDot = (props: {
  cx: number;
  cy: number;
  payload: { score: number };
}) => {
  const { cx, cy, payload } = props;

  // Determine dot color based on score
  const fillColor = payload.score < 100 ? 'red' : 'green';

  return (
    <svg
      x={cx - 10}
      y={cy - 10}
      width={20}
      height={20}
      fill={fillColor}
      viewBox="0 0 1024 1024"
    >
      <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
    </svg>
  );
};

// Customized Dollar Sign SVG for Total Donations
const CustomizedDollarDot = (props: {
  cx: number;
  cy: number;
  payload: { totalDonations: number };
}) => {
  const { cx, cy } = props;

  return (
    <svg
    x={cx - 10}
    y={cy - 10}
    width={20}
    height={20}
    fill="#FFB200" // Green color for dollar sign
    viewBox="0 0 24 24"
  >
    <path d="M12 1C6.48 1 2 5.48 2 11C2 16.52 6.48 21 12 21C17.52 21 22 16.52 22 11C22 5.48 17.52 1 12 1ZM13 14H11V9H13V14ZM13 7H11V5H13V7ZM12 3C6.48 3 3 6.48 3 11C3 15.52 6.48 19 12 19C17.52 19 21 15.52 21 11C21 6.48 17.52 3 12 3Z" />
  </svg>
  );
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  const { userAccountData } = useUserContext();
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-gray-600">Score: {payload[0].value}</p>
        <p className="text-sm text-gray-600">
          Total Donations: {userAccountData?.profile?.currency?.toUpperCase()}
          {payload[1].value}
        </p>
      </div>
    );
  }

  return null;
};

const LeaderboardChart = ({ leaderboard }: any) => {
  // Transform leaderboard data for the chart
  const chartData = leaderboard.map((backer: any) => ({
    name: backer.username, // Use backer's name as the X-axis label
    score: backer.score, // Use score as one data line
    totalDonations: Number(backer.total_donations || 0), // Use total donations as another data line
  }));

  return (
    <div className="w-full h-[400px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            dot={<CustomizedDot cx={0} cy={0} payload={{ score: 0 }} />}
          />
          <Line
            type="monotone"
            dataKey="totalDonations"
            stroke="#FFB200"
            dot={
              <CustomizedDollarDot
                cx={0}
                cy={0}
                payload={{ totalDonations: 0 }}
              />
            }
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaderboardChart;
