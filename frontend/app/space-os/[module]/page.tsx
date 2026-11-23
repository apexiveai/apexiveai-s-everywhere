// app/space-os/[module]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSpaceModule } from "@/lib/space-os"; // adjust path to match your project

async function SpaceModuleContent({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: slug } = await params;
  const module = getSpaceModule(slug);

  if (!module) {
    notFound();
  }

  return <div>{/* Render module */}</div>;
}

export default function SpaceModuleRoute({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading module...</div>}>
      <SpaceModuleContent params={params} />
    </Suspense>
  );
}