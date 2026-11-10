
import type { Metadata } from "next";
import DaiichiAdminDashboard from "./DaiichiAdminDashboard";

export const metadata: Metadata = {
  title: "Daiichi Lead Management | Apexive AI",
  description: "Daiichi partner campaign administration.",
};

export default function DaiichiAdminPage() {
  return <DaiichiAdminDashboard />;
}
