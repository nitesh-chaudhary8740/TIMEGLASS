const DashboardSkeleton = () => {
  return (
    <div className="space-y-10 pt-4 animate-pulse">
      {/* 4 StatCard Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-50 flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-2 w-16 bg-slate-100 rounded" />
              <div className="h-8 w-24 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-14 w-14 bg-slate-50 rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Large Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 h-64">
          <div className="h-4 w-32 bg-slate-100 rounded mb-8" />
          <div className="space-y-4">
            <div className="h-16 w-full bg-slate-50 rounded-2xl" />
            <div className="h-16 w-full bg-slate-50 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;