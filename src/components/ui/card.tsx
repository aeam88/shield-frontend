import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dark-700/60 bg-dark-900/40 backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
