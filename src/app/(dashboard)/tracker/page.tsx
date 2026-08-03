"use client";

import { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { PageHeader, FadeIn } from "@/components/shared/ui-helpers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APPLICATIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/lib/types";

const STATUSES: ApplicationStatus[] = [
  "Draft",
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
];

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Draft: "border-muted-foreground/30 bg-muted text-muted-foreground",
  Submitted: "border-primary/30 bg-primary/10 text-primary",
  "Under Review": "border-warning/30 bg-warning/10 text-warning",
  Approved: "border-success/30 bg-success/10 text-success",
  Rejected: "border-destructive/30 bg-destructive/10 text-destructive",
};

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>(APPLICATIONS);
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? applications
      : applications.filter((a) => a.status === filter);

  const updateStatus = (id: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status, updatedAt: new Date().toISOString() }
          : a
      )
    );
  };

  return (
    <div className="space-y-8">
      <FadeIn>
        <PageHeader
          title="Application Tracker"
          description="Monitor every application from draft to decision. Update status and track next steps."
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <Tabs value={filter} onValueChange={(v) => v && setFilter(String(v))}>
          <TabsList className="h-auto flex-wrap gap-1">
            <TabsTrigger value="All">All ({applications.length})</TabsTrigger>
            {STATUSES.map((s) => (
              <TabsTrigger key={s} value={s}>
                {s} ({applications.filter((a) => a.status === s).length})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </FadeIn>

      <div className="space-y-4">
        {filtered.map((app, i) => (
          <FadeIn key={app.id} delay={0.05 + i * 0.03}>
            <Card className="rounded-2xl border-border shadow-sm shadow-slate-900/5">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn("font-medium", STATUS_STYLES[app.status])}
                      >
                        {app.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Updated {format(parseISO(app.updatedAt), "d MMM yyyy")}
                      </span>
                    </div>
                    <Link
                      href={`/opportunities/${app.opportunityId}`}
                      className="text-base font-semibold hover:text-primary"
                    >
                      {app.opportunityTitle}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {app.organization}
                    </p>
                    {app.submittedAt && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Submitted {format(parseISO(app.submittedAt), "d MMM yyyy")}
                      </p>
                    )}
                  </div>
                  <Select
                    value={app.status}
                    onValueChange={(v) =>
                      v && updateStatus(app.id, v as ApplicationStatus)
                    }
                  >
                    <SelectTrigger className="h-9 w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(app.notes || app.nextStep) && (
                  <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
                    {app.notes && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Notes
                        </p>
                        <p className="text-sm">{app.notes}</p>
                      </div>
                    )}
                    {app.nextStep && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Next step
                        </p>
                        <p className="text-sm font-medium text-primary">
                          {app.nextStep}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No applications with status &ldquo;{filter}&rdquo;.
          </p>
        </div>
      )}
    </div>
  );
}
