import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
  href = "/",
}: {
  className?: string;
  showText?: boolean;
  href?: string;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M4 14c3-6 6-9 8-9s5 3 8 9" strokeLinecap="round" />
          <path d="M7 14h10" strokeLinecap="round" />
          <circle cx="12" cy="17" r="2" fill="currentColor" stroke="none" />
        </svg>
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            CivicBridge
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            AI
          </span>
        </span>
      )}
    </Link>
  );
}
