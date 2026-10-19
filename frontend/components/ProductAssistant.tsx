"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { apiRequest } from "@/lib/api";

type Product = {
  code: string;
  name: string;
  description: string;
};

type Message = {
  role: "assistant" | "user";
  content: string;
  source?: string;
};

const verifiedProducts: Product[] = [
  {
    code: "TRADEMARK",
    name: "Trademark AI",
    description:
      "AI-assisted review that compares trademark documents and logos, with visual matching and conflict analysis.",
  },
  {
    code: "RPA",
    name: "RPA Automation",
    description:
      "Robotic process automation for automating repetitive business processes with intelligent workflows.",
  },
  {
    code: "COMMUNITY",
    name: "Apexive AI Community",
    description:
      "The site provides forums, articles, projects, resources, a community dashboard, directory search, and a clone-detector section. Some sections explicitly require an external service before their advertised analysis can run.",
  },
  {
    code: "WORKFORCE",
    name: "Workforce AI",
    description:
      "Workforce AI appears as a configured integration point in this website. A detailed product description is not present in the current product catalog, so this assistant cannot verify its specific functions yet.",
  },
  {
    code: "MNA",
    name: "M&A AI",
    description:
      "M&A AI appears as a configured integration point in this website. A detailed product description is not present in the current product catalog, so this assistant cannot verify its specific functions yet.",
  },
];

const burmeseDescriptions: Record<string, string> = {
  TRADEMARK:
    "Trademark စာရွက်စာတမ်းများနဲ့ logo များကို AI အကူအညီဖြင့် နှိုင်းယှဉ်စစ်ဆေးပြီး အမြင်ပုံစံတူညီမှုနဲ့ ပဋိပက္ခဖြစ်နိုင်မှုကို သုံးသပ်ပေးတဲ့ workflow ဖြစ်ပါတယ်။",
  RPA:
    "ထပ်ခါတလဲလဲ လုပ်ရတဲ့ business process များကို intelligent workflow များနဲ့ အလိုအလျောက်လုပ်ဆောင်ပေးတဲ့ Robotic Process Automation ဖြစ်ပါတယ်။",
  COMMUNITY:
    "ဒီ website မှာ Forums, Articles, Projects, Resources, Dashboard, Directory Search နဲ့ Clone Detector section တွေ ပါဝင်ပါတယ်။ Clone detection analysis အချို့ကိုတော့ ပြင်ပ service ချိတ်ဆက်ပြီးမှ အသုံးပြုနိုင်ပါတယ်။",
  WORKFORCE:
    "Workforce AI ကို integration point အဖြစ်သာ configure လုပ်ထားတာ တွေ့ရပါတယ်။ Product ရဲ့ အတိအကျလုပ်ဆောင်ချက် description မရှိသေးတဲ့အတွက် ဒီ chat က မခန့်မှန်းပေးပါဘူး။",
  MNA:
    "M&A AI ကို integration point အဖြစ်သာ configure လုပ်ထားတာ တွေ့ရပါတယ်။ Product ရဲ့ အတိအကျလုပ်ဆောင်ချက် description မရှိသေးတဲ့အတွက် ဒီ chat က မခန့်မှန်းပေးပါဘူး။",
};

const normalize = (value: string) =>
  value.toLocaleLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, " ");

