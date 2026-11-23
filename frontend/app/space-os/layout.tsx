import type { ReactNode } from "react";
import SpaceOSShell from "../../components/space-os/SpaceOSShell";
import "./space-os.css";

export const metadata = {
  title: "ApexiveAI Space OS | Space Operations",
  description:
    "A unified civilian space infrastructure and operations management platform.",
};

export default function SpaceOSLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SpaceOSShell>{children}</SpaceOSShell>;
}