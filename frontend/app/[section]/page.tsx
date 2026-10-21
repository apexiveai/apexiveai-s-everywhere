import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommunitySectionPage from "../../components/CommunitySectionPage";
import {
  communitySections,
  type CommunitySectionSlug,
} from "../../lib/community";

function isCommunitySection(
  section: string,
): section is CommunitySectionSlug {
  return Object.hasOwn(communitySections, section);
}

export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (!isCommunitySection(section)) {
    notFound();
  }

  return <CommunitySectionPage section={section} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  if (!isCommunitySection(section)) {
    return {};
  }

  const content = communitySections[section];
  return {
    title: `${content.title} | Apexive AI`,
    description: content.description,
  };
}

export function generateStaticParams() {
  return Object.keys(communitySections).map((section) => ({ section }));
}