function makeReply(question: string, catalog: Product[]): Message {
  const query = normalize(question);
  const products = [...verifiedProducts, ...catalog];
  const uniqueProducts = Array.from(
    new Map(products.map((product) => [product.code, product])).values(),
  );
  const tokens = query.split(/\s+/).filter((token) => token.length > 1);
  const ranked = uniqueProducts
    .map((product) => {
      const text = normalize(`${product.name} ${product.code} ${product.description}`);
      const score =
        (text.includes(query) ? 5 : 0) +
        tokens.reduce((total, token) => total + (text.includes(token) ? 1 : 0), 0);
      return { product, score };
    })
    .sort((a, b) => b.score - a.score);
  const top = ranked[0];
  const specificallyAskedAbout = uniqueProducts.find((product) => {
    const name = normalize(product.name);
    const code = normalize(product.code);
    return query.includes(name) || query.includes(code);
  });
  const isOverview =
    /what|which|sell|product|service|offer|ဘာ|ဘယ်|ရောင်း|လုပ်ဆောင်|အဓိက/.test(query);
  const burmese = /[\u1000-\u109f]/u.test(question);

  if (specificallyAskedAbout || (top && top.score >= 2)) {
    const product = specificallyAskedAbout ?? top!.product;
    return {
      role: "assistant",
      content: `${product.name}: ${
        burmese
          ? burmeseDescriptions[product.code] ?? product.description
          : product.description
      }`,
      source: "Product catalog",
    };
  }

  if (isOverview || tokens.length === 0) {
    return {
      role: "assistant",
      content: `${
        burmese
          ? "ဒီ website နဲ့ product catalog ထဲမှာ အတည်ပြုနိုင်တဲ့အချက်တွေကတော့:\n"
          : "Here is what I can verify from this website:\n"
      }${uniqueProducts
        .map(
          (product) =>
            `• ${product.name}: ${
              burmese
                ? burmeseDescriptions[product.code] ?? product.description
                : product.description
            }`,
        )
        .join("\n")}`,
      source: "Website and product catalog",
    };
  }

  return {
    role: "assistant",
    content:
      burmese
        ? "ဒီ website မှာ configure လုပ်ထားတဲ့ product အချက်အလက်တွေအပေါ်မူတည်ပြီးသာ ဖြေဆိုနိုင်ပါတယ်။ ဒီမေးခွန်းအတွက် အတည်ပြုထားတဲ့ description မတွေ့ပါ။ SuperAdmin → Solutions မှာ product name နဲ့ မှန်ကန်တဲ့ description ထည့်ပေးပါ။"
        : "I can only answer from product details configured on this website. I couldn't find a verified description for that question. Add the product name and an accurate description under SuperAdmin → Solutions, or ask about Trademark AI, RPA Automation, Workforce AI, M&A AI, or the Community.",
    source: "No matching catalog information",
  };
}

export default function ProductAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [catalogUnavailable, setCatalogUnavailable] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "မင်္ဂလာပါ။ ဒီ website မှာ အတည်ပြုဖော်ပြထားတဲ့ product နဲ့ လုပ်ဆောင်ချက်တွေကို မေးနိုင်ပါတယ်။ မသိတဲ့အချက်ကို ခန့်မှန်းမပြောပါဘူး။",
      source: "Apexive product guide",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    apiRequest<{ items: Product[] }>("/catalog/solutions")
      .then((result) => {
        if (active) {
          setCatalog(result.items);
          setCatalogUnavailable(false);
        }
      })
      .catch(() => {
        if (active) setCatalogUnavailable(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages, open]);

  const promptSuggestions = [
    "ဘာတွေ ရောင်းတာလဲ?",
    "Trademark AI ကဘာလုပ်ပေးလဲ?",
    "RPA ရဲ့ အဓိကလုပ်ဆောင်ချက်ကဘာလဲ?",
  ];

  function sendMessage(event?: FormEvent<HTMLFormElement>, preset?: string) {
    event?.preventDefault();
    const text = (preset ?? question).trim();
    if (!text) return;

    setMessages((current) => [
      ...current,
      { role: "user", content: text },
      makeReply(text, catalog),
    ]);
    setQuestion("");
  }

  return (
    <div className="product-assistant">
      {open ? (
        <section className="assistant-panel" aria-label="Product guide chat">
          <header className="assistant-header">
            <span className="assistant-icon"><Bot size={19} /></span>
            <span>
              <strong>Product Guide ChatAI</strong>
              <small>Answers grounded in this website&apos;s catalog</small>
            </span>
            <button type="button" aria-label="Close chat" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </header>

          <div className="assistant-messages" aria-live="polite">
            {catalogUnavailable && (
              <p className="assistant-catalog-warning" role="status">
                Live product catalog is unavailable. Answers are limited to verified website descriptions.
              </p>
            )}
            {messages.map((message, index) => (
              <article className={`assistant-message is-${message.role}`} key={`${index}-${message.role}`}>
                <p>{message.content}</p>
                {message.source && <small>{message.source}</small>}
              </article>
            ))}
            <div ref={endRef} />
          </div>

          {messages.length === 1 && (
            <div className="assistant-suggestions">
              {promptSuggestions.map((suggestion) => (
                <button type="button" key={suggestion} onClick={() => sendMessage(undefined, suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form className="assistant-form" onSubmit={sendMessage}>
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="မေးခွန်းရေးပါ..."
              aria-label="Ask about Apexive products"
            />
            <button type="submit" aria-label="Send message" disabled={!question.trim()}>
              <Send size={17} />
            </button>
          </form>
          <p className="assistant-disclaimer">
            Product descriptions come from this website&apos;s configured catalog. No generative AI service is connected, and missing features are not invented.
          </p>
        </section>
      ) : (
        <button className="assistant-launcher" type="button" onClick={() => setOpen(true)}>
          <MessageCircle size={19} />
          <span>Ask about our products</span>
        </button>
      )}
    </div>
  );
}
