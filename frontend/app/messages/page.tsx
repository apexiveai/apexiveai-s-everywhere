"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { LoaderCircle, MessageSquare, RefreshCw, Send } from "lucide-react";
import { apiRequest, fetchAllPages } from "@/lib/api";

type Thread = {
  id: number;
  subject: string;
  thread_type: string;
  last_message: string;
  last_message_at: string;
};
type ThreadMessage = {
  id: number;
  sender_id: number;
  sender_name: string;
  body: string;
  created_at: string;
};
type Tenant = { id: number; company_name: string };
type CurrentUser = { id: number; role: string };

export default function MessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [recipient, setRecipient] = useState("SUPER_ADMIN");
  const [subject, setSubject] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadThreads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [threadData, userData] = await Promise.all([
        apiRequest<{ items: Thread[] }>("/messages/threads"),
        apiRequest<CurrentUser>("/auth/me"),
      ]);
      setThreads(threadData.items);
      setUser(userData);
      if (activeId && !threadData.items.some((item) => item.id === activeId)) {
        setActiveId(null);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load messages.");
    } finally {
      setLoading(false);
    }
  }, [activeId]);

  useEffect(() => {
    void Promise.resolve().then(loadThreads);
  }, [loadThreads]);

  useEffect(() => {
    if (!user) return;
    if (user.role === "SUPER_ADMIN") {
      fetchAllPages<Tenant>("/admin/tenants")
        .then(setTenants)
        .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Unable to load recipients."));
      return;
    }
    apiRequest<{ items: Tenant[] }>("/messages/tenants")
      .then((data) => setTenants(data.items))
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Unable to load recipients."));
  }, [user]);

  useEffect(() => {
    if (!activeId) return;
    apiRequest<{ messages: ThreadMessage[] }>(`/messages/threads/${activeId}`)
      .then((data) => setMessages(data.messages))
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Unable to open conversation."));
  }, [activeId]);

  async function createThread(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const payload =
        user.role === "SUPER_ADMIN"
          ? {
              subject,
              body: initialMessage,
              recipient_super_admin: false,
              recipient_tenant_id: Number(recipient),
            }
          : recipient === "SUPER_ADMIN"
            ? { subject, body: initialMessage, recipient_super_admin: true }
            : {
                subject,
                body: initialMessage,
                recipient_super_admin: false,
                recipient_tenant_id: Number(recipient),
              };
      const thread = await apiRequest<Thread>("/messages/threads", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setSubject("");
      setInitialMessage("");
      setNotice("Message sent.");
      setActiveId(thread.id);
      await loadThreads();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to send message.");
    } finally {
      setBusy(false);
    }
  }

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeId || !reply.trim()) return;
    setBusy(true);
    setError("");
    try {
      await apiRequest(`/messages/threads/${activeId}`, {
        method: "POST",
        body: JSON.stringify({ body: reply }),
      });
      setReply("");
      const result = await apiRequest<{ messages: ThreadMessage[] }>(`/messages/threads/${activeId}`);
      setMessages(result.messages);
      await loadThreads();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to send reply.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="communications-page">
      <header className="billing-heading">
        <div><span className="ac-eyebrow">Apexive communications</span><h1>Messages</h1><p>Contact the SuperAdmin or start a conversation with another active tenant.</p></div>
        <button className="billing-refresh" type="button" onClick={() => void loadThreads()}><RefreshCw size={16} /> Refresh</button>
      </header>
      {error && <p className="billing-alert is-error" role="alert">{error}</p>}
      {notice && <p className="billing-alert" role="status">{notice}</p>}
      <div className="message-workspace">
        <aside className="thread-list">
          <h2>Conversations</h2>
          {loading ? <LoaderCircle className="animate-spin" /> : threads.map((thread) => (
            <button type="button" key={thread.id} className={activeId === thread.id ? "is-active" : ""} onClick={() => setActiveId(thread.id)}>
              <strong>{thread.subject}</strong><span>{thread.thread_type === "SUPER_ADMIN" ? "SuperAdmin" : "Tenant"} · {thread.last_message}</span>
              <small>{new Date(thread.last_message_at).toLocaleString()}</small>
            </button>
          ))}
          {!loading && !threads.length && <p>No conversations yet.</p>}
        </aside>
        <section className="message-panel">
          {activeId ? (
            <>
              <div className="message-history">
                {messages.map((message) => (
                  <article key={message.id} className={message.sender_id === user?.id ? "is-mine" : ""}>
                    <strong>{message.sender_name}</strong>
                    <p>{message.body}</p>
                    <small>{new Date(message.created_at).toLocaleString()}</small>
                  </article>
                ))}
              </div>
              <form className="message-compose" onSubmit={(event) => void sendReply(event)}>
                <textarea required maxLength={10000} rows={3} value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply…" />
                <button type="submit" disabled={busy || !reply.trim()}><Send size={16} /> Reply</button>
              </form>
            </>
          ) : (
            <div className="new-message">
              <MessageSquare size={25} />
              <h2>Start a conversation</h2>
              <form className="account-form" onSubmit={(event) => void createThread(event)}>
                <label>Send to
                  <select value={recipient} onChange={(event) => setRecipient(event.target.value)}>
                    {user?.role !== "SUPER_ADMIN" && <option value="SUPER_ADMIN">SuperAdmin</option>}
                    {tenants.map((tenant) => <option key={tenant.id} value={tenant.id}>{tenant.company_name}</option>)}
                  </select>
                </label>
                <label>Subject<input required minLength={2} maxLength={255} value={subject} onChange={(event) => setSubject(event.target.value)} /></label>
                <label>Message<textarea required maxLength={10000} rows={5} value={initialMessage} onChange={(event) => setInitialMessage(event.target.value)} /></label>
                <button type="submit" disabled={busy || !recipient}>{busy ? "Sending…" : "Send message"}</button>
              </form>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
