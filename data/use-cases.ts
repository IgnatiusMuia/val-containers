export interface UseCase {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  intro: string;
  image: { src: string; alt: string };
  gallery: { src: string; alt: string }[];
  sizes: string[];
  fromPrice: number;
  timeline: string;
  features: { title: string; body: string }[];
  considerations: { title: string; body: string }[];
  related: string[];
}

const img = (id: string, alt: string) => ({
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`,
  alt,
});

export const useCases: UseCase[] = [
  {
    slug: "secure-storage",
    title: "Secure storage that shows up on a truck",
    shortTitle: "Secure storage",
    eyebrow: "Storage",
    summary:
      "Lockable, weather-tight steel storage for stock, tools and equipment — delivered to your site and ready the same day.",
    intro:
      "A shipping container is the simplest secure room you can buy. It arrives finished, locks properly, and can be moved when the lease ends. For retailers holding stock, contractors protecting tools, or farms storing inputs, it removes the cost and delay of building a store.",
    image: img("1573030889348-c6b0f8b15e40", "Stacked shipping containers used for secure storage under a blue sky"),
    gallery: [
      img("1696324535687-6bb987f50e96", "Steel storage container with locking doors"),
      img("1553413077-190dd305871c", "Warehouse aisle with pallet racking"),
      img("1601108122462-8a69128bb3ce", "Container door and locking bars"),
    ],
    sizes: ["20ft", "40ft", "40ft HC"],
    fromPrice: 185000,
    timeline: "Same-day delivery within Nairobi for units in stock",
    features: [
      {
        title: "One lock, one room",
        body: "Steel walls, a solid floor and lockable doors give you a single controlled access point. Add a lock box or internal cage for high-value stock.",
      },
      {
        title: "Weather-tight by design",
        body: "A wind-and-watertight unit keeps rain and dust out. We check door seals and roof seams before dispatch.",
      },
      {
        title: "Movable, not permanent",
        body: "When the site closes or the lease ends, the container moves with you. No demolition, no lost materials.",
      },
    ],
    considerations: [
      {
        title: "Ground conditions",
        body: "Place on level, compacted ground or concrete plinths. Soft ground will shift under a loaded 40ft unit.",
      },
      {
        title: "Ventilation",
        body: "Condensation forms in sealed steel boxes. Add passive vents for general goods, or a dehumidifier for sensitive stock.",
      },
      {
        title: "Security",
        body: "Fit a heavy-duty padlock and, for high-value goods, a welded lock box. Ask us to quote this with the unit.",
      },
    ],
    related: ["20ft-dry-wind-watertight", "40ft-dry-wind-watertight", "40ft-high-cube-cargo-worthy"],
  },
  {
    slug: "site-offices",
    title: "Site offices that are ready before the site is",
    shortTitle: "Site offices",
    eyebrow: "Site offices",
    summary:
      "Insulated, wired and lockable offices delivered to site in days, not months. Move them to the next project when you are done.",
    intro:
      "A container office gives a project team a proper base from week one. Windows, lighting, power and a steel door are installed before delivery, so your team can start work the day the crane sets it down. When the project ends, the office moves.",
    image: img("1696454595486-bdb174df034e", "Fabricated container office with glazing and a steel walkway"),
    gallery: [
      img("1497366216548-37526070297c", "Insulated office interior with desk and lighting"),
      img("1497366811353-6870744d04b2", "Glass meeting room in a modern office"),
      img("1713950653257-33abeea82b40", "Container door specification plate"),
    ],
    sizes: ["20ft", "40ft"],
    fromPrice: 595000,
    timeline: "2–4 weeks for fabrication, depending on the fit-out",
    features: [
      {
        title: "Insulated for Kenyan heat",
        body: "50 mm insulated walls and ceiling keep the interior usable without overworking an AC unit. Roof ventilation helps too.",
      },
      {
        title: "Wired before delivery",
        body: "LED lights, sockets, a consumer unit and labelled circuits. Your electrician connects the supply, not the whole office.",
      },
      {
        title: "Lockable and mobile",
        body: "Personnel doors, window grilles and a steel shell. Relocate the office with a crane truck between projects.",
      },
    ],
    considerations: [
      {
        title: "Power supply",
        body: "Confirm the supply capacity on site. An office with AC, computers and a kettle may need a dedicated circuit.",
      },
      {
        title: "Placement",
        body: "Leave clearance for the door swing and a step or ramp. The crane needs a straight approach and firm ground.",
      },
      {
        title: "Permits",
        body: "Temporary site offices are usually simpler than permanent buildings, but the host site must still approve placement.",
      },
    ],
    related: ["20ft-site-office", "40ft-site-office", "40ft-high-cube-one-trip"],
  },
  {
    slug: "container-homes",
    title: "Container homes, without the guesswork",
    shortTitle: "Container homes",
    eyebrow: "Container homes",
    summary:
      "A high cube shell gives you a fast, predictable home base — insulated, plumbed and finished with the rooms you actually need.",
    intro:
      "A container home is not a shed with a bed in it. Built properly, it is an insulated steel room with real windows, wiring and plumbing, delivered in weeks rather than months. The savings come from the shell and speed; the comfort comes from the fit-out.",
    image: img("1628394029761-acc83a2a08a6", "Container home with large glazed doors under mature trees"),
    gallery: [
      img("1523351964962-1ee5847816c3", "Modern container home over water with glass doors"),
      img("1693515184806-c94ead5b8400", "Container home on stilts with a timber deck"),
      img("1599813674302-e3b2bc05695f", "Compact bedroom interior with timber ceiling"),
    ],
    sizes: ["40ft HC"],
    fromPrice: 820000,
    timeline: "4–8 weeks depending on finishes and site services",
    features: [
      {
        title: "High cube headroom",
        body: "A 40ft high cube gives 2.70 m internally. Insulation and a ceiling still leave a comfortable room height.",
      },
      {
        title: "Finished interiors",
        body: "Wall lining, flooring, lighting, kitchen and bathroom can all be completed before the unit leaves the yard.",
      },
      {
        title: "Foundation-light",
        body: "Containers need support at the corners and midpoints, not a full slab. That reduces cost and site time.",
      },
    ],
    considerations: [
      {
        title: "Approvals",
        body: "A permanent container home is generally treated like a structure. Confirm county planning and NEMA requirements before you build.",
      },
      {
        title: "Insulation is not optional",
        body: "Steel conducts heat. Without insulation and ventilation, a container becomes uncomfortable at midday.",
      },
      {
        title: "Services",
        body: "Plan water, sewer and power connections early. A container cannot hide mistakes as easily as a masonry build.",
      },
    ],
    related: ["40ft-container-home", "20ft-container-studio", "40ft-high-cube-cargo-worthy"],
  },
  {
    slug: "retail-kiosks",
    title: "Retail kiosks that open the day they land",
    shortTitle: "Retail kiosks",
    eyebrow: "Retail kiosks",
    summary:
      "A lockable, brandable shop with a serving counter and roller shutter — placed on your plot and open for business.",
    intro:
      "A container kiosk is a shop, store room and security box in one. It can be branded on three elevations, fitted with a serving counter and secured with a steel roller shutter. For a roadside trader or a brand testing a new location, it is a low-risk way to start.",
    image: img("1764344815220-2cbf59c95f46", "Container retail unit with a mural and outdoor seating"),
    gallery: [
      img("1529939828339-56039bb75a63", "Container cafe with glazing and an outdoor service area"),
      img("1691481486044-04f12d77a92c", "Container doors and locking bars"),
      img("1696324535687-6bb987f50e96", "Steel container doors"),
    ],
    sizes: ["20ft"],
    fromPrice: 520000,
    timeline: "2–4 weeks for fabrication",
    features: [
      {
        title: "Designed for foot traffic",
        body: "A roller shutter and fold-up counter create a clear service point that secures overnight.",
      },
      {
        title: "Brandable surface",
        body: "Flat steel panels take paint, vinyl and signage well. Plan the brand before the unit is finished.",
      },
      {
        title: "Stock and serve in one",
        body: "The rear of the container becomes your store room, so there is no separate lock-up to rent.",
      },
    ],
    considerations: [
      {
        title: "County approvals",
        body: "Check advertising, trading and land-use rules with the county before placing a kiosk.",
      },
      {
        title: "Power and water",
        body: "A single-phase supply is usually enough for lights, a fridge and a POS. Food service needs more.",
      },
      {
        title: "Placement",
        body: "Orient the shutter away from direct afternoon sun and leave space for customers to stand safely off the road.",
      },
    ],
    related: ["20ft-retail-kiosk", "20ft-dry-one-trip", "20ft-dry-wind-watertight"],
  },
  {
    slug: "cold-storage",
    title: "Cold storage that goes where the harvest is",
    shortTitle: "Cold storage",
    eyebrow: "Cold storage",
    summary:
      "Working reefer containers for produce, meat, dairy and flowers — with temperature-tested cooling units and clear power requirements.",
    intro:
      "A refrigerated container is a cold room with wheels. It can sit at a farm, a market or a distribution yard, holding produce at a stable setpoint without building a permanent cold room. The catch is power: most reefers need 3-phase supply.",
    image: img("1611224097891-83220d09271a", "Refrigerated shipping container with a Carrier cooling unit"),
    gallery: [
      img("1609143739217-01b60dad1c67", "Clean cold storage interior with stacked cartons"),
      img("1595871685450-d5d2e8847a64", "Insulated refrigerated container at the yard"),
      img("1713950653257-33abeea82b40", "Container door specification markings"),
    ],
    sizes: ["20ft", "40ft HC"],
    fromPrice: 1250000,
    timeline: "Available from stock; delivery within 2–3 days",
    features: [
      {
        title: "Deep-freeze to ambient",
        body: "Working units hold setpoints from −30 °C to +25 °C, depending on the model and condition.",
      },
      {
        title: "Tested before sale",
        body: "We run the cooling unit across its range and share the test sheet with the condition report.",
      },
      {
        title: "Sealed cargo envelope",
        body: "Insulated panels, door gaskets and an aluminium T-floor are checked for air leaks and drainage.",
      },
    ],
    considerations: [
      {
        title: "3-phase power",
        body: "Most reefer units need 3-phase, 380–460 V. Confirm the supply with an electrician before you commit.",
      },
      {
        title: "Standby vs. operating",
        body: "A reefer can be used as an insulated box without running the unit, but it will not hold a cold setpoint.",
      },
      {
        title: "Loading discipline",
        body: "Leave air gaps around pallets and do not block the evaporator. A full box loaded tight will warm unevenly.",
      },
    ],
    related: ["20ft-refrigerated", "40ft-high-cube-reefer", "20ft-dry-one-trip"],
  },
  {
    slug: "events-pop-ups",
    title: "Pop-ups, bars and event spaces with a steel backbone",
    shortTitle: "Events & pop-ups",
    eyebrow: "Events",
    summary:
      "Stackable, brandable containers for bars, activations, ticket desks and event back-of-house — installed and removed without a build.",
    intro:
      "Event organisers use containers because they arrive complete, look intentional and leave without a demolition crew. A single 20ft unit can be a bar or ticket desk; stacked units create a two-storey activation. Branding turns the corrugation into part of the design.",
    image: img("1603803325392-7c58cb452a3c", "Colourful stacked containers used as an event structure"),
    gallery: [
      img("1764344815220-2cbf59c95f46", "Container bar with outdoor seating"),
      img("1529939828339-56039bb75a63", "Container cafe unit with service windows"),
      img("1767884163408-fc4fc6b2c0a0", "Colourful stacked containers"),
    ],
    sizes: ["20ft", "40ft"],
    fromPrice: 520000,
    timeline: "2–4 weeks fabrication; short-term hire on request",
    features: [
      {
        title: "Brand-first surfaces",
        body: "Flat panels and corrugation both take vinyl, paint and cut-out signage. Design for the material, not against it.",
      },
      {
        title: "Stackable footprints",
        body: "Containers are designed to stack, opening up two-level bars, VIP decks and compact back-of-house.",
      },
      {
        title: "Fast in, fast out",
        body: "Crane truck delivery and collection keep site time short — useful for pop-ups and temporary leases.",
      },
    ],
    considerations: [
      {
        title: "Event permits",
        body: "Temporary structures still need event approval and a safe layout. Confirm with the venue and county.",
      },
      {
        title: "Power and water",
        body: "Bar and catering units need more power than a retail kiosk. Plan a generator or dedicated supply.",
      },
      {
        title: "Weather",
        body: "Steel roofs get hot and loud in the rain. Insulate ceilings and add shade or a canopy for guest comfort.",
      },
    ],
    related: ["20ft-retail-kiosk", "20ft-dry-one-trip", "40ft-high-cube-one-trip"],
  },
];

export function getUseCase(slug: string) {
  return useCases.find((useCase) => useCase.slug === slug);
}
