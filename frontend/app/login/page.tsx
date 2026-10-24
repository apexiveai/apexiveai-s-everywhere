"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

type LoginResponse = {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string | null;
    role: string;
    tenant_id: number | null;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: username.trim(), password }),
      });
      localStorage.setItem("apexive_token", result.access_token);
      localStorage.setItem("apexive_user", JSON.stringify(result.user));
      const requestedPath = new URLSearchParams(window.location.search).get("next");
      const requestedUrl = requestedPath
        ? new URL(requestedPath, window.location.origin)
        : null;
      const returnPath =
        requestedUrl?.origin === window.location.origin
          ? `${requestedUrl.pathname}${requestedUrl.search}${requestedUrl.hash}`
          : null;
      router.replace(returnPath || (result.user.role === "SUPER_ADMIN" ? "/admin" : "/billing"));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="account-page">
      <section className="account-card">
        <span className="ac-eyebrow">Apexive account</span>
        <h1>Sign in</h1>
        <p>Tenant accounts are created by the SuperAdmin. Sign in to review invoices and report bank transfers.</p>
        <form onSubmit={submit} className="account-form">
          <label>
            Username
            <input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>
          <label>
            Password
            <input autoComplete="current-password" autoCapitalize="none" autoCorrect="off" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error && <p className="account-error" role="alert">{error}</p>}
          <button type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <Link href="/">Back to Apexive AI</Link>
      </section>
    </main>
  );
}
