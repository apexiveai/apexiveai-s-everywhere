const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "https://commu-api.apexiveai.com/api"
).replace(/\/+$/, "");

export type SecurityGuardInquiryPayload = {
  full_name: string;
  organization?: string;
  phone: string;
  email?: string;
  guard_level: string;
  personnel_count: number;
  inquiry?: string;
  consent_given: boolean;
  website?: string;
};

export async function submitSecurityGuardInquiry(
  payload: SecurityGuardInquiryPayload,
): Promise<{ id: number; message: string }> {
  const response = await fetch(`${API_BASE}/security-guards/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      typeof data?.detail === "string"
        ? data.detail
        : "Unable to submit your service inquiry. Please try again.",
    );
  }

  return data as { id: number; message: string };
}
