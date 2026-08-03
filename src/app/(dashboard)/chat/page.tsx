"use client";

import { useRef, useState } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";
import { PageHeader, FadeIn } from "@/components/shared/ui-helpers";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { chatWithAssistant, createChatMessage } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  "What schemes am I eligible for?",
  "What documents do I need for NSP?",
  "When is the PM Internship deadline?",
  "How do I improve my match score?",
];

function renderMarkdownish(text: string) {
  return text.split("\n").map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={lineIdx}>
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={i} className="font-semibold text-foreground">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={i}>{part}</span>;
        })}
        {lineIdx < text.split("\n").length - 1 && <br />}
      </span>
    );
  });
}

export default function ChatPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    createChatMessage(
      "assistant",
      `Hello ${profile?.name?.split(" ")[0] || "there"}! I'm your CivicBridge AI assistant. I know your profile and can help with eligibility, documents, deadlines, and application guidance.\n\nWhat would you like to explore today?`
    ),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg = createChatMessage("user", text.trim());
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const history = updated.map((m) => ({ role: m.role, content: m.content }));
      const reply = await chatWithAssistant(history, profile);
      setMessages((prev) => [...prev, createChatMessage("assistant", reply)]);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <FadeIn>
        <PageHeader
          title="AI Assistant"
          description="Ask about eligibility, documents, deadlines, and application strategy."
        />
      </FadeIn>

      <FadeIn delay={0.05} className="mb-4 flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => sendMessage(prompt)}
            disabled={loading}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs transition-colors hover:border-primary/30 hover:bg-primary/5 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </FadeIn>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border bg-card p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {msg.role === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground"
              )}
            >
              {msg.role === "assistant"
                ? renderMarkdownish(msg.content)
                : msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
              <Bot className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about schemes, documents, or deadlines…"
          className="min-h-[44px] max-h-32 resize-none"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
        />
        <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
