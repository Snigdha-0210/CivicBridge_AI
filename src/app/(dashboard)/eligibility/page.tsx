"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  User,
} from "lucide-react";
import { PageHeader, FadeIn } from "@/components/shared/ui-helpers";
import { EligibilityBadge } from "@/components/dashboard/opportunity-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { getOpportunity } from "@/lib/api";
import { OPPORTUNITIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { EligibilityStatus } from "@/lib/types";

function StatusVisual({ status }: { status?: EligibilityStatus }) {
  const config = {
    Eligible: {
      icon: CheckCircle2,
      ring: "ring-success/30",
      bg: "bg-success/10",
      text: "text-success",
    },
    "Likely Eligible": {
      icon: AlertTriangle,
      ring: "ring-warning/30",
      bg: "bg-warning/10",
      text: "text-warning",
    },
    "Not Eligible": {
      icon: XCircle,
      ring: "ring-destructive/30",
      bg: "bg-destructive/10",
      text: "text-destructive",
    },
  };

  const key = status || "Not Eligible";
  const { icon: Icon, ring, bg, text } = config[key];

  return (
    <div
      className={cn(
        "mx-auto flex h-24 w-24 items-center justify-center rounded-full ring-4",
        ring,
        bg
      )}
    >
      <Icon className={cn("h-12 w-12", text)} />
    </div>
  );
}

function EligibilityContent() {
  const searchParams = useSearchParams();
  const { profile } = useAuth();
  const [selectedId, setSelectedId] = useState(
    searchParams.get("opportunity") || OPPORTUNITIES[0].id
  );

  useEffect(() => {
    const opp = searchParams.get("opportunity");
    if (opp) setSelectedId(opp);
  }, [searchParams]);

  const opportunity = getOpportunity(selectedId, profile);

  if (!opportunity) return null;

  return (
    <div className="space-y-8">
      <FadeIn>
        <PageHeader
          title="Eligibility Checker"
          description="See how your profile matches official scheme criteria. Results are advisory — always confirm on the official portal."
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="max-w-xl space-y-2">
          <label className="text-sm font-medium">Select opportunity</label>
          <Select value={selectedId} onValueChange={(v) => v && setSelectedId(String(v))}>
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Choose an opportunity" />
            </SelectTrigger>
            <SelectContent>
              {OPPORTUNITIES.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-3">
        <FadeIn delay={0.1} className="lg:col-span-2">
          <Card className="rounded-2xl border-border">
            <CardHeader className="text-center">
              <StatusVisual status={opportunity.eligibilityStatus} />
              <div className="mt-4 flex flex-col items-center gap-2">
                <EligibilityBadge status={opportunity.eligibilityStatus} />
                <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {opportunity.organization}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="mb-3 text-sm font-semibold">Why this result?</h3>
              <ul className="space-y-3">
                {opportunity.eligibilityReasons?.map((reason) => (
                  <li
                    key={reason}
                    className="flex gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {reason}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.15}>
          <Card className="rounded-2xl border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Profile used for check</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Name</span>
                <p className="font-medium">{profile?.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Education</span>
                <p className="font-medium">{profile?.education}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Occupation</span>
                <p className="font-medium">{profile?.occupation}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Income</span>
                <p className="font-medium">{profile?.income}</p>
              </div>
              <div>
                <span className="text-muted-foreground">State</span>
                <p className="font-medium">{profile?.state}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Skills</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {profile?.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}

export default function EligibilityPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <EligibilityContent />
    </Suspense>
  );
}
