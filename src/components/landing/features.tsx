"use client";

import {
  Search,
  CheckCircle2,
  FileText,
  Map,
  Calendar,
  FolderLock,
  ListChecks,
  MessageSquare,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/shared/ui-helpers";
import { cn } from "@/lib/utils";

const FEATURES: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Search,
    title: "Opportunity Discovery",
    description:
      "AI scans verified government portals and surfaces scholarships, grants, internships, and welfare schemes matched to your profile.",
  },
  {
    icon: CheckCircle2,
    title: "Eligibility Checker",
    description:
      "Instant eligibility verdicts with clear reasoning — know whether you qualify before investing time in an application.",
  },
  {
    icon: FileText,
    title: "Document Explainer",
    description:
      "Upload dense government PDFs and get plain-language summaries of requirements, deadlines, and key clauses.",
  },
  {
    icon: Map,
    title: "Application Roadmap",
    description:
      "Step-by-step checklists tailored to each opportunity, so you never miss a form field or verification step.",
  },
  {
    icon: Calendar,
    title: "Calendar",
    description:
      "Deadline tracking with smart reminders — stay ahead of closing dates across all your active applications.",
  },
  {
    icon: FolderLock,
    title: "Document Vault",
    description:
      "Securely store Aadhaar, mark sheets, income certificates, and more — reuse documents across applications.",
  },
  {
    icon: ListChecks,
    title: "Tracker",
    description:
      "Monitor every application from draft to decision with status updates and next-step guidance.",
  },
  {
    icon: MessageSquare,
    title: "AI Chat",
    description:
      "Ask questions about schemes, documents, or processes and get accurate answers grounded in official sources.",
  },
  {
    icon: GraduationCap,
    title: "Career Advisor",
    description:
      "Personalized recommendations for skills, courses, and opportunities that strengthen your long-term eligibility.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 border-y border-border bg-card/50 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Features</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you need to navigate government opportunities
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            One platform to discover, understand, prepare, and track — powered by
            AI that speaks your language.
          </p>
        </FadeIn>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.05}>
              <div
                className={cn(
                  "group h-full rounded-2xl border border-border bg-card p-6 shadow-sm shadow-slate-900/[0.03]",
                  "transition-colors hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
                )}
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
