"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppFooter from "@/components/AppFooter";
import Header from "@/components/Header";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type Status = "connected" | "not_connected" | "failed";
type TestState = "idle" | "success" | "api_failed";

export default function QfConnectPage() {
  const [status, setStatus] = useState<Status>("not_connected");
  const [testState, setTestState] = useState<TestState>("idle");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const oauthUrl = useMemo(() => `${API_BASE}/api/qf/oauth/start`, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "oauth_failed") {
      setStatus("failed");
      return;
    }

    async function loadStatus() {
      try {
        const res = await fetch(`${API_BASE}/api/qf/user/status`, {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        setStatus(data.connected ? "connected" : "not_connected");
      } catch {
        setStatus("not_connected");
      }
    }

    loadStatus();
  }, []);

  async function testBookmarks() {
    setLoading(true);
    setResult("");
    setTestState("idle");

    try {
      const res = await fetch(`${API_BASE}/api/qf/user/bookmarks?mushafId=1`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));

      if (data?.connected === false) {
        setStatus("not_connected");
        setTestState("api_failed");
      } else if (res.ok) {
        setStatus("connected");
        setTestState("success");
      } else {
        setStatus("connected");
        setTestState("api_failed");
      }
    } catch {
      setStatus("connected");
      setTestState("api_failed");
      setResult("Failed to call Quran.Foundation User API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <Header />
      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_20px_60px_rgba(30,45,56,0.06)] sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--heading-accent-soft)]">Connect Quran.Foundation</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)]">Connect Quran.Foundation</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">Connecting Quran.Foundation allows Al-Huda to use Quran.Foundation user features such as bookmarks, goals, streaks, notes, and activity APIs.</p>

          <div className="mt-6 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4">
            <p className="text-sm font-semibold text-[var(--heading-accent)]">Status</p>
            <p className="mt-2 text-sm text-[var(--text-strong)]">
              {status === "connected" && testState !== "api_failed" && "Connected"}
              {status === "connected" && testState === "api_failed" && "Connected, but Bookmarks test failed"}
              {status === "not_connected" && "Not connected"}
              {status === "failed" && "Connection failed. OAuth may be misconfigured (redirect URI/scopes)."}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={oauthUrl} className="rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--button-primary-text)] transition hover:opacity-90">Connect Quran.Foundation</Link>
            <button onClick={testBookmarks} disabled={loading} className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-raised)] disabled:opacity-60">{loading ? "Testing..." : "Test User API"}</button>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4">
            <p className="text-sm font-semibold text-[var(--heading-accent)]">Bookmarks test result</p>
            <p className="mt-2 text-xs text-[var(--text-muted)]">This tests the Quran.Foundation User API through the Bookmarks endpoint.</p>
            {testState === "success" && <p className="mt-3 text-sm text-[var(--text-strong)]">Connected • Bookmarks API test successful</p>}
            {testState === "api_failed" && status === "connected" && <p className="mt-3 text-sm text-[var(--text-strong)]">Connected • Bookmarks API test failed</p>}
            <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-[var(--surface-raised)] p-3 text-xs text-[var(--text-strong)]">{result || "No test run yet."}</pre>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}