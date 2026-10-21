import type { Metadata } from "next";
import AuctionsClient from "../../components/AuctionsClient";

export const metadata: Metadata = {
  title: "Apexive Auctions | List and Bid",
  description:
    "Browse community auctions, list an item for sale, and place bids in the Apexive online marketplace.",
};

export default function AuctionsPage() {
  return <AuctionsClient />;
}
