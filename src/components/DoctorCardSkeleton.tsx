export default function DoctorCardSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-zinc-800 rounded-lg shadow p-4 flex flex-col items-center gap-4 min-h-[220px]">
      <div className="w-20 h-20 bg-gray-200 dark:bg-zinc-700 rounded-full" />
      <div className="w-32 h-4 bg-gray-200 dark:bg-zinc-700 rounded" />
      <div className="w-24 h-3 bg-gray-200 dark:bg-zinc-700 rounded" />
      <div className="w-20 h-3 bg-gray-200 dark:bg-zinc-700 rounded" />
      <div className="w-16 h-3 bg-gray-200 dark:bg-zinc-700 rounded" />
    </div>
  );
}
