import React from 'react';

const FundraisersPage = () => {
  const fundraisers = [
    { rank: 1, name: 'Project A', amountRaised: '$50,000' },
    { rank: 2, name: 'Project B', amountRaised: '$40,000' },
    { rank: 3, name: 'Project C', amountRaised: '$35,000' },
    { rank: 4, name: 'Project D', amountRaised: '$30,000' },
    { rank: 5, name: 'Project E', amountRaised: '$25,000' },
  ]; // Example data; replace with dynamic data as needed

  return (
    <div className="px-4 py-6 flex flex-col items-center flex-grow bg-white min-h-screen">
      {/* Leaderboard Header */}
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl md:text-[32px] font-bold text-gray-900">
          Fundraisers Leaderboard
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Every project on Bantu Hive has a leaderboard that shows who has the
          most money. It's a fun way to see what's popular, but it also gives
          you a sense of how much work it takes to get funded.
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="w-full max-w-4xl mt-6">
        <table className="w-full text-left border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-gray-700 text-sm font-medium">
                Rank
              </th>
              <th className="px-4 py-3 text-gray-700 text-sm font-medium">
                Fundraiser
              </th>
              <th className="px-4 py-3 text-gray-700 text-sm font-medium">
                Amount Raised
              </th>
            </tr>
          </thead>
          <tbody>
            {fundraisers.map((fundraiser) => (
              <tr
                key={fundraiser.rank}
                className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-800">{fundraiser.rank}</td>
                <td className="px-4 py-3 text-gray-800">{fundraiser.name}</td>
                <td className="px-4 py-3 text-gray-800">
                  {fundraiser.amountRaised}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* How-to Section */}
      <div className="w-full max-w-4xl mt-10 bg-gray-50 border border-gray-200 rounded-md p-6">
        <h2 className="text-xl font-semibold text-gray-900">
          How do I get on the leaderboard?
        </h2>

        <div className="mt-4 space-y-4 text-gray-700">
          <div>
            <h3 className="text-lg font-medium text-gray-800">
              Top Projects Requirement
            </h3>
            <p className="text-sm">
              You have to be in the top 5% of all projects based on total funds
              raised. So if there are 100 projects, you'd need to be in the top
              5. If there are 10,000 projects, you'd need to be in the top 500.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">
              Project Progress
            </h3>
            <p className="text-sm">
              You can track your progress on your project page. This will show
              your current rank and how much money you've raised. You can also
              see how many days are left in your campaign.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">
              What happens if I make the leaderboard?
            </h3>
            <p className="text-sm">
              If you make the leaderboard, you'll get a special badge on your
              project. This is a great way to show potential backers that your
              project is popular.
            </p>
            <p className="text-sm mt-2">
              You'll also get a shout-out in our weekly newsletter. This goes
              out to thousands of people who love to discover new projects. It's
              a great way to get some extra attention for your campaign.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundraisersPage;
