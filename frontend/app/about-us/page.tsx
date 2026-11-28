import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | Apexive AI",
  description:
    "Learn about Apexive AI and the intelligent systems we build for modern organizations.",
};

export default function AboutUsPage() {
  return (
    <main className="about-us-page">
      <section className="leaders-section" aria-label="Meet our leaders">
        <Image
          src="/meet-our-leaders.jpg"
          alt="Meet our leaders - Apexive AI leadership team"
          fill
          priority
          sizes="100vw"
        />
      </section>
    </main>
  );
}
