export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-60" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-3xl">
          🎁
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-lg font-bold text-zinc-800">AIがプレゼントを考え中...</p>
        <p className="text-sm text-zinc-500">思い出を分析して、ぴったりの案を探しています</p>
      </div>
    </div>
  );
}
