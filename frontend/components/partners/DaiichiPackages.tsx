
import React from "react";

const packages = [
  {
    no: "01",
    title: "Life & Family Protection",
    japanese: "定期保険・終身保険・養老保険",
    products: ["定期保険 — Term Life", "終身保険 — Whole Life", "養老保険 — Endowment"],
    description: "Financial protection for family responsibilities, beneficiaries and future planning.",
    icon: "◈",
    category: "LIFE",
  },
  {
    no: "02",
    title: "Medical & Hospital Protection",
    japanese: "総合医療一時金保険",
    products: ["総合医療一時金保険", "入院一時金保険（限定告知型）"],
    description: "Explore hospitalisation, surgery and eligible medical treatment benefits.",
    icon: "✚",
    category: "MEDICAL",
  },
  {
    no: "03",
    title: "Advanced Medical Care",
    japanese: "先進医療保険",
    products: ["先進医療保険"],
    description: "Information about protection against eligible advanced medical treatment costs.",
    icon: "⌬",
    category: "ADVANCED CARE",
  },
  {
    no: "04",
    title: "Critical Illness Protection",
    japanese: "3大疾病・介護・身体障害保険",
    products: [
      "3大疾病所得保障保険",
      "3大疾病・介護・身体障害保険",
      "軽度3大疾病・介護・身体障害保険",
    ],
    description: "Protection concepts involving specified cancer, heart disease, stroke and other defined conditions.",
    icon: "✥",
    category: "CRITICAL ILLNESS",
  },
  {
    no: "05",
    title: "Income Protection",
    japanese: "継続入院所得保障保険",
    products: [
      "継続入院所得保障保険 — 心身サポート",
      "介護・身体障害所得保障保険",
      "「家族」所得保障保険",
    ],
    description: "Explore financial protection against income interruption under specified circumstances.",
    icon: "↗",
    category: "INCOME",
  },
  {
    no: "06",
    title: "Long-Term Care & Dementia",
    japanese: "要支援・介護保険",
    products: [
      "要支援・介護保険",
      "認知症保険",
      "介護・身体障害所得保障保険",
    ],
    description: "Planning information for long-term care, dementia and specified disability needs.",
    icon: "⌂",
    category: "CARE",
  },
  {
    no: "07",
    title: "Women's Health Protection",
    japanese: "女性特定治療保険",
    products: ["女性特定治療保険"],
    description: "Explore specified women's health treatment protection, subject to policy definitions.",
    icon: "✿",
    category: "WOMEN'S HEALTH",
  },
  {
    no: "08",
    title: "Accident & Injury Protection",
    japanese: "特定損傷保険",
    products: ["特定損傷保険"],
    description: "Information about specified injuries such as fractures, joint dislocations and tendon ruptures.",
    icon: "✧",
    category: "ACCIDENT",
  },
  {
    no: "09",
    title: "Education, Savings & Retirement",
    japanese: "こども学資保険・指数連動型個人年金保険",
    products: [
      "こども応援団 Mickey — Children's Education",
      "ステップジャンプ — Indexed Individual Annuity",
    ],
    description: "Explore education funding, long-term savings and retirement preparation.",
    icon: "◇",
    category: "FUTURE PLANNING",
  },
];

export default function DaiichiPackages() {
  return (
    <section
      id="solutions"
      className="relative overflow-hidden bg-[#101B30] px-6 py-24 text-white lg:px-10 lg:py-32"
    >
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#D8B779]/10 blur-[100px]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="h-px w-9 bg-[#D8B779]" />
          <span className="text-[10px] font-semibold tracking-[0.3em] text-[#D8B779]">
            JAPAN-INSPIRED PRODUCT COLLECTION
          </span>
          <span className="h-px w-9 bg-[#D8B779]" />
        </div>

        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-4xl font-light leading-tight sm:text-5xl">
            Nine areas of
            <span className="font-semibold text-[#D8B779]"> protection.</span>
          </h2>
          <p className="mt-6 text-sm leading-8 text-white/60">
            Explore nine product categories organised around the
            Japanese Daiichi Life product lineup. Japanese product
            names are shown as references, not as confirmation of
            Myanmar availability.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((item) => (
            <article
              key={item.no}
              className="group relative flex flex-col border border-white/10 bg-white/[0.035] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#D8B779]/60 hover:bg-white/[0.065] hover:shadow-2xl hover:shadow-black/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-[0.25em] text-[#D8B779]">
                  PACKAGE {item.no}
                </span>
                <span className="text-3xl text-[#D8B779]">{item.icon}</span>
              </div>

              <span className="mt-9 text-[9px] font-semibold tracking-[0.24em] text-white/35">
                {item.category}
              </span>

              <h3 className="mt-3 text-2xl font-medium leading-snug">
                {item.title}
              </h3>

              <p className="mt-4 text-xs leading-6 text-[#D8B779]">
                {item.japanese}
              </p>

              <p className="mt-5 min-h-[72px] text-sm leading-7 text-white/55">
                {item.description}
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="mb-4 text-[9px] font-semibold tracking-[0.2em] text-white/35">
                  JAPAN PRODUCT REFERENCES
                </p>
                <ul className="space-y-3">
                  {item.products.map((product) => (
                    <li
                      key={product}
                      className="flex gap-3 text-xs leading-6 text-white/75"
                    >
                      <span className="text-[#D8B779]">✦</span>
                      <span>{product}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-8">
                <a
                  href="#consultation"
                  className="flex items-center justify-between border border-[#D8B779]/40 px-5 py-4 text-[10px] font-semibold tracking-[0.16em] text-[#E6D0A5] transition hover:bg-[#D8B779] hover:text-[#101B30]"
                >
                  REQUEST INFORMATION
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 border border-[#D8B779]/20 bg-[#D8B779]/[0.06] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="text-2xl text-[#D8B779]">ⓘ</span>
            <div>
              <h3 className="text-sm font-semibold text-[#E6D0A5]">
                Important Product Availability Notice
              </h3>
              <p className="mt-3 text-xs leading-7 text-white/55">
                This collection references products listed by Dai-ichi
                Life Insurance Company in Japan. These are not nine
                confirmed Myanmar insurance plans. Eligibility,
                premiums, coverage, policy terms and availability in
                Myanmar must be verified through Dai-ichi Life Myanmar
                and its approved documentation before any product is
                offered to customers.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-7 text-center text-[10px] leading-6 text-white/35">
          Product reference: Dai-ichi Life Japan official lineup ·
          January 2026 information
        </p>
      </div>
    </section>
  );
}
