// Beautiful Skeleton Loader Component
const CampaignCardSkeleton: React.FC = () => {
  return (
    <div className="snap-start flex-none w-[220px] md:w-[280px] my-3 mx-2">
      <div className="group relative overflow-hidden bg-white shadow-sm rounded-lg h-full flex flex-col animate-pulse">
        {/* Image Skeleton */}
        <div className="relative aspect-[4/2.5] overflow-hidden bg-gray-200">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <div className="p-3 flex-1 flex flex-col space-y-3">
          {/* Avatar & Name Skeleton */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>

          {/* Title Skeleton */}
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Progress Bar Skeleton */}
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gray-300 w-1/2"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>

          {/* Backers & Days Skeleton */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-10"></div>
          </div>
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>
    </div>
  );
};

export default CampaignCardSkeleton;
