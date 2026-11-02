export type FaqItem = { cat: string; q: string; a: string };

export const FAQ_CATS = ["Pricing and payment", "Placement and disclosure", "Process", "Results", "Policies"] as const;

export const ADVERTISE_FAQ: FaqItem[] = [
  // Pricing and payment
  { cat: "Pricing and payment", q: "How much does a placement cost?", a: "Starting prices, one time, in US dollars: a sponsored mention from $150, a sponsored section from $300, a sponsored article from $600. The final quote depends on the article, the length and how much research the item needs. We confirm the price in writing before any work starts." },
  { cat: "Pricing and payment", q: "Are prices one-time or recurring?", a: "One time per placement. There are no renewal or hosting fees. The placement stays live for as long as the article is published." },
  { cat: "Pricing and payment", q: "What does the price include?", a: "Writing or adapting the copy, checking the facts against your public pages, the Sponsored label, rel=\"sponsored\" on the link, publication, and up to two rounds of edits to the wording before it goes live." },
  { cat: "Pricing and payment", q: "Do you offer packages or discounts?", a: "Yes. The Partner pack is three sponsored mentions across three related articles for $400 (instead of $450). The Launch pack is one sponsored article plus two mentions for $850 (instead of $900). For a larger series, ask for a quote." },
  { cat: "Pricing and payment", q: "How do I pay?", a: "We invoice in US dollars. You can pay by Wise, Revolut, PayPal or bank transfer. The invoice is sent after you approve the wording, and we publish once payment is confirmed or the payment terms are agreed." },
  { cat: "Pricing and payment", q: "Can you invoice a company? Do you provide tax forms?", a: "Yes. We can invoice a registered company or an individual, whichever your finance team needs. Tell us the legal name, address, tax ID and any purchase-order number. If your finance team needs a specific tax form for a non-US supplier, tell us which one and we will provide what applies." },
  // Placement and disclosure
  { cat: "Placement and disclosure", q: "Is a sponsored placement a paid link?", a: "A placement can include a link to your site. Every paid link is marked rel=\"sponsored\", which is what Google's guidelines ask for, so it works as a clearly labelled advertisement and as a referral path for readers, not as a ranking trick." },
  { cat: "Placement and disclosure", q: "How is sponsored content disclosed?", a: "Each placement carries a visible \"Sponsored\" label next to it, on desktop and mobile. In the US, the FTC's Endorsement Guides (16 CFR Part 255) require a clear and conspicuous disclosure of a paid connection, and we apply the same rule to every placement." },
  { cat: "Placement and disclosure", q: "Can I choose the article?", a: "Yes. Tell us the article you have in mind or let us suggest the best fit from our guides. We confirm that the placement suits the article and its readers, and we may propose a better one." },
  { cat: "Placement and disclosure", q: "Can I appear in several articles?", a: "Yes. Many advertisers choose two or three related guides. Each placement is written for its article, so the text is not repeated word for word." },
  { cat: "Placement and disclosure", q: "Can you keep competitors out of the article?", a: "No. We do not remove competitors from a comparison because someone paid. If exclusivity matters to you, ask about it before booking and we will tell you what is realistic." },
  { cat: "Placement and disclosure", q: "How long does a placement stay up?", a: "For as long as the article is published. If it becomes inaccurate we contact you before changing or removing it." },
  { cat: "Placement and disclosure", q: "Can I change or remove my placement later?", a: "Yes, tell us. Factual corrections such as a new price or a renamed plan are made promptly. A larger rewrite is quoted separately." },
  // Process
  { cat: "Process", q: "How long does it take?", a: "We reply within two business days. A mention or a section goes live within three business days of your approval of the wording. A sponsored article usually takes about two weeks because we research and write it." },
  { cat: "Process", q: "What do you need from me?", a: "Your product name, the URL for the link, the key facts you want readers to know (with a public page that supports them), your target market, and the article you have in mind. UTM parameters on the link are welcome and we keep them intact." },
  { cat: "Process", q: "Can I write the copy myself?", a: "You can send key facts, a draft or approved claims. We rewrite for accuracy and tone, check the facts against your public pages, and send you the final wording before it goes live." },
  { cat: "Process", q: "Do you work with agencies on behalf of brands?", a: "Yes. Tell us which brand the placement is for and who approves the wording and the payment. We invoice the party you name." },
  // Results
  { cat: "Results", q: "Do you guarantee traffic, rankings or sales?", a: "No, and nobody honest can. We tell you where the placement sits and what the page earns in search so you can judge the fit." },
  { cat: "Results", q: "What numbers can you show me?", a: "Search Console figures for the article you are considering, and our overall impressions. Screenshots are available on request, and after publication we can share how the page performs." },
  { cat: "Results", q: "How can I measure results?", a: "Use a UTM-tagged link and watch the referral traffic in your own analytics. Readers who click a sponsored link usually arrive already comparing options, so judge the result on the quality of visits as well as the count." },
  // Policies
  { cat: "Policies", q: "What happens if my claims cannot be verified?", a: "We cut or soften them. A claim we cannot support from a public source does not run, whoever is paying for it." },
  { cat: "Policies", q: "What categories do you review carefully?", a: "Gambling, adult content, crypto trading promotions and health claims are reviewed case by case. We also need to be able to verify that the product exists and works as described. If a request does not suit our readers, we say so." },
  { cat: "Policies", q: "Do you take placements outside the US?", a: "Yes. Our readers are mostly in the US, UK, Canada and Australia, and we can phrase and price placements for any of those markets." },
];
