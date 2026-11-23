
import SpaceWorkspaceEngine from "./SpaceWorkspaceEngine";

type SpaceModule = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  category: string;
  status: string;
  records: string;
  accent: string;
  capabilities: string[];
  columns: string[];
};

export default function SpaceModulePage({
  module,
}: {
  module: SpaceModule;
}) {
  return <SpaceWorkspaceEngine module={module} />;
}
