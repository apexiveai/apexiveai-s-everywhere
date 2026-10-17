export type CommunityGroup = {
  title: string;
  description: string;
  items: {
    title: string;
    description: string;
  }[];
};

export type CommunitySection = {
  title: string;
  eyebrow: string;
  description: string;
  groups: CommunityGroup[];
};

export const externalModules = {
  trademark: {
    label: "Trademark AI",
    href: "https://apexiveai-trademark-detection-xi.vercel.app/",
  },
  rpa: {
    label: "RPA Automation",
    href: "https://apexiveai-jzjrzr3il-apexiveais-projects.vercel.app/",
  },
} as const;

export const communitySections = {
  dashboard: {
    title: "Dashboard",
    eyebrow: "Your business at a glance",
    description:
      "A focused view of the activity, opportunities, and insights across your Apexive workspace.",
    groups: [
      {
        title: "B2B",
        description: "Track business relationships and opportunities.",
        items: [
          {
            title: "KPI Overview",
            description: "A clear snapshot of the indicators that matter to your business.",
          },
          {
            title: "Leads Generated",
            description: "Review inbound leads and follow their progress.",
          },
          {
            title: "Active Partnerships",
            description: "Keep current partner relationships within reach.",
          },
          {
            title: "Revenue Analytics",
            description: "Understand revenue performance and business trends.",
          },
          {
            title: "Trending Topics",
            description: "See the conversations gaining momentum in your industry.",
          },
          {
            title: "Recent Activities",
            description: "Catch up on recent updates across your network.",
          },
        ],
      },
      {
        title: "Own Business",
        description: "Bring day-to-day company performance together.",
        items: [
          {
            title: "Sales Dashboard",
            description: "Follow sales activity and pipeline performance.",
          },
          {
            title: "Customer Analytics",
            description: "Explore customer engagement and behavior.",
          },
          {
            title: "Orders Overview",
            description: "Review order activity and fulfillment progress.",
          },
          {
            title: "Marketing Performance",
            description: "Understand campaign reach and engagement.",
          },
          {
            title: "Team Productivity",
            description: "Keep an eye on team activity and progress.",
          },
          {
            title: "AI Insights",
            description: "Surface useful patterns from your business data.",
          },
        ],
      },
    ],
  },
  forums: {
    title: "Forums",
    eyebrow: "Conversations that move business forward",
    description:
      "Find the right place to ask questions, share experience, and connect with the community.",
    groups: [
      {
        title: "B2B",
        description: "Meet peers, partners, and experts across industries.",
        items: [
          {
            title: "Industry Discussions",
            description: "Exchange ideas and perspectives with industry peers.",
          },
          {
            title: "Partnership Requests",
            description: "Share collaboration opportunities and find partners.",
          },
          {
            title: "Vendor Marketplace",
            description: "Discover and discuss business services and vendors.",
          },
          {
            title: "Startup Corner",
            description: "A space for founders to learn and build together.",
          },
          {
            title: "Q&A Hub",
            description: "Get practical answers from the community.",
          },
          {
            title: "Expert AMA Sessions",
            description: "Ask experienced professionals about their craft.",
          },
        ],
      },
      {
        title: "Own Business",
        description: "Build stronger relationships with your customers.",
        items: [
          {
            title: "Customer Community",
            description: "Bring customers together around your products and services.",
          },
          {
            title: "Product Feedback",
            description: "Collect useful product feedback in one place.",
          },
          {
            title: "Feature Requests",
            description: "Share and organize ideas for what to build next.",
          },
          {
            title: "Support Discussions",
            description: "Help customers find answers and support each other.",
          },
          {
            title: "Success Stories",
            description: "Celebrate customer outcomes and lessons learned.",
          },
        ],
      },
    ],
  },
  articles: {
    title: "Articles",
    eyebrow: "Knowledge for what comes next",
    description:
      "Browse industry perspectives and publish helpful stories for your own audience.",
    groups: [
      {
        title: "B2B",
        description: "Explore ideas and knowledge from across the market.",
        items: [
          {
            title: "Industry News",
            description: "Stay current with developments across your sector.",
          },
          {
            title: "Market Research",
            description: "Explore research and insights into market direction.",
          },
          {
            title: "Case Studies",
            description: "Learn from real-world business outcomes.",
          },
          {
            title: "Business Guides",
            description: "Find practical guidance for growing your business.",
          },
          {
            title: "AI & Technology Trends",
            description: "Follow new ideas shaping AI and technology.",
          },
        ],
      },
      {
        title: "Own Business",
        description: "Share useful updates and expertise with your customers.",
        items: [
          {
            title: "Company Blog",
            description: "Publish news and perspectives from your team.",
          },
          {
            title: "Product Updates",
            description: "Keep customers informed about product improvements.",
          },
          {
            title: "Customer Success Stories",
            description: "Highlight the outcomes customers achieve with you.",
          },
          {
            title: "Tutorials",
            description: "Help customers get more from your products.",
          },
          {
            title: "Announcements",
            description: "Share important company and community news.",
          },
        ],
      },
    ],
  },
  projects: {
    title: "Projects",
    eyebrow: "Turn good ideas into shared progress",
    description:
      "Discover collaboration opportunities or organize the work happening inside your business.",
    groups: [
      {
        title: "B2B",
        description: "Create new opportunities with trusted partners.",
        items: [
          {
            title: "Collaboration Projects",
            description: "Bring organizations together around shared goals.",
          },
          {
            title: "Partner Projects",
            description: "Coordinate joint work with business partners.",
          },
          {
            title: "Open Opportunities",
            description: "Find projects looking for skills and collaborators.",
          },
          {
            title: "Joint Ventures",
            description: "Explore larger initiatives built across organizations.",
          },
        ],
      },
      {
        title: "Own Business",
        description: "Plan work and keep your team moving together.",
        items: [
          {
            title: "Internal Projects",
            description: "Organize initiatives across your company.",
          },
          {
            title: "Client Projects",
            description: "Keep client engagements and deliverables on track.",
          },
          {
            title: "Roadmap",
            description: "Share priorities and what your team plans to build.",
          },
          {
            title: "Task Tracking",
            description: "Follow tasks, owners, and project progress.",
          },
        ],
      },
    ],
  },
  resources: {
    title: "Resources",
    eyebrow: "Useful tools, ready when you need them",
    description:
      "Find reusable business materials or organize the knowledge your team relies on.",
    groups: [
      {
        title: "B2B",
        description: "Practical materials for working across businesses.",
        items: [
          {
            title: "Business Templates",
            description: "Start common business documents with reusable templates.",
          },
          {
            title: "Legal Documents",
            description: "Keep frequently used legal resources easy to find.",
          },
          {
            title: "Marketing Materials",
            description: "Share materials that support your marketing efforts.",
          },
          {
            title: "API Documentation",
            description: "Explore technical references for connected services.",
          },
          {
            title: "Funding Resources",
            description: "Find materials for funding research and preparation.",
          },
        ],
      },
      {
        title: "Own Business",
        description: "Make your company's knowledge available to the team.",
        items: [
          {
            title: "Knowledge Base",
            description: "Collect answers and internal guidance in one place.",
          },
          {
            title: "Training Materials",
            description: "Help teammates learn processes and new skills.",
          },
          {
            title: "SOP Library",
            description: "Keep standard operating procedures organized.",
          },
          {
            title: "Product Documentation",
            description: "Maintain documentation for your products and services.",
          },
        ],
      },
    ],
  },
  "clone-detector": {
    title: "Clone Detector",
    eyebrow: "Protect what makes your brand yours",
    description:
      "A unified place to explore similarity checks across websites, brands, trademarks, logos, domains, and apps.",
    groups: [
      {
        title: "Detection tools",
        description:
          "Choose the type of similarity check that fits what you want to investigate.",
        items: [
          {
            title: "Website Clone Detector",
            description: "Check for websites that closely imitate your online presence.",
          },
          {
            title: "Brand Similarity Check",
            description: "Review names and identities that may be confused with your brand.",
          },
          {
            title: "Trademark Similarity",
            description: "Explore potential conflicts between trademark names.",
          },
          {
            title: "Logo Similarity",
            description: "Compare visual identities for potentially similar logos.",
          },
          {
            title: "Domain Similarity Scanner",
            description: "Look for domains that resemble your business or brand.",
          },
          {
            title: "App Clone Detection",
            description: "Identify apps with names or presentation similar to yours.",
          },
        ],
      },
    ],
  },
  search: {
    title: "Search",
    eyebrow: "Find the right signal in the network",
    description:
      "Search the community directory and browse companies, people, articles, projects, and resources.",
    groups: [
      {
        title: "Search the network",
        description:
          "Choose a directory to explore. Search results will appear here when matching community content is available.",
        items: [
          {
            title: "Global Search",
            description: "Search across the available community directories.",
          },
          {
            title: "Companies Search",
            description: "Find companies, vendors, and potential partners.",
          },
          {
            title: "People Search",
            description: "Discover community members and industry experts.",
          },
          {
            title: "Articles Search",
            description: "Find useful articles, guides, and research.",
          },
          {
            title: "Projects Search",
            description: "Explore projects and open collaboration opportunities.",
          },
          {
            title: "Resources Search",
            description: "Locate business templates, documents, and references.",
          },
          {
            title: "AI Semantic Search",
            description: "Search by meaning when an AI search service is connected.",
          },
        ],
      },
    ],
  },
} satisfies Record<string, CommunitySection>;

