import { Component } from "solid-js";

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export const Skeleton: Component<SkeletonProps> = (props) => {
  const getVariantClass = () => {
    switch (props.variant) {
      case "text":
        return "h-4 rounded";
      case "circular":
        return "rounded-full";
      case "rectangular":
      default:
        return "rounded-lg";
    }
  };

  return (
    <div
      class={`animate-pulse bg-gray-200 ${getVariantClass()} ${props.className || ""}`}
      style={{
        width: props.width || "100%",
        height: props.height || "1rem",
      }}
    />
  );
};

interface SkeletonCardProps {
  rows?: number;
}

export const SkeletonCard: Component<SkeletonCardProps> = (props) => {
  const rows = props.rows || 3;

  return (
    <div class="bg-surface-DEFAULT p-6 rounded-lg border border-border-DEFAULT space-y-4">
      <Skeleton height="2rem" width="60%" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton height="1rem" width={i === rows - 1 ? "80%" : "100%"} />
      ))}
    </div>
  );
};

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: Component<SkeletonTableProps> = (props) => {
  const rows = props.rows || 5;
  const columns = props.columns || 4;

  return (
    <div class="bg-surface-DEFAULT rounded-lg border border-border-DEFAULT overflow-hidden">
      <div class="p-4 border-b border-border-DEFAULT">
        <div
          class="grid gap-4"
          style={{ "grid-template-columns": `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map(() => (
            <Skeleton height="1.5rem" />
          ))}
        </div>
      </div>

      {Array.from({ length: rows }).map(() => (
        <div class="p-4 border-b border-border-DEFAULT last:border-b-0">
          <div
            class="grid gap-4"
            style={{ "grid-template-columns": `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map(() => (
              <Skeleton height="1rem" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface SkeletonListProps {
  items?: number;
}

export const SkeletonList: Component<SkeletonListProps> = (props) => {
  const items = props.items || 5;

  return (
    <div class="space-y-3">
      {Array.from({ length: items }).map(() => (
        <div class="bg-surface-DEFAULT p-4 rounded-lg border border-border-DEFAULT flex items-center gap-4">
          <Skeleton variant="circular" width="3rem" height="3rem" />
          <div class="flex-1 space-y-2">
            <Skeleton height="1rem" width="40%" />
            <Skeleton height="0.75rem" width="80%" />
          </div>
        </div>
      ))}
    </div>
  );
};
