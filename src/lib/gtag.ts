declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: Record<string, unknown>) => void;
  }
}

type GtagParams = Record<string, string | number | boolean>;

function track(event: string, params?: GtagParams) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, params as Record<string, string>);
  }
}

export const gtag = {
  // ── Conversions ─────────────────────────────────────────────────────────
  contactFormSubmitted: (formType: "explore" | "ready", niche?: string) => {
    track("contact_form_submitted", { form_type: formType, ...(niche && { niche }) });
    // GA4 recommended event name; mark ONE of the two as a Key event in GA4 to avoid double counting
    track("generate_lead", { form_type: formType, ...(niche && { niche }) });
  },

  emailSubscribed: (source: string) =>
    track("email_subscribed", { source }),

  // ── CTA clicks ──────────────────────────────────────────────────────────
  freeAuditClicked: (source: string) =>
    track("free_audit_clicked", { source }),

  // ── Link clicks (fired by EventTracker, one named event per destination type) ──
  bookCallClicked: (page: string) => track("book_call_clicked", { page }),
  emailLinkClicked: (page: string) => track("email_link_clicked", { page }),
  phoneLinkClicked: (page: string) => track("phone_link_clicked", { page }),
  contactCtaClicked: (page: string, label: string) => track("contact_cta_clicked", { page, label }),
  serviceLinkClicked: (page: string, destination: string) => track("service_link_clicked", { page, destination }),

  // ── Scroll depth (separate event names so they can be counted without custom dimensions) ──
  scrollDepth: (percent: 25 | 50 | 75, page: string) => track(`scroll_${percent}`, { page }),

  // ── Popups ──────────────────────────────────────────────────────────────
  exitIntentShown: (trigger: "mouse_leave" | "scroll_60" | "timer_40s") =>
    track("exit_intent_popup_shown", { trigger }),

  exitIntentDismissed: () =>
    track("exit_intent_popup_dismissed"),

  floatingCtaShown: () =>
    track("floating_cta_shown"),

  floatingCtaDismissed: () =>
    track("floating_cta_dismissed"),

  // ── Chat widget ──────────────────────────────────────────────────────────
  chatWidgetOpened: () =>
    track("chat_widget_opened"),

  chatMessageSent: (messageIndex: number) =>
    track("chat_message_sent", { message_index: messageIndex }),

  chatLeadCaptured: () => track("chat_lead_captured"),

  // ── Tools ────────────────────────────────────────────────────────────────
  budgetCalculatorCompleted: (budget: number, niche: string, goal: string) =>
    track("budget_calculator_completed", { budget, niche, goal }),

  budgetCalculatorCopied: (budget: number) =>
    track("budget_calculator_copied", { budget }),

  budgetCalculatorShared: (network: string, budget: number) =>
    track("budget_calculator_shared", { network, budget }),

  budgetCalculatorCtaClicked: (budget: number, niche: string) =>
    track("budget_calculator_cta_clicked", { budget, niche }),

  seoGraderSubmitted: (niche: string, city: string) =>
    track("seo_grader_submitted", { niche, city }),

  checklistCompleted: (slug: string) =>
    track("checklist_completed", { checklist_slug: slug }),

  // ── Content ──────────────────────────────────────────────────────────────
  radarSignalViewed: (category: string, impact: string, slug: string) =>
    track("radar_signal_viewed", { category, impact, slug }),
};
