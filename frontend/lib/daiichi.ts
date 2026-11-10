
const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://commu-api-ecb2d331.ownkube.app/api"
).replace(/\/+$/, "");

export type DaiichiLeadPayload = {
  full_name: string;
  phone: string;
  email?: string;
  inquiry?: string;
  consent_given: boolean;
  consent_text_version: string;
  website?: string;
};

export type DaiichiLeadResponse = {
  id: number;
  message: string;
};

export type DaiichiEventType = "page_view" | "cta_click";

export async function submitDaiichiLead(
  payload: DaiichiLeadPayload,
): Promise<DaiichiLeadResponse> {
  const response = await fetch(`${API_BASE}/daiichi/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : "Unable to submit your inquiry. Please try again.";
    throw new Error(message);
  }

  return data as DaiichiLeadResponse;
}

export async function trackDaiichiEvent(
  eventType: DaiichiEventType,
  campaignKey = "main",
): Promise<void> {
  try {
    await fetch(`${API_BASE}/daiichi/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: eventType,
        campaign_key: campaignKey,
        page_path: "/partners/daiichi",
      }),
      keepalive: true,
    });
  } catch {
    // Analytics failure must not interrupt the visitor experience.
  }
}
