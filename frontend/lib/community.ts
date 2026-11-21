export type CommunityGroup = {
  title: string;
  description: string;
  items: {
    title: string;
    description: string;
    href?: string | null;
    image?: string;
  }[];
};

export type CommunitySection = {
  title: string;
  eyebrow: string;
  description: string;
  heroImage?: string;
  groups: CommunityGroup[];
};

export const governmentPublicSectorNavItems = [
  { label: "Public Safety", href: "/public-safety" },
  { label: "Energy OS", href: "/energy-os" },
  { label: "Space & Satellite OS", href: "/space-satellite-os" },
  {
    label: "Defense Enterprise Suite",
    href:
      process.env.NEXT_PUBLIC_DEFENSE_ENTERPRISE_SUITE_URL ??
      "http://127.0.0.1:5173",
  },
  { label: "Municipal OS", href: "/municipal-os" },
  { label: "Police Citizen Connect", href: "/police-citizen-connect" },
  { label: "Security Guards", href: "/security-guards" },
];

const governmentProductDescriptions: Record<string, string> = {
  "Public Safety":
    "Explore ApexiveAI Public Safety within the Government & Public Sector portfolio.",
  "Energy OS":
    "Explore ApexiveAI Energy OS within the Government & Public Sector portfolio.",
  "Space & Satellite OS":
    "National space infrastructure, satellite operations, and earth-observation management.",
  "Defense Enterprise Suite":
    "Explore ApexiveAI Defense Enterprise Suite within the Government & Public Sector portfolio.",
  "Municipal OS":
    "Explore ApexiveAI Municipal OS within the Government & Public Sector portfolio.",
  "Police Citizen Connect":
    "Explore ApexiveAI Police Citizen Connect within the Government & Public Sector portfolio.",
  "Security Guards":
    "Explore Paladin Security Services guard levels, monthly rates, and request a service quotation.",
};

function governmentProductSection(
  title: string,
  description: string,
): CommunitySection {
  return {
    title,
    eyebrow: "Government & Public Sector",
    description,
    groups: [
      {
        title: "Government & Public Sector products",
        description:
          "Explore the ApexiveAI products in the Government & Public Sector portfolio.",
        items: governmentPublicSectorNavItems.map(({ label, href }) => ({
          title: label,
          description: governmentProductDescriptions[label],
          href,
        })),
      },
    ],
  };
}

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

