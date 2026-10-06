/**
 * Single place that writes every inbound lead (contact form, newsletter signup,
 * direct e-mail) to Supabase `contact_submissions`. Server-side only (service-role key).
 * Returns true only if the row was stored, so callers can raise an alert when it was not.
 */
export interface LeadRow {
  email: string;
  name?: string | null;
  niche?: string | null;
  message?: string | null;
  form_type: string;          // explore | ready | newsletter | direct_email
  status?: string;            // default "new"
  notes?: string | null;      // e.g. signup source, message id
}

export async function saveLead(row: LeadRow): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("CRM save skipped: Supabase env vars missing");
    return false;
  }
  try {
    const res = await fetch(`${url}/rest/v1/contact_submissions`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ status: "new", ...row }),
    });
    if (!res.ok) {
      console.error("CRM save failed:", res.status, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("CRM save error:", err);
    return false;
  }
}
