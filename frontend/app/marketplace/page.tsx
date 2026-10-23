import type { Metadata } from "next";
import MarketplaceClient from "../../components/MarketplaceClient";

export const metadata: Metadata = {
  title: "Apexive Marketplace | Shop and Sell",
  description:
    "Shop community products, list items for sale, and manage orders with local payment and delivery arrangements.",
};

export default function MarketplacePage() {
  return <MarketplaceClient />;
}
