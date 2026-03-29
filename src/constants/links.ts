export const CONSTANTS = {
  /** Public Lead Agent app — pricing / nav “Contact” send leads here to complete the form. */
  LEAD_AGENT_APP_URL: "https://lead-processing-agent-sandy-omega.vercel.app",
  /** POST JSON lead pings from marketing CTAs (see LeadAgentCtaPing). Agent must allow CORS from this site. */
  get LEAD_AGENT_SUBMIT_API_URL() {
    return `${this.LEAD_AGENT_APP_URL}/api/submit`;
  },
  LOGIN_LINK: "/signin",
  CALCOM_NAMESPACE: "chat-with-manu-demo",
  CALCOM_BRAND_COLOR: "#000000",
  CALCOM_HIDE_EVENT_TYPE_DETAILS: false,
  CALCOM_LAYOUT: "month_view",
  CALCOM_LINK: "manu-arora-vesr9s/chat-with-manu-demo",
};
