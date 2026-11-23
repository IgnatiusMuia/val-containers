export type ContainerType = "plain" | "fabricated" | "refrigerated";
export type ContainerSize = "20ft" | "40ft" | "40ft-hc";
export type ContainerCondition = "new" | "used";

export type ContainerMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; alt: string; poster: string };

export interface ContainerSpecs {
  external: string;
  internal: string;
  tare: string;
  payload: string;
  door: string;
  volume: string;
  floor: string;
  flooring: string;
  ventilation: string;
  extra: { label: string; value: string }[];
}

export interface Container {
  slug: string;
  name: string;
  shortName: string;
  type: ContainerType;
  typeLabel: string;
  size: ContainerSize;
  sizeLabel: string;
  condition: ContainerCondition;
  conditionLabel: string;
  grade: string;
  price: number;
  media: ContainerMedia[];
  photosAreRepresentative?: boolean;
  description: string;
  highlights: string[];
  specs: ContainerSpecs;
  conditionReport: string[];
  included: string[];
  features: string[];
  bestFor: string[];
  featured: boolean;
  addedAt: string;
  stock: number;
  year: number;
  id?: string;
  status?:
    | "available"
    | "reserved"
    | "sold"
    | "unavailable"
    | "inspection";
  reference?: string;
  currency?: string;
  location?: string;
  deliveryInfo?: string;
  refrigerationStatus?: string;
  verifiedAt?: string | null;
  publicationStatus?: "draft" | "published" | "archived";
}

const image = (file: string, alt: string): ContainerMedia => ({
  kind: "image",
  src: `/media/images/${file}`,
  alt,
});

const video = (file: string, alt: string, poster: string): ContainerMedia => ({
  kind: "video",
  src: `/media/videos/${file}`,
  alt,
  poster: `/media/images/${poster}`,
});

const dry20 = {
  external: "6.06 m × 2.44 m × 2.59 m",
  internal: "5.90 m × 2.35 m × 2.39 m",
  tare: "2,230 kg",
  payload: "28,180 kg",
  door: "2.34 m wide × 2.28 m high",
  volume: "33.2 m³",
  floor: "13.9 m²",
  flooring: "28 mm marine plywood over steel cross-members",
  ventilation: "Standard passive vents",
  extra: [],
};

const dry40 = {
  external: "12.19 m × 2.44 m × 2.59 m",
  internal: "12.03 m × 2.35 m × 2.39 m",
  tare: "3,750 kg",
  payload: "26,730 kg",
  door: "2.34 m wide × 2.28 m high",
  volume: "67.7 m³",
  floor: "28.3 m²",
  flooring: "28 mm marine plywood over steel cross-members",
  ventilation: "Standard passive vents",
  extra: [],
};

const hc40 = {
  external: "12.19 m × 2.44 m × 2.90 m",
  internal: "12.03 m × 2.35 m × 2.70 m",
  tare: "3,900 kg",
  payload: "26,580 kg",
  door: "2.34 m wide × 2.58 m high",
  volume: "76.4 m³",
  floor: "28.3 m²",
  flooring: "28 mm marine plywood over steel cross-members",
  ventilation: "Standard passive vents",
  extra: [],
};

const office20 = {
  external: "6.06 m × 2.44 m × 2.59 m",
  internal: "5.80 m × 2.25 m × 2.30 m",
  tare: "2,650 kg",
  payload: "27,700 kg",
  door: "Steel personnel door + 1.2 m window bay",
  volume: "30.0 m³",
  floor: "13.1 m²",
  flooring: "Sealed plywood with commercial vinyl finish",
  ventilation: "Insulated walls, ceiling and passive vents",
  extra: [
    { label: "Insulation", value: "50 mm PU panels, walls and ceiling" },
    { label: "Electrical", value: "LED lighting, sockets and consumer unit" },
    { label: "Windows", value: "2 × sliding aluminium windows with security grilles" },
    { label: "Climate", value: "AC provision ready for a wall-mounted unit" },
  ],
};

