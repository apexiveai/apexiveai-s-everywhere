"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, LoaderCircle, ShieldCheck } from "lucide-react";
import { apiRequest } from "@/lib/api";

type Product = {
  code: string;
  name: string;
  description: string | null;
  url: string | null;
  expires_at: string | null;
};

export default function WorkspacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<{ items: Product[] }>("/invoices/products");
      setProducts(result.items);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  async function openProduct(product: Product) {
    try {
      const authorization = await apiRequest<{ authorized: boolean; url: string | null }>(
        `/auth/solutions/${encodeURIComponent(product.code)}/access`,
      );
      if (authorization.authorized && authorization.url) {
        window.location.assign(authorization.url);
      } else {
        setError("The product is authorized but has no launch URL configured.");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Product access check failed.");
    }
  }

  return (
    <main className="workspace-page">
      <span className="ac-eyebrow">Tenant workspace</span>
      <h1>My products</h1>
      <p>Only products with an active SuperAdmin grant are listed here. The server re-checks authorization before launch.</p>
      {error && <p className="billing-alert is-error" role="alert">{error}</p>}
      {loading ? (
        <div className="billing-loading"><LoaderCircle className="animate-spin" /> Checking product access…</div>
      ) : products.length ? (
        <div className="workspace-products">
          {products.map((product) => (
            <article className="workspace-product" key={product.code}>
              <ShieldCheck size={22} />
              <h2>{product.name}</h2>
              <p>{product.description || "No product description has been configured."}</p>
              {product.expires_at && <small>Access until {new Date(product.expires_at).toLocaleDateString()}</small>}
              <button type="button" disabled={!product.url} onClick={() => void openProduct(product)}>
                {product.url ? <>Open product <ExternalLink size={15} /></> : "Launch URL not configured"}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="invoice-empty"><ShieldCheck size={24} /><strong>No active product access</strong><span>Product access is enabled after a license invoice is paid and verified, or when your SuperAdmin grants access.</span></div>
      )}
    </main>
  );
}
