import type { ContributionStatus } from "@/lib/contributions";

const ORDER: ContributionStatus[] = ["merged", "open", "closed"];

const DOT: Record<ContributionStatus, string> = {
  merged: "bg-purple-500",
  open: "bg-emerald-500",
  closed: "bg-rose-500",
};

/** Non-zero status counts, in a fixed order, e.g. "7 merged  2 open". */
export function StatusCounts({
  counts,
  className = "",
}: Readonly<{
  counts: Record<ContributionStatus, number>;
  className?: string;
}>) {
  const visible = ORDER.filter((status) => counts[status] > 0);

  if (visible.length === 0) return null;

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
      {visible.map((status) => (
        <span key={status} className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${DOT[status]}`} />
          <span className="font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
            {counts[status]}
          </span>
          <span>{status}</span>
        </span>
      ))}
    </span>
  );
}
