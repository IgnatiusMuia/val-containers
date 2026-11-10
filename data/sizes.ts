export interface SizeGuide {
  id: "20ft" | "40ft" | "40ft-hc";
  label: string;
  short: string;
  externalLength: string;
  externalHeight: string;
  internalHeight: string;
  volume: string;
  floorArea: string;
  pallets: string;
  desks: string;
  cars: string;
  doors: string;
  bestFor: string;
  detail: string;
  scale: number;
}

export const sizes: SizeGuide[] = [
  {
    id: "20ft",
    label: "20ft Standard",
    short: "20ft",
    externalLength: "6.06 m",
    externalHeight: "2.59 m",
    internalHeight: "2.39 m",
    volume: "33.2 m³",
    floorArea: "13.9 m²",
    pallets: "10 standard pallets",
    desks: "10–12 workstations",
    cars: "1 small car, loaded with care",
    doors: "Full-width double doors",
    bestFor: "Storage, kiosks, single offices and compact homes",
    detail:
      "The most flexible size in the Kenyan market. Fits on smaller sites, turns easily and is the cheapest entry point.",
    scale: 1,
  },
  {
    id: "40ft",
    label: "40ft Standard",
    short: "40ft",
    externalLength: "12.19 m",
    externalHeight: "2.59 m",
    internalHeight: "2.39 m",
    volume: "67.7 m³",
    floorArea: "28.3 m²",
    pallets: "20–21 standard pallets",
    desks: "22–24 workstations",
    cars: "2 cars, end to end",
    doors: "Full-width double doors",
    bestFor: "Bulk storage, workshops and two-room offices",
    detail:
      "Double the floor of a 20ft unit for a modest price step. Plan for a wider turning circle and a longer offload zone.",
    scale: 2,
  },
  {
    id: "40ft-hc",
    label: "40ft High Cube",
    short: "40ft HC",
    externalLength: "12.19 m",
    externalHeight: "2.90 m",
    internalHeight: "2.70 m",
    volume: "76.4 m³",
    floorArea: "28.3 m²",
    pallets: "20–21 standard pallets",
    desks: "22–24 workstations",
    cars: "2 cars, end to end",
    doors: "2.58 m high door opening",
    bestFor: "Homes, premium offices and high-volume storage",
    detail:
      "An extra 31 cm of internal headroom leaves room for insulation and ceiling services without feeling cramped. The preferred base for homes.",
    scale: 2,
  },
];

export const sizeFits = [
  {
    icon: "pallets" as const,
    label: "Standard pallets",
    values: { "20ft": "10", "40ft": "20–21", "40ft-hc": "20–21" },
  },
  {
    icon: "desks" as const,
    label: "Workstations",
    values: { "20ft": "10–12", "40ft": "22–24", "40ft-hc": "22–24" },
  },
  {
    icon: "cars" as const,
    label: "Cars, end to end",
    values: { "20ft": "1", "40ft": "2", "40ft-hc": "2" },
  },
  {
    icon: "volume" as const,
    label: "Usable volume",
    values: { "20ft": "33.2 m³", "40ft": "67.7 m³", "40ft-hc": "76.4 m³" },
  },
];

export const sizeDecision = [
  {
    need: "Small shop, kiosk or gatehouse",
    size: "20ft",
    reason: "Enough room for a counter and stock without overshooting a tight plot.",
  },
  {
    need: "Secure storage for a contractor",
    size: "20ft",
    reason: "Tooling and materials fit comfortably; crane placement is easier.",
  },
  {
    need: "Two-room site office",
    size: "40ft",
    reason: "Split the length into two rooms with a shared lobby.",
  },
  {
    need: "Bulk grain or agro-dealer stock",
    size: "40ft HC",
    reason: "Extra height and 67 m³+ of volume for palletised loads.",
  },
  {
    need: "One or two-bedroom home",
    size: "40ft HC",
    reason: "The only size with enough headroom for an insulated ceiling.",
  },
  {
    need: "Cold room for produce",
    size: "20ft or 40ft reefer",
    reason: "Choose capacity first, then confirm 3-phase power on site.",
  },
];
