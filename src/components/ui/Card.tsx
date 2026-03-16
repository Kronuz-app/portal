import { cn } from "../../lib/utils";

interface CardProps {
  variant?: "default" | "selectable";
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Card({
  variant = "default",
  selected = false,
  onClick,
  children,
  className,
}: CardProps) {
  const base =
    "rounded-lg bg-card text-card-foreground p-4 border border-border";

  const selectable =
    variant === "selectable"
      ? "cursor-pointer transition-colors hover:border-primary"
      : "";

  const selectedStyle =
    selected ? "border-primary ring-1 ring-primary" : "";

  return (
    <div
      role={variant === "selectable" ? "button" : undefined}
      tabIndex={variant === "selectable" ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        variant === "selectable"
          ? (e) => (e.key === "Enter" || e.key === " ") && onClick?.()
          : undefined
      }
      className={cn(base, selectable, selectedStyle, className)}
    >
      {children}
    </div>
  );
}
