export type SpaceModule = {
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

export const SPACE_MODULES: SpaceModule[] = [
  {
    slug: "satellite-fleet",
    name: "Satellite Fleet Management",
    shortName: "Satellite Fleet",
    description: "Manage satellite assets, orbital information, ownership and operational readiness.",
    category: "ASSET OPERATIONS",
    status: "Operational",
    records: "24",
    accent: "cyan",
    capabilities: ["Satellite Registry", "Orbit Information", "Asset Status", "Manufacturer Records", "Launch Information"],
    columns: ["Satellite", "NORAD ID", "Orbit", "Organization", "Status"],
  },
  {
    slug: "ground-stations",
    name: "Ground Station Management",
    shortName: "Ground Stations",
    description: "Manage ground station facilities, antennas, locations and communication infrastructure.",
    category: "GROUND INFRASTRUCTURE",
    status: "Operational",
    records: "08",
    accent: "blue",
    capabilities: ["Station Directory", "Geographic Locations", "Antenna Inventory", "Frequency Bands", "Facility Status"],
    columns: ["Station", "Location", "Antenna", "Frequency", "Status"],
  },
  {
    slug: "missions",
    name: "Mission Management",
    shortName: "Missions",
    description: "Coordinate mission portfolios, schedules, participating satellites and mission milestones.",
    category: "MISSION OPERATIONS",
    status: "Operational",
    records: "12",
    accent: "violet",
    capabilities: ["Mission Registry", "Mission Planning", "Satellite Assignments", "Schedules", "Milestones"],
    columns: ["Mission", "Mission Type", "Organization", "Priority", "Status"],
  },
  {
    slug: "earth-observation",
    name: "Earth Observation & Remote Sensing",
    shortName: "Earth Observation",
    description: "Organize Earth observation programmes, remote sensing datasets and imagery workflows.",
    category: "EARTH INTELLIGENCE",
    status: "Development",
    records: "06",
    accent: "green",
    capabilities: ["Observation Catalog", "Imagery Inventory", "Coverage Areas", "Acquisition Planning", "Data Products"],
    columns: ["Dataset", "Sensor", "Coverage", "Acquisition", "Status"],
  },
  {
    slug: "satellite-telecommunications",
    name: "Satellite Telecommunications",
    shortName: "Telecommunications",
    description: "Manage satellite communication services, capacity records and service coverage.",
    category: "SPACE COMMUNICATIONS",
    status: "Development",
    records: "05",
    accent: "blue",
    capabilities: ["Service Registry", "Capacity Planning", "Coverage Records", "Frequency Planning", "Service Status"],
    columns: ["Service", "Satellite", "Band", "Coverage", "Status"],
  },
  {
    slug: "navigation",
    name: "Navigation & Positioning Services",
    shortName: "Navigation",
    description: "Manage navigation service information, positioning programmes and reference datasets.",
    category: "POSITIONING SERVICES",
    status: "Development",
    records: "04",
    accent: "cyan",
    capabilities: ["Service Directory", "Reference Stations", "Service Coverage", "Accuracy Records", "Availability"],
    columns: ["Service", "System", "Coverage", "Provider", "Status"],
  },
  {
    slug: "data-intelligence",
    name: "Satellite Data Intelligence",
    shortName: "Data Intelligence",
    description: "Explore satellite data catalogues, metadata, processing workflows and analytical products.",
    category: "DATA & ANALYTICS",
    status: "Development",
    records: "18",
    accent: "violet",
    capabilities: ["Data Catalog", "Metadata Registry", "Processing Jobs", "Analytics", "Data Governance"],
    columns: ["Dataset", "Data Type", "Source", "Updated", "Status"],
  },
  {
    slug: "weather-climate",
    name: "Weather & Climate Monitoring",
    shortName: "Weather & Climate",
    description: "Organize weather and climate observation datasets, monitoring programmes and reports.",
    category: "CLIMATE INTELLIGENCE",
    status: "Development",
    records: "09",
    accent: "blue",
    capabilities: ["Weather Datasets", "Climate Records", "Observation Sources", "Monitoring Reports", "Data Access"],
    columns: ["Dataset", "Observation", "Region", "Updated", "Status"],
  },
  {
    slug: "disaster-response",
    name: "Disaster Monitoring & Response",
    shortName: "Disaster Response",
    description: "Coordinate civilian disaster monitoring, situational awareness and response information.",
    category: "PUBLIC SAFETY",
    status: "Development",
    records: "03",
    accent: "orange",
    capabilities: ["Event Registry", "Affected Areas", "Observation Reports", "Response Coordination", "Situation Updates"],
    columns: ["Event", "Event Type", "Region", "Reported", "Status"],
  },
  {
    slug: "sustainability",
    name: "Space Sustainability & Compliance",
    shortName: "Sustainability",
    description: "Track sustainability programmes, regulatory documentation and compliance activities.",
    category: "GOVERNANCE",
    status: "Development",
    records: "07",
    accent: "green",
    capabilities: ["Compliance Register", "Policy Records", "Sustainability Metrics", "Risk Register", "Reports"],
    columns: ["Record", "Category", "Organization", "Review Date", "Status"],
  },
  {
    slug: "research",
    name: "Space Research & Education",
    shortName: "Research & Education",
    description: "Manage research programmes, educational initiatives, publications and institutional projects.",
    category: "RESEARCH ECOSYSTEM",
    status: "Development",
    records: "11",
    accent: "violet",
    capabilities: ["Research Projects", "Institutions", "Publications", "Education Programmes", "Knowledge Library"],
    columns: ["Project", "Institution", "Research Area", "Updated", "Status"],
  },
  {
    slug: "international-cooperation",
    name: "International Space Cooperation",
    shortName: "International Cooperation",
    description: "Organize international partnerships, institutional contacts and cooperation programmes.",
    category: "INTERNATIONAL RELATIONS",
    status: "Development",
    records: "04",
    accent: "cyan",
    capabilities: ["Partner Directory", "Cooperation Agreements", "Joint Programmes", "Institutional Contacts", "Engagement Records"],
    columns: ["Partner", "Country", "Programme", "Agreement", "Status"],
  },
];

export const SPACE_METRICS = [
  { label: "Registered Satellites", value: "24", change: "Asset registry", icon: "satellite" },
  { label: "Ground Stations", value: "08", change: "Facility records", icon: "radio-tower" },
  { label: "Active Missions", value: "12", change: "Mission portfolio", icon: "orbit" },
  { label: "Data Collections", value: "18", change: "Catalogued datasets", icon: "database" },
];

export const SPACE_ACTIVITY = [
  { title: "Satellite registry updated", detail: "ASTER-01 · Asset Management", time: "09:42 UTC", type: "asset" },
  { title: "Ground station record created", detail: "Yangon Ground Station · Infrastructure", time: "08:55 UTC", type: "station" },
  { title: "Mission schedule reviewed", detail: "Earth Observation Mission · Mission Control", time: "Yesterday", type: "mission" },
  { title: "Dataset added to catalogue", detail: "Regional Climate Dataset · Data Intelligence", time: "Yesterday", type: "data" },
];

export function getSpaceModule(slug: string) {
  return SPACE_MODULES.find((item) => item.slug === slug);
}