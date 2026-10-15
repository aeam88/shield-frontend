import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary/10 text-primary border-primary/20",
  neutral: "bg-white/5 text-dark-200 border-white/10",
};

export function Badge({
  variant = "primary",
  className,
  children,
}: {
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
