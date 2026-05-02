"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/db";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function checkExistingSession() {
      try {
        const user = await getCurrentUser();

        if (user) {
          router.replace("/");
          return;
        }
      } catch {
        // ignore and let page render
      } finally {
        setCheckingSession(false);
      }
    }

    checkExistingSession();
  }, [router]);

  async function handleGoogleLogin() {
    setLoadingGoogle(true);
    setMessage("");

    const redirectTo = `${window.location.origin}/auth/callback?next=/`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setMessage("We couldn’t start Google sign-in right now. Please try again.");
      setLoadingGoogle(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoadingEmail(true);
    setMessage("");

    const redirectTo = `${window.location.origin}/auth/callback?next=/`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setMessage("We couldn’t send the magic link right now. Please try again.");
    } else {
      setMessage("Magic link sent. Check your email.");
    }

    setLoadingEmail(false);
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)]">
        <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-5 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] px-6 py-5 text-sm text-[var(--text-muted)] shadow-[0_20px_60px_rgba(30,45,56,0.06)]">
            Checking your session...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top, var(--bg-page-alt) 0%, var(--bg-page) 45%, var(--bg-page) 100%)",
      }}
    >
      <main className="mx-auto flex min-h-screen max-w-5xl items-center px-5 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.95fr]">
          <section
            className="relative overflow-hidden rounded-[2rem] border p-8 text-white shadow-[0_30px_80px_rgba(30,45,56,0.10)]"
            style={{
              borderColor: "var(--border-soft)",
              background:
                "linear-gradient(135deg, var(--brand-a) 0%, #7dbdca 42%, var(--brand-b) 100%)",
            }}
          >
            <div className="pointer-events-none absolute right-[-10px] top-[-6px] text-[120px] text-white/10">
              ۝
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75">
              One Ayah Forward
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Welcome to Al-Huda
            </h1>
            <p className="mt-5 max-w-md text-sm leading-8 text-white/85">
              Sign in to save your journey, keep your reflections, and build a
              consistent streak over time.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm leading-7 text-white/85">
                Start with Google or use a magic link sent to your email.
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_30px_80px_rgba(30,45,56,0.08)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--heading-accent-soft)]">
              Sign in
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)]">
              Continue your journey
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
              Choose the simplest way to enter the app.
            </p>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loadingGoogle}
              className="mt-6 w-full rounded-full bg-[var(--button-primary-bg)] px-5 py-3 text-sm font-medium text-[var(--button-primary-text)] transition hover:opacity-90 disabled:opacity-60"
            >
              {loadingGoogle ? "Redirecting..." : "Continue with Google"}
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border-soft)]" />
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                or
              </span>
              <div className="h-px flex-1 bg-[var(--border-soft)]" />
            </div>

            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[var(--heading-accent)]"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-[1.25rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-a)]"
                />
              </div>

              <button
                type="submit"
                disabled={loadingEmail}
                className="w-full rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-5 py-3 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-raised)] disabled:opacity-60"
              >
                {loadingEmail ? "Sending..." : "Send magic link"}
              </button>
            </form>

            {message && (
              <div className="mt-5 rounded-2xl bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-strong)]">
                {message}
              </div>
            )}

            <div className="mt-6">
              <Link
                href="/"
                className="text-sm text-[var(--heading-accent-soft)] transition hover:text-[var(--heading-accent)]"
              >
                ← Back to home
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}