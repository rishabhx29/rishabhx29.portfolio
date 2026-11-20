const SIZES = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-[13px]",
} as const;

export function OrganizationMark({
  name,
  size = "sm",
}: Readonly<{ name: string; size?: keyof typeof SIZES }>) {
  const initials = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "?";

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 select-none items-center justify-center rounded-full border border-black/10 bg-zinc-50 font-semibold tracking-tight text-zinc-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 ${SIZES[size]}`}
    >
      {initials}
    </span>
  );
}
