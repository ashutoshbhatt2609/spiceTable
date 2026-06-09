import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-md border border-[hsl(var(--border))] bg-white px-3 text-sm",
        "text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]",
        "transition-colors duration-100",
        "focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary)/0.3)]",
        "disabled:cursor-not-allowed disabled:bg-[hsl(var(--muted))] disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}
