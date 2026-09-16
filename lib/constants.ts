export const INDUSTRIES = [
  "Insurance",
  "Healthcare",
  "FinTech",
  "Retail",
  "Public sector",
] as const;

export const STACK_OPTIONS = [
  "Next.js",
  "Laravel",
  "React",
  "MySQL",
  "AWS",
  "Auth0",
] as const;

export const TEMPLATE_OPTIONS = [
  { id: "website", label: "Website · numbers first" },
  { id: "editorial", label: "Editorial" },
  { id: "impact", label: "Impact" },
] as const;

export const DUMMY_IMAGES = [
  { src: "/images/nlg-enquiry.jpg", label: "Insurance operations" },
  { src: "/images/claims-portal.jpg", label: "Healthcare corridor" },
  { src: "/images/fintech-kyc.jpg", label: "FinTech desk" },
  { src: "/images/retail-stock.jpg", label: "Retail stockroom" },
  { src: "/images/public-licensing.jpg", label: "Public counter" },
  { src: "/images/broker-appointments.jpg", label: "Broker meeting" },
] as const;

export const CASE_STUDIES_TAG = "case-studies";
export const PUBLIC_REVALIDATE_SECONDS = 60;
