import type { Metadata } from "next";
import SecurityGuardServicePage from "../../components/SecurityGuardServicePage";

export const metadata: Metadata = {
  title: "Security Guard Services | Paladin Security Services",
  description:
    "Compare monthly security guard service rates by level and request a quotation from Paladin Security Services Co., Ltd.",
};

export default function SecurityGuardsPage() {
  return <SecurityGuardServicePage />;
}
