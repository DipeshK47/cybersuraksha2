"use client";

import {
  BookOpen,
  Bot,
  ExternalLink,
  Globe2,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { readJson } from "../lib/read-json";

type Source =
  | {
      id: string;
      kind: "handbook";
      title: string;
      label: string;
    }
  | {
      id: string;
      kind: "web";
      title: string;
      label: string;
      url: string;
    };

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
};

const welcome: Message = {
  id: "welcome",
  role: "assistant",
  text: "Hi! I’m Suraksha Guide. Ask me about your Computational Thinking and AI handbook.",
};

const modulesWithInlineGuide = new Set([
  "/module/secret-message-rescue",
  "/module/toy-workshop",
  "/module/double-century-vault",
]);

function getViewerRole() {
  if (typeof window === "undefined") return "student";
  return sessionStorage.getItem("cybersuraksha-role") === "teacher"
    ? "teacher"
    : "student";
}

function getInitialGrade() {
  if (typeof window === "undefined") return 7;
  try {
    const stored = sessionStorage.getItem("cybersuraksha-student");
    const student = stored ? (JSON.parse(stored) as { className?: string }) : null;
    const grade = Number.parseInt(student?.className ?? "", 10);
    return grade >= 3 && grade <= 8 ? grade : 7;
  } catch {
    return 7;
  }
}

function getSessionId() {
  const key = "cybersuraksha-guide-session";
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  sessionStorage.setItem(key, created);
  return created;
}

type HandbookChatbotProps = {
  placement?: "floating" | "inline";
};

export function HandbookChatbot({
  placement = "floating",
}: HandbookChatbotProps = {}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"handbook" | "web">("handbook");
  const [grade, setGrade] = useState(getInitialGrade);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [viewerRole, setViewerRole] = useState<"student" | "teacher">("student");
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      conversationRef.current?.scrollTo({
        top: conversationRef.current.scrollHeight,
      });
    }
  }, [open, messages, sending]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  function toggleAssistant() {
    if (!open) {
      const role = getViewerRole();
      setViewerRole(role);
      if (role === "teacher" && messages.length === 1) {
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            text: "Hi! I’m Suraksha Guide for Teachers. Ask for a class report, a student’s progress, the current schedule, or deadlines.",
          },
        ]);
      }
    }
    setOpen((current) => !current);
  }

  async function askQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = question.trim();
    if (!text || sending) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };
    const history = messages
      .filter((message) => message.id !== "welcome")
      .slice(-6)
      .map((message) => ({ role: message.role, text: message.text }));
    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setSending(true);
    setStatus("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode,
          grade,
          history,
          sessionId: getSessionId(),
        }),
      });
      const payload = await readJson<{
        answer?: string;
        error?: string;
        provider?: "groq" | "teacher-data";
        sources?: Source[];
      }>(response);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text:
            payload.answer ??
            "I could not answer that just now. Please try asking in another way.",
          sources: payload.sources,
        },
      ]);
      if (!response.ok) {
        setStatus(payload.error ?? "The assistant is temporarily unavailable.");
      } else if (mode === "web") {
        setStatus("Local handbook answer with approved official research links.");
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "I cannot connect right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  if (
    placement === "floating" &&
    modulesWithInlineGuide.has(pathname)
  ) {
    return null;
  }

  return (
    <aside
      className={`surakshaGuide${placement === "inline" ? " surakshaGuideInline" : ""}${open ? " surakshaGuideOpen" : ""}`}
    >
      {open ? (
        <section
          aria-label="Suraksha Guide handbook assistant"
          aria-modal="false"
          className="surakshaGuidePanel"
          role="dialog"
        >
          <header className="surakshaGuideHeader">
            <span className="surakshaGuideMark" aria-hidden="true">
              <Bot />
            </span>
            <span>
              <strong>Suraksha Guide</strong>
              <small>{viewerRole === "teacher" ? "Teacher insight assistant" : "Handbook learning assistant"}</small>
            </span>
            <button
              aria-label="Close Suraksha Guide"
              className="surakshaGuideClose"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X aria-hidden="true" />
            </button>
          </header>

          {viewerRole === "teacher" ? (
            <div className="surakshaGuideTeacherPrompt">
              Try: “Create a Class 7A report” or “How is Aarav Mehta doing?”
            </div>
          ) : (
          <div className="surakshaGuideControls">
            <label>
              <span>Class</span>
              <select
                aria-label="Choose class"
                onChange={(event) => setGrade(Number(event.target.value))}
                value={grade}
              >
                {[3, 4, 5, 6, 7, 8].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <div aria-label="Answer sources" className="surakshaGuideMode" role="group">
              <button
                aria-pressed={mode === "handbook"}
                onClick={() => setMode("handbook")}
                type="button"
              >
                <BookOpen aria-hidden="true" /> Handbooks
              </button>
              <button
                aria-pressed={mode === "web"}
                onClick={() => setMode("web")}
                type="button"
              >
                <Globe2 aria-hidden="true" /> + Web
              </button>
            </div>
          </div>
          )}

          <div
            aria-live="polite"
            className="surakshaGuideConversation"
            ref={conversationRef}
          >
            {messages.map((message) => (
              <article
                className={`surakshaGuideMessage surakshaGuideMessage${message.role}`}
                key={message.id}
              >
                <p>{message.text}</p>
                {message.sources?.length ? (
                  <div className="surakshaGuideSources">
                    {message.sources.map((source) =>
                      source.kind === "web" ? (
                        <a
                          href={source.url}
                          key={`${message.id}-${source.id}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <Globe2 aria-hidden="true" />
                          <span>{source.title}</span>
                          <ExternalLink aria-hidden="true" />
                        </a>
                      ) : (
                        <span key={`${message.id}-${source.id}`}>
                          <BookOpen aria-hidden="true" />
                          <span>{source.label}</span>
                        </span>
                      ),
                    )}
                  </div>
                ) : null}
              </article>
            ))}
            {sending ? (
              <div className="surakshaGuideThinking" role="status">
                <span />
                <span />
                <span />
                <b>Finding the best explanation…</b>
              </div>
            ) : null}
          </div>

          <form className="surakshaGuideComposer" method="post" onSubmit={askQuestion}>
            <input
              aria-label="Ask Suraksha Guide"
              maxLength={800}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask a handbook question…"
              ref={inputRef}
              value={question}
            />
            <button
              aria-label="Send question"
              disabled={sending || !question.trim()}
              type="submit"
            >
              <Send aria-hidden="true" />
            </button>
          </form>
          <footer className="surakshaGuideSafety">
            <ShieldCheck aria-hidden="true" />
            <span>Don’t share personal details. Teachers may review school activity.</span>
          </footer>
          {status ? <p className="surakshaGuideStatus">{status}</p> : null}
        </section>
      ) : null}

      <button
        aria-expanded={open}
        aria-label={open ? "Close Suraksha Guide" : "Open Suraksha Guide"}
        className="surakshaGuideLauncher"
        onClick={toggleAssistant}
        type="button"
      >
        <Bot aria-hidden="true" />
        <span>Ask Suraksha Guide</span>
      </button>
    </aside>
  );
}
