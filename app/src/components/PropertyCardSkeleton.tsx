import React from 'react';

export const PropertyCardSkeleton = () => {
  return (
    <div className="absolute inset-0 w-full h-full p-4 sm:p-8 pb-6 flex items-center justify-center">
      <div className="relative w-full h-full max-w-[400px] rounded-3xl overflow-hidden glass border border-stone-800 animate-pulse-slow bg-stone-900/40">
        <div className="absolute inset-0 bg-stone-800/40" />
        <div className="absolute bottom-5 left-5 right-5 space-y-4">
           {/* Title Skeleton */}
           <div className="h-6 bg-stone-700/50 rounded-lg w-3/4" />
           {/* Price Skeleton */}
           <div className="h-8 bg-stone-700/50 rounded-lg w-1/2" />
           {/* Meta Skeleton */}
           <div className="flex gap-3 mt-4">
              <div className="h-10 bg-stone-700/50 rounded-xl flex-1" />
              <div className="h-10 bg-stone-700/50 rounded-xl flex-1" />
              <div className="h-10 bg-stone-700/50 rounded-xl flex-1" />
           </div>
        </div>
      </div>
    </div>
  );
};
