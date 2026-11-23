export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "callout"; title: string; text: string }
  | { type: "quote"; text: string; cite?: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  date: string;
  readMinutes: number;
  image: { src: string; alt: string };
  featured: boolean;
  related: string[];
  content: BlogBlock[];
}

const img = (file: string, alt: string) => ({
  src: `/media/images/${file}`,
  alt,
});

export const blogPosts: BlogPost[] = [
  {
    slug: "shipping-container-price-guide-kenya-2026",
    title: "Shipping Container Price Guide in Kenya — 2026 Edition",
    excerpt:
      "What 20ft, 40ft, high cube, fabricated and refrigerated containers actually cost in Kenya this year — and what moves the number.",
    description:
      "A practical 2026 guide to shipping container prices in Kenya, covering used, new, fabricated and refrigerated units, delivery costs and how to read a quote.",
    category: "Buying guide",
    date: "2026-11-04",
    readMinutes: 9,
    image: img("yard/container-stack-high-cube.jpg", "Stacked high cube shipping containers at the yard"),
    featured: true,
    related: [
      "container-delivery-costs-kenya",
      "container-homes-vs-site-offices-kenya",
      "customize-shipping-container-office-kenya",
    ],
    content: [
      {
        type: "p",
        text: "Container prices in Kenya move for reasons that have little to do with the container itself. Global freight rates, the shilling, port congestion and the condition of the individual unit all change what a yard can sell for. This guide gives you realistic 2026 ranges, explains what separates a cheap unit from an expensive one, and shows you where the hidden costs usually sit.",
      },
      {
        type: "callout",
        title: "Indicative figures — confirm current pricing",
        text: "The ranges below are a planning reference, not a quotation. Stock, condition and freight rates move. Confirm the exact unit price on its listing or with the yard before paying.",
      },
      {
        type: "callout",
        title: "The short version",
        text: "A used 20ft wind-and-watertight container typically lands between KES 185,000 and KES 250,000. A new one-trip 20ft is around KES 400,000–460,000. A used 40ft high cube sits around KES 330,000–420,000. Fabrication and refrigeration add significantly more.",
      },
      { type: "h2", text: "2026 price ranges at a glance" },
      {
        type: "table",
        head: ["Unit", "Condition", "Typical range (KES)"],
        rows: [
          ["20ft dry", "Used, WWT", "185,000 – 250,000"],
          ["20ft dry", "One-trip new", "400,000 – 460,000"],
          ["40ft dry", "Used, WWT", "280,000 – 340,000"],
          ["40ft high cube", "Used, cargo worthy", "330,000 – 420,000"],
          ["40ft high cube", "One-trip new", "700,000 – 820,000"],
          ["20ft site office", "Fabricated, insulated", "550,000 – 700,000"],
          ["40ft site office", "Fabricated, two rooms", "1,000,000 – 1,400,000"],
          ["20ft retail kiosk", "Fabricated, shutter", "480,000 – 620,000"],
          ["20ft reefer", "Used, working", "1,100,000 – 1,500,000"],
          ["40ft high cube reefer", "Used, working", "1,600,000 – 2,100,000"],
          ["Two-bedroom container home", "Fabricated, finished", "2,200,000 – 3,200,000"],
        ],
      },
      {
        type: "p",
        text: "These are yard prices in Nairobi before delivery. They are not a quotation. Condition, stock availability and the exact specification can move a unit by tens of thousands of shillings in either direction.",
      },
      { type: "h2", text: "The five things that move the price" },
      { type: "h3", text: "1. Condition grade" },
      {
        type: "p",
        text: "A wind-and-watertight (WWT) container is weatherproof but may show surface rust, dents and faded paint. A cargo-worthy (CW) unit is structurally sound and suitable for freight. A one-trip container has made a single voyage and still has factory paint. Each step up the ladder adds cost — and usually saves you money on repairs later.",
      },
      { type: "h3", text: "2. Size and height" },
      {
        type: "p",
        text: "A 40ft container is not double the price of a 20ft, even though it carries roughly double the volume. That is why 40ft units often look like better value per cubic metre. High cube units add about 30 cm of internal height and usually carry a premium over a standard 40ft.",
      },
      { type: "h3", text: "3. Global freight and stock" },
      {
        type: "p",
        text: "Kenya imports most of its container stock. When global freight rates rise, fewer used boxes are released into the local market and yard prices firm up. When shipping normalises, supply loosens. This is why a quote can change within weeks — and why it pays to confirm today's price rather than rely on a six-month-old blog post.",
      },
      { type: "h3", text: "4. Fabrication scope" },
      {
        type: "p",
        text: "Fabrication is where quotes diverge fastest. A basic office with a door, two windows, lights and sockets is a different project from a fully lined home with a bathroom, kitchen, tiling and air conditioning. Ask for a room-by-room scope, not a single lump sum.",
      },
      { type: "h3", text: "5. Delivery and access" },
      {
        type: "p",
        text: "Delivery within Nairobi starts around KES 15,000 for a 20ft unit with crane offload. Upcountry trips can run from KES 35,000 to over KES 100,000 depending on distance, road access and whether the truck can reach the plot. A cheap container with an expensive delivery is not a bargain.",
      },
      { type: "h2", text: "New vs used: which makes sense?" },
      {
        type: "p",
        text: "Buy used if the container will be painted, clad or used for storage where presentation is secondary. Buy new if you are building a home, a branded kiosk or an office where the exterior is part of the design. A used shell with good bones and a proper paint job often beats a cheap new unit with hidden repairs.",
      },
      {
        type: "quote",
        text: "The cheapest container is rarely the cheapest project. The cost of fixing a bad floor or a leaking roof usually shows up after delivery, when the unit is already on your site.",
      },
      { type: "h2", text: "How to read a container quote" },
      {
        type: "ul",
        items: [
          "Does the price include the CSC plate and condition notes where available?",
          "Is delivery included, and is crane offload included in that figure?",
          "What is the exact container grade — WWT, cargo worthy or one-trip?",
          "Are there photos of the actual unit, including the doors and floor?",
          "Is the serial number recorded on the invoice?",
          "For fabrication, is the scope room-by-room and are electricals included?",
          "What is the lead time, and what happens if the delivery date slips?",
          "Are payment terms and receipts in writing?",
        ],
      },
      { type: "h2", text: "A realistic budget example" },
      {
        type: "p",
        text: "A small retailer in Ruiru buys a 20ft cargo-worthy container for KES 215,000, adds a roller shutter, counter and lighting for KES 180,000, and pays KES 20,000 for delivery and offload. Total: KES 415,000 for a lockable shop that can be moved when the lease ends. A comparable permanent kiosk build would cost more and take longer.",
      },
      { type: "h2", text: "The bottom line" },
      {
        type: "p",
        text: "Use the ranges above to sanity-check quotes, not to bargain a yard into a loss. Ask for the unit's grade, photos, documents and a written delivery figure. A transparent seller will answer all four without hesitation. If the price looks too good, inspect the floor, the roof seams and the door gaskets first.",
      },
    ],
  },
  {
    slug: "container-homes-vs-site-offices-kenya",
    title: "Container Homes vs. Site Offices: Which Should You Build?",
    excerpt:
      "They start from the same steel box, but a home and a site office are different projects. Here is how to choose — and where the costs really go.",
    description:
      "A practical comparison of container homes and container site offices in Kenya, including costs, timelines, permits, insulation, services and resale.",
    category: "Comparison",
    date: "2026-10-21",
    readMinutes: 7,
    image: img("homes/container-home-exterior.jpg", "Container home exterior with a timber veranda"),
    featured: false,
    related: [
      "shipping-container-price-guide-kenya-2026",
      "customize-shipping-container-office-kenya",
      "container-delivery-costs-kenya",
    ],
    content: [
      {
        type: "p",
        text: "A container home and a container site office begin with the same shell. After that, they diverge quickly. One is designed for permanence, privacy and daily living. The other is designed to be moved, hosed down and put back on a truck. Choosing the wrong starting point is expensive.",
      },
      { type: "h2", text: "The quick comparison" },
      {
        type: "table",
        head: ["Consideration", "Container home", "Site office"],
        rows: [
          ["Typical shell", "40ft high cube", "20ft or 40ft standard"],
          ["Fit-out cost", "High — kitchen, bath, finishes", "Moderate — insulation, power, windows"],
          ["Timeline", "4–8 weeks", "2–4 weeks"],
          ["Permits", "County approval and NEMA likely", "Temporary site approval usually simpler"],
          ["Services", "Water, sewer, power, hot water", "Power and data; often no plumbing"],
          ["Mobility", "Possible but disruptive", "Designed to relocate"],
          ["Lifespan", "20+ years with maintenance", "10–20 years with maintenance"],
          ["Best for", "Living, guest suites, staff housing", "Project teams, gatehouses, clinics"],
        ],
      },
      { type: "h2", text: "Start with how long it needs to last" },
      {
        type: "p",
        text: "If the unit will move in two years, build a site office. If it will sit on the same plot for a decade, build a home. A home fitted into a shell that is later craned onto a truck will lose its finishes, crack tile joints and stress plumbing connections. A site office built like a permanent home is over-capitalised for a temporary need.",
      },
      { type: "h2", text: "Where the money goes in a container home" },
      {
        type: "ul",
        items: [
          "Insulation and interior lining — the difference between a steel box and a room.",
          "Bathroom and kitchen plumbing, including hot water and drainage.",
          "Windows and doors: glazing, security grilles and proper flashing.",
          "Electrical installation, sockets, lighting and a consumer unit.",
          "Flooring, ceiling and joinery.",
          "Foundation plinths and connection to site services.",
        ],
      },
      { type: "h2", text: "Where the money goes in a site office" },
      {
        type: "ul",
        items: [
          "Insulated walls and ceiling for a usable working temperature.",
          "Two windows, a steel personnel door and security grilles.",
          "LED lighting and dedicated socket circuits.",
          "AC provision or a mounted unit.",
          "A simple layout with one or two rooms.",
          "Crane delivery and a straightforward offload.",
        ],
      },
      { type: "h2", text: "Permits are the hidden fork in the road" },
      {
        type: "p",
        text: "A permanent container home is generally treated as a structure. County planning approval, drawings and NEMA considerations can apply, especially where you are connecting water and sewer. A temporary site office on an active project is usually a lighter conversation, but the host site still has to approve placement. Always confirm with the relevant county before you commit to a build.",
      },
      { type: "h2", text: "The hybrid option" },
      {
        type: "p",
        text: "Many buyers combine both. A 40ft high cube becomes the main living pod, while a 20ft unit becomes a site office, store or guest room. The units can share a deck and services but keep separate access. This works well for farms, lodges and projects that grow in phases.",
      },
      {
        type: "callout",
        title: "One question that settles it",
        text: "Will the building need a bathroom and a kitchen? If yes, it is a home — budget for services and permits. If it only needs power and a desk, it is an office.",
      },
      { type: "h2", text: "Mistakes to avoid" },
      {
        type: "ul",
        items: [
          "Skipping insulation because the unit will be painted a light colour.",
          "Putting a home on a site with no sewer or soak-pit plan.",
          "Building a heavy interior into a shell that will be moved frequently.",
          "Buying a 20ft unit for a two-bedroom home.",
          "Forgetting window and door security in a ground-floor layout.",
        ],
      },
      { type: "h2", text: "The verdict" },
      {
        type: "p",
        text: "For a project team, a site office is the right tool: fast, insulated, wired and relocatable. For a home, start with a 40ft high cube, budget properly for services and finishes, and confirm approvals before fabrication. The shell is only about a quarter of the final cost — the fit-out and site works decide whether the project feels cheap or comfortable.",
      },
    ],
  },
  {
    slug: "container-delivery-costs-kenya",
    title: "Container Delivery Costs: Mombasa vs. Nairobi vs. Kisumu",
    excerpt:
      "Delivery is not one line item. Here is what actually drives the cost of moving a container from the yard to your site — and how to keep it down.",
    description:
      "Understand container delivery costs in Kenya by route, including Nairobi, Mombasa and Kisumu, plus crane offload, access requirements and how to avoid surprise charges.",
    category: "Logistics",
    date: "2026-09-30",
    readMinutes: 6,
    image: img("delivery/mobile-unit-truck.jpg", "Patterned container unit loaded on a truck at the yard"),
    featured: false,
    related: [
      "shipping-container-price-guide-kenya-2026",
      "container-homes-vs-site-offices-kenya",
      "customize-shipping-container-office-kenya",
    ],
    content: [
      {
        type: "p",
        text: "Two buyers can purchase identical containers and pay very different delivery costs. The difference is rarely the container. It is the route, the truck, the crane and whether the plot can be reached without a fight. Understanding the components helps you compare quotes fairly.",
      },
      {
        type: "callout",
        title: "Indicative routes — confirm before booking",
        text: "The delivery figures below are planning estimates from the Nairobi yard. Access, crane reach, waiting time and fuel can change the final quote. Request a written figure for your site before booking.",
      },
      { type: "h2", text: "What is inside a delivery quote" },
      {
        type: "ul",
        items: [
          "Truck hire and fuel for the distance from the yard to your site.",
          "Crane offload at the destination — usually a separate cost from transport.",
          "Waiting time if the site is not ready when the truck arrives.",
          "Access difficulty: narrow roads, low branches or soft ground.",
          "Permits or escorts where a route requires them.",
        ],
      },
      {
        type: "p",
        text: "A quote that only says “delivery” is incomplete. Ask whether the figure includes the crane, whether waiting time is capped, and what happens if the truck cannot reach the placement point.",
      },
      { type: "h2", text: "Typical route ranges" },
      {
        type: "table",
        head: ["Route", "Typical delivery time", "Indicative 20ft", "Indicative 40ft HC"],
        rows: [
          ["Nairobi & Kiambu", "1 day; confirm on booking", "from KES 15,000", "from KES 25,000"],
          ["Machakos / Kajiado", "1 day", "from KES 20,000", "from KES 30,000"],
          ["Nakuru / Rift Valley", "2–3 days", "from KES 35,000", "from KES 55,000"],
          ["Mombasa / Coast", "2–3 days", "from KES 45,000", "from KES 65,000"],
          ["Kisumu / Nyanza", "2–3 days", "from KES 45,000", "from KES 70,000"],
          ["Western Kenya", "3–4 days", "from KES 50,000", "from KES 75,000"],
          ["North Eastern", "3–5 days", "quoted per trip", "quoted per trip"],
        ],
      },
      {
        type: "p",
        text: "These figures are indicative and include the truck from our Nairobi yard. Crane offload is planned into the final quote. Mombasa and Kisumu cost more than Nairobi because of distance and route conditions, not because the container is different.",
      },
      { type: "h2", text: "Why Mombasa can surprise you" },
      {
        type: "p",
        text: "Mombasa is a port city, but that does not automatically make delivery cheap. The container still has to come from our yard, and the last mile can be tight: narrow access roads, coastal plots with soft ground, and cranes that cannot reach over walls. Share a photo of the entrance and the placement point before you agree the price.",
      },
      { type: "h2", text: "Why Kisumu and western routes cost more" },
      {
        type: "p",
        text: "Distance is the main driver, followed by route conditions and the availability of a crane truck at the destination. If you are buying more than one unit, combining them on one trip can reduce the per-unit cost. If your site is far from the main road, expect a transshipment or a smaller final-leg truck.",
      },
      { type: "h2", text: "The six-point access check" },
      {
        type: "ol",
        items: [
          "Gate width: at least 3.5 m for a 20ft truck; 4 m+ for a 40ft trailer.",
          "Turning space: the truck needs room to swing and reverse.",
          "Ground: firm and level, or engineered plinths for soft soil.",
          "Overhead: no power lines or branches in the crane's lift path.",
          "Offload zone: about 10 m in front of the placement point.",
          "Permission: landlord or county approval before the truck arrives.",
        ],
      },
      { type: "h2", text: "How to reduce your delivery cost" },
      {
        type: "ul",
        items: [
          "Book both the truck and crane together instead of sourcing them separately.",
          "Be flexible on the delivery day so the transporter can combine trips.",
          "Clear the access path before the truck leaves the yard.",
          "Choose a 20ft unit if a 40ft truck cannot reach the plot.",
          "Collect from the yard yourself if you have a suitable truck and crane.",
        ],
      },
      {
        type: "callout",
        title: "Get the access check first",
        text: "The cheapest quote can become the most expensive delivery if the truck arrives and cannot reach the site. Send us a pin, a photo of the entrance and the ground conditions before you pay.",
      },
      { type: "h2", text: "The bottom line" },
      {
        type: "p",
        text: "Budget delivery as a project cost, not an afterthought. Within Nairobi, a 20ft delivery with crane offload is usually a five-figure sum. Upcountry moves quickly reach six figures. Confirm the scope in writing, check access honestly, and the final invoice should match the quote.",
      },
    ],
  },
  {
    slug: "customize-shipping-container-office-kenya",
    title: "How to Customize a Shipping Container Office in Kenya",
    excerpt:
      "A step-by-step guide to turning a steel box into a comfortable, secure office — from shell selection and insulation to wiring and cooling.",
    description:
      "Learn how to customize a shipping container into an office in Kenya, including shell choice, insulation, electrical work, windows, flooring, ventilation and costs.",
    category: "Build guide",
    date: "2026-09-12",
    readMinutes: 7,
    image: img("interiors/office-interior.jpg", "Finished container office interior with glass doors and timber floor"),
    featured: false,
    related: [
      "container-homes-vs-site-offices-kenya",
      "shipping-container-price-guide-kenya-2026",
      "container-delivery-costs-kenya",
    ],
    content: [
      {
        type: "p",
        text: "A container office is a simple idea executed badly more often than it should be. The shell is strong, but steel is a poor insulator and an even worse place to hide plumbing mistakes. These are the decisions that separate a comfortable workspace from a hot box with a desk in it.",
      },
      { type: "h2", text: "Step 1: Choose the right shell" },
      {
        type: "p",
        text: "For a single office, a 20ft container is enough for two to four people. For a team of six or more, a 40ft gives you two rooms and a shared lobby. A high cube adds 30 cm of headroom, which matters once you add insulation and a ceiling. Check the floor, roof seams and door gaskets before fabrication begins.",
      },
      { type: "h2", text: "Step 2: Plan the layout before cutting steel" },
      {
        type: "p",
        text: "Mark the door, window and partition positions on a floor plan first. Cutting a container is permanent, and every opening needs a proper frame to carry the load. Place desks away from the afternoon sun, keep the door on the shaded elevation where possible, and leave a clear walkway.",
      },
      {
        type: "callout",
        title: "The one rule of container openings",
        text: "Every cut needs a framed opening. Do not let a fabricator cut a window and fit it without stiffening the surrounding panel.",
      },
      { type: "h2", text: "Step 3: Insulate properly" },
      {
        type: "p",
        text: "Kenyan steel containers heat up quickly. A 50 mm polyurethane (PU) panel system on the walls and ceiling, installed with a continuous vapour barrier, makes the office usable without relying entirely on air conditioning. Insulation also reduces noise from rain and nearby traffic.",
      },
      { type: "h2", text: "Step 4: Design the electrical installation" },
      {
        type: "ul",
        items: [
          "Consumer unit sized for lighting, sockets, AC and any kitchen equipment.",
          "Separate circuits for AC units and heavy loads.",
          "LED lighting with a warm-neutral colour temperature.",
          "Sockets at desk height, not near the floor behind furniture.",
          "Cable routes planned before wall lining goes on.",
          "External connection point protected from weather.",
        ],
      },
      { type: "h2", text: "Step 5: Windows, doors and security" },
      {
        type: "p",
        text: "Sliding aluminium windows with 5 mm or 6 mm glass are standard. Add security grilles on ground-floor units. A steel personnel door with a quality lock set is the minimum; a second door improves flow and safety in a 40ft office. Flash every opening carefully — water finds bad detail quickly.",
      },
      { type: "h2", text: "Step 6: Flooring and finishes" },
      {
        type: "p",
        text: "Seal the plywood floor, then lay commercial vinyl, laminate or tile. Vinyl is the most practical for offices: easy to clean, forgiving underfoot and available in neutral finishes. Avoid carpet in dusty or high-traffic sites. Line the walls with painted plywood or gypsum board and finish the ceiling to hide services.",
      },
      { type: "h2", text: "Step 7: Cooling and ventilation" },
      {
        type: "p",
        text: "Insulation reduces the cooling load, but it does not replace airflow. Plan a wall-mounted AC unit for the main room, keep a window that opens, and add passive vents or an extractor for meeting rooms. A ceiling fan is a cheap way to keep air moving when the AC is off.",
      },
      { type: "h2", text: "Understanding the budget" },
      {
        type: "table",
        head: ["Item", "Typical share of fit-out cost"],
        rows: [
          ["Insulation and lining", "20–25%"],
          ["Windows, doors and security", "15–20%"],
          ["Electrical installation", "10–15%"],
          ["Flooring and ceiling", "10–15%"],
          ["Cooling and ventilation", "10–15%"],
          ["Labour and finishing", "15–20%"],
        ],
      },
      {
        type: "p",
        text: "For a 20ft basic office, a realistic turnkey budget is KES 550,000–700,000 including the shell. A 40ft two-room office typically lands between KES 1.0 million and KES 1.4 million. Specification, not container size alone, drives the final number.",
      },
      { type: "h2", text: "What can go wrong" },
      {
        type: "ul",
        items: [
          "No vapour barrier, leading to condensation behind the lining.",
          "Under-sized electrical supply for AC and office equipment.",
          "Windows cut without framed openings or proper flashing.",
          "A 20ft shell asked to do the work of a 40ft team office.",
          "Delivery planned before the crane and access were confirmed.",
        ],
      },
      { type: "h2", text: "The bottom line" },
      {
        type: "p",
        text: "A good container office is planned like a small building, not assembled like a shed. Choose the right shell, insulate it, wire it properly and detail the openings. Do that, and the result is a workspace that can move with your project and still feel professional on day one.",
      },
    ],
  },
];

export const featuredPost = blogPosts.find((post) => post.featured) ?? blogPosts[0];

export function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function relatedPosts(slug: string, limit = 3) {
  const post = getPost(slug);
  if (!post) return blogPosts.filter((item) => item.slug !== slug).slice(0, limit);

  const preferred = post.related
    .map((relatedSlug) => blogPosts.find((item) => item.slug === relatedSlug))
    .filter((item): item is BlogPost => Boolean(item));

  const filler = blogPosts.filter(
    (item) => item.slug !== slug && !preferred.some((p) => p.slug === item.slug),
  );

  return [...preferred, ...filler].slice(0, limit);
}

export function postText(post: BlogPost) {
  return post.content
    .map((block) => {
      if (block.type === "ul" || block.type === "ol") return block.items.join(" ");
      if (block.type === "table") return [...block.head, ...block.rows.flat()].join(" ");
      if (block.type === "callout") return `${block.title} ${block.text}`;
      if (block.type === "quote") return block.text;
      return block.text;
    })
    .join(" ");
}