const office40 = {
  external: "12.19 m × 2.44 m × 2.59 m",
  internal: "11.90 m × 2.25 m × 2.30 m",
  tare: "4,150 kg",
  payload: "26,300 kg",
  door: "Two steel personnel doors + window bays",
  volume: "61.6 m³",
  floor: "26.8 m²",
  flooring: "Sealed plywood with commercial vinyl finish",
  ventilation: "Insulated walls, ceiling and passive vents",
  extra: [
    { label: "Insulation", value: "50 mm PU panels, walls and ceiling" },
    { label: "Electrical", value: "LED lighting, sockets and consumer unit" },
    { label: "Layout", value: "Two rooms with a shared lobby" },
    { label: "Climate", value: "AC provision ready in both rooms" },
  ],
};

const reefer20 = {
  external: "6.06 m × 2.44 m × 2.59 m",
  internal: "5.44 m × 2.29 m × 2.26 m",
  tare: "3,080 kg",
  payload: "27,400 kg",
  door: "2.29 m wide × 2.26 m high",
  volume: "28.3 m³",
  floor: "12.4 m²",
  flooring: "Aluminium T-floor with drainage channels",
  ventilation: "Sealed insulated envelope with controlled airflow",
  extra: [
    { label: "Cooling unit", value: "Carrier Vector 1550" },
    { label: "Temperature", value: "−30 °C to +25 °C" },
    { label: "Power", value: "3-phase, 380–460 V" },
    { label: "Controls", value: "Digital setpoint with fault alarms" },
  ],
};

const reefer40 = {
  external: "12.19 m × 2.44 m × 2.90 m",
  internal: "11.56 m × 2.29 m × 2.54 m",
  tare: "4,480 kg",
  payload: "29,520 kg",
  door: "2.29 m wide × 2.54 m high",
  volume: "67.3 m³",
  floor: "26.5 m²",
  flooring: "Aluminium T-floor with drainage channels",
  ventilation: "Sealed insulated envelope with controlled airflow",
  extra: [
    { label: "Cooling unit", value: "Thermo King Magnum Plus" },
    { label: "Temperature", value: "−30 °C to +25 °C" },
    { label: "Power", value: "3-phase, 380–460 V" },
    { label: "Controls", value: "Digital setpoint with fault alarms" },
  ],
};

