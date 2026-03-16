import { Skeleton } from "./Skeleton";

interface AppointmentSkeletonProps {
  count?: number;
}

export function AppointmentSkeleton({ count = 3 }: AppointmentSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg p-4 mb-3 border"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 space-y-2">
              {/* Service name */}
              <Skeleton className="h-5 w-3/4" />
              {/* Professional name */}
              <Skeleton className="h-4 w-1/2" />
              {/* Date and time */}
              <Skeleton className="h-4 w-2/3" />
            </div>
            {/* Status badge */}
            <Skeleton className="h-6 w-20 rounded-full shrink-0" />
          </div>
        </div>
      ))}
    </>
  );
}
