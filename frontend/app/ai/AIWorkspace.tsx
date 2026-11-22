
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  Activity,
  ArrowDown,
  ArrowUp,
  Bot,
  Check,
  ChevronDown,
  CircleHelp,
  Command,
  Copy,
  Cpu,
  Globe2,
  LoaderCircle,
  MessageSquare,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";


import {
  createConversation,
  deleteConversation,
  getAIModels,
  getConversations,
  getConversation,
  streamAIChat,
  type AIConversation,
  type AIMessage,
  type AIModel,
  type AIProvider,
} from "../../lib/ai";


import styles from "./AIWorkspace.module.css";

const suggestions = [
  {
    title: "Business strategy",
    description: "Develop a business plan and growth strategy.",
    prompt:
      "Help me develop a comprehensive enterprise business strategy.",
    icon: Activity,
  },
  {
    title: "Research & analysis",
    description: "Analyze complex topics and information.",
    prompt:
      "Help me research and analyze an important business topic.",
    icon: Globe2,
  },
  {
    title: "Software development",
    description: "Design, develop, and review software systems.",
    prompt:
      "Help me design a production-ready enterprise software architecture.",
    icon: Cpu,
  },
  {
    title: "Enterprise operations",
    description: "Improve workflows and operational efficiency.",
    prompt:
      "Help me identify opportunities to automate enterprise operations.",
    icon: Zap,
  },
];

function createMessage(
  role: AIMessage["role"],
  content: string
): AIMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

function formatDate(value?: string): string {
  if (!value) return "Recent";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Recent";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function AIWorkspace() {
  const [provider, setProvider] = useState<AIProvider>("cloud");
  const [models, setModels] = useState<AIModel[]>([]);
  const [conversations, setConversations] = useState<
    AIConversation[]
  >([]);

  const [activeConversation, setActiveConversation] =
    useState<AIConversation | null>(null);

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const availableModels = models.filter(
    (model) =>
      model.provider === provider && model.available
  );

  const selectedModel = availableModels[0];

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      setBooting(true);

      try {
        const [modelResult, conversationResult] =
          await Promise.allSettled([
            getAIModels(),
            getConversations(),
          ]);

        if (cancelled) return;

        if (modelResult.status === "fulfilled") {
          setModels(modelResult.value);

          const firstAvailable = modelResult.value.find(
            (model) => model.available
          );

          if (firstAvailable) {
            setProvider(firstAvailable.provider);
          }
        }

        if (conversationResult.status === "fulfilled") {
          setConversations(conversationResult.value);
        }
      } catch {
        // Individual API errors are handled below.
      } finally {
        if (!cancelled) setBooting(false);
      }
    }

    initialize();

    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const refreshConversations = useCallback(async () => {
    try {
      const result = await getConversations();
      setConversations(result);
    } catch {
      // Public users may not have conversation-list access.
    }
  }, []);

  const startNewConversation = useCallback(() => {
    abortRef.current?.abort();

    setActiveConversation(null);
    setMessages([]);
    setInput("");
    setError("");
    setLoading(false);
    setModelMenuOpen(false);

    textareaRef.current?.focus();
  }, []);


