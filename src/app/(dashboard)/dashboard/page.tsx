"use client";

import Link from "next/link";
import { format, parseISO, differenceInDays } from "date-fns";
import {
  Target,
  FileCheck2,
  CalendarClock,
  Bookmark,
  Upload,
  Search,
  ListChecks,
  ArrowRight,
  Bell,
} from "lucide-react";
import { PageHeader, FadeIn, StatCard } from "@/components/shared/ui-helpers";
import { OpportunityCard } from "@/components/dashboard/opportunity-card";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { getRecommended } from "@/lib/api";
import {
  OPPORTUNITIES,
  APPLICATIONS,
  NOTIFICATIONS,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  {
    href: "/document-explainer",
    label: "Upload Government PDF",
    description: "Explain a notification in plain language",
    icon: Upload,
  },
  {
    href: "/eligibility",
    label: "Check Eligibility",
    description: "See if you qualify for a scheme",
    icon: FileCheck2,
  },
  {
    href: "/search",
    label: "Search Opportunities",
    description: "Natural language discovery",
    icon: Search,
  },
  {
    href: "/tracker",
    label: "Application Tracker",
    description: "Monitor your submissions",
    icon: ListChecks,
  },
];

export default function DashboardPage() {
  const { profile } = useAuth();
  const recommendations = getRecommended(profile).slice(0, 4);

  const eligibleCount = OPPORTUNITIES.filter(
    (o) =>
      o.eligibilityStatus === "Eligible" ||
      o.eligibilityStatus === "Likely Eligible"
  ).length;

  const submittedCount = APPLICATIONS.filter(
    (a) => a.status !== "Draft"
  ).length;

  const today = new Date();
  const upcomingDeadlines = [...OPPORTUNITIES]
    .filter((o) => differenceInDays(parseISO(o.deadline), today) >= 0)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 5);

  const deadlineCount = OPPORTUNITIES.filter((o) => {
    const days = differenceInDays(parseISO(o.deadline), today);
    return days >= 0 && days <= 30;
  }).length;

  const savedCount = 3;
  const recentNotifications = NOTIFICATIONS.slice(0, 4);
  const firstName = profile?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <FadeIn>
        <PageHeader
          title={`Good evening, ${firstName}`}
          description="Here is your personalized overview of opportunities, deadlines, and next steps."
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Eligible Opportunities"
            value={eligibleCount}
            subtitle="Based on your profile"
            icon={<Target className="h-4 w-4" />}
          />
          <StatCard
            title="Applications Submitted"
            value={submittedCount}
            subtitle={`${APPLICATIONS.length} total tracked`}
            icon={<FileCheck2 className="h-4 w-4" />}
          />
          <StatCard
            title="Upcoming Deadlines"
            value={deadlineCount}
            subtitle="Within the next 30 days"
            icon={<CalendarClock className="h-4 w-4" />}
          />
          <StatCard
            title="Saved Opportunities"
            value={savedCount}
            subtitle="Bookmarked for later"
            icon={<Bookmark className="h-4 w-4" />}
          />
        </div>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-3">
        <FadeIn delay={0.1} className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Latest Recommendations</h2>
            <Link
              href="/opportunities"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-1"
              )}
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {recommendations.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} compact />
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="space-y-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-primary/[0.02]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        </FadeIn>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FadeIn delay={0.2}>
          <Card className="rounded-2xl border-border shadow-sm shadow-slate-900/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">
                Upcoming Deadlines
              </CardTitle>
              <Link
                href="/calendar"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Calendar
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDeadlines.map((opp) => {
                const days = differenceInDays(parseISO(opp.deadline), today);
                return (
                  <Link
                    key={opp.id}
                    href={`/opportunities/${opp.id}`}
                    className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="truncate text-sm font-medium">{opp.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(opp.deadline), "d MMM yyyy")}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        days <= 7
                          ? "border-destructive/30 text-destructive"
                          : days <= 14
                            ? "border-warning/30 text-warning"
                            : ""
                      )}
                    >
                      {days === 0 ? "Today" : `${days}d left`}
                    </Badge>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.25}>
          <Card className="rounded-2xl border-border shadow-sm shadow-slate-900/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">
                Recent Notifications
              </CardTitle>
              <Link
                href="/notifications"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentNotifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href || "/notifications"}
                  className={cn(
                    "flex gap-3 rounded-lg border px-3 py-2.5 transition-colors hover:bg-muted/50",
                    !n.read ? "border-primary/20 bg-primary/[0.02]" : "border-border/60"
                  )}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
