export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50/30">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading profile...</p>
      </div>
    </div>
  );
}
