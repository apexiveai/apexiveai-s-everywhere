
import type { Metadata } from "next";
import DaiichiExperience from "@/components/partners/DaiichiExperience";

export const metadata: Metadata = {
  title: "ApexiveAI | Daiichi Life Insurance Information",
  description:
    "An independent ApexiveAI information page for learning about life insurance and submitting an enquiry. Not the official Daiichi Life Myanmar website.",
  keywords: [
    "Daiichi Life Myanmar",
    "Life Insurance Myanmar",
    "Insurance Protection",
    "ApexiveAI",
  ],
  openGraph: {
    title: "ApexiveAI | Daiichi Life Information",
    description:
      "Independent life insurance information and enquiries by ApexiveAI.",
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
