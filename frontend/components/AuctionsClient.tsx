"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import {
  ArrowRight,
  Clock3,
  Gavel,
  LoaderCircle,
  RefreshCw,
  Tag,
  UserRound,
} from "lucide-react";
import { apiRequest, getToken, type PaginatedResponse } from "../lib/api";

type Auction = {
  id: number;
  title: string;
  description: string;
  seller_name: string;
  starting_price: string;
  current_bid: string;
  currency: "USD" | "MMK";
  bid_count: number;
  ended: boolean;
  ends_at: string;
  created_at: string;
};

type AuctionDraft = {
  title: string;
  description: string;
  starting_price: string;
  currency: "USD" | "MMK";
  ends_at: string;
};

const PAGE_SIZE = 20;
const EMPTY_DRAFT: AuctionDraft = {
  title: "",
  description: "",
  starting_price: "",
  currency: "USD",
  ends_at: "",
};

function hasTenantAccount() {
  if (!getToken()) return false;
  const userText = localStorage.getItem("apexive_user");
  if (!userText) return false;

  try {
    const user = JSON.parse(userText) as {
      role?: string;
      tenant_id?: number | null;
    };
    return user.role === "TENANT_ADMIN" && typeof user.tenant_id === "number";
  } catch {
    return false;
  }
}

