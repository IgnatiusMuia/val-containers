export interface Testimonial {
  name: string;
  location: string;
  role: string;
  quote: string;
  image: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    name: "Wanjiku M.",
    location: "Ruiru",
    role: "20ft retail kiosk",
    quote:
      "The kiosk arrived with the shutter, counter and lights already done. We opened the next morning. What sold me was the condition report and the fact that the price on the website was the price I paid.",
    image: "/testimonials/wanjiku-m.jpg",
    rating: 5,
  },
  {
    name: "Otieno K.",
    location: "Kisumu",
    role: "40ft dry container",
    quote:
      "Buying from Nairobi felt risky until they sent photos of the exact unit and the CSC plate. Delivery took two days and the driver called before arriving. No drama, no extra charges at the gate.",
    image: "/testimonials/otieno-k.jpg",
    rating: 5,
  },
  {
    name: "Fatuma A.",
    location: "Mombasa",
    role: "20ft refrigerated container",
    quote:
      "They ran the reefer for hours and sent me the temperature test sheet before I paid a shilling. My fish stock holds overnight without stress. Worth the trip to the yard.",
    image: "/testimonials/fatuma-a.jpg",
    rating: 5,
  },
  {
    name: "David N.",
    location: "Nakuru",
    role: "20ft site office",
    quote:
      "We needed an office for a road project in three weeks. Val had the unit wired, windows in and AC provision done on time. The team moved it to our second site without a scratch.",
    image: "/testimonials/david-n.jpg",
    rating: 5,
  },
  {
    name: "Grace W.",
    location: "Machakos",
    role: "40ft container home",
    quote:
      "I was nervous about a container home feeling like a box. The high cube with insulation and proper windows feels like a small apartment. The quote was clear from day one.",
    image: "/testimonials/grace-w.jpg",
    rating: 5,
  },
];
