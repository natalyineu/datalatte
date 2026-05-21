const BASE = "https://datalatte.pro";

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "OnlineBusiness"],
    "@id": `${BASE}/#business`,
    name: "DataLatte",
    url: BASE,
    logo: `${BASE}/icon`,
    image: `${BASE}/opengraph-image`,
    description:
      "Data-driven digital marketing for local small businesses in the US, UK, Australia, and Canada. Google Ads, Meta Ads, Local SEO, Google Business Profile optimization, and AI marketing automation — run by an ex-agency strategist.",
    email: "hi@datalatte.pro",
    priceRange: "$$",
    // Remote / online service — deliberately no physical address (serves US/UK/AU/CA)
    hasMap: `${BASE}/contact`,
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Australia" },
      { "@type": "Country", name: "Canada" },
    ],
    serviceType: [
      "Google Ads Management",
      "Meta Ads Management",
      "TikTok Ads Management",
      "Google Business Profile Optimization",
      "Local SEO",
      "Content Marketing",
      "Reputation Management",
      "Conversion Rate Optimisation",
      "Video Marketing",
      "Marketing Analytics",
      "Email Marketing",
      "Social Media Marketing",
      "AI Marketing Automation",
      "Website & Landing Page Design",
    ],
    knowsLanguage: ["en-US", "en-GB"],
    sameAs: [
      "https://www.linkedin.com/company/datalattepro",
      "https://www.instagram.com/datalatte.pro",
    ],
    founder: {
      "@type": "Person",
      name: "Nataliia Makota",
      url: `${BASE}/about`,
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    url: BASE,
    name: "DataLatte",
    description: "Data-driven local marketing for small businesses",
    publisher: { "@id": `${BASE}/#business` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${BASE}/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
    inLanguage: ["en-US", "en-GB"],
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE}/#founder`,
    name: "Nataliia Makota",
    jobTitle: "Digital Marketing Consultant & Founder",
    url: `${BASE}/about`,
    email: "hi@datalatte.pro",
    worksFor: { "@id": `${BASE}/#business` },
    alumniOf: [
      { "@type": "Organization", name: "OMD" },
      { "@type": "Organization", name: "Dentsu" },
      { "@type": "Organization", name: "BBDO" },
      { "@type": "Organization", name: "GroupM" },
    ],
    knowsAbout: [
      "Google Ads", "Meta Ads", "Local SEO", "Programmatic Advertising",
      "Marketing Analytics", "Email Marketing", "Marketing Automation",
      "Brand Strategy", "Media Planning", "Performance Marketing",
    ],
    sameAs: [
      "https://www.linkedin.com/company/datalattepro",
      "https://www.instagram.com/datalatte.pro",
    ],
  };
}

export function serviceSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    provider: { "@id": `${BASE}/#business` },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Australia" },
      { "@type": "Country", name: "Canada" },
    ],
    serviceType: name,
    inLanguage: "en",
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
  tags,
  wordCount,
  timeRequired,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  tags?: string[];
  wordCount?: number;
  timeRequired?: string; // ISO 8601 duration e.g. "PT8M"
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    keywords: tags?.join(", "),
    inLanguage: "en-US",
    ...(wordCount ? { wordCount } : {}),
    ...(timeRequired ? { timeRequired } : {}),
    author: {
      "@type": "Person",
      "@id": `${BASE}/#founder`,
      name: "Nataliia Makota",
      url: `${BASE}/about`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE}/#business`,
      name: "DataLatte",
      url: BASE,
      logo: { "@type": "ImageObject", url: `${BASE}/opengraph-image` },
    },
    image: image ? (image.startsWith("http") ? image : `${BASE}${image}`) : `${BASE}/opengraph-image`,
    isPartOf: { "@id": `${BASE}/#website` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}
