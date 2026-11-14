export type Segment = { title: string; blurb: string; href: string; emoji: string };
export type SegmentGroup = { id: string; label: string; intro: string; items: Segment[] };

export const SEGMENT_GROUPS: SegmentGroup[] = [
  {
    id: "local",
    label: "Local services & hospitality",
    intro: "Walk-ins, bookings and calls from people nearby.",
    items: [
      { title: "Coffee shops & cafés", blurb: "Maps visibility, foot traffic, online orders", href: "/for/coffee-shops", emoji: "☕" },
      { title: "Restaurants", blurb: "Reservations, delivery and local search", href: "/for/restaurants", emoji: "🍽️" },
      { title: "Hair & beauty salons", blurb: "New bookings, repeat clients, reviews", href: "/for/hair-salons", emoji: "✂️" },
      { title: "Barbershops", blurb: "Chairs filled, regulars retained", href: "/for/barbershops", emoji: "💈" },
      { title: "Nail salons", blurb: "Appointments and local reach", href: "/for/nail-salons", emoji: "💅" },
      { title: "Pet groomers & vets", blurb: "Map pack ranking, bookings", href: "/for/pet-groomers", emoji: "🐾" },
      { title: "Fitness studios & gyms", blurb: "Trial sign-ups, memberships", href: "/for/fitness-studios", emoji: "🏋️" },
      { title: "Yoga studios", blurb: "Class bookings and community", href: "/for/yoga-studios", emoji: "🧘" },
      { title: "Dentists", blurb: "New patients from local search", href: "/for/dentists", emoji: "🦷" },
      { title: "Cleaning services", blurb: "Quote requests and repeat contracts", href: "/for/cleaning-services", emoji: "🧼" },
      { title: "Plumbers", blurb: "Emergency calls and local leads", href: "/for/plumbers", emoji: "🔧" },
      { title: "Electricians", blurb: "Qualified leads, local trust", href: "/for/electricians", emoji: "⚡" },
    ],
  },
  {
    id: "startups",
    label: "Startups, freelancers & professionals",
    intro: "Find your first customers and build a brand that converts.",
    items: [
      { title: "Startups", blurb: "User acquisition on a lean budget", href: "/for/startups", emoji: "🚀" },
      { title: "Freelancers & consultants", blurb: "Personal brand, inbound leads", href: "/for/freelancers", emoji: "🧑‍💻" },
      { title: "Real estate agents", blurb: "Listings, leads and local authority", href: "/for/real-estate-agents", emoji: "🏡" },
    ],
  },
  {
    id: "growth",
    label: "Growing & multi-location brands",
    intro: "Scale what works across locations, markets and teams.",
    items: [
      { title: "Growing businesses", blurb: "From local to regional growth", href: "/for/medium-business", emoji: "📈" },
      { title: "Multi-location", blurb: "Consistent local presence at scale", href: "/for/multi-location", emoji: "📍" },
      { title: "Enterprise & agencies", blurb: "White-label and large-scale programs", href: "/for/enterprise", emoji: "🏢" },
    ],
  },
];
