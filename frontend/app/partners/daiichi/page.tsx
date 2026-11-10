
import type { Metadata } from "next";
import DaiichiExperience from "@/components/partners/DaiichiExperience";

export const metadata: Metadata = {
  title: "Daiichi Life Myanmar | Life Protection & Financial Confidence",
  description:
    "Discover life insurance information, protection concepts and customer consultation opportunities through ApexiveAI's Daiichi Life experience.",
  keywords: [
    "Daiichi Life Myanmar",
    "Life Insurance Myanmar",
    "Insurance Protection",
    "ApexiveAI",
  ],
  openGraph: {
    title: "Daiichi Life Myanmar | A Future Worth Protecting",
    description:
      "Explore life protection and financial planning information.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DaiichiPartnerPage() {
  return <DaiichiExperience />;
}
