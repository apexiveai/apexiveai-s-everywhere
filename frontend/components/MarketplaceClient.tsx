"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  ClipboardList,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  ShoppingCart,
  Store,
  Trash2,
  X,
} from "lucide-react";
import { apiRequest, type PaginatedResponse } from "../lib/api";

type Currency = "USD" | "MMK";

type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  currency: Currency;
  stock: number;
  seller_id: number;
  seller_name: string;
};

type Order = {
  id: number;
  buyer_id: number;
  buyer_name: string;
  seller_id: number;
  seller_name: string;
  delivery_address: string;
  contact_phone: string;
  buyer_note: string | null;
  status: "REQUESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  total: string;
  currency: Currency;
  items: {
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: string;
    currency: Currency;
  }[];
  created_at: string;
};

type ProductDraft = {
  name: string;
  description: string;
  category: string;
  price: string;
  currency: Currency;
  stock: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const EMPTY_PRODUCT: ProductDraft = {
  name: "",
  description: "",
  category: "",
  price: "",
  currency: "USD",
  stock: "1",
};

function subscribeToAccountChanges(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getStoredUser() {
  if (!localStorage.getItem("apexive_token")) return null;
  const userText = localStorage.getItem("apexive_user");
  if (!userText) return null;
  try {
    return JSON.parse(userText) as { id?: number; role?: string };
  } catch {
    return null;
  }
}

function getUserId() {
  const id = getStoredUser()?.id;
  return typeof id === "number" ? id : null;
}

function canStoredUserSell() {
  const role = getStoredUser()?.role;
  return role === "TENANT_ADMIN" || role === "SELLER";
}

function formatMoney(amount: string, currency: Currency) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export default function MarketplaceClient() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<Record<number, CartItem>>({});
  const [productDraft, setProductDraft] = useState<ProductDraft>(EMPTY_PRODUCT);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [buyerNote, setBuyerNote] = useState("");
  const userId = useSyncExternalStore(
    subscribeToAccountChanges,
    getUserId,
    () => null,
  );
  const canSell = useSyncExternalStore(
    subscribeToAccountChanges,
    canStoredUserSell,
    () => false,
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [showSellForm, setShowSellForm] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const params = new URLSearchParams({ page_size: "100" });
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    try {
      const result = await apiRequest<
        PaginatedResponse<Product> & { categories: string[] }
      >(`/marketplace/products?${params.toString()}`);
      setProducts(result.items);
      setCategories(result.categories);
    } catch (cause) {
      setLoadError(
        cause instanceof Error ? cause.message : "Unable to load products.",
      );
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  const loadOrders = useCallback(async () => {
    try {
      const result = await apiRequest<{ items: Order[] }>("/marketplace/orders");
      setOrders(result.items);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load orders.");
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadProducts);
  }, [loadProducts]);

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0,
      ),
    [cartItems],
  );
  const cartCurrency = cartItems[0]?.product.currency;

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current[product.id];
      if (
        existing &&
        (existing.quantity >= product.stock ||
          existing.product.currency !== product.currency)
      ) {
        return current;
      }
      return {
        ...current,
        [product.id]: {
          product,
          quantity: (existing?.quantity ?? 0) + 1,
        },
      };
    });
    setNotice(`${product.name} added to your cart.`);
    setError("");
  }

  function updateCartQuantity(productId: number, quantity: number) {
    setCart((current) => {
      const item = current[productId];
      if (!item) return current;
      if (quantity <= 0) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return {
        ...current,
        [productId]: {
          ...item,
          quantity: Math.min(quantity, item.product.stock),
        },
      };
    });
  }

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await apiRequest<Product>("/marketplace/products", {
        method: "POST",
        body: JSON.stringify({
          ...productDraft,
          price: productDraft.price,
          stock: Number(productDraft.stock),
          category: productDraft.category.trim() || "General",
        }),
      });
      setProductDraft(EMPTY_PRODUCT);
      setShowSellForm(false);
      setNotice("Your product is now listed.");
      await loadProducts();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to list product.");
    } finally {
      setBusy(false);
    }
  }

  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId) {
      router.push("/login?next=%2Fmarketplace");
      return;
    }
    if (!cartItems.length) return;

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await apiRequest<{ items: Order[] }>("/marketplace/orders", {
        method: "POST",
        body: JSON.stringify({
          items: cartItems.map(({ product, quantity }) => ({
            product_id: product.id,
            quantity,
          })),
          delivery_address: deliveryAddress,
          contact_phone: contactPhone,
          buyer_note: buyerNote.trim() || null,
        }),
      });
      setCart({});
      setDeliveryAddress("");
      setContactPhone("");
      setBuyerNote("");
      setOrders((current) => [...result.items, ...current]);
      setShowCart(false);
      setShowOrders(true);
      setNotice(
        result.items.length === 1
          ? "Your order request was sent to the seller."
          : `Your order requests were sent to ${result.items.length} sellers.`,
      );
      await loadProducts();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to place order.");
    } finally {
      setBusy(false);
    }
  }

  async function updateOrder(
    order: Order,
    nextStatus: "CONFIRMED" | "CANCELLED",
  ) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const updated = await apiRequest<Order>(`/marketplace/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      setOrders((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setNotice(`Order #${order.id} ${nextStatus.toLowerCase()}.`);
      if (nextStatus === "CANCELLED") await loadProducts();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update order.");
    } finally {
      setBusy(false);
    }
  }

  async function completeOrder(order: Order) {
    setBusy(true);
    setError("");
    try {
      const updated = await apiRequest<Order>(`/marketplace/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      setOrders((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setNotice(`Order #${order.id} marked complete.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to complete order.");
    } finally {
      setBusy(false);
    }
  }

  async function openOrders() {
    if (!userId) {
      router.push("/login?next=%2Fmarketplace");
      return;
    }
    setShowOrders((open) => !open);
    await loadOrders();
  }

  return (
    <main className="marketplace-page">
      <section className="marketplace-hero">
        <div className="marketplace-hero-copy">
          <span className="ac-eyebrow">APEXIVE COMMUNITY MARKETPLACE</span>
          <h1>
            Good finds, <span>closer to home.</span>
          </h1>
          <p lang="my">
            အသိုင်းအဝိုင်းထဲက ပစ္စည်းတွေကို ရှာဖွေဝယ်ယူပါ၊ ကိုယ့်ပစ္စည်းတွေကိုလည်း
            ရောင်းချနိုင်ပါတယ်။
          </p>
          <div className="marketplace-hero-note">
            <Check size={16} />
            Browse freely · Order securely · Arrange payment and delivery directly
          </div>
        </div>
        <div className="marketplace-hero-art" aria-hidden="true">
          <ShoppingBag size={54} />
          <span><Package size={24} /></span>
        </div>
      </section>

      <div className="marketplace-toolbar">
        <label className="marketplace-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
          />
        </label>
        <label className="marketplace-category">
          <span className="visually-hidden">Filter by category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <div className="marketplace-toolbar-actions">
          <button
            className={`marketplace-action${showOrders ? " is-active" : ""}`}
            type="button"
            onClick={() => void openOrders()}
          >
            <ClipboardList size={16} /> My orders
          </button>
          {canSell && (
            <button
              className={`marketplace-action${showSellForm ? " is-active" : ""}`}
              type="button"
              onClick={() => setShowSellForm((open) => !open)}
            >
              <Store size={16} /> Sell an item
            </button>
          )}
          <button
            className={`marketplace-cart-button${showCart ? " is-active" : ""}`}
            type="button"
            onClick={() => setShowCart((open) => !open)}
            aria-label={`Open cart, ${cartItems.length} items`}
          >
            <ShoppingCart size={17} /> Cart <span>{cartItems.length}</span>
          </button>
        </div>
      </div>

      {(error || loadError) && (
        <p className="marketplace-alert is-error" role="alert">{error || loadError}</p>
      )}
      {notice && <p className="marketplace-alert is-success" role="status">{notice}</p>}

      {showSellForm && (
        <section className="marketplace-sell-panel" aria-labelledby="marketplace-sell-title">
          <div className="marketplace-panel-heading">
            <div><span className="ac-eyebrow">SELL WITH THE COMMUNITY</span><h2 id="marketplace-sell-title">List a product</h2></div>
            <button type="button" className="marketplace-icon-button" onClick={() => setShowSellForm(false)} aria-label="Close listing form"><X size={18} /></button>
          </div>
          <form className="marketplace-product-form" onSubmit={(event) => void createProduct(event)}>
            <label>Product name<input required minLength={3} maxLength={120} value={productDraft.name} onChange={(event) => setProductDraft({ ...productDraft, name: event.target.value })} placeholder="What are you selling?" /></label>
            <label>Category<input maxLength={80} value={productDraft.category} onChange={(event) => setProductDraft({ ...productDraft, category: event.target.value })} placeholder="e.g. Electronics" /></label>
            <label className="marketplace-product-description">Description<textarea required minLength={10} maxLength={4000} rows={3} value={productDraft.description} onChange={(event) => setProductDraft({ ...productDraft, description: event.target.value })} placeholder="Describe condition, size, or other useful details." /></label>
            <label>Price<input required type="number" min="0.01" step="0.01" value={productDraft.price} onChange={(event) => setProductDraft({ ...productDraft, price: event.target.value })} placeholder="0.00" /></label>
            <label>Currency<select value={productDraft.currency} onChange={(event) => setProductDraft({ ...productDraft, currency: event.target.value as Currency })}><option value="USD">USD</option><option value="MMK">MMK</option></select></label>
            <label>Available stock<input required type="number" min="1" max="10000" step="1" value={productDraft.stock} onChange={(event) => setProductDraft({ ...productDraft, stock: event.target.value })} /></label>
            <button className="marketplace-primary-button marketplace-publish-button" type="submit" disabled={busy}>{busy ? "Publishing…" : "Publish listing"}<ArrowRight size={16} /></button>
          </form>
        </section>
      )}

      {showOrders && (
        <section className="marketplace-orders-panel" aria-labelledby="marketplace-orders-title">
          <div className="marketplace-panel-heading">
            <div><span className="ac-eyebrow">ORDER ACTIVITY</span><h2 id="marketplace-orders-title">My orders</h2></div>
            <button type="button" className="marketplace-icon-button" onClick={() => void loadOrders()} aria-label="Refresh orders"><RefreshCw size={16} /></button>
          </div>
          {orders.length ? (
            <div className="marketplace-orders-list">
              {orders.map((order) => {
                const isSeller = order.seller_id === userId;
                return (
                  <article className="marketplace-order-card" key={order.id}>
                    <div className="marketplace-order-heading">
                      <div><strong>Order #{order.id}</strong><span>{isSeller ? `Buyer: ${order.buyer_name}` : `Seller: ${order.seller_name}`}</span></div>
                      <span className={`marketplace-order-status is-${order.status.toLowerCase()}`}>{order.status}</span>
                    </div>
                    <div className="marketplace-order-items">
                      {order.items.map((item) => <span key={item.product_id}>{item.quantity} × {item.product_name} · {formatMoney(item.unit_price, item.currency)}</span>)}
                    </div>
                    <div className="marketplace-order-footer">
                      <strong>{formatMoney(order.total, order.currency)}</strong>
                      {isSeller && order.status === "REQUESTED" && (
                        <div className="marketplace-order-actions">
                          <button type="button" onClick={() => void updateOrder(order, "CONFIRMED")} disabled={busy}>Confirm</button>
                          <button type="button" onClick={() => void updateOrder(order, "CANCELLED")} disabled={busy}>Decline</button>
                        </div>
                      )}
                      {!isSeller && order.status === "REQUESTED" && <button type="button" className="marketplace-cancel-order" onClick={() => void updateOrder(order, "CANCELLED")} disabled={busy}>Cancel request</button>}
                      {isSeller && order.status === "CONFIRMED" && <button type="button" onClick={() => void completeOrder(order)} disabled={busy}>Mark complete</button>}
                    </div>
                    <p className="marketplace-order-contact">{order.contact_phone} · {order.delivery_address}</p>
                    {order.buyer_note && <p className="marketplace-order-note">Note: {order.buyer_note}</p>}
                  </article>
                );
              })}
            </div>
          ) : <p className="marketplace-empty-orders">No orders yet.</p>}
        </section>
      )}

      <div className={`marketplace-content${showCart ? " has-open-cart" : ""}`}>
        <section className="marketplace-catalog" aria-labelledby="marketplace-catalog-title">
          <div className="marketplace-section-heading">
            <div><span className="ac-eyebrow">COMMUNITY FINDS</span><h2 id="marketplace-catalog-title">Shop products</h2><p>{products.length} {products.length === 1 ? "item" : "items"} available</p></div>
            <button className="marketplace-icon-button" type="button" onClick={() => void loadProducts()} disabled={loading} aria-label="Refresh products"><RefreshCw size={17} className={loading ? "marketplace-spin" : ""} /></button>
          </div>

          {loading ? (
            <div className="marketplace-empty"><RefreshCw size={22} className="marketplace-spin" /><span>Loading products…</span></div>
          ) : products.length ? (
            <div className="marketplace-product-grid">
              {products.map((product) => (
                <article className="marketplace-product-card" key={product.id}>
                  <div className={`marketplace-product-art marketplace-product-art-${product.id % 5}`} aria-hidden="true"><Package size={35} /></div>
                  <div className="marketplace-product-copy">
                    <span className="marketplace-product-category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <span className="marketplace-product-seller"><Store size={13} /> {product.seller_name}</span>
                    <div className="marketplace-product-footer">
                      <span><strong>{formatMoney(product.price, product.currency)}</strong><small>{product.stock} in stock</small></span>
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        disabled={
                          product.seller_id === userId ||
                          (cartCurrency !== undefined && cartCurrency !== product.currency)
                        }
                        aria-label={`Add ${product.name} to cart`}
                        title={
                          product.seller_id === userId
                            ? "You cannot order your own listing"
                            : cartCurrency !== undefined && cartCurrency !== product.currency
                              ? "Your cart can only contain one currency"
                              : undefined
                        }
                      ><Plus size={17} /><span>Add</span></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="marketplace-empty">
              <Package size={28} />
              <strong>{search || category ? "No matching products" : "The shelves are ready"}</strong>
              <span>{search || category ? "Try another search or category." : "No products are listed yet. Sellers can add the first item to the community store."}</span>
              {search || category ? <button type="button" onClick={() => { setSearch(""); setCategory(""); }}>Clear filters</button> : canSell && <button type="button" onClick={() => setShowSellForm(true)}>List a product</button>}
            </div>
          )}
        </section>

        {showCart && (
          <aside className="marketplace-cart-panel" aria-labelledby="marketplace-cart-title">
            <div className="marketplace-panel-heading">
              <div><span className="ac-eyebrow">READY WHEN YOU ARE</span><h2 id="marketplace-cart-title">Your cart</h2></div>
              <button type="button" className="marketplace-icon-button" onClick={() => setShowCart(false)} aria-label="Close cart"><X size={18} /></button>
            </div>
            {cartItems.length ? (
              <>
                <div className="marketplace-cart-items">
                  {cartItems.map(({ product, quantity }) => (
                    <div className="marketplace-cart-item" key={product.id}>
                      <div><strong>{product.name}</strong><small>{formatMoney(product.price, product.currency)}</small></div>
                      <div className="marketplace-cart-quantity">
                        <button type="button" onClick={() => updateCartQuantity(product.id, quantity - 1)} aria-label={`Remove one ${product.name}`}>−</button>
                        <span>{quantity}</span>
                        <button type="button" onClick={() => updateCartQuantity(product.id, quantity + 1)} disabled={quantity >= product.stock} aria-label={`Add one ${product.name}`}>+</button>
                        <button type="button" className="marketplace-cart-remove" onClick={() => updateCartQuantity(product.id, 0)} aria-label={`Remove ${product.name}`}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="marketplace-cart-total"><span>Order total</span><strong>{cartCurrency ? formatMoney(cartTotal.toFixed(2), cartCurrency) : ""}</strong></div>
                <form className="marketplace-checkout-form" onSubmit={(event) => void checkout(event)}>
                  <label>Delivery address<textarea required minLength={5} maxLength={1000} rows={2} value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} placeholder="Where should the seller deliver?" /></label>
                  <label>Contact phone<input required minLength={7} maxLength={40} type="tel" value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} placeholder="How can the seller reach you?" /></label>
                  <label>Note to seller <span>(optional)</span><textarea maxLength={1000} rows={2} value={buyerNote} onChange={(event) => setBuyerNote(event.target.value)} placeholder="Delivery instructions or questions" /></label>
                  <button className="marketplace-primary-button" type="submit" disabled={busy}>{busy ? "Sending…" : userId ? "Request order" : "Sign in to order"}<ArrowRight size={16} /></button>
                  <p className="marketplace-payment-note">No payment is collected here. The seller will confirm your order and arrange payment and delivery with you.</p>
                </form>
              </>
            ) : (
              <div className="marketplace-empty-cart"><ShoppingCart size={24} /><strong>Your cart is empty</strong><span>Add a product to start an order.</span></div>
            )}
          </aside>
        )}
      </div>
    </main>
  );
}
