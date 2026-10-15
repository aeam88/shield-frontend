import { cn } from "@/lib/utils";

export function GradientText({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