function subscribeToTenantAccount(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function formatMoney(amount: string, currency: Auction["currency"]) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export default function AuctionsClient() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [draft, setDraft] = useState<AuctionDraft>(EMPTY_DRAFT);
  const [bidAmounts, setBidAmounts] = useState<Record<number, string>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const signedIn = useSyncExternalStore(
    subscribeToTenantAccount,
    hasTenantAccount,
    () => false,
  );
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");

  const loadAuctions = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const result = await apiRequest<PaginatedResponse<Auction>>(
        `/auctions?page=${page}&page_size=${PAGE_SIZE}`,
      );
      setAuctions(result.items);
      setTotalPages(result.total_pages);
    } catch (cause) {
      setLoadError(
        cause instanceof Error ? cause.message : "Unable to load auctions.",
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void Promise.resolve().then(loadAuctions);
  }, [loadAuctions]);

  async function createAuction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyAction("create");
    setError("");
    setNotice("");
    try {
      const endDate = new Date(draft.ends_at);
      if (Number.isNaN(endDate.getTime())) {
        throw new Error("Choose a valid auction end time.");
      }
      await apiRequest<Auction>("/auctions", {
        method: "POST",
        body: JSON.stringify({
          ...draft,
          starting_price: draft.starting_price,
          ends_at: endDate.toISOString(),
        }),
      });
      setDraft(EMPTY_DRAFT);
      setNotice("Your auction is now live.");
      if (page === 1) {
        await loadAuctions();
      } else {
        setPage(1);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create this auction.");
    } finally {
      setBusyAction(null);
    }
  }

  async function placeBid(event: FormEvent<HTMLFormElement>, auction: Auction) {
    event.preventDefault();
    const amount = bidAmounts[auction.id]?.trim();
    if (!amount) return;

    setBusyAction(`bid-${auction.id}`);
    setError("");
    setNotice("");
    try {
      await apiRequest(`/auctions/${auction.id}/bids`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      });
      setBidAmounts((current) => ({ ...current, [auction.id]: "" }));
      setNotice(`Your bid on “${auction.title}” has been placed.`);
      await loadAuctions();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to place your bid.");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <main className="auctions-page">
      <section className="auctions-hero">
        <span className="ac-eyebrow">APEXIVE COMMUNITY MARKETPLACE</span>
        <h1>
          Auctions <span>for everyone.</span>
        </h1>
        <p lang="my">
          ပစ္စည်းတင်ပြီး လေလံစတင်ပါ၊ သင်စိတ်ဝင်စားတဲ့ ပစ္စည်းတွေအတွက်လည်း လေလံဝင်ဆွဲပါ။
        </p>
        <div className="auctions-hero-note">
          <Gavel size={16} />
          Browse freely · Sign in to list or bid · No online payments yet
        </div>
      </section>

      <div className="auctions-layout">
        <section className="auction-list-section" aria-labelledby="auction-list-title">
          <div className="auction-section-heading">
            <div>
              <span className="ac-eyebrow">THE MARKETPLACE</span>
              <h2 id="auction-list-title">Community auctions</h2>
            </div>
            <button
              type="button"
              className="auction-refresh"
              onClick={() => void loadAuctions()}
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? "auction-spin" : ""} />
              Refresh
            </button>
          </div>

          {error && <p className="auction-alert is-error" role="alert">{error}</p>}
          {loadError && <p className="auction-alert is-error" role="alert">{loadError}</p>}
          {notice && <p className="auction-alert is-success" role="status">{notice}</p>}

          {loading ? (
            <div className="auction-empty">
              <LoaderCircle className="auction-spin" size={23} />
              <span>Loading auctions…</span>
            </div>
          ) : loadError && auctions.length === 0 ? (
            <div className="auction-empty">
              <strong>Unable to load auctions</strong>
              <span>Check your connection and try again.</span>
              <button
                type="button"
                className="auction-refresh"
                onClick={() => void loadAuctions()}
              >
                <RefreshCw size={14} /> Try again
              </button>
            </div>
          ) : auctions.length ? (
            <div className="auction-list">
              {auctions.map((auction) => {
                const ended = auction.ended;
                const busy = busyAction === `bid-${auction.id}`;
                return (
                  <article className="auction-card" key={auction.id}>
                    <div className="auction-card-top">
                      <span className={`auction-status${ended ? " is-ended" : ""}`}>
                        <span />
                        {ended ? "Ended" : "Live auction"}
                      </span>
                      <span className="auction-bid-count">
                        {auction.bid_count} {auction.bid_count === 1 ? "bid" : "bids"}
                      </span>
                    </div>
                    <h3>{auction.title}</h3>
                    <p className="auction-description">{auction.description}</p>
                    <div className="auction-card-meta">
                      <span><UserRound size={14} /> {auction.seller_name}</span>
                      <span>
                        <Clock3 size={14} />
                        {ended
                          ? `Ended ${new Date(auction.ends_at).toLocaleString()}`
                          : `Ends ${new Date(auction.ends_at).toLocaleString()}`}
                      </span>
                    </div>
                    <div className="auction-price-row">
                      <div>
                        <small>{auction.bid_count ? "Current highest bid" : "Starting bid"}</small>
                        <strong>{formatMoney(auction.current_bid, auction.currency)}</strong>
                      </div>
                      <span className="auction-start-price">
                        Start: {formatMoney(auction.starting_price, auction.currency)}
                      </span>
                    </div>
                    {ended ? (
                      <p className="auction-ended-note">Bidding is closed for this item.</p>
                    ) : signedIn ? (
                      <form
                        className="auction-bid-form"
                        onSubmit={(event) => void placeBid(event, auction)}
                      >
                        <label className="visually-hidden" htmlFor={`bid-${auction.id}`}>
                          Your bid in {auction.currency}
                        </label>
                        <input
                          id={`bid-${auction.id}`}
                          type="number"
                          inputMode="decimal"
                          min="0.01"
                          step="0.01"
                          required
                          placeholder={`More than ${formatMoney(auction.current_bid, auction.currency)}`}
                          value={bidAmounts[auction.id] ?? ""}
                          onChange={(event) =>
                            setBidAmounts((current) => ({
                              ...current,
                              [auction.id]: event.target.value,
                            }))
                          }
                        />
                        <button type="submit" disabled={busy}>
                          {busy ? "Bidding…" : "Place bid"}
                          <ArrowRight size={15} />
                        </button>
                      </form>
                    ) : (
                      <Link
                        className="auction-signin-link"
                        href="/login?next=%2Fauctions"
                      >
                        Sign in to bid <ArrowRight size={15} />
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="auction-empty">
              <Tag size={25} />
              <strong>No auctions yet</strong>
              <span>Be the first to list an item for the community.</span>
            </div>
          )}

          {totalPages > 1 && (
            <nav className="auction-pagination" aria-label="Auction pages">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </nav>
          )}
        </section>

        <aside className="auction-sell-panel" id="create-auction">
          <span className="auction-sell-icon"><Gavel size={19} /></span>
          <span className="ac-eyebrow">SELL WITH THE COMMUNITY</span>
          <h2>List an item</h2>
          <p>Set a starting price and end time. Interested members can place bids while your auction is live.</p>
          {signedIn ? (
            <form className="auction-create-form" onSubmit={(event) => void createAuction(event)}>
              <label>
                Item title
                <input
                  required
                  minLength={3}
                  maxLength={120}
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  placeholder="What are you selling?"
                />
              </label>
              <label>
                Description
                <textarea
                  required
                  minLength={10}
                  maxLength={4000}
                  rows={4}
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                  placeholder="Share the details buyers should know."
                />
              </label>
              <div className="auction-create-price">
                <label>
                  Starting price
                  <input
                    required
                    type="number"
                    inputMode="decimal"
                    min="0.01"
                    step="0.01"
                    value={draft.starting_price}
                    onChange={(event) =>
                      setDraft({ ...draft, starting_price: event.target.value })
                    }
                    placeholder="0.00"
                  />
                </label>
                <label>
                  Currency
                  <select
                    value={draft.currency}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        currency: event.target.value === "MMK" ? "MMK" : "USD",
                      })
                    }
                  >
                    <option value="USD">USD</option>
                    <option value="MMK">MMK</option>
                  </select>
                </label>
              </div>
              <label>
                Auction ends
                <input
                  required
                  type="datetime-local"
                  value={draft.ends_at}
                  onChange={(event) => setDraft({ ...draft, ends_at: event.target.value })}
                />
              </label>
              <button className="auction-create-button" type="submit" disabled={busyAction === "create"}>
                {busyAction === "create" ? "Publishing…" : "Publish auction"}
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <div className="auction-account-note">
              <p>Use a tenant account created by the SuperAdmin to list items and place bids.</p>
              <Link href="/login?next=%2Fauctions%23create-auction">
                Sign in to continue <ArrowRight size={15} />
              </Link>
            </div>
          )}
          <small className="auction-payment-note">
            <Clock3 size={13} />
            Payments and delivery are arranged between the buyer and seller.
          </small>
        </aside>
      </div>
    </main>
  );
}
