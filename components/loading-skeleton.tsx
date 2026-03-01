// ═══════════════════════════════════════════════════════════════════
// Loading Skeleton Components
// Reusable skeleton placeholders for all screens
// TypeScript Strict Mode | Functions ≤30 lines
// ═══════════════════════════════════════════════════════════════════

const SHIMMER = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

// ─── Base Skeleton ───

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`${SHIMMER} ${className}`} />;
}

// ─── Card Skeleton ───

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 space-y-3">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

// ─── Portfolio Value Skeleton ───

export function PortfolioValueSkeleton() {
  return (
    <div className="bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-3xl p-6 space-y-4">
      <Skeleton className="h-3 w-32 bg-white/20" />
      <Skeleton className="h-10 w-48 bg-white/20" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-16 rounded-xl bg-white/10" />
        <Skeleton className="h-16 rounded-xl bg-white/10" />
        <Skeleton className="h-16 rounded-xl bg-white/10" />
      </div>
    </div>
  );
}

// ─── Investment Row Skeleton ───

export function InvestmentRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="space-y-2 text-right">
        <Skeleton className="h-4 w-16 ml-auto" />
        <Skeleton className="h-3 w-12 ml-auto" />
      </div>
    </div>
  );
}

// ─── Grid Skeleton (for Market Overview, Invest) ───

export function GridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Home Screen Skeleton ───

export function HomeScreenSkeleton() {
  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      <PortfolioValueSkeleton />
      <div className="flex gap-3">
        <Skeleton className="h-20 flex-1 rounded-xl" />
        <Skeleton className="h-20 flex-1 rounded-xl" />
        <Skeleton className="h-20 flex-1 rounded-xl" />
      </div>
      <GridSkeleton count={4} />
    </div>
  );
}

// ─── Detail Screen Skeleton ───

export function DetailScreenSkeleton() {
  return (
    <div className="space-y-6 pb-24">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    </div>
  );
}

// ─── List Screen Skeleton ───

export function ListScreenSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <InvestmentRowSkeleton key={i} />
      ))}
    </div>
  );
}