export const containers: Container[] = [
  {
    slug: "20ft-dry-wind-watertight",
    name: "20ft Dry Container — Wind & Watertight",
    shortName: "20ft Dry WWT",
    type: "plain",
    typeLabel: "Plain / dry",
    size: "20ft",
    sizeLabel: "20ft",
    condition: "used",
    conditionLabel: "Used · WWT",
    grade: "B+",
    price: 185000,
    media: [
      image("yard/container-stack.jpg", "Stacked used shipping containers at the Nairobi yard"),
      image("yard/container-20ft-red.jpg", "Red 20ft shipping container on the ground at the yard"),
      image("delivery/container-on-truck.jpg", "Shipping container loaded on a flatbed truck for delivery"),
      video(
        "hero-yard.mp4",
        "Yard footage: forklift lifting a red 20ft container",
        "yard/container-20ft-red.jpg",
      ),
    ],
    photosAreRepresentative: true,
    description:
      "A clean, wind-and-watertight 20ft dry container for secure storage, site tooling or a straightforward conversion base. Floors are solid and door seals have been checked. Ask for current photos, condition notes and any CSC plate details before payment.",
    highlights: ["Wind & watertight", "Solid plywood floor", "Delivery ready"],
    specs: dry20,
    conditionReport: [
      "Surface rust at the bottom rails; no perforation found during inspection.",
      "Door gaskets flexible and sealing correctly; lock rods operate cleanly.",
      "Floor solid across all bays with minor scuffs from previous cargo.",
      "Ask for the serial and CSC plate details for the exact unit.",
    ],
    included: [
      "Condition notes and current photos on request",
      "Bill of sale",
      "CSC plate and serial details where available",
      "Delivery planning and crane booking",
      "Yard viewing before payment",
    ],
    features: [
      "Wind-and-watertight grade for static storage",
      "Original steel doors with working gaskets",
      "Forklift pockets and corner castings intact",
      "Ready for shelving, racking or a basic fit-out",
    ],
    bestFor: ["Secure storage", "Construction sites", "Equipment lock-up"],
    featured: true,
    addedAt: "2026-10-12",
    stock: 4,
    year: 2021,
  },
  {
    slug: "20ft-dry-one-trip",
    name: "20ft Dry Container — One-Trip New",
    shortName: "20ft One-Trip",
    type: "plain",
    typeLabel: "Plain / dry",
    size: "20ft",
    sizeLabel: "20ft",
    condition: "new",
    conditionLabel: "One-trip new",
    grade: "A+",
    price: 430000,
    media: [
      image(
        "photo-coming-soon.jpg",
        "Photos of the one-trip 20ft container coming soon — ask the yard for current photos",
      ),
    ],
    description:
      "A near-new, one-trip 20ft container with factory paint, straight panels and clean floors. This is the unit to choose when presentation matters — branding, a shopfront, an office shell or a home conversion that starts with a sound envelope.",
    highlights: ["One-trip condition", "Factory paint", "Straight panels"],
    specs: { ...dry20, tare: "2,240 kg", payload: "28,170 kg" },
    conditionReport: [
      "One-trip unit with original factory coating and no structural repairs.",
      "Panels and roof straight; minor handling marks consistent with a single voyage.",
      "Doors open and close smoothly; gaskets clean and pliable.",
      "Interior clean, dry and free of odour or residue.",
    ],
    included: [
      "Condition notes and current photos on request",
      "Bill of sale",
      "CSC plate and serial details where available",
      "Delivery planning and crane booking",
      "Yard viewing before payment",
    ],
    features: [
      "Factory-painted exterior, ideal for branding",
      "Clean interior ready for lining or racking",
      "Dual locking bars with original hardware",
      "Best base for high-finish conversions",
    ],
    bestFor: ["Branded retail", "Office conversion", "Premium storage"],
    featured: false,
    addedAt: "2026-11-08",
    stock: 3,
    year: 2026,
  },
  {
    slug: "40ft-dry-wind-watertight",
    name: "40ft Dry Container — Wind & Watertight",
    shortName: "40ft Dry WWT",
    type: "plain",
    typeLabel: "Plain / dry",
    size: "40ft",
    sizeLabel: "40ft",
    condition: "used",
    conditionLabel: "Used · WWT",
    grade: "B+",
    price: 295000,
    media: [
      image("yard/container-stack.jpg", "Stacked used dry shipping containers at the yard"),
      image("yard/container-stack-high-cube.jpg", "Stacked high cube containers at the yard"),
      image("delivery/container-on-truck.jpg", "Container loaded on a flatbed truck for delivery"),
    ],
    photosAreRepresentative: true,
    description:
      "Double the floor area of a 20ft unit for a modest price step. This 40ft dry container is ideal for bulk storage, a workshop or a multi-room conversion shell. Inspected, wind-and-watertight and ready to leave the yard.",
    highlights: ["28.3 m² floor", "Bulk storage", "Cargo-worthy envelope"],
    specs: dry40,
    conditionReport: [
      "Light surface corrosion on the roof and bottom rails; no soft metal.",
      "Door seals checked at the last yard inspection.",
      "Plywood floor solid; minor dents from pallet traffic.",
      "Ask for the serial and CSC plate details for the exact unit.",
    ],
    included: [
      "Condition notes and current photos on request",
      "Bill of sale",
      "CSC plate and serial details where available",
      "Delivery planning and crane booking",
      "Yard viewing before payment",
    ],
    features: [
      "Twice the storage footprint of a 20ft unit",
      "Full-width double doors for pallet access",
      "Strong corrugated walls for racking loads",
      "Easy base for a two-room office or workshop",
    ],
    bestFor: ["Bulk storage", "Workshops", "Site offices"],
    featured: false,
    addedAt: "2026-09-28",
    stock: 3,
    year: 2020,
  },
  {
    slug: "40ft-high-cube-cargo-worthy",
    name: "40ft High Cube — Cargo Worthy",
    shortName: "40ft HC Cargo Worthy",
    type: "plain",
    typeLabel: "Plain / dry",
    size: "40ft-hc",
    sizeLabel: "40ft High Cube",
    condition: "used",
    conditionLabel: "Used · Cargo worthy",
    grade: "A−",
    price: 355000,
    media: [
      image("yard/container-stack-high-cube.jpg", "Stacked yellow and red high cube containers at the yard"),
      image("yard/container-stack.jpg", "Stacked used shipping containers at the yard"),
      image("delivery/container-on-truck.jpg", "Container loaded on a flatbed truck"),
    ],
    photosAreRepresentative: true,
    description:
      "A cargo-worthy 40ft high cube with the extra 30cm of headroom that makes a real difference in homes and offices. Strong enough for freight use, clean enough to convert. The extra height leaves room for insulation, ceiling services and a proper finish.",
    highlights: ["Extra headroom", "Cargo worthy", "Home & office ready"],
    specs: hc40,
    conditionReport: [
      "Structurally sound with no major dents to corner posts or rails.",
      "Roof checked and sealed; no active leaks observed.",
      "Floor solid with normal wear from freight use.",
      "Doors, gaskets and locking bars in working order.",
    ],
    included: [
      "Condition notes and current photos on request",
      "Bill of sale",
      "CSC plate and serial details where available",
      "Delivery planning and crane booking",
      "Yard viewing before payment",
    ],
    features: [
      "2.70 m internal height for insulated ceilings",
      "Cargo-worthy structure suitable for freight or conversion",
      "Full-width doors with four locking bars",
      "The most popular base for container homes",
    ],
    bestFor: ["Container homes", "Site offices", "High-volume storage"],
    featured: true,
    addedAt: "2026-09-10",
    stock: 2,
    year: 2022,
  },
  {
    slug: "40ft-high-cube-one-trip",
    name: "40ft High Cube — One-Trip New",
    shortName: "40ft HC One-Trip",
    type: "plain",
    typeLabel: "Plain / dry",
    size: "40ft-hc",
    sizeLabel: "40ft High Cube",
    condition: "new",
    conditionLabel: "One-trip new",
    grade: "A+",
    price: 760000,
    media: [
      image(
        "photo-coming-soon.jpg",
        "Photos of the one-trip 40ft high cube coming soon — ask the yard for current photos",
      ),
    ],
    description:
      "The premium blank canvas: a one-trip 40ft high cube with maximum volume, factory paint and no repair history. If you are building a home, a flagship office or a branded retail unit, start here — fewer surprises under the cladding.",
    highlights: ["Maximum volume", "One-trip new", "Factory finish"],
    specs: { ...hc40, tare: "3,910 kg", payload: "26,570 kg" },
    conditionReport: [
      "One-trip unit with factory paint throughout.",
      "No dents or patch welds observed at the last yard check.",
      "Doors and seals as delivered from the factory.",
      "Interior clean and ready for lining or fit-out.",
    ],
    included: [
      "Condition notes and current photos on request",
      "Bill of sale",
      "CSC plate and serial details where available",
      "Delivery planning and crane booking",
      "Yard viewing before payment",
    ],
    features: [
      "76.4 m³ of usable volume",
      "Factory finish for exterior branding",
      "Straight panels for a high-end cladding job",
      "Long service life with minimal maintenance",
    ],
    bestFor: ["Container homes", "Premium offices", "Branded retail"],
    featured: false,
    addedAt: "2026-10-22",
    stock: 1,
    year: 2026,
  },
  {
    slug: "20ft-site-office",
    name: "20ft Site Office — Insulated Fit-Out",
    shortName: "20ft Site Office",
    type: "fabricated",
    typeLabel: "Fabricated",
    size: "20ft",
    sizeLabel: "20ft",
    condition: "new",
    conditionLabel: "New build",
    grade: "A",
    price: 595000,
    media: [
      image("interiors/office-interior.jpg", "Finished container office interior with glass doors and timber floor"),
      image("yard/kiosk-shell-orange.jpg", "Orange and black container shell before office fit-out"),
      image("yard/kiosk-two-storey.jpg", "Two-storey container office structure with grey cladding"),
      image("yard/kiosk-row-orange.jpg", "Orange container office units with roller shutters"),
    ],
    photosAreRepresentative: true,
    description:
      "A turnkey 20ft site office built on a new container shell. Insulated walls and ceiling, LED lighting, power sockets, sliding windows and a steel personnel door. Delivered ready to furnish — desk, chairs and a kettle are all you need to add.",
    highlights: ["Insulated & wired", "Personnel door", "Two windows"],
    specs: office20,
    conditionReport: [
      "Built on a one-trip 20ft shell with no structural repairs.",
      "All fabrication welds inspected and primed before topcoat.",
      "Electrical circuits checked before dispatch; confirm labelling on inspection.",
      "Snag walk completed before dispatch.",
    ],
    included: [
      "Electrical layout drawing",
      "Fit-out snag list",
      "Condition notes and current photos on request",
      "Delivery planning and crane booking",
      "Care and maintenance sheet",
    ],
    features: [
      "50 mm insulated walls and ceiling",
      "LED lighting plus dedicated socket circuits",
      "Two sliding aluminium windows with grilles",
      "Wall-mounted AC provision",
    ],
    bestFor: ["Site offices", "Project management", "Gatehouses"],
    featured: false,
    addedAt: "2026-11-05",
    stock: 2,
    year: 2026,
  },
  {
    slug: "40ft-site-office",
    name: "40ft Site Office — Two-Room Fit-Out",
    shortName: "40ft Site Office",
    type: "fabricated",
    typeLabel: "Fabricated",
    size: "40ft",
    sizeLabel: "40ft",
    condition: "new",
    conditionLabel: "New build",
    grade: "A",
    price: 1180000,
    media: [
      image("interiors/office-interior.jpg", "Finished container office interior with glass doors"),
      image("yard/kiosk-row-orange.jpg", "Orange container office units in the yard"),
      image("yard/kiosk-two-storey.jpg", "Two-storey container office structure"),
    ],
    photosAreRepresentative: true,
    description:
      "A 40ft two-room office for teams that need a proper working environment on site. Two insulated rooms, a shared lobby, two personnel doors, LED lighting and AC provision. Built to be lived in for the length of a project, then moved to the next one.",
    highlights: ["Two private rooms", "Shared lobby", "AC provision"],
    specs: office40,
    conditionReport: [
      "Built on a cargo-worthy 40ft shell with no structural repairs.",
      "Steel partitions and door frames primed and top-coated.",
      "Electrical installation checked room by room; confirm labelling on inspection.",
      "Snag walk completed with the fabrication lead before dispatch.",
    ],
    included: [
      "Electrical layout drawing",
      "Room-by-room fit-out schedule",
      "Condition notes and current photos on request",
      "Delivery planning and crane booking",
      "Care and maintenance sheet",
    ],
    features: [
      "Two insulated offices plus a shared lobby",
      "Two steel personnel doors with lock sets",
      "LED lighting and dedicated socket circuits",
      "AC provision in both rooms",
    ],
    bestFor: ["Project offices", "NGO field teams", "Construction management"],
    featured: false,
    addedAt: "2026-09-20",
    stock: 1,
    year: 2026,
  },
  {
    slug: "20ft-retail-kiosk",
    name: "20ft Retail Kiosk — Roller Shutter",
    shortName: "20ft Retail Kiosk",
    type: "fabricated",
    typeLabel: "Fabricated",
    size: "20ft",
    sizeLabel: "20ft",
    condition: "new",
    conditionLabel: "New build",
    grade: "A",
    price: 520000,
    media: [
      image("yard/kiosk-row-red.jpg", "Red container retail kiosks with white roller shutters"),
      image("yard/kiosk-row-black.jpg", "Black container kiosks with roller shutters"),
      image("yard/kiosk-row-blue.jpg", "Blue container kiosks with roller shutters"),
      image("yard/kiosk-row-green.jpg", "Green container kiosks in the yard"),
      image("yard/kiosk-row-orange.jpg", "Orange container kiosks with roller shutters"),
      image("yard/kiosk-row-patterned.jpg", "Patterned container kiosks in green, white and yellow"),
    ],
    photosAreRepresentative: true,
    description:
      "A roadside-ready 20ft kiosk with a roller shutter, serving counter and lockable hatch. Built for retail, food service or a mobile brand activation. The shell is insulated and wired, so you can open for business as soon as it is placed.",
    highlights: ["Roller shutter", "Serving counter", "Wired & insulated"],
    specs: {
      ...office20,
      door: "Roller shutter + steel personnel door",
      extra: [
        { label: "Shutter", value: "Manual roller shutter with lock" },
        { label: "Counter", value: "Serving counter with fold-up hatch" },
        { label: "Insulation", value: "50 mm PU panels, walls and ceiling" },
        { label: "Electrical", value: "LED lighting, sockets and consumer unit" },
      ],
    },
    conditionReport: [
      "Built on an inspected 20ft shell with straight panels.",
      "Shutter and lock checked; confirm operation on inspection.",
      "Electrical circuits checked; confirm labelling on inspection.",
      "Exterior primed and top-coated for roadside conditions.",
    ],
    included: [
      "Electrical layout drawing",
      "Fit-out snag list",
      "Condition notes and current photos on request",
      "Delivery planning and crane booking",
      "Care and maintenance sheet",
    ],
    features: [
      "Lockable roller shutter for overnight security",
      "Serving counter with fold-up hatch",
      "Insulated and wired for lights and equipment",
      "Space for signage on three elevations",
    ],
    bestFor: ["Retail", "Food service", "Brand activations"],
    featured: true,
    addedAt: "2026-11-01",
    stock: 2,
    year: 2026,
  },
  {
    slug: "20ft-container-studio",
    name: "20ft Container Studio — Bath & Kitchenette",
    shortName: "20ft Studio Home",
    type: "fabricated",
    typeLabel: "Fabricated",
    size: "20ft",
    sizeLabel: "20ft",
    condition: "new",
    conditionLabel: "New build",
    grade: "A",
    price: 820000,
    media: [
      image(
        "photo-coming-soon.jpg",
        "Photos of the 20ft container studio coming soon — ask the yard for current photos",
      ),
    ],
    description:
      "A compact guest studio or starter home in a 20ft footprint. Insulated, wired, plumbed and finished with a shower room and kitchenette. Ideal for a guest suite, a farm stay or a secure city pad where land is tight.",
    highlights: ["Shower room", "Kitchenette", "Turnkey finish"],
    specs: {
      ...office20,
      extra: [
        { label: "Insulation", value: "50 mm PU panels, walls and ceiling" },
        { label: "Bathroom", value: "Shower, WC and vanity with hot-water provision" },
        { label: "Kitchenette", value: "Sink, counter and space for a two-plate cooker" },
        { label: "Electrical", value: "LED lighting, sockets and consumer unit" },
      ],
    },
    conditionReport: [
      "Built on a one-trip 20ft shell with no structural repairs.",
      "Plumbing and drainage checked before dispatch; confirm on inspection.",
      "Electrical circuits checked; confirm labelling on inspection.",
      "Interior finishes inspected and snag-listed.",
    ],
    included: [
      "Electrical and plumbing layout drawings",
      "Fit-out snag list",
      "Condition notes and current photos on request",
      "Delivery planning and crane booking",
      "Care and maintenance sheet",
    ],
    features: [
      "Insulated living pod with a shower room",
      "Kitchenette with sink and cooking space",
      "Timber-lined ceiling and vinyl floor finish",
      "Ready for connection to water and power",
    ],
    bestFor: ["Guest suites", "Farm stays", "Compact city living"],
    featured: false,
    addedAt: "2026-09-15",
    stock: 1,
    year: 2026,
  },
  {
    slug: "40ft-container-home",
    name: "40ft Container Home — Two Bedroom Shell",
    shortName: "40ft Home Shell",
    type: "fabricated",
    typeLabel: "Fabricated",
    size: "40ft",
    sizeLabel: "40ft",
    condition: "new",
    conditionLabel: "New build",
    grade: "A",
    price: 2450000,
    media: [
      image("homes/container-home-exterior.jpg", "Container home exterior with a timber veranda"),
      image("interiors/container-home-kitchen.jpg", "Container home kitchen with cabinets and tiled walls"),
      image("yard/container-stack-high-cube.jpg", "High cube containers used as the base for conversions"),
    ],
    photosAreRepresentative: true,
    description:
      "A two-bedroom container home built on a 40ft high cube shell. Insulated, wired, plumbed and finished to a comfortable residential standard, with a lounge, kitchen, bathroom and two bedrooms. A realistic alternative to a stone build when speed and predictability matter.",
    highlights: ["Two bedrooms", "Full fit-out", "40ft high cube"],
    specs: {
      ...office40,
      extra: [
        { label: "Insulation", value: "50 mm PU panels with interior lining" },
        { label: "Bathroom", value: "Shower, WC and vanity with hot-water provision" },
        { label: "Kitchen", value: "Counter, sink and cooker point" },
        { label: "Electrical", value: "LED lighting, sockets and consumer unit" },
        { label: "Water", value: "Cold-water inlet and drainage ready to connect" },
      ],
    },
    conditionReport: [
      "Built on a cargo-worthy 40ft high cube shell.",
      "Roof and floor checked for water ingress before lining.",
      "Plumbing and electrical work checked on site; confirm certification on inspection.",
      "Residential snag walk completed before handover.",
    ],
    included: [
      "Electrical and plumbing layout drawings",
      "Room-by-room fit-out schedule",
      "Condition notes and current photos on request",
      "Delivery planning and crane booking",
      "Care and maintenance sheet",
    ],
    features: [
      "Two bedrooms, lounge, kitchen and bathroom",
      "High cube height with an insulated ceiling",
      "Factory-finished wall lining and vinyl floors",
      "Designed for quick connection to site services",
    ],
    bestFor: ["Family homes", "Guest accommodation", "Staff housing"],
    featured: true,
    addedAt: "2026-10-28",
    stock: 1,
    year: 2026,
  },
  {
    slug: "20ft-refrigerated",
    name: "20ft Refrigerated Container — Carrier Unit",
    shortName: "20ft Reefer",
    type: "refrigerated",
    typeLabel: "Refrigerated",
    size: "20ft",
    sizeLabel: "20ft",
    condition: "used",
    conditionLabel: "Used · Working",
    grade: "B+",
    price: 1250000,
    media: [
      image(
        "photo-coming-soon.jpg",
        "Photos of the 20ft refrigerated container coming soon — ask the yard for current photos",
      ),
    ],
    description:
      "A 20ft refrigerated container with a Carrier Vector unit, suited to produce, meat, dairy or flowers where a cold chain cannot fail. Ask for the current test sheet before payment. Requires 3-phase power on site.",
    highlights: ["Carrier cooling", "−30 °C to +25 °C", "3-phase power"],
    specs: reefer20,
    conditionReport: [
      "Ask for the current cooling-unit test sheet.",
      "Insulated panels and door gaskets checked for air leakage.",
      "Aluminium T-floor clean with drainage channels clear.",
      "Control panel and alarms checked; confirm on inspection.",
    ],
    included: [
      "Cooling-unit test sheet on request",
      "Condition notes and current photos on request",
      "Bill of sale",
      "Delivery planning and crane booking",
      "On-site power requirements checklist",
    ],
    features: [
      "Carrier Vector 1550 cooling unit",
      "Deep-freeze to ambient temperature range",
      "Sealed, insulated cargo envelope",
      "Digital controls with fault alarms",
    ],
    bestFor: ["Produce & flowers", "Meat & dairy", "Cold-chain storage"],
    featured: false,
    addedAt: "2026-10-18",
    stock: 1,
    year: 2019,
  },
  {
    slug: "40ft-high-cube-reefer",
    name: "40ft High Cube Reefer — Thermo King",
    shortName: "40ft HC Reefer",
    type: "refrigerated",
    typeLabel: "Refrigerated",
    size: "40ft-hc",
    sizeLabel: "40ft High Cube",
    condition: "used",
    conditionLabel: "Used · Working",
    grade: "B+",
    price: 1720000,
    media: [
      image(
        "photo-coming-soon.jpg",
        "Photos of the 40ft high cube reefer coming soon — ask the yard for current photos",
      ),
    ],
    description:
      "A 40ft high cube reefer with a Thermo King Magnum unit for larger cold-storage volumes. Suited to distributors, farms and food processors who need reliable temperature control without building a cold room from scratch.",
    highlights: ["Thermo King unit", "67 m³ capacity", "3-phase power"],
    specs: reefer40,
    conditionReport: [
      "Ask for the current cooling-unit test sheet.",
      "Door gaskets and insulated panels checked for leakage.",
      "Aluminium T-floor cleaned and drainage checked.",
      "Control panel and alarms checked; confirm on inspection.",
    ],
    included: [
      "Cooling-unit test sheet on request",
      "Condition notes and current photos on request",
      "Bill of sale",
      "Delivery planning and crane booking",
      "On-site power requirements checklist",
    ],
    features: [
      "Thermo King Magnum Plus cooling unit",
      "High cube height for palletised loads",
      "Deep-freeze to ambient temperature range",
      "Digital controls with fault alarms",
    ],
    bestFor: ["Food distribution", "Floriculture", "Bulk cold storage"],
    featured: false,
    addedAt: "2026-10-05",
    stock: 1,
    year: 2020,
  },
];