const chooseConversation = useCallback(
  async (conversation: AIConversation) => {
    if (loading) return;

    abortRef.current?.abort();

    setActiveConversation(conversation);
    setMessages([]);
    setInput("");
    setError("");
    setProvider(conversation.provider || "cloud");

    try {
      const result = await getConversation(conversation.id);

      setActiveConversation(result.conversation);
      setMessages(result.messages);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load conversation history."
      );
    }
  },
  [loading]
);


  const sendMessage = useCallback(
    async (content: string) => {
      const message = content.trim();

      if (!message || loading) return;

      setError("");
      setLoading(true);
      setInput("");

      const userMessage = createMessage("user", message);
      const assistantMessage = createMessage("assistant", "");

      setMessages((current) => [
        ...current,
        userMessage,
        assistantMessage,
      ]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        let conversation = activeConversation;

        if (!conversation) {
          const result = await createConversation(provider);
          conversation = result.conversation;

          setActiveConversation(conversation);

          setConversations((current) => [
            conversation!,
            ...current.filter(
              (item) => item.id !== conversation!.id
            ),
          ]);
        }

        await streamAIChat(
          conversation.id,
          message,
          {
            onToken: (token) => {
              setMessages((current) =>
                current.map((item) =>
                  item.id === assistantMessage.id
                    ? {
                        ...item,
                        content: item.content + token,
                      }
                    : item
                )
              );
            },
            onDone: () => {
              refreshConversations();
            },
            onError: (message) => {
              setError(message);
            },
          },
          controller.signal
        );

        await refreshConversations();
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : "Unable to connect to ApexiveAI.";

        setError(message);

        setMessages((current) =>
          current.filter(
            (item) =>
              item.id !== assistantMessage.id ||
              item.content.length > 0
          )
        );
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [
      activeConversation,
      loading,
      provider,
      refreshConversations,
    ]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleSuggestion = (prompt: string) => {
    void sendMessage(prompt);
  };

  const handleDeleteConversation = async (
    conversation: AIConversation
  ) => {
    if (
      !window.confirm(
        `Delete "${conversation.title}"? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteConversation(conversation.id);

      setConversations((current) =>
        current.filter((item) => item.id !== conversation.id)
      );

      if (activeConversation?.id === conversation.id) {
        startNewConversation();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete conversation."
      );
    }
  };

  const copyMessage = async (message: AIMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);

      window.setTimeout(() => {
        setCopiedId("");
      }, 1800);
    } catch {
      setError("Unable to copy this response.");
    }
  };

  const switchProvider = (nextProvider: AIProvider) => {
    if (loading) return;

    setProvider(nextProvider);
    setModelMenuOpen(false);
  };

  return (
    <main className={styles.workspace}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <Sparkles size={21} />
          </div>

          <div>
            <div className={styles.brandName}>APEXIVE<span>AI</span></div>
            <div className={styles.brandSub}>INTELLIGENCE PLATFORM</div>
          </div>
        </div>

        <nav className={styles.topNav}>
          <a className={styles.navActive} href="/ai">
            Assistant
          </a>
          <a href="/workspace">Workspace</a>
          <a href="/history">History</a>
        </nav>

        <div className={styles.topActions}>
          <div className={styles.secureStatus}>
            <ShieldCheck size={15} />
            <span>Secure session</span>
          </div>

          <button
            className={styles.iconButton}
            type="button"
            title="New conversation"
            onClick={startNewConversation}
          >
            <Plus size={19} />
          </button>
        </div>
      </header>

      <section className={styles.mainLayout}>
        <aside className={styles.historyPanel}>
          <div className={styles.panelHeader}>
            <div>
              <div className={styles.panelEyebrow}>YOUR WORKSPACE</div>
              <h2>Conversations</h2>
            </div>

            <button
              className={styles.smallIconButton}
              type="button"
              onClick={() => void refreshConversations()}
              title="Refresh conversations"
            >
              <RefreshCw size={15} />
            </button>
          </div>

          <button
            className={styles.newChatButton}
            type="button"
            onClick={startNewConversation}
          >
            <Plus size={17} />
            <span>New conversation</span>
            <span className={styles.shortcut}>⌘ K</span>
          </button>

          <div className={styles.historyLabel}>RECENT ACTIVITY</div>

          <div className={styles.conversationList}>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`${styles.conversationItem} ${
                  activeConversation?.id === conversation.id
                    ? styles.conversationActive
                    : ""
                }`}
              >
                <button
                  type="button"
                  className={styles.conversationSelect}
                  onClick={() => chooseConversation(conversation)}
                >
                  <MessageSquare size={15} />
                  <span>{conversation.title}</span>
                </button>

                <span className={styles.conversationDate}>
                  {formatDate(conversation.updated_at)}
                </span>

                <button
                  type="button"
                  className={styles.deleteButton}
                  title="Delete conversation"
                  onClick={() =>
                    void handleDeleteConversation(conversation)
                  }
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {!booting && conversations.length === 0 && (
              <div className={styles.emptyHistory}>
                <MessageSquare size={20} />
                <span>Your conversations will appear here.</span>
              </div>
            )}
          </div>

          <div className={styles.panelFooter}>
            <div className={styles.footerIcon}>
              <CircleHelp size={17} />
            </div>
            <div>
              <strong>Need assistance?</strong>
              <span>Explore the ApexiveAI platform</span>
            </div>
          </div>
        </aside>

        <section className={styles.chatArea}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderLeft}>
              <div className={styles.agentAvatar}>
                <Bot size={20} />
              </div>

              <div>
                <div className={styles.agentName}>
                  Universal Enterprise Agent
                </div>
                <div className={styles.agentStatus}>
                  <span className={styles.onlineDot} />
                  Intelligent assistance
                </div>
              </div>
            </div>

            <div className={styles.modelArea}>
              <button
                type="button"
                className={styles.modelSelector}
                onClick={() => setModelMenuOpen((value) => !value)}
                disabled={loading}
              >
                {provider === "cloud" ? (
                  <Globe2 size={16} />
                ) : (
                  <Cpu size={16} />
                )}

                <span>
                  {provider === "cloud" ? "Cloud AI" : "Local AI"}
                </span>

                <ChevronDown size={15} />
              </button>

              {modelMenuOpen && (
                <div className={styles.modelMenu}>
                  <button
                    type="button"
                    onClick={() => switchProvider("cloud")}
                  >
                    <Globe2 size={17} />
                    <span>
                      <strong>Cloud AI</strong>
                      <small>Hosted AI provider</small>
                    </span>
                    {provider === "cloud" && <Check size={16} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => switchProvider("local")}
                  >
                    <Cpu size={17} />
                    <span>
                      <strong>Local AI</strong>
                      <small>Self-hosted AI provider</small>
                    </span>
                    {provider === "local" && <Check size={16} />}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.messageViewport}>
            <div className={styles.messageContent}>
              {messages.length === 0 ? (
                <div className={styles.welcome}>
                  <div className={styles.welcomeOrb}>
                    <div className={styles.orbRing} />
                    <Sparkles size={34} />
                  </div>

                  <div className={styles.welcomeEyebrow}>
                    APEXIVEAI INTELLIGENCE
                  </div>

                  <h1>
                    Intelligence for
                    <br />
                    <span>what comes next.</span>
                  </h1>

                  <p className={styles.welcomeDescription}>
                    Your universal enterprise AI agent. Research,
                    create, analyze, and solve complex challenges
                    across your organization.
                  </p>

                  <div className={styles.suggestionGrid}>
                    {suggestions.map((suggestion) => {
                      const Icon = suggestion.icon;

                      return (
                        <button
                          key={suggestion.title}
                          type="button"
                          className={styles.suggestionCard}
                          onClick={() =>
                            handleSuggestion(suggestion.prompt)
                          }
                          disabled={loading}
                        >
                          <div className={styles.suggestionIcon}>
                            <Icon size={18} />
                          </div>

                          <strong>{suggestion.title}</strong>
                          <span>{suggestion.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className={styles.messages}>
                  {messages.map((message) => (
                    <article
                      key={message.id}
                      className={
                        message.role === "user"
                          ? styles.userMessage
                          : styles.assistantMessage
                      }
                    >
                      <div className={styles.messageAvatar}>
                        {message.role === "user" ? (
                          <Command size={17} />
                        ) : (
                          <Sparkles size={17} />
                        )}
                      </div>

                      <div className={styles.messageBody}>
                        <div className={styles.messageMeta}>
                          <strong>
                            {message.role === "user"
                              ? "You"
                              : "ApexiveAI"}
                          </strong>

                          {message.role === "assistant" &&
                            message.content && (
                              <button
                                type="button"
                                className={styles.copyButton}
                                onClick={() =>
                                  void copyMessage(message)
                                }
                                title="Copy response"
                              >
                                {copiedId === message.id ? (
                                  <Check size={14} />
                                ) : (
                                  <Copy size={14} />
                                )}
                                {copiedId === message.id
                                  ? "Copied"
                                  : "Copy"}
                              </button>
                            )}
                        </div>

                        <div className={styles.messageText}>
                          {message.content ? (
                            message.content
                          ) : loading &&
                            message.role === "assistant" ? (
                            <span className={styles.thinking}>
                              <span />
                              <span />
                              <span />
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                  <div ref={bottomRef} />
                </div>
              )}

              {error && (
                <div className={styles.errorNotice}>
                  <CircleHelp size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.composerArea}>
            <form
              className={styles.composer}
              onSubmit={handleSubmit}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Ask ApexiveAI anything..."
                rows={1}
                maxLength={20000}
                disabled={loading}
              />

              <div className={styles.composerBottom}>
                <div className={styles.composerMeta}>
                  <span className={styles.providerIndicator}>
                    {provider === "cloud" ? (
                      <Globe2 size={13} />
                    ) : (
                      <Cpu size={13} />
                    )}
                    {provider === "cloud" ? "Cloud" : "Local"}
                  </span>

                  <span>
                    {selectedModel?.label ||
                      "Provider configuration required"}
                  </span>
                </div>

                <button
                  className={styles.sendButton}
                  type="submit"
                  disabled={!input.trim() || loading}
                  title="Send message"
                >
                  {loading ? (
                    <LoaderCircle
                      size={18}
                      className={styles.spinning}
                    />
                  ) : (
                    <ArrowUp size={19} />
                  )}
                </button>
              </div>
            </form>

            <div className={styles.disclaimer}>
              <ShieldCheck size={13} />
              AI-generated content may contain inaccuracies.
              Verify important information before making decisions.
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
