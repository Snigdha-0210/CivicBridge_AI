"use client";

import { useState } from "react";
import { FileText, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { PageHeader, FadeIn } from "@/components/shared/ui-helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { explainDocument } from "@/lib/api";
import type { DocumentExplanation } from "@/lib/types";

const SAMPLE_NOTIFICATION = `GOVERNMENT OF INDIA
Ministry of Education — Scholarship Notification 2026

Post Matric Scholarship for students from economically weaker sections.

Eligibility: Indian citizens enrolled in recognized institutions with family income below ₹8 lakh per annum. Minimum 50% marks in previous examination required.

Benefits: Tuition fee reimbursement up to ₹50,000 per year, maintenance allowance, and book grant.

Documents: Aadhaar, income certificate, mark sheets, admission letter, bank passbook.

Last date for online submission: 30 September 2026 via scholarships.gov.in only.`;

export default function DocumentExplainerPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DocumentExplanation | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === "application/pdf") {
      setText(
        `[Uploaded: ${file.name}]\n\n${SAMPLE_NOTIFICATION}\n\n(Simulated text extraction from PDF — connect OCR backend for production.)`
      );
    } else {
      const content = await file.text();
      setText(content);
    }
  };

  const handleExplain = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const explanation = await explainDocument(text);
      setResult(explanation);
      setCheckedItems(new Set());
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      <FadeIn>
        <PageHeader
          title="Document Explainer"
          description="Upload a government PDF or paste notification text. CivicBridge AI extracts eligibility, deadlines, and action items."
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <Tabs defaultValue="upload">
          <TabsList>
            <TabsTrigger value="upload">Upload PDF</TabsTrigger>
            <TabsTrigger value="paste">Paste text</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-4">
            <Card className="rounded-2xl border-dashed border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Upload className="h-7 w-7" />
                </div>
                <p className="mb-1 text-sm font-medium">
                  Drop a government notification PDF
                </p>
                <p className="mb-4 text-xs text-muted-foreground">
                  Supports PDF up to 10 MB
                </p>
                <label>
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    className="hidden"
                    onChange={handleFile}
                  />
                  <span className="inline-flex h-9 cursor-pointer items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80">
                    Choose file
                  </span>
                </label>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="paste" className="mt-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the full notification text here…"
              className="min-h-[200px] resize-y"
            />
          </TabsContent>
        </Tabs>

        {text && (
          <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Input preview
            </p>
            <p className="text-sm text-muted-foreground line-clamp-4">{text}</p>
          </div>
        )}

        <Button
          className="mt-4 gap-2"
          onClick={handleExplain}
          disabled={!text.trim() || loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing document…
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Explain document
            </>
          )}
        </Button>
      </FadeIn>

      {result && (
        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.1}>
            <Card className="rounded-2xl border-border lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Summary</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {result.summary}
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="text-base">Eligibility</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {result.eligibility.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="text-base">Required documents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {result.requiredDocuments.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="text-base">Deadline</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {result.deadline}
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="text-base">Important notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {result.importantNotes.map((n) => (
                    <li key={n} className="flex gap-2">
                      <span className="text-warning">•</span>
                      {n}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.25} className="lg:col-span-2">
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="text-base">Action checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.actionChecklist.map((item, i) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 px-4 py-3 transition-colors hover:bg-muted/30"
                  >
                    <Checkbox
                      checked={checkedItems.has(i)}
                      onCheckedChange={() => toggleCheck(i)}
                    />
                    <span className="text-sm text-muted-foreground">{item}</span>
                    {checkedItems.has(i) && (
                      <CheckCircle2 className="ml-auto h-4 w-4 text-success" />
                    )}
                  </label>
                ))}
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.3} className="lg:col-span-2">
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle className="text-base">FAQs</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion>
                  {result.faqs.map((faq, i) => (
                    <AccordionItem key={faq.question} value={`faq-${i}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      )}
    </div>
  );
}
