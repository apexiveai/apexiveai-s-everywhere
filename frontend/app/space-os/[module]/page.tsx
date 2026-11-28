// app/space-os/[module]/page.tsx
import { notFound } from "next/navigation";
import SpaceModulePage from "../../../components/space-os/SpaceModulePage";
import { getSpaceModule, SPACE_MODULES } from "../../../lib/space-os";

export const instant = false;

export function generateStaticParams() {
  return SPACE_MODULES.map((module) => ({
    module: module.slug,
  }));
}

export default async function SpaceModuleRoute({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: slug } = await params;
  const spaceModule = getSpaceModule(slug);

  if (!spaceModule) {
    notFound();
  }

  return <SpaceModulePage module={spaceModule} />;
}