export function primaryImage(container: Container) {
  const first = container.media[0];
  if (!first) return { src: "", alt: "" };
  return first.kind === "image"
    ? { src: first.src, alt: first.alt }
    : { src: first.poster, alt: first.alt };
}

export function containerImageUrls(container: Container) {
  return container.media.map((item) =>
    item.kind === "image" ? item.src : item.poster,
  );
}

export const featuredContainers = containers.filter((container) => container.featured);

export function getContainer(slug: string) {
  return containers.find((container) => container.slug === slug);
}

export function relatedContainers(container: Container, limit = 4) {
  const scored = containers
    .filter((item) => item.slug !== container.slug)
    .map((item) => {
      let score = 0;
      if (item.type === container.type) score += 3;
      if (item.size === container.size) score += 2;
      if (item.condition === container.condition) score += 1;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || b.item.price - a.item.price);

  return scored.slice(0, limit).map((entry) => entry.item);
}

export const typeLabels: Record<ContainerType, string> = {
  plain: "Plain / dry",
  fabricated: "Fabricated",
  refrigerated: "Refrigerated",
};

export const sizeLabels: Record<ContainerSize, string> = {
  "20ft": "20ft",
  "40ft": "40ft",
  "40ft-hc": "40ft High Cube",
};

export const conditionLabels: Record<ContainerCondition, string> = {
  new: "New",
  used: "Used",
};
