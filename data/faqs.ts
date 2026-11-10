export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "How much does delivery cost?",
    answer:
      "Within Nairobi and Kiambu, delivery starts at about KES 15,000 for a 20ft container and KES 25,000 for a 40ft high cube, including crane offload. Upcountry delivery is quoted per trip. We confirm the figure in writing after checking your site access, so there are no surprises at the gate.",
  },
  {
    question: "Can I pay with M-Pesa or bank transfer?",
    answer:
      "Yes. We accept M-Pesa and bank transfer. For stock units, we typically agree a deposit to reserve the container and settle the balance before delivery. For fabricated units, payment follows the build milestones. We issue a written quotation and receipt for every payment.",
  },
  {
    question: "How long does fabrication take?",
    answer:
      "Most fabricated offices and kiosks take two to four weeks. Container homes and larger two-room offices can take four to eight weeks depending on the finish, windows, plumbing and electrical work. We confirm the lead time in your quotation before work starts.",
  },
  {
    question: "Do I need a permit for a container home or office?",
    answer:
      "For a permanent container home, expect the same county planning and NEMA considerations as a conventional structure. Temporary site offices are usually simpler, but the host site must still approve placement. We can share our drawings and documentation to support your application, but approval remains with the relevant authorities.",
  },
  {
    question: "What do WWT and cargo worthy mean?",
    answer:
      "WWT means wind and watertight: the container has no holes and the door seals keep out weather, though it may show surface rust or dents. Cargo worthy means the unit is structurally sound and suitable for freight or conversion. Every listing states the grade, and the condition report explains what we found.",
  },
  {
    question: "Can I inspect the container before paying?",
    answer:
      "Yes. The yard is open 24 hours and you can inspect any unit in person. If you are upcountry, we send current photos and a video walkaround of the exact container, including the CSC plate and serial number. We do not swap units after payment.",
  },
  {
    question: "Do you deliver outside Kenya?",
    answer:
      "We focus on Kenya and occasionally support cross-border projects in Uganda, Tanzania, Rwanda and South Sudan. Cross-border moves need customs coordination, so we quote them separately and confirm the paperwork before committing.",
  },
  {
    question: "What documents come with a container?",
    answer:
      "Every unit comes with a bill of sale, a condition report with inspection photos, and CSC plate and serial verification. Fabricated units also include electrical and plumbing layout drawings where relevant, plus a fit-out snag list. These documents are what make a container straightforward to resell or finance.",
  },
  {
    question: "Is a reefer expensive to run?",
    answer:
      "A working reefer draws significant power, usually from a 3-phase supply. Running costs depend on the setpoint, ambient temperature and how often the door is opened. We share the unit's test sheet and power requirements so your electrician can size the supply before delivery.",
  },
  {
    question: "Can you fit out a container I already own?",
    answer:
      "Yes, subject to an inspection. We check the shell for structural condition before quoting fabrication. If the unit is not a sound base, we will say so rather than cover a problem with lining.",
  },
];
