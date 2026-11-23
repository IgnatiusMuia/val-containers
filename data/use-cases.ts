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

const img = (file: string, alt: string) => ({
  src: `/media/images/${file}`,
  alt,
});

export const useCases: UseCase[] = [
  {
    slug: "secure-storage",
    title: "Secure storage that shows up on a truck",
    shortTitle: "Secure storage",
    eyebrow: "Storage",
    summary:
      "Lockable, weather-tight steel storage for stock, tools and equipment — delivered after stock and site access are confirmed.",
    intro:
      "A shipping container is the simplest secure room you can buy. It arrives finished, locks properly, and can be moved when the lease ends. For retailers holding stock, contractors protecting tools, or farms storing inputs, it removes the cost and delay of building a store.",
    image: img("yard/container-stack.jpg", "Stacked used shipping containers at the Nairobi yard"),
    gallery: [
      img("yard/container-stack-high-cube.jpg", "Stacked high cube containers at the yard"),
      img("delivery/container-on-truck.jpg", "Container loaded on a flatbed truck for delivery"),
      img("yard/container-20ft-red.jpg", "Red 20ft shipping container on the ground at the yard"),
    ],
    sizes: ["20ft", "40ft", "40ft HC"],
    fromPrice: 185000,
    timeline: "Delivery scheduled after stock and site access are confirmed",
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
      "Insulated, wired and lockable offices built for site work, then moved to the next project when the job is done.",
    intro:
      "A container office gives a project team a proper base from week one. Windows, lighting, power and a steel door are installed before delivery, so your team can start work the day the crane sets it down. When the project ends, the office moves.",
    image: img("interiors/office-interior.jpg", "Finished container office interior with glass doors and timber floor"),
    gallery: [
      img("yard/kiosk-two-storey.jpg", "Two-storey container office structure with grey cladding"),
      img("yard/kiosk-shell-orange.jpg", "Orange and black container shell before office fit-out"),
      img("yard/kiosk-row-orange.jpg", "Orange container office units with roller shutters"),
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
    image: img("homes/container-home-exterior.jpg", "Container home exterior with a timber veranda"),
    gallery: [
      img("interiors/container-home-kitchen.jpg", "Container home kitchen with cabinets and tiled walls"),
      img("yard/container-stack-high-cube.jpg", "High cube containers used as the base for conversions"),
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
    image: img("yard/kiosk-row-red.jpg", "Red container retail kiosks with white roller shutters"),
    gallery: [
      img("yard/kiosk-row-black.jpg", "Black container kiosks with roller shutters"),
      img("yard/kiosk-row-blue.jpg", "Blue container kiosks with roller shutters"),
      img("yard/kiosk-row-patterned.jpg", "Patterned container kiosks in green, white and yellow"),
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
      "Refrigerated container options for produce, meat, dairy and flowers, with power requirements confirmed before delivery.",
    intro:
      "A refrigerated container is a cold room with wheels. It can sit at a farm, a market or a distribution yard, holding produce at a stable setpoint without building a permanent cold room. The catch is power: most reefers need 3-phase supply.",
    image: img(
      "photo-coming-soon.jpg",
      "Cold storage container photos coming soon — ask the yard for current reefer photos",
    ),
    gallery: [
      img(
        "photo-coming-soon.jpg",
        "Cold storage container photos coming soon — ask the yard for current reefer photos",
      ),
    ],
    sizes: ["20ft", "40ft HC"],
    fromPrice: 1250000,
    timeline: "Lead time confirmed against current reefer stock",
    features: [
      {
        title: "Deep-freeze to ambient",
        body: "Working units hold setpoints from −30 °C to +25 °C, depending on the model and condition.",
      },
      {
        title: "Test sheet on request",
        body: "Ask for the current cooling-unit test sheet and power requirements before you commit.",
      },
      {
        title: "Sealed cargo envelope",
        body: "Insulated panels, door gaskets and an aluminium T-floor are part of the inspection. Ask for current notes on the exact unit.",
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
    image: img("yard/kiosk-row-patterned.jpg", "Patterned container kiosks in green, white and yellow"),
    gallery: [
      img("yard/kiosk-two-storey.jpg", "Two-storey container structure with grey cladding"),
      img("yard/kiosk-row-orange.jpg", "Orange container kiosks with roller shutters"),
      img("yard/kiosk-row-blue.jpg", "Blue container kiosks with roller shutters"),
    ],
    sizes: ["20ft", "40ft"],
    fromPrice: 520000,
    timeline: "2–4 weeks fabrication; event timelines confirmed on enquiry",
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
