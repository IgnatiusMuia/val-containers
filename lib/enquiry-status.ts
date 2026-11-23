export const enquiryStatuses = [
  "new",
  "under_review",
  "contacted",
  "awaiting_customer",
  "quotation_discussed",
  "negotiation",
  "converted",
  "closed",
  "cancelled",
] as const;

export type EnquiryStatus = (typeof enquiryStatuses)[number];

export const enquiryStatusLabels: Record<EnquiryStatus, string> = {
  new: "New",
  under_review: "Under review",
  contacted: "Contacted",
  awaiting_customer: "Awaiting customer",
  quotation_discussed: "Quotation discussed",
  negotiation: "Negotiation",
  converted: "Converted",
  closed: "Closed",
  cancelled: "Cancelled",
};
