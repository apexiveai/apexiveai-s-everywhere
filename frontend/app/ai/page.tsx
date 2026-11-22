
import type { Metadata } from "next";
import AIWorkspace from "./AIWorkspace";

export const metadata: Metadata = {
  title: "ApexiveAI | Universal Enterprise Agent",
  description:
    "ApexiveAI Universal Enterprise Agent — intelligent assistance for organizations, teams, and businesses.",
};

export default function AIPage() {
  return <AIWorkspace />;
}
