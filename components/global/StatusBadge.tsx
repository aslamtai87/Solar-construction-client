"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType =
  | "active"
  | "suspended"
  | "banned"
  | "rejected"
  | "paused"
  | "approved"
  | "pending"
  | "inactive"
  | "running"
  | "failed"
  | "completed"
  | "processing"
  | "refunded";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: {
    label: "active",
    className: "bg-[#D1E7DD] text-green-success hover:bg-green-100 ",
  },
  suspended: {
    label: "suspended",
    className: "bg-[#FFE5B4] text-[#7C4700] hover:bg-yellow-100",
  },
  banned: {
    label: "banned",
    className: "bg-[#F8D7DA] text-red-800 hover:bg-red-100",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-[#842029] hover:bg-red-100",
  },
  paused: {
    label: "Paused",
    className: "bg-table-row text-gray-800 hover:bg-table-row ",
  },
  approved: {
    label: "approved",
    className: "bg-green-100 text-green-800 hover:bg-green-100 ",
  },
  pending: {
    label: "pending",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  inactive: {
    label: "inactive",
    className: "bg-gray-200 text-gray-800 hover:bg-table-row ",
  },
  running: {
    label: "Running",
    className: "bg-green-100 text-green-800 hover:bg-green-100 ",
  },
  failed: {
    label: "failed",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  completed: {
    label: "Completed",
    className: "bg-[#D1E7DD] text-[#0F5132] hover:bg-teal-100 ",
  },
  processing: {
    label: "processing",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100 ",
  },
  refunded: {
    label: "Refunded",
    className: "bg-green-100 text-green-800 hover:bg-green-100 ",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = status ? statusConfig[String(status)] : undefined;

  if (!config) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[StatusBadge] Unknown status "${status}" - using fallback styling.`
      );
    }
    return (
      <Badge
        variant="secondary"
        className={cn("bg-gray-100 text-gray-800", className)}
      >
        {String(status ?? "unknown")}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

export function ActiveBadge({ className }: { className?: string }) {
  return <StatusBadge status="active" className={className} />;
}

export function SuspendedBadge({ className }: { className?: string }) {
  return <StatusBadge status="suspended" className={className} />;
}

export function BannedBadge({ className }: { className?: string }) {
  return <StatusBadge status="banned" className={className} />;
}

export function RejectedBadge({ className }: { className?: string }) {
  return <StatusBadge status="rejected" className={className} />;
}

export function PausedBadge({ className }: { className?: string }) {
  return <StatusBadge status="paused" className={className} />;
}

export function ApprovedBadge({ className }: { className?: string }) {
  return <StatusBadge status="approved" className={className} />;
}

export function PendingBadge({ className }: { className?: string }) {
  return <StatusBadge status="pending" className={className} />;
}

export function InactiveBadge({ className }: { className?: string }) {
  return <StatusBadge status="inactive" className={className} />;
}

export function RunningBadge({ className }: { className?: string }) {
  return <StatusBadge status="running" className={className} />;
}

export function FailedBadge({ className }: { className?: string }) {
  return <StatusBadge status="failed" className={className} />;
}

export function CompletedBadge({ className }: { className?: string }) {
  return <StatusBadge status="completed" className={className} />;
}

export function ProcessingBadge({ className }: { className?: string }) {
  return <StatusBadge status="processing" className={className} />;
}
