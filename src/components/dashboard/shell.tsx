"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Search,
  FileCheck2,
  FileText,
  Route,
  CalendarDays,
  FolderLock,
  ListChecks,
  Bell,
  Compass,
  MessageSquare,
  UserRound,
  FileBarChart,
  Shield,
  Menu,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/opportunities", label: "Opportunities", icon: Compass },
  { href: "/search", label: "Search", icon: Search },
  { href: "/eligibility", label: "Eligibility", icon: FileCheck2 },
  { href: "/document-explainer", label: "Document AI", icon: FileText },
  { href: "/roadmap", label: "Roadmap", icon: Route },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/vault", label: "Document Vault", icon: FolderLock },
  { href: "/tracker", label: "Tracker", icon: ListChecks },
  { href: "/career", label: "Career Advisor", icon: Sparkles },
  { href: "/chat", label: "AI Assistant", icon: MessageSquare },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/admin", label: "Admin", icon: Shield },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5 px-3 py-2">
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        const unread =
          item.href === "/notifications"
            ? NOTIFICATIONS.filter((n) => !n.read).length
            : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Icon className={cn("h-4 w-4", active && "text-primary")} />
            <span className="flex-1">{item.label}</span>
            {unread > 0 && (
              <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]">
                {unread}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { profile, logout, isDemo } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const initials =
    profile?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CB";

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <Logo href="/dashboard" />
      </div>
      {isDemo && (
        <div className="mx-3 mb-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Demo mode — connect Firebase for production auth.
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <NavLinks onNavigate={() => setOpen(false)} />
      </div>
      <Separator />
      <div className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{profile?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{profile?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={async () => {
            await logout();
            router.push("/");
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:fixed lg:inset-y-0 lg:flex lg:flex-col">
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-white/80 px-4 backdrop-blur-xl sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="lg:hidden" />}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              {sidebar}
            </SheetContent>
          </Sheet>

          <form onSubmit={onSearch} className="relative max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try “scholarships under ₹8 lakh income”'
              className="h-10 border-border/80 bg-secondary/50 pl-9"
            />
          </form>

          <Link
            href="/notifications"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "relative"
            )}
          >
            <Bell className="h-5 w-5" />
            {NOTIFICATIONS.some((n) => !n.read) && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            )}
          </Link>

          <Link
            href="/profile"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
