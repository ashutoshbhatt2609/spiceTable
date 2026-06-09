import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export function Button({
  className, variant = "primary", size = "md",
  loading = false, disabled, children, ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary)/0.4)] focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" && "h-8  px-3 text-xs",
        size === "md" && "h-9  px-4 text-sm",
        size === "lg" && "h-10 px-5 text-sm",
        variant === "primary"   && "bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary)/0.88)]",
        variant === "secondary" && "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--border))]",
        variant === "ghost"     && "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]",
        variant === "danger"    && "bg-[hsl(var(--destructive))] text-white hover:opacity-90",
        variant === "success"   && "bg-[hsl(var(--success))] text-white hover:opacity-90",
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="size-3.5 animate-spin" />}
      {children}
    </button>
  );
}