export type CommunitySectionSlug = keyof typeof communitySections;

export const searchCategories = [
  { id: "all", label: "Global Search" },
  { id: "companies", label: "Companies" },
  { id: "people", label: "People" },
  { id: "articles", label: "Articles" },
  { id: "projects", label: "Projects" },
  { id: "resources", label: "Resources" },
] as const;

export type SearchCategory = (typeof searchCategories)[number]["id"];

export const searchDirectory = [
  {
    title: "Vendor Marketplace",
    description: "Discover business services and vendors in the community.",
    category: "companies",
    href: "/forums",
  },
  {
    title: "Partnership Requests",
    description: "Find companies sharing partnership and collaboration opportunities.",
    category: "companies",
    href: "/forums",
  },
  {
    title: "Active Partnerships",
    description: "Keep up with business relationships across your network.",
    category: "companies",
    href: "/dashboard",
  },
  {
    title: "Industry Discussions",
    description: "Connect with professionals discussing your industry.",
    category: "people",
    href: "/forums",
  },
  {
    title: "Expert AMA Sessions",
    description: "Meet experienced professionals and ask them questions.",
    category: "people",
    href: "/forums",
  },
  {
    title: "Q&A Hub",
    description: "Find answers and learn from the community.",
    category: "people",
    href: "/forums",
  },
  {
    title: "Industry News",
    description: "Browse the latest news and updates across industries.",
    category: "articles",
    href: "/articles",
  },
  {
    title: "Market Research",
    description: "Explore research, analysis, and market trends.",
    category: "articles",
    href: "/articles",
  },
  {
    title: "Business Guides",
    description: "Find practical advice for building and growing a business.",
    category: "articles",
    href: "/articles",
  },
  {
    title: "AI & Technology Trends",
    description: "Read about emerging AI and technology developments.",
    category: "articles",
    href: "/articles",
  },
  {
    title: "Collaboration Projects",
    description: "Explore shared projects and cross-company initiatives.",
    category: "projects",
    href: "/projects",
  },
  {
    title: "Partner Projects",
    description: "Find projects coordinated with business partners.",
    category: "projects",
    href: "/projects",
  },
  {
    title: "Open Opportunities",
    description: "Browse open projects looking for collaborators.",
    category: "projects",
    href: "/projects",
  },
  {
    title: "Business Templates",
    description: "Find reusable templates for common business needs.",
    category: "resources",
    href: "/resources",
  },
  {
    title: "Legal Documents",
    description: "Browse legal reference materials and documents.",
    category: "resources",
    href: "/resources",
  },
  {
    title: "API Documentation",
    description: "Find API references and integration documentation.",
    category: "resources",
    href: "/resources",
  },
  {
    title: "Knowledge Base",
    description: "Search company answers, guides, and internal knowledge.",
    category: "resources",
    href: "/resources",
  },
] satisfies {
  title: string;
  description: string;
  category: Exclude<SearchCategory, "all">;
  href: string;
}[];