export function getExternalProductUrl(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

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
      {
        title: "Connected Products",
        description: "Open your connected ApexiveAI business applications.",
        items: [
          {
            title: "ApexiveAI Workforce Payroll SaaS",
            description:
              "Manage workforce operations and payroll in the connected SaaS application.",
            href: getExternalProductUrl(
              process.env.NEXT_PUBLIC_WORKFORCE_PAYROLL_URL,
            ),
          },
          {
            title: "ApexiveAI MultiVendor Marketplace",
            description:
              "Open the multi-vendor commerce platform for sellers and buyers.",
            href: getExternalProductUrl(
              process.env.NEXT_PUBLIC_MULTIVENDOR_MARKETPLACE_URL,
            ),
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
  security: {
    title: "Security & Trust",
    eyebrow: "Security controls and deployment guidance",
    description:
      "Apexive မှာ code ဖြင့်ကာကွယ်ထားသည့်အချက်များနှင့် production server တွင် သီးခြားပြင်ဆင်ရမည့် security checklist ကို ဖော်ပြထားပါသည်။",
    groups: [
      {
        title: "Python backend security",
        description: "Backend API နှင့် database layer တွင် အသုံးပြုထားသော ကာကွယ်မှုများ။",
        items: [
          {
            title: "ORM & parameterized queries",
            description:
              "Database access တွင် SQLAlchemy ORM နှင့် bound parameters ကို အသုံးပြုထားပါသည်။ User input ကို SQL string ထဲ တိုက်ရိုက်ပေါင်းမထည့်ပါနှင့်။",
          },
          {
            title: "CORS configuration",
            description:
              "FastAPI တွင် ခွင့်ပြုထားသော origin များကို config ဖြင့်သတ်မှတ်ထားပါသည်။ Production domain များကိုသာ allowlist လုပ်ပါ။ CORS သည် login/authentication ကို အစားမထိုးပါ။",
          },
          {
            title: "Pydantic input validation",
            description:
              "Pydantic request schema များက type၊ စာလုံးအရေအတွက်နှင့် ဈေးနှုန်းအကွာအဝေးများကို server ပေါ်တွင် စစ်ဆေးပါသည်။ Browser validation သည် အဆင်ပြေစေရန်သာ ဖြစ်သည်။",
          },
          {
            title: "Password hashing",
            description:
              "Account password များကို Passlib မှတစ်ဆင့် bcrypt ဖြင့် hash လုပ်ထားပါသည်။ မူရင်း password ကို သိမ်းဆည်းခြင်း၊ log ထဲရေးခြင်း မလုပ်ပါနှင့်။",
          },
        ],
      },
      {
        title: "Frontend security",
        description: "Browser တွင် data ပြသမှု၊ token နှင့် environment variable များအတွက် အချက်များ။",
        items: [
          {
            title: "XSS protection",
            description:
              "React သည် text အဖြစ်ထည့်သွင်းထားသော data များကို ပုံမှန်အားဖြင့် escape လုပ်ပါသည်။ မယုံကြည်ရသော HTML ကို တိုက်ရိုက်မပြသပါနှင့်၊ server ပေါ်တွင်လည်း ပြန်စစ်ပါ။",
          },
          {
            title: "Token & cookie management",
            description:
              "လက်ရှိ access token ကို browser localStorage ထဲတွင် သိမ်းထားပြီး HttpOnly cookie မဟုတ်သေးပါ။ ပိုမိုလုံခြုံရန် Secure၊ HttpOnly၊ SameSite cookie နှင့် CSRF ကာကွယ်မှုသို့ ပြောင်းရန်လိုပါသည်။",
          },
          {
            title: "Environment variable protection",
            description:
              "Database credential နှင့် signing key များကို server ဘက်တွင်သာထားပါ။ NEXT_PUBLIC_ variable များကို browser သို့ပို့သည်။ Secret များကို ထိုနေရာတွင်မထားပါနှင့်၊ .env file များကို source control ထဲမတင်ပါနှင့်။",
          },
        ],
      },
      {
        title: "Infrastructure & transport security",
        description: "Production hosting တွင် သီးခြားစစ်ဆေးပြီး configure လုပ်ရမည့်အချက်များ။",
        items: [
          {
            title: "HTTPS / TLS everywhere",
            description:
              "Website နှင့် API traffic အားလုံးကို HTTPS/TLS ဖြင့်ပို့ပါ။ Hosting သို့မဟုတ် proxy အဆင့်တွင် HTTP မှ HTTPS သို့ redirect နှင့် HSTS ကို configure လုပ်ပါ။",
          },
          {
            title: "Reverse proxy & WAF",
            description:
              "FastAPI ရှေ့တွင် Nginx သို့မဟုတ် Cloudflare WAF ထားပြီး origin server ကို တိုက်ရိုက်ဝင်ရောက်မှုကန့်သတ်ပါ။ Rate limit နှင့် ယုံကြည်ရသော proxy header များကို သတ်မှတ်ပါ။ DDoS ကာကွယ်မှုသည် အန္တရာယ်ကိုလျှော့ချခြင်းသာဖြစ်ပြီး အပြည့်အဝတားဆီးနိုင်မည်ဟု အာမမခံနိုင်ပါ။",
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
  "public-safety": governmentProductSection(
    "Public Safety",
    governmentProductDescriptions["Public Safety"],
  ),
  "energy-os": {
    title: "Energy OS",
    eyebrow: "Nuclear Energy Operating System",
    description:
      "A unified operating platform for national nuclear energy governance, operations, safety, workforce, and public transparency.",
    heroImage:
      "https://images.openai.com/static-rsc-4/K_xMNXw8HcckFjZgikGgEo6BuYPVxDbq8cC_WRRmYibBLUoTdUhDZ3E5HkcWseEdWXJYQmiu57Ia76um9F1NLhczHW-bRE5MLUtqoyKsK9egj3LLgZECEl2-sy3BDLZ4ey7-Iqwt1CgTCtiJ02wsB3T8TLeXiKtuL0MlW93Mhng?purpose=inline",
    groups: [
      {
        title: "Nuclear Management Modules",
        description:
          "Connected capabilities for planning, oversight, operations, compliance, and public information.",
        items: [
          {
            title: "Nuclear Energy Dashboard",
            description:
              "National energy statistics, project status, and power-generation reports.",
            image:
              "https://images.openai.com/static-rsc-4/kNXrbsr-Yw6F1ax8x0GPUAGAbVZ0XsnhJYSrCrxKaASUDIUdftZZ7gCvBBG5Gkm5cOhCDpehCNbRD_N06yJikLQE-fsyHUhdtHmDZv_vusHsQO1XlDZ0MDIiN97CAq5ZDq7t0dTwkZXT6BepYPTRCmwWnh7Upw1YvxKEYh_2AEw?purpose=inline",
          },
          {
            title: "Nuclear Project Management",
            description:
              "Project planning, milestones, budgets, contractors, and approvals.",
            image:
              "https://images.openai.com/static-rsc-4/nIyRcicL6kridT5_3gAv3Mf4N-ShrQGNGN4PNtS6F8Nl4PQwymtVgeA07UkRPpJU-64iOQTwppMOT9a_Q5f7Uzx5ujVmoxgoapXao0Ak0sxeDSWYH3wlv2GUaL7nqSEdYJtoZPzhxGaUgmAH0rx8kkrnBlM2euIbkCBEhocB6mU?purpose=inline",
          },
          {
            title: "Regulatory & Licensing Management",
            description:
              "Government permits, regulatory reviews, inspections, and compliance records.",
            image:
              "https://images.openai.com/static-rsc-4/K_xMNXw8HcckFjZgikGgEo6BuYPVxDbq8cC_WRRmYibBLUoTdUhDZ3E5HkcWseEdWXJYQmiu57Ia76um9F1NLhczHW-bRE5MLUtqoyKsK9egj3LLgZECEl2-sy3BDLZ4ey7-Iqwt1CgTCtiJ02wsB3T8TLeXiKtuL0MlW93Mhng?purpose=inline",
          },
          {
            title: "Electricity Generation Management",
            description:
              "Generation statistics, grid integration, and electricity supply reporting.",
            image:
              "https://images.openai.com/static-rsc-4/o9WybvzgCzsq8UImxVIemWIf4jOrb4bWuwT1w4qOQ_5xFLkuV3fHOGGWR8UtlDgWkCYCIaC86wk3CR5oho374Q9Jl1vEc3QGrKqH4rqe8zAjMKeKj1gsumfmpwxJfFLTYQdsLm2fEELjcbjmPyAGm6W-STMMXLyeDWtvWEKn3To?purpose=inline",
          },
          {
            title: "Nuclear Safety & Compliance",
            description:
              "Safety audits, corrective actions, inspection records, and safety indicators.",
            image:
              "https://images.openai.com/static-rsc-4/EsXu22g_oBWqp1psSMYwZ93WF8jk-33o1r0PPPmuYdi0nO9yaF5V2fYtuEzzv9LNp8ULk1qs_GIiE0PoLuHs-Wlrc_oG0qkwM3T6dUKoEb7m1sYvOBzlIbDklbJ6v66jsoUB19-wUDHEJ0Y?purpose=inline",
          },
          {
            title: "Radiation & Environmental Monitoring",
            description:
              "Authorized monitoring data, environmental reports, and radiation protection records.",
            image:
              "https://images.openai.com/static-rsc-4/v-OMt2z72pCS1sNJpnCnLVs-yCWFdP_OyVbqDvqLCjjLXEjnoSeRigdWLzWEHD92HE_-BVJOtFSpKFq6CDRc81yPiswZ0DYZ9ar7iFIMGVTNlt3engHJJXLIKDBng6qiFVJ2WJ9ZHvAlEuiVp0_fLbOXozannzZT7MF78ncbVoo?purpose=inline",
          },
          {
            title: "Emergency Preparedness & Response",
            description:
              "Emergency plans, drills, notifications, and incident coordination.",
            image:
              "https://images.openai.com/static-rsc-4/SOZ_bdFq2-DPI2V6hxVPl1oOoT9NPQtDgDAMYPY0egCA2uw7Z87bLXpQ07XmboAQGDwd7sKFz7NqA34woINHaEkK0L1ASpAkOR2shKc1052rz6pPXLKroQh4DWMZ4tzLttSnG7-YnPihzgi4zHTe0zm8QCP4rRNVlrvZnFBD6QI?purpose=inline",
          },
          {
            title: "Radioactive Waste Governance",
            description:
              "Waste inventory records, licensed facilities, compliance, and disposal documentation.",
            image:
              "https://images.openai.com/static-rsc-4/HzMb23sqzu9MBfdqppRQKwlzvTj31ySllUbAEISSMyQZ1odIAFFK8qMOe9UI646y_fHD6Tz5UuSkxVSvLtCWgO1Rn5L_LLSCA5KANbqU791O9OjyvjWsso6Tjy3tdM1bvtvzi8s0x5h1A25EY9XSaeAFf_pgXqHPKyIokY1M5uc?purpose=inline",
          },
          {
            title: "Workforce & Training Management",
            description:
              "Staff qualifications, training, certifications, and competency records.",
            image:
              "https://images.openai.com/static-rsc-4/nEgIcl008Ik8vbHyMtrv_40aviljFiZ5gr8AMbHCwFLzTLagzo8969H-8ES10E4RxCLRcyBYdrqdmlrNXNEmYBlz1NCK1lLM1zxZNanScbLNgtXy3DT2uTPIEjcMGLZAHlDa3u73TJaopOehbnncNYiSUmEquudqlA8QaxrxsUY?purpose=inline",
          },
          {
            title: "Procurement & Financial Management",
            description:
              "Procurement approvals, project finance, supplier contracts, and expenditure tracking.",
            image:
              "https://images.openai.com/static-rsc-4/4mr7Szi_tcuJuhi8y0Fl0a5jirhJCRhWknO9UJOY4lG7tIyIV5G8aCiuR-HCK0JnbvUJNZCrfh8i5l6cxsjL4k8NVW0cTuhdxNu1H3TS9CcuuQzq1nSZ3anLzKaJWa_QEU3y0D_ww8I3URpal7ksPyW0U3JuOG7Sh5WTAeXAYgk?purpose=inline",
          },
          {
            title: "Nuclear Research & Knowledge Center",
            description:
              "Research publications, approved technical documents, education, and collaboration.",
            image:
              "https://images.openai.com/static-rsc-4/MDJja5bqyPVSfilPmenq6y3k5auVtQtlS2rHJ5TtjRy-PRY-gaawhbA_Z4KxkAwsEXVjcKsMyU08ynl_r4gk9uTtDrH_1J8qqC5Tl20ffe1m0gT18Zh6ncH4xYXcEUpxdvNxvScIpvptAbUlMSK1aAgcFIIdu7mbW5BXUOY1-_I?purpose=inline",
          },
          {
            title: "Public Information & Transparency",
            description:
              "Public reports, electricity statistics, environmental disclosures, and announcements.",
            image:
              "https://images.openai.com/static-rsc-4/K_xMNXw8HcckFjZgikGgEo6BuYPVxDbq8cC_WRRmYibBLUoTdUhDZ3E5HkcWseEdWXJYQmiu57Ia76um9F1NLhczHW-bRE5MLUtqoyKsK9egj3LLgZECEl2-sy3BDLZ4ey7-Iqwt1CgTCtiJ02wsB3T8TLeXiKtuL0MlW93Mhng?purpose=inline",
          },
        ],
      },
    ],
  },
  "space-satellite-os": {
    title: "ApexiveAI Space & Satellite OS",
    eyebrow: "National Space Infrastructure",
    description:
      "National space infrastructure, satellite operations, and earth-observation management.",
    heroImage:
      "https://images.openai.com/static-rsc-4/owUvzza4Se8kNZUm8YlGwft0gh_1I4B5wttL2r_sVFf0ofwejafmyCdref_c-Uih9EygYbTDwWJpIqOiGbCKQuUlIvOn_eMip34XX0TQDwwau1Y4OzHDYEOm2pBcoHOxNqrUwzmTM1eG0DBgL3FswHUiw8g-jL_QTszNkBYjraU?purpose=inline",
    groups: [
      {
        title: "Satellite OS — Core Modules",
        description:
          "Core capabilities for satellite operations, earth observation, communications, sustainability, and cooperation.",
        items: [
          {
            title: "Satellite Fleet Management",
            description:
              "Satellite inventory, ownership, type, lifecycle, and mission status management.",
            image:
              "https://images.openai.com/static-rsc-4/HOxShQYPldjhke5t4tnR9aeW7JaUbU5xPF5uHH0x_d7HyWc1NT4yehCnaah0wntnRnlJLP-XSpHjjcqEo3PrebG3mDvrVon_HdTm74lvubz8Oj4UBZ64YSH3n9U40wIzLY2HwWQYQbvP97hp4SdNkjFNQsmJ4zXgIPA9HlBASk8?purpose=inline",
          },
          {
            title: "Ground Station Management",
            description:
              "Ground stations, communications infrastructure, and facility records.",
            image:
              "https://images.openai.com/static-rsc-4/8QqvR4IdCdQxe02iFXpdRDkqaHcxu7rmy7SpRZRuyPWCJ02Q4Hlsj1DmFAJTXlSjDaZm1y3Ht7tis4vKYOd8nCyOw06k4UAw9570rPwSzLBQ1fhsxU1b9tHeelNKlliPTVGywKa4woox5Q5-0sOI2R0NrK0XPJtULcFZs_WJ5Xw?purpose=inline",
          },
          {
            title: "Mission Management",
            description:
              "Mission lifecycle, project milestones, mission documentation, and status tracking.",
            image:
              "https://images.openai.com/static-rsc-4/IWRUEsWUYnxUqc5DD7nFQOGImUw2VjCHwIJn667PWSW4ECbQdDx2qP2OGwqpEyhTQopVMRu1LtWp7zBLvA-q_xNJnrnki6c3dh_W8MKIXHwioZ-aqeDDjXLAI-teUOGnGYEJhNWkirA_0Rphl3Vqee4kbZ84BYlcTVe2u0F2ri0?purpose=inline",
          },
          {
            title: "Earth Observation & Remote Sensing",
            description:
              "Agriculture, forestry, flood, land-use, and environmental monitoring.",
            image:
              "https://images.openai.com/static-rsc-4/-Oe7B8wbn-GIuOVu-9phFYJDK1twUOq6yqnwHGEZX_jMNysEXAU_Es2gqxbQL9__Xw7Wqb1h1eAZ01ejkEQ6fJITO49_TD-YM24VL5_aD1XPQnn_SC5TEgbmjSGWDiNvbEfWYUA2Vj2_zvdxmoCRmCr-YZ_dpK9QVC_vOZlIdbs?purpose=inline",
          },
          {
            title: "Satellite Telecommunications",
            description:
              "Satellite internet, broadband, remote connectivity, and telecom service management.",
            image:
              "https://images.openai.com/static-rsc-4/W6TI7khuBK9x0-KILLX6GfEiCcwuO3v_FKX4MtoR8iFubNcqPscJYOq4hQgM812qTjnF4WOqYDkb_jnHCVvyAE_9xpfrP02uZ8vKcUo4dMEwaypfXp6GXcYNXRovQ7RnugVO6ONk3dDw8Z5JcIJc3LUIKfz1wHdeaFs13Dgkv5A?purpose=inline",
          },
          {
            title: "Navigation & Positioning Services",
            description:
              "GNSS data services, mapping integration, and positioning service governance.",
            image:
              "https://images.openai.com/static-rsc-4/eAF0qjxJBQ2trYwEchWXbamhh2h52DlFH4u7_d-4kzUgF2la0QQdlFujO25Y15bOVWcBDGUsMCmtGayLAIZsCcerspFnMRf0ISv7kEizyms5YJ26ZH4cWfJCDbKmihkZIBolYvlBcpC0Log?purpose=inline",
          },
          {
            title: "Satellite Data Intelligence",
            description:
              "Imagery repository, data analytics, AI image classification, and reporting.",
            image:
              "https://images.openai.com/static-rsc-4/vR5rb8C5TfmM_TiNS_H6Y7oJs6U5V4f7NL2HpH9moO2p-1kS156EcYDj3eTKiz9o9usw5aDRwhIpPtCOAs8OYRkn3fWuf7YF5j1rf2e7NIu4k875cJRulJJQSiCdiJNUWWqInHPHOszBCp3KAigapjS4HexR01kxp06ZCGBY5HE?purpose=inline",
          },
          {
            title: "Weather & Climate Monitoring",
            description:
              "Weather, climate change, storm, and climate-related data monitoring.",
            image:
              "https://images.openai.com/static-rsc-4/kzusR-8fNrHtXV8I0Gs8tWY21N6URuhloIlWf3RCgwOWjsTArKjeOJlRkg9tvn7AfzosZIIc9GSzp7pJXkVLYmX6ZC_JM_WPpPr8EIj7s6fmGegMexau2BE0gs-5tn-wccpA_SFr649DK2gkJM0BN7rKiJHZgXKsZgCYdqsgoTE?purpose=inline",
          },
          {
            title: "Disaster Monitoring & Response",
            description:
              "Flood, wildfire, landslide, and natural-disaster observation and reporting.",
            image:
              "https://images.openai.com/static-rsc-4/c36dYdbSKx460lSu4hCJEAoJ-EuuYtumYpa_lsmo7ZUv8b8tMYPK_AAn413LF2F48fWjmw9TbpJqzGQ-e4wYGELxcbmXMxrne4Be9k3k-2U1yONUROqpPPzx6J39plq75lqaP6oFtqDUSOQabCna5__nU0o27kzvWtlg-6R4hM8?purpose=inline",
          },
          {
            title: "Space Sustainability & Compliance",
            description:
              "Space debris awareness, orbital sustainability records, and international compliance.",
            image:
              "https://images.openai.com/static-rsc-4/MPIaZH5XDic8NLpjIBx-Ky48XM5SrtYYkhe_vi-1k1znnsotVo53vV5sSRlrrkuvRg0C09TZzYqHgYzcpNf_h5s6zIKo1ngmZfq07vddr9Vo_K3Si1sfCuvFZv3rBwxUoDYCWEcWg4Kwv9q4HkHjKRDNPh590NMheoVCi2FmQF4?purpose=inline",
          },
          {
            title: "Space Research & Education",
            description:
              "Research projects, universities, scientific publications, and workforce training.",
            image:
              "https://images.openai.com/static-rsc-4/ZW4Kf2LmJX-uTX4LM_AEE7zss6KTHH4xUdK8GU3kSHpTK4zZhUHa0V1WQkCUjVvFEQs8q8tRSMDqTS5LieoPu3qnRuiwdP1wCW8Mb-mBGlFgp9g2uoVj69TpT2chZ9DIBbo5w3ZqVBmA9CSlsvIvdMeDynpj21SWeWsWcyi20e8?purpose=inline",
          },
          {
            title: "International Space Cooperation",
            description:
              "International partnerships, satellite data-sharing agreements, and collaboration records.",
            image:
              "https://images.openai.com/static-rsc-4/owUvzza4Se8kNZUm8YlGwft0gh_1I4B5wttL2r_sVFf0ofwejafmyCdref_c-Uih9EygYbTDwWJpIqOiGbCKQuUlIvOn_eMip34XX0TQDwwau1Y4OzHDYEOm2pBcoHOxNqrUwzmTM1eG0DBgL3FswHUiw8g-jL_QTszNkBYjraU?purpose=inline",
          },
        ],
      },
    ],
  },
  "defense-enterprise-suite": governmentProductSection(
    "Defense Enterprise Suite",
    governmentProductDescriptions["Defense Enterprise Suite"],
  ),
  "municipal-os": governmentProductSection(
    "Municipal OS",
    governmentProductDescriptions["Municipal OS"],
  ),
  "police-citizen-connect": governmentProductSection(
    "Police Citizen Connect",
    governmentProductDescriptions["Police Citizen Connect"],
  ),
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
    title: "Security & Trust",
    description: "Review backend, frontend, and infrastructure security guidance.",
    category: "resources",
    href: "/security",
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
