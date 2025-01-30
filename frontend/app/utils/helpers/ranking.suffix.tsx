import React from 'react';

export const getRankWithSuffix = (rank: number): JSX.Element => {
  const suffix = (rank: number): string => {
    if (rank % 10 === 1 && rank !== 11) return 'st';
    if (rank % 10 === 2 && rank !== 12) return 'nd';
    if (rank % 10 === 3 && rank !== 13) return 'rd';
    return 'th';
  };

  return (
    <>
      {rank}
      <sup>{suffix(rank)}</sup>
    </>
  );
};
