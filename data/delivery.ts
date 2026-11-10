export interface DeliveryRegion {
  id: string;
  name: string;
  towns: string;
  timeline: string;
  from20: number | null;
  from40hc: number | null;
  note: string;
  lon: number;
  lat: number;
}

export const deliveryRegions: DeliveryRegion[] = [
  {
    id: "nairobi",
    name: "Nairobi & Kiambu",
    towns: "Nairobi, Ruiru, Thika, Kikuyu, Ngong",
    timeline: "Same day – next day",
    from20: 15000,
    from40hc: 25000,
    note: "Yard collection available. Crane offload arranged with the delivery.",
    lon: 36.8219,
    lat: -1.2921,
  },
  {
    id: "machakos-kajiado",
    name: "Machakos & Kajiado",
    towns: "Machakos, Athi River, Kitengela, Kajiado, Isinya",
    timeline: "1 day",
    from20: 20000,
    from40hc: 30000,
    note: "Access check needed for unpaved plots and sloped driveways.",
    lon: 37.2634,
    lat: -1.5177,
  },
  {
    id: "central",
    name: "Central Kenya",
    towns: "Nyeri, Nanyuki, Embu, Meru, Murang'a",
    timeline: "1–2 days",
    from20: 25000,
    from40hc: 40000,
    note: "Highland routes are reliable; confirm overhead lines at the offload point.",
    lon: 37.0,
    lat: -0.42,
  },
  {
    id: "rift-valley",
    name: "Rift Valley",
    towns: "Nakuru, Naivasha, Eldoret, Kericho, Kitale",
    timeline: "2–3 days",
    from20: 35000,
    from40hc: 55000,
    note: "Longer routes are quoted per trip. Combine two units for a better rate.",
    lon: 36.08,
    lat: -0.3031,
  },
  {
    id: "coast",
    name: "Coast",
    towns: "Mombasa, Kilifi, Malindi, Diani, Voi",
    timeline: "2–3 days",
    from20: 45000,
    from40hc: 65000,
    note: "Crane access in coastal plots can be tight; share photos of the entrance.",
    lon: 39.6682,
    lat: -4.0435,
  },
  {
    id: "nyanza",
    name: "Nyanza",
    towns: "Kisumu, Homa Bay, Migori, Siaya, Kisii",
    timeline: "2–3 days",
    from20: 45000,
    from40hc: 70000,
    note: "Ferry crossings and last-mile access can add a day; we plan for it in the quote.",
    lon: 34.7617,
    lat: -0.0917,
  },
  {
    id: "western",
    name: "Western",
    towns: "Kakamega, Bungoma, Busia, Webuye",
    timeline: "3–4 days",
    from20: 50000,
    from40hc: 75000,
    note: "Border-area deliveries may need customs coordination if the unit crosses a frontier.",
    lon: 34.5606,
    lat: 0.5635,
  },
  {
    id: "eastern",
    name: "Eastern",
    towns: "Machakos, Kitui, Embu, Meru, Isiolo",
    timeline: "1–2 days",
    from20: 30000,
    from40hc: 45000,
    note: "Meru and Isiolo are quoted with the same access check as Central routes.",
    lon: 37.6559,
    lat: 0.0463,
  },
  {
    id: "north-eastern",
    name: "North Eastern",
    towns: "Garissa, Wajir, Mandera, Marsabit",
    timeline: "3–5 days",
    from20: null,
    from40hc: null,
    note: "Quoted per trip after a fuel and access review. Escort requirements may apply.",
    lon: 39.6401,
    lat: -0.4536,
  },
];

export const deliverySteps = [
  {
    number: "01",
    title: "Share the site",
    body: "Send the location pin, a photo of the entrance and the surface where the container will sit.",
  },
  {
    number: "02",
    title: "We check access",
    body: "We confirm truck size, crane reach and overhead clearance. If the road is tight, we say so early.",
  },
  {
    number: "03",
    title: "Agree the quote",
    body: "One figure for the truck and crane, confirmed before dispatch. No surprise charges at the gate.",
  },
  {
    number: "04",
    title: "Deliver and place",
    body: "The driver calls ahead, the crane lifts the unit into position and you inspect it before signing.",
  },
];

export const siteAccessChecks = [
  {
    title: "Gate and road width",
    body: "Allow at least 3.5 m for a 20ft truck and 4 m+ for a 40ft trailer. Wider is always safer.",
  },
  {
    title: "Turning circle",
    body: "A 40ft trailer needs space to swing. Tight urban plots may need a smaller truck or a transshipment point.",
  },
  {
    title: "Ground strength",
    body: "Firm, level, compacted ground or concrete plinths. Soft black-cotton soil needs a proper base.",
  },
  {
    title: "Overhead clearance",
    body: "Check for power lines, branches and canopies. The crane needs a clear lift path.",
  },
  {
    title: "Offload zone",
    body: "Leave roughly 10 m in front of the placement point for the crane truck to set up safely.",
  },
  {
    title: "Site permission",
    body: "Confirm the landlord, county or site manager has approved the placement before delivery day.",
  },
];

export const deliveryDisclaimers = [
  "Figures are indicative for a standard 20ft or 40ft high cube from our Nairobi yard.",
  "Crane offload, waiting time and difficult access are confirmed in the written quote.",
  "Remote sites such as Lodwar, Lokichoggio and Lamu are quoted individually.",
  "Delivery does not include permits, ground works or utility connections.",
];
