// Helper function to calculate the remaining days
function calculateRemainingDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the total number of days between start and end
  const totalDays = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  ); // milliseconds to days

  // Get the current date
  const today = new Date();

  // Calculate the number of days passed since the start date
  const daysPassed = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Calculate the remaining days
  const remainingDays = totalDays - daysPassed;

  // Return remaining days, ensuring it doesn't go below 0
  return Math.max(remainingDays, 0);
}

export function calculateAndUpdateRemainingDays(
  startDate: string,
  endDate: string,
): number {
  // Initial calculation of remaining days
  let remainingDays = calculateRemainingDays(startDate, endDate);

  // Set an interval to update the remaining days once per day
  setInterval(
    () => {
      remainingDays = calculateRemainingDays(startDate, endDate);
      //   console.log(`Remaining Days: ${remainingDays}`);
      // Here, you can update your UI or call another function to display the remaining days
    },
    1000 * 60 * 60 * 24,
  ); // Update every 24 hours (86400000 ms)

  return remainingDays;
}

export function getRemainingDaysMessage(
  startDate: string,
  endDate: string,
): string {
  const remainingDays = calculateAndUpdateRemainingDays(startDate, endDate);
  if (remainingDays === 1) return '1 day left';
  if (remainingDays === 0) return 'No days left';
  return `${remainingDays} days left`;
}

export const getRankWithSuffix = (rank: number): string => {
  const suffix = (rank: number): string => {
    if (rank % 10 === 1 && rank !== 11) return 'st';
    if (rank % 10 === 2 && rank !== 12) return 'nd';
    if (rank % 10 === 3 && rank !== 13) return 'rd';
    return 'th';
  };

  // Return rank with the correct suffix
  return `${rank}<sup>${suffix(rank)}</sup>`;
};
