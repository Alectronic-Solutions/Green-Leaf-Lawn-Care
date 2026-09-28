import { site } from "@/config/site";
import { track } from "@/lib/analytics";

// Static hosting has no server, so forms post straight to a form service
// configured in src/config/site.ts (Web3Forms, Formspree, or anything that
// accepts JSON). With no endpoint set, the site runs in demo mode: the
// submission is simulated and nothing leaves the browser.

export type LeadKind = "quote" | "contact" | "careers";

export type LeadResult = { ok: true; demo: boolean } | { ok: false; error: string };

const LAST_LEAD_KEY = "gl-last-lead";

export async function submitLead(
  kind: LeadKind,
  fields: Record<string, string>,
  /** Honeypot value. Real people never fill the hidden field. */
  trap = ""
): Promise<LeadResult> {
  if (trap) return { ok: true, demo: true };

  const payload = {
    ...(site.forms.accessKey ? { access_key: site.forms.accessKey } : {}),
    subject: `New ${kind} request from ${fields.name || "the website"}`,
    from_name: site.name,
    form: kind,
    ...fields,
  };

  let result: LeadResult;
  if (!site.forms.endpoint) {
    await new Promise((r) => setTimeout(r, 700));
    result = { ok: true, demo: true };
  } else {
    try {
      const res = await fetch(site.forms.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      result = res.ok
        ? { ok: true, demo: false }
        : { ok: false, error: "The form service did not accept the request." };
    } catch {
      result = { ok: false, error: "We could not reach the server. Check your connection and try again." };
    }
  }

  if (result.ok) {
    track(`${kind}_submit`, { service: fields.service ?? "" });
    try {
      sessionStorage.setItem(LAST_LEAD_KEY, JSON.stringify({ kind, ...fields }));
    } catch {
      // Private mode or blocked storage: the thank-you page falls back to
      // generic copy.
    }
  }
  return result;
}

/** The last submitted lead as a JSON string, for the thank-you page. */
export function readLastLeadRaw(): string | null {
  try {
    return sessionStorage.getItem(LAST_LEAD_KEY);
  } catch {
    return null;
  }
}
